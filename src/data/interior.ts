import type { Highlight } from "@/data/icons";

// Default Interior Detailing copy. It seeds the database; live values are edited in /admin
// (prices and items under Pricing, page texts under Page texts).
export const INTERIOR_PACKAGE_ID = "interior";

// The same seven services are included in every interior package. Leather conditioning is NOT one of them.
export const interiorHighlights: Highlight[] = [
  {
    icon: "wind",
    title: "Full vacuum",
    text: "Full interior vacuum, including boot and underneath seats where accessible",
  },
  {
    icon: "gauge",
    title: "Dashboard & trim",
    text: "Detailed cleaning of dashboard, air vents, buttons and interior trim",
  },
  {
    icon: "door",
    title: "Doors & cupholders",
    text: "Cleaning of door panels, door shuts and cupholders, including steam cleaning where appropriate",
  },
  { icon: "sparkles", title: "Interior glass", text: "Interior glass cleaning" },
  {
    icon: "layers",
    title: "Mats & plastics",
    text: "Floor mat cleaning and restoration of interior plastic surfaces",
  },
  {
    icon: "armchair",
    title: "Leather clean",
    text: "Leather cleaning to restore a clean, factory-style finish",
  },
  { icon: "shield", title: "Seatbelts", text: "Seatbelt cleaning and restoration" },
];

// Per vehicle type (ids match vehicle_types): title and description for the three package cards.
export const interiorTiers: Record<string, { title: string; blurb: string }> = {
  hatchback: {
    title: "Hatchback Interior Detail",
    blurb:
      "A thorough interior cleaning service designed for maintained vehicles that need professional attention and a refreshed interior.",
  },
  saloon: {
    title: "Sedan Interior Detail",
    blurb:
      "Professional interior detailing for saloon and sedan vehicles, covering all accessible interior surfaces.",
  },
  suv: {
    title: "SUV Interior Detail",
    blurb:
      "Comprehensive interior detailing for SUVs, with pricing reflecting the larger vehicle size.",
  },
};
