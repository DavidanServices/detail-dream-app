import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Check, Info, Plus } from "lucide-react";
import interiorImage from "@/assets/interior-hero.jpg";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";
import { LEATHER_CONDITIONING_ID } from "@/data/addons";
import {
  INTERIOR_PACKAGE_ID,
  interiorIncluded,
  interiorTiers,
  priceDisclaimer,
} from "@/data/interior";
import { gbp } from "@/data/packages";
import { mapsUrl, site, telHref, whatsappUrl } from "@/data/site";
import { loadCatalog } from "@/lib/catalog";
import { stagger } from "@/lib/motion";
import { pageHead } from "@/lib/seo";

const TITLE = "Interior Car Detailing Packages | Davidan Services";
const DESCRIPTION =
  "Professional interior car detailing by Davidan Services. Hatchback packages from £110, sedans from £150 and SUVs from £180. Explore our services and request a quote.";

export const Route = createFileRoute("/interior-detailing")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: ({ loaderData }) => {
    const interior = loaderData?.packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
    const tiers =
      loaderData?.vehicleTypes.filter((v) => interior?.prices[v.id] !== undefined) ?? [];
    // Prices in the metadata follow the live catalogue so they can never drift from the page.
    const lowest = tiers.map((v) => interior?.prices[v.id] ?? 0).sort((a, b) => a - b)[0];
    return pageHead({
      title: TITLE,
      description:
        interior && tiers.length === 3
          ? `Professional interior car detailing by Davidan Services. ${tiers
              .map(
                (v) =>
                  `${interiorTiers[v.id]?.title.split(" ")[0] ?? v.label} from ${gbp(interior.prices[v.id] ?? 0)}`,
              )
              .join(", ")}. Explore our services and request a quote.`
          : DESCRIPTION,
      ogTitle: TITLE,
      path: "/interior-detailing",
      ...(interior && lowest !== undefined
        ? {
            jsonLd: {
              "@context": "https://schema.org",
              "@type": "Service",
              name: "Interior Car Detailing",
              serviceType: "Interior car detailing",
              provider: { "@type": "Organization", name: site.name, url: site.url },
              offers: tiers.map((v) => ({
                "@type": "Offer",
                name: interiorTiers[v.id]?.title ?? `${v.label} Interior Detail`,
                priceCurrency: "GBP",
                priceSpecification: {
                  "@type": "PriceSpecification",
                  minPrice: interior.prices[v.id],
                  priceCurrency: "GBP",
                },
              })),
            },
          }
        : {}),
    });
  },
  component: InteriorPage,
});

