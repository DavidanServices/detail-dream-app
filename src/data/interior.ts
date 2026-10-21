import { Armchair, DoorOpen, Gauge, Layers, ShieldCheck, Sparkles, Wind } from "lucide-react";

// Interior Detailing copy. Prices are NOT stored here: they come from the catalogue
// (package "interior" in /admin/pricing), so editing a price updates every page and the booking form.
export const INTERIOR_PACKAGE_ID = "interior";

export const priceDisclaimer =
  "Prices are starting rates for standard vehicles. Vehicle size, condition and individual requirements may affect the final quote.";

// The same seven services are included in every interior package. Leather conditioning is NOT one of them.
export const interiorIncluded = [
  {
    icon: Wind,
    title: "Full vacuum",
    text: "Full interior vacuum, including boot and underneath seats where accessible",
  },
  {
    icon: Gauge,
    title: "Dashboard & trim",
    text: "Detailed cleaning of dashboard, air vents, buttons and interior trim",
  },
  {
    icon: DoorOpen,
    title: "Doors & cupholders",
    text: "Cleaning of door panels, door shuts and cupholders, including steam cleaning where appropriate",
  },
  { icon: Sparkles, title: "Interior glass", text: "Interior glass cleaning" },
  {
    icon: Layers,
    title: "Mats & plastics",
    text: "Floor mat cleaning and restoration of interior plastic surfaces",
  },
  {
    icon: Armchair,
    title: "Leather clean",
    text: "Leather cleaning to restore a clean, factory-style finish",
  },
  { icon: ShieldCheck, title: "Seatbelts", text: "Seatbelt cleaning and restoration" },
] as const;

export const interiorIncludedServices: string[] = interiorIncluded.map((item) => item.text);

// Per vehicle type (ids match vehicle_types) title and description for the three package cards.
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
