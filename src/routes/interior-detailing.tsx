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
import { iconFor } from "@/data/icons";
import { INTERIOR_PACKAGE_ID } from "@/data/interior";
import { text } from "@/data/page-text";
import { gbp, highlightsOf } from "@/data/packages";
import { telHref } from "@/data/site";
import { loadCatalog } from "@/lib/catalog";
import { detailingHead } from "@/lib/detailing-seo";
import { tierBlurb, tierTitle } from "@/lib/tiers";

export const Route = createFileRoute("/interior-detailing")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const content = loaderData?.content ?? {};
    const pkg = loaderData?.packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
    return detailingHead({
      path: "/interior-detailing",
      title: text(content, "interior.seo.title"),
      descriptionOverride: text(content, "interior.seo.description"),
      noun: "interior car detailing",
      serviceName: "Interior Car Detailing",
      pkg,
      tiers: loaderData?.vehicleTypes ?? [],
      tierTitle: (v) => tierTitle(pkg, v, "Interior Detail"),
    });
  },
  component: InteriorPage,
});

function InteriorPage() {
  const { packages, ppf, vehicleTypes, addons, content } = Route.useLoaderData();
  const t = (key: string) => text(content, key);
  const pkg = packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
  const extra = addons.find((a) => a.packageId === INTERIOR_PACKAGE_ID);
  const tiers = vehicleTypes.filter((v) => pkg?.prices[v.id] !== undefined);
  const items = pkg ? highlightsOf(pkg) : [];
  const title = (v: (typeof tiers)[number]) => tierTitle(pkg, v, "Interior Detail");
  const { preset, withAddon, choose, toggleAddon } = useDetailingSelection(pkg?.name, extra);

  return (
    <>
      <DetailingHero
        eyebrow={t("interior.hero.eyebrow")}
        title={
          <>
            {t("interior.hero.title")}{" "}
            <span className="text-primary">{t("interior.hero.accent")}</span>
          </>
        }
        lead={t("interior.hero.lead")}
        image={interiorImage}
        imageAlt="Detailed car interior after a professional clean"
        stats={[
          ...(pkg
            ? tiers.map((v) => ({
                label: title(v).split(" ")[0] ?? v.label,
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
            title={t("interior.packages.title")}
            lead={t("interior.packages.lead")}
          />
          {pkg && tiers.length > 0 ? (
            <TierCards
              pkg={pkg}
              tiers={tiers}
              titleFor={title}
              blurbFor={(v) => tierBlurb(pkg, v)}
              included={items.map((item) => item.text)}
              selectedAddon={withAddon ? extra : undefined}
              onChoose={choose}
              disclaimer={t("pricing.disclaimer")}
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
            title={t("interior.included.title")}
            lead={t("interior.included.lead")}
          />
          <IncludedGrid
            items={items.map((item) => ({
              icon: iconFor(item.icon),
              title: item.title || item.text,
              text: item.text,
            }))}
            note={
              <>
                <p className="label-tech">Not included</p>
                <p className="leading-relaxed">{t("interior.included.note")}</p>
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
          hint={t("interior.addon.hint")}
        />
      )}

      <BookingSection
        packages={packages}
        ppf={ppf}
        vehicleTypes={vehicleTypes}
        addons={addons}
        preset={preset}
        content={content}
      />
    </>
  );
}
