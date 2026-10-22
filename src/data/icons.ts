import {
  Armchair,
  Check,
  CircleDot,
  DoorOpen,
  Droplets,
  Gauge,
  Hand,
  Layers,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Star,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";

// Icons that can be picked in /admin for an "included" item. The database stores the key.
export const highlightIcons = {
  check: Check,
  wind: Wind,
  gauge: Gauge,
  door: DoorOpen,
  sparkles: Sparkles,
  layers: Layers,
  armchair: Armchair,
  shield: ShieldCheck,
  droplets: Droplets,
  snowflake: Snowflake,
  hand: Hand,
  circle: CircleDot,
  star: Star,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconKey = keyof typeof highlightIcons;
export const iconKeys = Object.keys(highlightIcons) as IconKey[];

export const iconFor = (key: string | undefined): LucideIcon =>
  highlightIcons[key as IconKey] ?? Check;

/** One "included" item: a short title, the full sentence and an icon key. */
export type Highlight = { icon: string; title: string; text: string };
