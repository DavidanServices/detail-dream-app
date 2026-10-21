import { CircleDot, Droplets, Hand, Snowflake, Sparkles } from "lucide-react";

// Exterior Detailing copy. Prices come from the catalogue (package "exterior" in /admin/pricing).
export const EXTERIOR_PACKAGE_ID = "exterior";

export const exteriorTagline = "Quality in every detail";
export const exteriorSameService = "Same service included for all vehicle sizes";
export const exteriorResult = "A clean, glossy and refreshed exterior with a premium finish.";

// The same five services are included in every exterior package.
export const exteriorIncluded = [
  { icon: Droplets, title: "Pre-wash", text: "Pre-wash" },
  {
    icon: Snowflake,
    title: "Shampoo or snow foam",
    text: "Shampooed or snow foamed (depending if the car has ceramic coating)",
  },
  { icon: Hand, title: "Contact wash", text: "Contact wash and rinsed" },
  { icon: CircleDot, title: "Alloys", text: "Alloys hand washed" },
  { icon: Sparkles, title: "Tyre shine", text: "Tyre shine included" },
] as const;

export const exteriorIncludedServices: string[] = exteriorIncluded.map((item) => item.text);

export const exteriorTiers: Record<string, { title: string }> = {
  hatchback: { title: "Hatchback Exterior Detail" },
  saloon: { title: "Sedan Exterior Detail" },
  suv: { title: "SUV Exterior Detail" },
};
