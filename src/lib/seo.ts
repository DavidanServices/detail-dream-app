import { absoluteUrl, site } from "@/data/site";

type PageSeo = {
  title: string;
  description: string;
  path: string;
  /** Shorter variants for social cards; fall back to the page title/description. */
  ogTitle?: string;
  ogDescription?: string;
  /** Structured data to embed as JSON-LD (only data that is accurate for the page). */
  jsonLd?: Record<string, unknown>;
};

// Shared <head> for every route: absolute canonical, Open Graph and Twitter tags.
export function pageHead({ title, description, path, ogTitle, ogDescription, jsonLd }: PageSeo) {
  const url = absoluteUrl(path);
  const image = `${site.url}${site.ogImage}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:site_name", content: site.name },
      { property: "og:locale", content: site.locale },
      { property: "og:title", content: ogTitle ?? title },
      { property: "og:description", content: ogDescription ?? description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
    ...(jsonLd
      ? { scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }] }
      : {}),
  };
}

// LocalBusiness data for Google. Built only from the business details in site.ts; opening hours
// are left out until they are confirmed.
export const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "AutomotiveBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  description:
    "Professional exterior and interior car detailing, ceramic coating and paint protection film.",
  url: site.url,
  image: `${site.url}${site.ogImage}`,
  telephone: `+44${site.phone.replace(/\D/g, "").slice(1)}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    postalCode: site.address.postcode,
    addressCountry: "GB",
  },
  areaServed: ["Dunstable", "Luton", "Houghton Regis", "Leighton Buzzard", "Bedfordshire"],
  priceRange: "££",
};
