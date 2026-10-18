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
      "Hand wash, clay bar, paint decontamination, and gloss-enhancing sealant for a mirror finish.",
    short: "Wash, decontaminate, and protect your paint.",
    description:
      "Our exterior detail begins with a thorough hand wash and dry, followed by clay bar decontamination to remove embedded contaminants. We finish with a high-quality sealant or wax to enhance gloss and provide protection against the elements.",
    features: [
      "Hand wash & dry",
      "Clay bar treatment",
      "Paint decontamination",
      "Sealant or wax protection",
      "Wheel & tire deep clean",
    ],
    image: exteriorImage,
    icon: Droplets,
  },
  {
    id: "interior",
    title: "Interior Detailing",
    summary:
      "Deep cleaning, leather conditioning, steam treatment, and odor elimination for a cabin that feels new.",
    short: "Deep clean and restore your cabin.",
    description:
      "We clean every surface of your interior — vacuuming, steam cleaning, leather conditioning, plastic restoration, and odor elimination. The result is a cabin that looks, feels, and smells like new.",
    features: [
      "Vacuuming & shampoo",
      "Leather cleaning & conditioning",
      "Steam sanitization",
      "Dashboard & trim care",
      "Odor elimination",
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
