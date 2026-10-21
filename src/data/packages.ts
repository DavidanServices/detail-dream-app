import { interiorIncludedServices } from "@/data/interior";

// Default catalogue. It seeds the database and is the fallback when Supabase is unreachable.
// Live prices are edited in /admin and loaded through src/lib/catalog.ts.
export type VehicleTypeInfo = { id: string; label: string; hint: string };

export const vehicleTypes: VehicleTypeInfo[] = [
  { id: "hatchback", label: "Hatchback", hint: "Small & compact cars" },
  { id: "saloon", label: "Saloon / Sedan", hint: "Saloons, sedans & coupes" },
  { id: "suv", label: "SUV", hint: "4x4s, MPVs & large vehicles" },
];

export type VehicleType = string;

export type Package = {
  id: string;
  name: string;
  /** Price per vehicle type id; a missing key means the package is not offered for that type. */
  prices: Record<string, number>;
  description: string;
  tagline?: string | undefined;
  features: string[];
  popular: boolean;
  /** Shown as a card in the home page price list; the rest appear as wide rows. */
  featured: boolean;
};

export const packages: Package[] = [
  {
    id: "interior",
    name: "Interior Detail",
    prices: { hatchback: 110, saloon: 150, suv: 180 },
    description: "A thorough interior detail for every vehicle size, from hatchback to SUV.",
    features: interiorIncludedServices,
    popular: false,
    featured: true,
  },
  {
    id: "exterior",
    name: "Exterior Detail",
    prices: { hatchback: 110, saloon: 130, suv: 150 },
    description: "Hand wash, clay bar, and protect your paintwork.",
    features: [
      "Hand wash & dry",
      "Clay bar treatment",
      "Paint decontamination",
      "Sealant or wax protection",
    ],
    popular: false,
    featured: true,
  },
  {
    id: "exterior-interior",
    name: "Exterior + Interior",
    prices: { hatchback: 185, saloon: 210, suv: 250 },
    description: "Our most popular combo — a complete inside-and-out refresh.",
    features: [
      "Full exterior detail",
      "Full interior detail",
      "Paint-safe techniques",
      "Cabin deep clean",
    ],
    popular: true,
    featured: true,
  },
  {
    id: "ceramic",
    name: "Ceramic Coating",
    prices: { hatchback: 175, saloon: 200, suv: 220 },
    description: "Long-lasting hydrophobic protection with a deep gloss finish.",
    features: [
      "Multi-year protection",
      "Hydrophobic finish",
      "UV resistance",
      "Enhanced depth & gloss",
    ],
    popular: false,
    featured: true,
  },
  {
    id: "complete",
    name: "The Complete Bundle",
    prices: { hatchback: 310, saloon: 360, suv: 420 },
    description: "Everything in one package: exterior, interior, and ceramic coating.",
    tagline: "Exterior + Interior + Ceramic Coating",
    features: [
      "Exterior + Interior detail",
      "Ceramic coating application",
      "Full protection & gloss",
      "Best value",
    ],
    popular: false,
    featured: false,
  },
];

export const lowestPrice = (pkg: Package) => {
  const prices = Object.values(pkg.prices);
  return prices.length ? Math.min(...prices) : 0;
};

export const cheapestPackagePrice = (list: Package[]) => {
  const prices = list.map(lowestPrice).filter((p) => p > 0);
  return prices.length ? Math.min(...prices) : 0;
};

export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
