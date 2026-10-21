import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import exteriorImage from "@/assets/exterior-hero.jpg";
import { AddonPanel } from "@/components/detailing/AddonPanel";
import { BookingSection } from "@/components/detailing/BookingSection";
import { DetailingHero } from "@/components/detailing/DetailingHero";
import { IncludedGrid } from "@/components/detailing/IncludedGrid";
import { TierCards } from "@/components/detailing/TierCards";
import { useDetailingSelection } from "@/components/detailing/useDetailingSelection";
import { PackageCard } from "@/components/PackageCard";
import { Faq } from "@/components/sections/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { addonPriceLabel } from "@/data/addons";
import {
  EXTERIOR_PACKAGE_ID,
  exteriorIncluded,
  exteriorIncludedServices,
  exteriorResult,
  exteriorSameService,
  exteriorTagline,
  exteriorTiers,
} from "@/data/exterior";
import { gbp } from "@/data/packages";
import { telHref } from "@/data/site";
import { loadCatalog } from "@/lib/catalog";
import { detailingHead } from "@/lib/detailing-seo";

const tierTitle = (v: { id: string; label: string }) =>
  exteriorTiers[v.id]?.title ?? `${v.label} Exterior Detail`;

export const Route = createFileRoute("/exterior-detailing")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const pkg = loaderData?.packages.find((p) => p.id === EXTERIOR_PACKAGE_ID);
    return detailingHead({
      path: "/exterior-detailing",
      title: "Exterior Car Detailing Packages | Davidan Services",
      noun: "exterior car detailing",
      serviceName: "Exterior Car Detailing",
      pkg,
      tiers: loaderData?.vehicleTypes ?? [],
      tierTitle,
    });
  },
  component: ExteriorPage,
});

function ExteriorPage() {
  const { packages, ppf, vehicleTypes, addons } = Route.useLoaderData();
  const pkg = packages.find((p) => p.id === EXTERIOR_PACKAGE_ID);
  const extra = addons.find((a) => a.packageId === EXTERIOR_PACKAGE_ID);
  const tiers = vehicleTypes.filter((v) => pkg?.prices[v.id] !== undefined);
  const { preset, withAddon, choose, toggleAddon } = useDetailingSelection(pkg?.name, extra);
  // Ceramic coating and the bundles live here too, under "Protection & bundles".
  const more = packages.filter((p) => p.id !== EXTERIOR_PACKAGE_ID && p.id !== "interior");

  return (
    <>
      <DetailingHero
        eyebrow="Davidan Services — Exterior Detailing"
        title={
          <>
            Exterior <span className="text-primary">Detailing</span>
          </>
        }
        lead={`${exteriorResult} The same service is included for every vehicle size.`}
        image={exteriorImage}
        imageAlt="Car exterior being washed and detailed"
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
            eyebrow="Exterior detail"
            title="Exterior detailing, priced by vehicle size"
            lead={`${exteriorSameService}.`}
          />
          {pkg && tiers.length > 0 ? (
            <TierCards
              pkg={pkg}
              tiers={tiers}
              titleFor={tierTitle}
              included={exteriorIncludedServices}
              selectedAddon={withAddon ? extra : undefined}
              onChoose={choose}
            />
          ) : (
            <p className="mt-14 border border-border bg-card p-6 text-muted-foreground">
              Our exterior packages are being updated. Please{" "}
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
            title="Five services in every exterior detail"
            lead="The same thorough process, whichever vehicle size you choose."
          />
          <IncludedGrid
            items={exteriorIncluded}
            note={
              <>
                <p className="label-tech">Optional</p>
                <p className="leading-relaxed">Polish is available separately as an add-on.</p>
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
          hint="Add it to any exterior package."
        />
      )}

      <section className="border-y border-border bg-secondary py-24 lg:py-28">
        <div className="reveal mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow">The result</p>
          <p className="mt-6 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">
            {exteriorResult}
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.3em] text-primary">
            {exteriorTagline}
          </p>
        </div>
      </section>

      <section id="protection" className="scroll-mt-20 bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Go further"
            title="Protection & bundles"
            lead="Add long-lasting protection, or combine interior and exterior in one visit. Pick your vehicle type to see the price."
          />
          <div className="reveal mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {more.map((p) => (
              <PackageCard key={p.id} pkg={p} vehicleTypes={vehicleTypes} />
            ))}
            <div className="lift relative flex flex-col rounded-sm border border-border border-t-2 border-t-primary bg-card p-6 hover:border-primary/30 hover:bg-muted">
              <h3 className="font-heading text-xl font-semibold text-card-foreground">
                {ppf.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{ppf.description}</p>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-foreground">
                  {gbp(ppf.startingFrom)}
                </span>
                <span className="text-sm text-muted-foreground">starting from</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {ppf.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/ppf"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm border border-primary/30 bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary/20"
              >
                Configure Coverage <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <BookingSection
        packages={packages}
        ppf={ppf}
        vehicleTypes={vehicleTypes}
        addons={addons}
        preset={preset}
      />
      <Faq />
    </>
  );
}
