import { CheckCircle, Droplets, Shield, Sparkles } from "lucide-react";
import exteriorImage from "@/assets/service-exterior.jpg";
import interiorImage from "@/assets/service-interior.jpg";
import ceramicImage from "@/assets/service-ceramic.jpg";
import ppfImage from "@/assets/service-ppf.jpg";

export const services = [
  {
    id: "exterior",
    title: "Exterior Detailing",
    summary:
      "Pre-wash, shampoo or snow foam, contact wash, hand-washed alloys and tyre shine for a clean, glossy finish.",
    short: "A clean, glossy and refreshed exterior.",
    description:
      "A thorough exterior wash: pre-wash, shampooed or snow foamed, contact wash and rinse, alloys washed by hand and tyre shine included. The result is a clean, glossy and refreshed exterior with a premium finish.",
    features: [
      "Pre-wash",
      "Shampooed or snow foamed",
      "Contact wash and rinsed",
      "Alloys hand washed",
      "Tyre shine included",
    ],
    image: exteriorImage,
    icon: Droplets,
  },
  {
    id: "interior",
    title: "Interior Detailing",
    summary:
      "Full vacuum, dashboard and trim detailing, door panels, glass, mats and leather cleaning for a fresh, factory-style cabin.",
    short: "Deep clean and restore your cabin.",
    description:
      "A thorough interior detail covering every accessible surface: a full vacuum, dashboard, vents and trim, door panels and cupholders, interior glass, floor mats and plastics, leather cleaning and seatbelts. Leather conditioning is available as an optional extra.",
    features: [
      "Full interior vacuum, including boot",
      "Dashboard, vents and trim detailed",
      "Door panels, shuts and cupholders",
      "Interior glass cleaning",
      "Floor mats and plastics restored",
      "Leather cleaning and seatbelts",
    ],
    image: interiorImage,
    icon: Sparkles,
  },
  {
    id: "ceramic",
    title: "Ceramic Coating",
    summary:
      "Long-lasting hydrophobic protection that adds depth, gloss, and makes maintenance effortless.",
    short: "Long-lasting gloss and hydrophobic protection.",
    description:
      "Ceramic coating forms a durable, hydrophobic layer over your paint. It locks in gloss, repels water and dirt, and makes routine washing easier while protecting against UV rays and minor contaminants.",
    features: [
      "Multi-year protection",
      "Hydrophobic finish",
      "UV resistance",
      "Enhanced depth & gloss",
      "Easier maintenance",
    ],
    image: ceramicImage,
    icon: Shield,
  },
  {
    id: "ppf",
    title: "Paint Protection Film",
    summary:
      "Self-healing clear film applied to high-impact areas to guard against chips, scratches, and road debris.",
    short: "Invisible armor against chips and scratches.",
    description:
      "Our self-healing paint protection film is applied to high-impact areas like the hood, bumper, fenders, and mirrors. It absorbs rock chips, scratches, and road debris while remaining virtually invisible.",
    features: [
      "Self-healing technology",
      "UV stable",
      "Prevents rock chips",
      "Preserves resale value",
      "Custom coverage options",
    ],
    image: ppfImage,
    icon: CheckCircle,
  },
];

export const highlights = [
  "Premium products & professional-grade tools",
  "Trained, insured detailing technicians",
  "Paint-safe techniques on every vehicle",
  "Satisfaction guaranteed",
];

// Where each service lives now that "Services" is the Exterior page.
export function serviceLink(id: string) {
  switch (id) {
    case "exterior":
      return { to: "/exterior-detailing" as const };
    case "interior":
      return { to: "/interior-detailing" as const };
    case "ceramic":
      return { to: "/exterior-detailing" as const, hash: "protection" };
    default:
      return { to: "/ppf" as const };
  }
}
