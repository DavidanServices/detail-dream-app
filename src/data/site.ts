// Single source of truth for business details. Opening hours are still placeholders.
const phone = "07773 456027";
const digits = phone.replace(/\D/g, "");
// UK numbers: drop the leading 0 and prefix the country code for tel: and WhatsApp links.
const international = `44${digits.slice(1)}`;
const addressLines = ["Cowbridge Farm, Bridle Way", "Dunstable LU5 6HS"] as const;

export const site = {
  name: "Davidan Services",
  url: "https://davidan.co.uk",
  locale: "en_GB",
  phone,
  email: "contact@davidan.com",
  address: { lines: addressLines },
  // Add real profile URLs; icons only render for entries that exist.
  social: [] as { name: "Instagram" | "Facebook"; href: string }[],
  hours: ["Mon–Fri: 8am – 6pm", "Saturday: 9am – 4pm"],
  ogImage: "/og-image.jpg",
} as const;

const mapQuery = encodeURIComponent(`${addressLines.join(", ")}, UK`);

export const telHref = `tel:+${international}`;
export const whatsappUrl = `https://wa.me/${international}?text=${encodeURIComponent("Hi Davidan Services, I'd like to request a quote.")}`;
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapQuery}&output=embed`;

export const absoluteUrl = (path: string) => `${site.url}${path === "/" ? "" : path}`;
