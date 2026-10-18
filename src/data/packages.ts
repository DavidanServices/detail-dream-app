export const vehicleTypes = [
  { id: "hatchback", label: "Hatchback", hint: "Small & compact cars" },
  { id: "saloon", label: "Saloon / Coupe", hint: "Sedans & coupes" },
  { id: "suv", label: "SUV", hint: "4x4s, MPVs & large vehicles" },
] as const;

export type VehicleType = (typeof vehicleTypes)[number]["id"];

export type Package = {
  id: string;
  name: string;
  prices: Record<VehicleType, number>;
  description: string;
  tagline?: string;
  features: string[];
  popular: boolean;
  /** Shown as a card in the home page price list; the rest appear as wide rows. */
  featured: boolean;
};

export const packages: Package[] = [
  {
    id: "interior",
    name: "Interior Detail",
    prices: { hatchback: 105, saloon: 120, suv: 140 },
    description: "Deep clean and restore your cabin from top to bottom.",
    features: [
      "Vacuuming & shampoo",
      "Leather conditioning",
      "Steam sanitization",
      "Odor elimination",
    ],
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

export const ppfPackage = {
  id: "ppf",
  name: "Paint Protection Film",
  startingFrom: 350,
  description: "Invisible, self-healing armor for high-impact areas.",
  tagline: "Custom coverage for high-impact areas",
  features: [
    "Self-healing technology",
    "UV stable",
    "Prevents rock chips",
    "Custom coverage options",
  ],
};

export const lowestPrice = (pkg: Package) => Math.min(...Object.values(pkg.prices));

export const cheapestPackagePrice = Math.min(...packages.map(lowestPrice));

export const gbp = (n: number) => `£${n.toLocaleString("en-GB")}`;
