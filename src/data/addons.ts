import { gbp } from "@/data/packages";

export type Addon = {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Package this extra belongs to (e.g. "interior"); extras only show for their package. */
  packageId?: string | undefined;
  /** True when the price is a starting rate ("From £150") rather than a fixed add-on ("+£30"). */
  startsFrom: boolean;
  note?: string | undefined;
};

export const LEATHER_CONDITIONING_ID = "leather-conditioning";
export const POLISH_ID = "polish";

// Default optional extras. They seed the database and are the fallback if Supabase is unreachable.
export const addons: Addon[] = [
  {
    id: LEATHER_CONDITIONING_ID,
    name: "Leather Conditioning",
    description:
      "Nourishes and protects leather surfaces, helping restore softness and maintain a factory-fresh finish.",
    price: 30,
    packageId: "interior",
    startsFrom: false,
  },
  {
    id: POLISH_ID,
    name: "Polish",
    description: "Available as an add-on to Exterior Detail.",
    price: 150,
    packageId: "exterior",
    startsFrom: true,
    note: "Depending on car size",
  },
];

export const addonPriceLabel = (addon: Addon) =>
  addon.startsFrom ? `From ${gbp(addon.price)}` : `+${gbp(addon.price)}`;