function InteriorPage() {
  const { packages, ppf, vehicleTypes, addons } = Route.useLoaderData();
  const interior = packages.find((p) => p.id === INTERIOR_PACKAGE_ID);
  const leather = addons.find((a) => a.id === LEATHER_CONDITIONING_ID);
  const tiers = vehicleTypes.filter((v) => interior?.prices[v.id] !== undefined);

  // Shared selection: pricing cards and the add-on both feed the booking form below.
  const [vehicle, setVehicle] = useState<string | undefined>();
  const [withLeather, setWithLeather] = useState(false);
  const [nonce, setNonce] = useState(0);
  const preset = useMemo(
    () => ({
      nonce,
      service: interior?.name,
      vehicle: vehicle ?? "",
      addonIds: withLeather && leather ? [leather.id] : [],
    }),
    [nonce, interior?.name, vehicle, withLeather, leather],
  );

  const choose = (vehicleId: string) => {
    setVehicle(vehicleId);
    setNonce((n) => n + 1);
  };

  const toggleLeather = () => {
    setWithLeather((v) => !v);
    setNonce((n) => n + 1);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
          <div className="relative z-10 px-4 py-20 sm:px-6 lg:col-span-7 lg:px-8 lg:py-28">
            <p style={stagger(0)} className="enter eyebrow">
              Davidan Services — Premium Interior Detailing
            </p>
            <h1
              style={stagger(1)}
              className="enter mt-6 font-heading text-5xl text-foreground sm:text-7xl lg:text-7xl"
            >
              A Cleaner Interior. <span className="text-primary">A Better Driving Experience.</span>
            </h1>
            <p
              style={stagger(2)}
              className="enter mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              Professional interior detailing for hatchbacks, saloons and SUVs. Every accessible
              surface is cleaned with care, so your cabin looks, feels and smells properly looked
              after.
            </p>
            <div style={stagger(3)} className="enter mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#book"
                className="btn-primary group inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground"
              >
                Book Your Detail{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#packages"
                className="inline-flex items-center justify-center border border-border px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/5"
              >
                View Packages
              </a>
            </div>

            {interior && (
              <dl
                style={stagger(4)}
                className="enter mt-12 grid max-w-xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4"
              >
                {tiers.map((v) => (
                  <div key={v.id} className="bg-background/80 p-4 backdrop-blur">
                    <dt className="label-tech">
                      {interiorTiers[v.id]?.title.split(" ")[0] ?? v.label}
                    </dt>
                    <dd className="mt-1 font-heading text-3xl text-foreground">
                      {gbp(interior.prices[v.id] ?? 0)}
                    </dd>
                  </div>
                ))}
                {leather && (
                  <div className="bg-background/80 p-4 backdrop-blur">
                    <dt className="label-tech">Leather conditioning</dt>
                    <dd className="mt-1 font-heading text-3xl text-primary">
                      +{gbp(leather.price)}
                    </dd>
                  </div>
                )}
              </dl>
            )}
          </div>
          <div className="relative min-h-[300px] lg:col-span-5">
            <img
              src={interiorImage}
              alt="Detailed car interior after a professional clean"
              width={1400}
              height={1045}
              fetchPriority="high"
              style={stagger(2)}
              className="enter-scale absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="scroll-mt-20 bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our packages"
            title="Interior detailing, priced by vehicle size"
            lead="Every package includes the same seven services. Choose the one that matches your vehicle."
          />

          {interior && tiers.length > 0 ? (
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {tiers.map((v, i) => {
                const price = interior.prices[v.id] ?? 0;
                const copy = interiorTiers[v.id];
                return (
                  <article
                    key={v.id}
                    style={stagger(i)}
                    className="reveal lift group flex flex-col rounded-sm border border-border bg-card p-7 hover:border-primary/50 sm:p-8"
                  >
                    <p className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      <span>Package 0{i + 1}</span>
                      <span className="text-primary">{v.label}</span>
                    </p>
                    <h3 className="mt-5 font-heading text-3xl text-card-foreground">
                      {copy?.title ?? `${v.label} Interior Detail`}
                    </h3>
                    <p className="mt-6 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                      From
                    </p>
                    <p className="font-heading text-7xl leading-none text-foreground">
                      {gbp(price)}
                    </p>
                    {withLeather && leather && (
                      <p className="mt-2 text-sm text-primary">
                        With leather conditioning: from {gbp(price + leather.price)}
                      </p>
                    )}
                    <p className="mt-5 leading-relaxed text-muted-foreground">
                      {copy?.blurb ?? interior.description}
                    </p>

                    <ul className="mt-6 flex-1 space-y-3 border-t border-border pt-6">
                      {interiorIncluded.map((item) => (
                        <li
                          key={item.title}
                          className="flex items-start gap-3 text-[15px] leading-snug text-foreground sm:text-sm"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          {item.text}
                        </li>
                      ))}
                    </ul>

                    <a
                      href="#book"
                      onClick={() => choose(v.id)}
                      aria-label={`Book ${copy?.title ?? v.label}`}
                      className="btn-primary mt-8 inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground"
                    >
                      Book {copy?.title.split(" ")[0] ?? v.label}{" "}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </article>
                );
              })}
            </div>
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

          <p className="reveal mt-8 flex items-start gap-3 border-l-2 border-primary bg-primary/5 px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            {priceDisclaimer}
          </p>
        </div>
      </section>

      {/* What's included */}
      <section className="border-y border-border bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="What's included"
            title="Seven services in every interior detail"
            lead="The same thorough process, whichever package you choose."
          />
          <ul className="mt-14 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {interiorIncluded.map((item, i) => (
              <li
                key={item.title}
                style={stagger(i % 3)}
                className="reveal group flex flex-col gap-4 bg-card p-7 transition-colors hover:bg-muted"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <item.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-heading text-2xl text-card-foreground">{item.title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </li>
            ))}
            <li className="reveal flex flex-col justify-center gap-2 bg-background p-7 text-muted-foreground">
              <p className="label-tech">Not included</p>
              <p className="leading-relaxed">
                Leather conditioning is available separately as an optional extra.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Optional extra */}
      {leather && (
        <section className="bg-background py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="reveal relative overflow-hidden border border-primary/60 bg-gradient-to-br from-primary/15 via-card to-card p-8 sm:p-12">
              <div className="grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
                <div>
                  <p className="eyebrow">Optional extra</p>
                  <h2 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl">
                    {leather.name}
                  </h2>
                  <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                    {leather.description}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Add it to any interior package.
                  </p>
                </div>
                <div className="lg:text-right">
                  <p className="font-heading text-7xl leading-none text-primary">
                    +{gbp(leather.price)}
                  </p>
                  <button
                    type="button"
                    aria-pressed={withLeather}
                    onClick={toggleLeather}
                    className={`mt-6 inline-flex w-full items-center justify-center gap-2 border px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98] sm:w-auto ${
                      withLeather
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-primary text-primary hover:bg-primary/10"
                    }`}
                  >
                    {withLeather ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {withLeather ? "Added to my booking" : "Add to my booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking */}
      <section
        id="book"
        className="scroll-mt-20 border-t border-border bg-secondary py-24 lg:py-32"
      >
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Book your detail"
              title="Request a quote"
              lead="Tell us about your vehicle and we'll come back with availability and a clear price. No obligation."
            />
            <ul className="reveal mt-8 space-y-3 text-muted-foreground">
              <li>
                Call{" "}
                <a
                  href={telHref}
                  className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Message us on WhatsApp
                </a>
              </li>
              <li>
                {site.address.lines[0]}, {site.address.lines[1]} ·{" "}
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  Directions
                </a>
              </li>
            </ul>
          </div>
          <div className="reveal border border-border border-t-2 border-t-primary bg-card p-6 sm:p-8">
            <QuoteForm
              packages={packages}
              ppf={ppf}
              vehicleTypes={vehicleTypes}
              addons={addons}
              preset={preset}
            />
          </div>
        </div>
      </section>
    </>
  );
}
