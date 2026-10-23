import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import ppfImage from "@/assets/ppf-hero.jpg";
import { BookingSection } from "@/components/detailing/BookingSection";
import { DetailingHero } from "@/components/detailing/DetailingHero";
import { IncludedGrid } from "@/components/detailing/IncludedGrid";
import { PpfPalette } from "@/components/ppf/PpfPalette";
import { PpfTierCards } from "@/components/ppf/PpfTierCards";
import { Faq } from "@/components/sections/Faq";
import { SectionHeading } from "@/components/SectionHeading";
import { iconFor } from "@/data/icons";
import { gbp } from "@/data/packages";
import { text } from "@/data/page-text";
import { finishLabels, type PpfColor } from "@/data/ppf";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";

const BENEFIT_ICONS = ["shield", "sparkles", "star", "check", "wrench"];

export const Route = createFileRoute("/ppf")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const content = loaderData?.content ?? {};
    return pageHead({
      title: text(content, "ppf.seo.title"),
      description:
        text(content, "ppf.seo.description") ||
        "Paint protection film (PPF) by Davidan Services: self-healing clear film, packages by vehicle size and gloss, satin and matte colours.",
      path: "/ppf",
    });
  },
  component: PpfPage,
});

function PpfPage() {
  const { packages, ppf, vehicleTypes, addons, content } = Route.useLoaderData();
  const t = (key: string) => text(content, key);
  const [vehicle, setVehicle] = useState<string | undefined>();
  const [color, setColor] = useState<PpfColor | undefined>();
  const [consultation, setConsultation] = useState(false);
  const [nonce, setNonce] = useState(0);

  // Choosing a size or a colour fills the quote form below; the visitor can still edit everything.
  const preset = useMemo(
    () => ({
      nonce,
      service: ppf.name,
      vehicle,
      message: consultation
        ? "I'd like to book a colour consultation to see the full 250-colour palette."
        : color
          ? `Preferred colour: ${color.name} (${finishLabels[color.finish]}).`
          : undefined,
    }),
    [nonce, ppf.name, vehicle, color, consultation],
  );

  const tiers = ppf.tiers.filter((tier) => vehicleTypes.some((v) => v.id === tier.vehicleTypeId));

  return (
    <>
      <DetailingHero
        eyebrow={t("ppf.hero.eyebrow")}
        title={
          <>
            {t("ppf.hero.title")} <span className="text-primary">{t("ppf.hero.accent")}</span>
          </>
        }
        lead={t("ppf.hero.lead")}
        image={ppfImage}
        imageAlt="Paint protection film being applied to a car"
        stats={tiers.map((tier) => ({
          label: tier.title,
          value: tier.price === null ? "On request" : gbp(tier.price),
        }))}
      />

      <section className="border-b border-border bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="About PPF"
            title={t("ppf.about.title")}
            lead={t("ppf.about.lead")}
          />
          <IncludedGrid
            items={ppf.features.map((feature, i) => ({
              icon: iconFor(BENEFIT_ICONS[i % BENEFIT_ICONS.length]),
              title: feature,
              text: feature,
            }))}
          />
        </div>
      </section>

      <section id="packages" className="scroll-mt-20 bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our packages"
            title={t("ppf.sizes.title")}
            lead={t("ppf.sizes.lead")}
          />
          <PpfTierCards
            ppf={ppf}
            vehicleTypes={vehicleTypes}
            onChoose={(id) => {
              setVehicle(id);
              setNonce((n) => n + 1);
            }}
            disclaimer={t("pricing.disclaimer")}
          />
        </div>
      </section>

      <section id="colours" className="scroll-mt-20 bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Colours & finishes"
            title={t("ppf.colors.title")}
            lead={t("ppf.colors.lead")}
          />
          <div className="mt-12">
            <PpfPalette
              colors={ppf.colors}
              selectedId={color?.id}
              onSelect={(c) => {
                setColor(c);
                setConsultation(false);
                setNonce((n) => n + 1);
              }}
            />
          </div>
          <div className="reveal mt-10 flex flex-col items-start gap-4 border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">250 colours available.</span> See the
              full palette in person and get advice on the best finish for your car.
            </p>
            <a
              href="#book"
              onClick={() => {
                setConsultation(true);
                setNonce((n) => n + 1);
              }}
              className="btn-primary bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground"
            >
              Book a colour consultation
            </a>
          </div>
          <p className="reveal mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm text-muted-foreground">
            <span>{t("ppf.colors.note")}</span>
            {color && (
              <a
                href="#book"
                className="link-wipe font-semibold uppercase tracking-[0.14em] text-primary"
              >
                Request {color.name}
              </a>
            )}
          </p>
        </div>
      </section>

      <BookingSection
        packages={packages}
        ppf={ppf}
        vehicleTypes={vehicleTypes}
        addons={addons}
        preset={preset}
        content={content}
      />
      <Faq />
    </>
  );
}
