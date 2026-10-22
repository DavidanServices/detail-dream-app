import type { Highlight } from "@/data/icons";

// Default Exterior Detailing copy. It seeds the database; live values are edited in /admin.
export const EXTERIOR_PACKAGE_ID = "exterior";

// The same five services are included in every exterior package.
export const exteriorHighlights: Highlight[] = [
  { icon: "droplets", title: "Pre-wash", text: "Pre-wash" },
  {
    icon: "snowflake",
    title: "Shampoo or snow foam",
    text: "Shampooed or snow foamed (depending if the car has ceramic coating)",
  },
  { icon: "hand", title: "Contact wash", text: "Contact wash and rinsed" },
  { icon: "circle", title: "Alloys", text: "Alloys hand washed" },
  { icon: "sparkles", title: "Tyre shine", text: "Tyre shine included" },
];

export const exteriorTiers: Record<string, { title: string }> = {
  hatchback: { title: "Hatchback Exterior Detail" },
  saloon: { title: "Sedan Exterior Detail" },
  suv: { title: "SUV Exterior Detail" },
};
