import { gbp, type Package, type VehicleTypeInfo } from "@/data/packages";
import { site } from "@/data/site";
import { pageHead } from "@/lib/seo";

type Params = {
  path: string;
  title: string;
  /** e.g. "interior car detailing" */
  noun: string;
  serviceName: string;
  pkg: Package | undefined;
  tiers: VehicleTypeInfo[];
  tierTitle: (vehicle: VehicleTypeInfo) => string;
  /** Edited Google description; empty means build it from the live prices. */
  descriptionOverride?: string | undefined;
};

// <head> for a detailing page. Prices in the description and JSON-LD follow the live catalogue,
// so they can never drift from what the page shows.
export function detailingHead({
  path,
  title,
  noun,
  serviceName,
  pkg,
  tiers,
  tierTitle,
  descriptionOverride,
}: Params) {
  const priced = pkg ? tiers.filter((v) => pkg.prices[v.id] !== undefined) : [];
  const prices =
    pkg && priced.length > 0
      ? priced
          .map((v) => `${tierTitle(v).split(" ")[0]} from ${gbp(pkg.prices[v.id] ?? 0)}`)
          .join(", ")
      : "";
  return pageHead({
    title,
    description:
      descriptionOverride ||
      `Professional ${noun} by ${site.name}.${prices ? ` ${prices}.` : ""} Explore our services and request a quote.`,
    path,
    ...(pkg && priced.length > 0
      ? {
          jsonLd: {
            "@context": "https://schema.org",
            "@type": "Service",
            name: serviceName,
            serviceType: noun,
            provider: { "@type": "Organization", name: site.name, url: site.url },
            offers: priced.map((v) => ({
              "@type": "Offer",
              name: tierTitle(v),
              priceCurrency: "GBP",
              priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: pkg.prices[v.id],
                priceCurrency: "GBP",
              },
            })),
          },
        }
      : {}),
  });
}
