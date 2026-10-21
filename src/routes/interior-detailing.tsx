import { createFileRoute } from "@tanstack/react-router";
import interiorImage from "@/assets/interior-hero.jpg";
import { AddonPanel } from "@/components/detailing/AddonPanel";
import { BookingSection } from "@/components/detailing/BookingSection";
import { DetailingHero } from "@/components/detailing/DetailingHero";
import { IncludedGrid } from "@/components/detailing/IncludedGrid";
import { TierCards } from "@/components/detailing/TierCards";
import { useDetailingSelection } from "@/components/detailing/useDetailingSelection";
import { SectionHeading } from "@/components/SectionHeading";
import { addonPriceLabel } from "@/data/addons";
import {
  INTERIOR_PACKAGE_ID,
  interiorIncluded,
  interiorIncludedServices,
  interiorTiers,
} from "@/data/interior";
import { gbp } from "@/data/packages";
import { telHref } from "@/data/site";
import { loadCatalog } from "@/lib/catalog";
import { detailingHead } from "@/lib/detailing-seo";

const tierTitle = (v: { id: string; label: string }) =>
  interiorTiers[v.id]?.title ?? `${v.label} Interior Detail`;

export const Route = createFileRoute("/interior-detailing")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const pkg = loaderData?.packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
    return detailingHead({
      path: "/interior-detailing",
      title: "Interior Car Detailing Packages | Davidan Services",
      noun: "interior car detailing",
      serviceName: "Interior Car Detailing",
      pkg,
      tiers: loaderData?.vehicleTypes ?? [],
      tierTitle,
    });
  },
  component: InteriorPage,
});

function InteriorPage() {
  const { packages, ppf, vehicleTypes, addons } = Route.useLoaderData();
  const pkg = packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
  const extra = addons.find((a) => a.packageId === INTERIOR_PACKAGE_ID);
  const tiers = vehicleTypes.filter((v) => pkg?.prices[v.id] !== undefined);
  const { preset, withAddon, choose, toggleAddon } = useDetailingSelection(pkg?.name, extra);

  return (
    <>
      <DetailingHero
        eyebrow="Davidan Services — Premium Interior Detailing"
        title={
          <>
            A Cleaner Interior. <span className="text-primary">A Better Driving Experience.</span>
          </>
        }
        lead="Professional interior detailing for hatchbacks, saloons and SUVs. Every accessible surface is cleaned with care, so your cabin looks, feels and smells properly looked after."
        image={interiorImage}
        imageAlt="Detailed car interior after a professional clean"
        stats={[
          ...(pkg
            ? tiers.map((v) => ({
                label: tierTitle(v).split(" ")[0] ?? v.label,
                value: gbp(pkg.prices[v.id] ?? 0),
              }))
            : []),
          ...(extra ? [{ label: extra.name, value: addonPriceLabel(extra), accent: true }] : []),
        ]}
      />

      <section id="packages" className="scroll-mt-20 bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our packages"
            title="Interior detailing, priced by vehicle size"
            lead="Every package includes the same seven services. Choose the one that matches your vehicle."
          />
          {pkg && tiers.length > 0 ? (
            <TierCards
              pkg={pkg}
              tiers={tiers}
              titleFor={tierTitle}
              blurbFor={(v) => interiorTiers[v.id]?.blurb}
              included={interiorIncludedServices}
              selectedAddon={withAddon ? extra : undefined}
              onChoose={choose}
            />
          ) : (
            <p className="mt-14 border border-border bg-card p-6 text-muted-foreground">
              Our interior packages are being updated. Please{" "}
              <a href={telHref} className="text-primary underline">
                call us
              </a>{" "}
              or{" "}
              <a href="#book" className="text-primary underline">
                request a quote
              </a>
              .
            </p>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="Seven services in every interior detail"
            lead="The same thorough process, whichever package you choose."
          />
          <IncludedGrid
            items={interiorIncluded}
            note={
              <>
                <p className="label-tech">Not included</p>
                <p className="leading-relaxed">
                  Leather conditioning is available separately as an optional extra.
                </p>
              </>
            }
          />
        </div>
      </section>

      {extra && (
        <AddonPanel
          addon={extra}
          selected={withAddon}
          onToggle={toggleAddon}
          hint="Add it to any interior package."
        />
      )}

      <BookingSection
        packages={packages}
        ppf={ppf}
        vehicleTypes={vehicleTypes}
        addons={addons}
        preset={preset}
      />
    </>
  );
}
