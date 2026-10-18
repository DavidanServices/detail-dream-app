import heroImage from "@/assets/hero-detailing.jpg";
import exteriorImage from "@/assets/service-exterior.jpg";
import interiorImage from "@/assets/service-interior.jpg";
import ceramicImage from "@/assets/service-ceramic.jpg";
import ppfImage from "@/assets/service-ppf.jpg";

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
