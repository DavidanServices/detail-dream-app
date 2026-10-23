import heroImage from "@/assets/hero-detailing.jpg";
import exteriorImage from "@/assets/service-exterior.jpg";
import interiorImage from "@/assets/service-interior.jpg";
import ceramicImage from "@/assets/service-ceramic.jpg";
import ppfImage from "@/assets/service-ppf.jpg";
import seatRestoration from "@/assets/results/seat-restoration.webp";
import footwellDeepClean from "@/assets/results/footwell-deep-clean.webp";
import seatsAndCarpets from "@/assets/results/seats-and-carpets.webp";
import cabinRecovery from "@/assets/results/cabin-recovery.webp";
import fullInterior from "@/assets/results/full-interior.webp";

// Swap these for real project photos (ideally before/after pairs) as they become available.
export const gallery = [
  {
    src: heroImage,
    alt: "Vehicle in the detailing studio",
    caption: "Studio finish",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: exteriorImage,
    alt: "Exterior detailing in progress",
    caption: "Exterior detail",
    span: "",
  },
  { src: interiorImage, alt: "Interior detailing", caption: "Interior detail", span: "" },
  { src: ceramicImage, alt: "Ceramic coating application", caption: "Ceramic coating", span: "" },
  {
    src: ppfImage,
    alt: "Paint protection film installation",
    caption: "Paint protection film",
    span: "",
  },
];

// Before (left) and after (right) results, newest first. Each image is one side-by-side photo.
export const results = [
  {
    src: seatRestoration,
    caption: "Seat restoration",
    alt: "Before and after: heavily soiled leather and suede seat restored to a clean finish",
  },
  {
    src: footwellDeepClean,
    caption: "Footwell deep clean",
    alt: "Before and after: dirty carpet and footwell cleaned back to a like-new look",
  },
  {
    src: seatsAndCarpets,
    caption: "Seats and carpets",
    alt: "Before and after: stained fabric seats and carpets deep cleaned",
  },
  {
    src: cabinRecovery,
    caption: "Cabin recovery",
    alt: "Before and after: very dirty cabin and carpets fully restored",
  },
  {
    src: fullInterior,
    caption: "Full interior detail",
    alt: "Before and after: a complete interior detail on a muddy saloon interior",
  },
];
