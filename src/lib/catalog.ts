import { addons as defaultAddons, type Addon } from "@/data/addons";
import { ppfPanels, ppfSettings, type Panel, type PpfSettings } from "@/data/ppf";
import {
  packages as defaultPackages,
  vehicleTypes as defaultVehicleTypes,
  type Package,
  type VehicleTypeInfo,
} from "@/data/packages";
import { supabase } from "@/lib/supabase";

export type Catalog = {
  vehicleTypes: VehicleTypeInfo[];
  packages: Package[];
  ppf: PpfSettings;
  panels: Panel[];
  addons: Addon[];
};

export const defaultCatalog: Catalog = {
  vehicleTypes: defaultVehicleTypes,
  packages: defaultPackages,
  ppf: ppfSettings,
  panels: ppfPanels,
  addons: defaultAddons,
};

type PackageRow = {
  id: string;
  name: string;
  description: string;
  tagline: string | null;
  features: string[];
  popular: boolean;
  featured: boolean;
  package_prices: { vehicle_type_id: string; price: number | string }[];
};

// Loads live prices from Supabase. Any failure falls back to the bundled defaults so the
// public site never breaks because of the database.
export async function loadCatalog(): Promise<Catalog> {
  if (!supabase) return defaultCatalog;
  try {
    const [vehicles, pkgs, ppf, panels, addons] = await Promise.all([
      supabase.from("vehicle_types").select("id,label,hint").order("sort_order"),
      supabase
        .from("packages")
        .select(
          "id,name,description,tagline,features,popular,featured,package_prices(vehicle_type_id,price)",
        )
        .order("sort_order"),
      supabase.from("ppf_settings").select("*").maybeSingle(),
      supabase.from("ppf_panels").select("id,name,price").order("sort_order"),
      // Add-ons arrived in a later migration: if the table is missing, use the defaults.
      supabase
        .from("addons")
        .select("id,name,description,price,package_id,starts_from,note")
        .order("sort_order"),
    ]);
    const error = vehicles.error ?? pkgs.error ?? ppf.error ?? panels.error;
    if (error) throw error;
    if (!pkgs.data?.length || !vehicles.data?.length) return defaultCatalog;

    const activeVehicleIds = new Set(vehicles.data.map((v) => v.id));
    return {
      vehicleTypes: vehicles.data as VehicleTypeInfo[],
      packages: (pkgs.data as PackageRow[]).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        tagline: row.tagline ?? undefined,
        features: row.features ?? [],
        popular: row.popular,
        featured: row.featured,
        prices: Object.fromEntries(
          row.package_prices
            .filter((p) => activeVehicleIds.has(p.vehicle_type_id))
            .map((p) => [p.vehicle_type_id, Number(p.price)]),
        ),
      })),
      ppf: ppf.data
        ? {
            name: ppf.data.name,
            description: ppf.data.description,
            tagline: ppf.data.tagline,
            features: ppf.data.features ?? [],
            startingFrom: Number(ppf.data.starting_from),
            fullCarPrice: Number(ppf.data.full_car_price),
          }
        : defaultCatalog.ppf,
      panels: panels.data?.length
        ? panels.data.map((p) => ({ id: p.id, name: p.name, price: Number(p.price) }))
        : defaultCatalog.panels,
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
    };
  } catch (error) {
    console.error("Could not load the catalogue from Supabase, using defaults", error);
    return defaultCatalog;
  }
}
