export type Panel = { id: string; name: string; price: number };

export type PpfSettings = {
  name: string;
  description: string;
  tagline: string;
  features: string[];
  startingFrom: number;
  fullCarPrice: number;
};

export const ppfSettings: PpfSettings = {
  name: "Paint Protection Film",
  description: "Invisible, self-healing armor for high-impact areas.",
  tagline: "Custom coverage for high-impact areas",
  features: [
    "Self-healing technology",
    "UV stable",
    "Prevents rock chips",
    "Custom coverage options",
  ],
  startingFrom: 350,
  fullCarPrice: 1800,
};

// Panel ids are tied to the clickable hotspots on the car images in the PPF page.
export const ppfPanels: Panel[] = [
  { id: "front-bumper", name: "Front bumper", price: 220 },
  { id: "rear-bumper", name: "Rear bumper", price: 210 },
  { id: "bonnet", name: "Bonnet", price: 260 },
  { id: "roof", name: "Roof", price: 240 },
  { id: "boot", name: "Boot", price: 180 },
  { id: "headlights", name: "Headlights", price: 60 },
  { id: "wing-l", name: "Left front wing", price: 95 },
  { id: "wing-r", name: "Right front wing", price: 95 },
  { id: "door-fl", name: "Left front door", price: 105 },
  { id: "door-fr", name: "Right front door", price: 105 },
  { id: "door-rl", name: "Left rear door", price: 100 },
  { id: "door-rr", name: "Right rear door", price: 100 },
  { id: "quarter-l", name: "Left rear quarter", price: 100 },
  { id: "quarter-r", name: "Right rear quarter", price: 100 },
  { id: "mirror-l", name: "Left wing mirror", price: 35 },
  { id: "mirror-r", name: "Right wing mirror", price: 35 },
];
