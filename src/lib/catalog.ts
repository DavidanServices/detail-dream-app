import { addons as defaultAddons, type Addon } from "@/data/addons";
import { ppfSettings, type PpfColor, type PpfSettings, type PpfTier } from "@/data/ppf";
import {
  packages as defaultPackages,
  vehicleTypes as defaultVehicleTypes,
  type Package,
  type VehicleTypeInfo,
} from "@/data/packages";
import type { Highlight } from "@/data/icons";
import { supabase } from "@/lib/supabase";

export type Catalog = {
  vehicleTypes: VehicleTypeInfo[];
  packages: Package[];
  ppf: PpfSettings;
  addons: Addon[];
  /** Edited page texts by key; anything missing falls back to the defaults in src/data/page-text.ts. */
  content: Record<string, string>;
};

export const defaultCatalog: Catalog = {
  vehicleTypes: defaultVehicleTypes,
  packages: defaultPackages,
  ppf: ppfSettings,
  addons: defaultAddons,
  content: {},
};

type PriceRow = {
  vehicle_type_id: string;
  price: number | string;
  title?: string | null;
  blurb?: string | null;
};

type PackageRow = {
  id: string;
  name: string;
  description: string;
  tagline: string | null;
  features: string[];
  highlights?: Highlight[] | null;
  popular: boolean;
  featured: boolean;
  package_prices: PriceRow[];
};

const FULL_COLUMNS =
  "id,name,description,tagline,features,highlights,popular,featured,package_prices(vehicle_type_id,price,title,blurb)";
const LEGACY_COLUMNS =
  "id,name,description,tagline,features,popular,featured,package_prices(vehicle_type_id,price)";

// Postgres / PostgREST report an unknown column when a migration has not been run yet.
const isMissingColumn = (error: { code?: string }) =>
  error.code === "42703" || error.code === "PGRST204";

// Reads packages with the newest columns; on a database that is not migrated yet it
// falls back to the older columns so live prices keep working.
async function fetchPackages() {
  const full = await supabase!.from("packages").select(FULL_COLUMNS).order("sort_order");
  if (full.error && isMissingColumn(full.error)) {
    const legacy = await supabase!.from("packages").select(LEGACY_COLUMNS).order("sort_order");
    return { ...legacy, legacy: true };
  }
  return { ...full, legacy: false };
}

type SizeRow = {
  vehicle_type_id: string;
  title: string;
  blurb: string;
  price: number | string | null;
};

// Sizes follow the vehicle types' order; a missing price stays null ("price on request").
const tiersFrom = (rows: SizeRow[], vehicles: { id: string }[] | null): PpfTier[] => {
  const order = new Map((vehicles ?? []).map((v, i) => [v.id, i]));
  return rows
    .filter((r) => order.has(r.vehicle_type_id))
    .sort((a, b) => (order.get(a.vehicle_type_id) ?? 0) - (order.get(b.vehicle_type_id) ?? 0))
    .map((r) => ({
      vehicleTypeId: r.vehicle_type_id,
      title: r.title,
      blurb: r.blurb,
      price: r.price === null ? null : Number(r.price),
    }));
};

// Loads live prices and texts from Supabase. Any failure falls back to the bundled defaults so
// the public site never breaks because of the database.
export async function loadCatalog(): Promise<Catalog> {
  if (!supabase) return defaultCatalog;
  try {
    const [vehicles, pkgs, ppf, ppfSizes, ppfColors, addons, content] = await Promise.all([
      supabase.from("vehicle_types").select("id,label,hint").order("sort_order"),
      fetchPackages(),
      supabase.from("ppf_settings").select("*").maybeSingle(),
      // PPF sizes and colours arrived in a later migration: if missing, use the defaults.
      supabase.from("ppf_sizes").select("vehicle_type_id,title,blurb,price"),
      supabase.from("ppf_colors").select("id,name,hex,finish").order("sort_order"),
      // Later migrations: if these are missing, use the defaults instead of failing.
      supabase
        .from("addons")
        .select("id,name,description,price,package_id,starts_from,note")
        .order("sort_order"),
      supabase.from("site_content").select("key,value"),
    ]);
    const error = vehicles.error ?? pkgs.error ?? ppf.error;
    if (error) throw error;
    if (!pkgs.data?.length || !vehicles.data?.length) return defaultCatalog;

    const activeVehicleIds = new Set(vehicles.data.map((v) => v.id));
    return {
      vehicleTypes: vehicles.data as VehicleTypeInfo[],
      packages: (pkgs.data as unknown as PackageRow[]).map((row) => {
        const fallback = pkgs.legacy ? defaultPackages.find((d) => d.id === row.id) : undefined;
        const tiers = Object.fromEntries(
          row.package_prices
            .filter((p) => p.title || p.blurb)
            .map((p) => [
              p.vehicle_type_id,
              { title: p.title ?? undefined, blurb: p.blurb ?? undefined },
            ]),
        );
        return {
          id: row.id,
          name: row.name,
          description: row.description,
          tagline: row.tagline ?? undefined,
          features: row.features ?? [],
          highlights: row.highlights ?? fallback?.highlights ?? [],
          tiers: Object.keys(tiers).length > 0 ? tiers : fallback?.tiers,
          popular: row.popular,
          featured: row.featured,
          prices: Object.fromEntries(
            row.package_prices
              .filter((p) => activeVehicleIds.has(p.vehicle_type_id))
              .map((p) => [p.vehicle_type_id, Number(p.price)]),
          ),
        };
      }),
      ppf: ppf.data
        ? {
            name: ppf.data.name,
            description: ppf.data.description,
            tagline: ppf.data.tagline,
            features: ppf.data.features ?? [],
            tiers:
              !ppfSizes.error && ppfSizes.data?.length
                ? tiersFrom(ppfSizes.data, vehicles.data)
                : defaultCatalog.ppf.tiers,
            colors:
              !ppfColors.error && ppfColors.data
                ? (ppfColors.data as PpfColor[])
                : defaultCatalog.ppf.colors,
          }
        : defaultCatalog.ppf,
      addons:
        !addons.error && addons.data
          ? addons.data.map((a) => ({
              id: a.id,
              name: a.name,
              description: a.description,
              price: Number(a.price),
              packageId: a.package_id ?? undefined,
              startsFrom: Boolean(a.starts_from),
              note: a.note ?? undefined,
            }))
          : defaultCatalog.addons,
      content:
        !content.error && content.data
          ? Object.fromEntries(content.data.map((r) => [r.key, r.value as string]))
          : {},
    };
  } catch (error) {
    console.error("Could not load the catalogue from Supabase, using defaults", error);
    return defaultCatalog;
  }
}
