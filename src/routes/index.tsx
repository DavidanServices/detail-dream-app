import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import heroImage from "@/assets/hero-detailing.jpg";
import exteriorImage from "@/assets/service-exterior.jpg";
import { SectionHeading } from "@/components/SectionHeading";
import { Faq } from "@/components/sections/Faq";
import { QuoteCta } from "@/components/sections/QuoteCta";
import { Process } from "@/components/sections/Process";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { cheapestPackagePrice, gbp, lowestPrice } from "@/data/packages";
import { highlights, services } from "@/data/services";
import { stagger } from "@/lib/motion";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Davidan Services | Premium Car Detailing in Dunstable",
      description:
        "Expert exterior and interior detailing, ceramic coating, and paint protection film. Restore and protect your vehicle with Davidan Services.",
      ogDescription:
        "Expert exterior and interior detailing, ceramic coating, and paint protection film.",
      path: "/",
    }),
  loader: () => loadCatalog(),
  staleTime: 60_000,
  component: HomePage,
});

function HomePage() {
  const { packages, ppf } = Route.useLoaderData();
  const featuredPackages = packages.filter((pkg) => pkg.featured);
  const widePackages = [
    ...packages
      .filter((pkg) => !pkg.featured)
      .map((pkg) => ({
        name: pkg.name,
        description: pkg.tagline ?? pkg.description,
        price: gbp(lowestPrice(pkg)),
        cta: "Book bundle",
      })),
    {
      name: ppf.name,
      description: ppf.tagline,
      price: gbp(ppf.startingFrom),
      cta: "Request quote",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl lg:grid-cols-12">
          <div className="relative z-10 flex flex-col justify-center px-4 py-16 sm:px-6 lg:col-span-6 lg:px-8 lg:py-24">
            <p style={stagger(0)} className="enter eyebrow">
              Premium auto detailing
            </p>
            <h1
              style={stagger(1)}
              className="enter mt-7 font-heading text-6xl text-foreground sm:text-7xl xl:text-8xl"
            >
              Drive a car that looks <span className="text-primary">brand new.</span>
            </h1>
            <p
              style={stagger(3)}
              className="enter mt-8 max-w-md text-lg leading-relaxed text-muted-foreground"
            >
              Expert detailing, ceramic coating, and paint protection film. Precision care for the
              vehicle you love.
            </p>
            <div style={stagger(4)} className="enter mt-10 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary group inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground"
              >
                Book an appointment{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center border border-border px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/5"
              >
                View services
              </Link>
            </div>
          </div>
          <div className="relative min-h-[50vh] lg:col-span-6">
            <img
              src={heroImage}
              alt="Luxury car in premium detailing studio"
              style={stagger(1)}
              className="enter-scale absolute inset-0 h-full w-full object-cover"
              width={1920}
              height={1080}
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent lg:bg-gradient-to-r" />
            <div
              style={stagger(6)}
              className="enter absolute bottom-8 right-8 hidden border border-border bg-background/80 px-6 py-4 backdrop-blur sm:block"
            >
              <p className="label-tech">Packages from</p>
              <p className="mt-1 font-heading text-5xl text-foreground">
                {gbp(cheapestPackagePrice(packages))}
              </p>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* Services index */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Services"
            title="Everything your vehicle needs"
            lead="To look its best and stay protected."
          />
          <div className="mt-14 divide-y divide-border border-y border-border">
            {services.map((service, i) => (
              <Link
                key={service.id}
                {...(service.id === "interior"
                  ? { to: "/interior-detailing" as const }
                  : { to: "/services" as const, hash: service.id })}
                className="reveal group grid items-center gap-6 py-7 md:grid-cols-12"
              >
                <span className="font-mono text-sm text-primary md:col-span-1">0{i + 1}</span>
                <h3 className="font-heading text-3xl text-foreground transition-transform duration-300 group-hover:translate-x-2 sm:text-4xl md:col-span-4">
                  {service.title}
                </h3>
                <p className="leading-relaxed text-muted-foreground md:col-span-4">
                  {service.summary}
                </p>
                <div className="relative h-28 overflow-hidden rounded-sm md:col-span-3">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                    loading="lazy"
                    width={1024}
                    height={768}
                  />
                  <span className="absolute bottom-0 right-0 flex items-center gap-1 bg-primary px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                    <service.icon className="h-3 w-3" /> Learn more{" "}
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Process />

      {/* Packages & Pricing */}
      <section className="border-y border-border bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Price list"
            title="Packages & pricing"
            lead="Clear, upfront pricing for every level of care. Prices vary by vehicle type: hatchback, saloon/coupe or SUV."
          />
          <div className="reveal mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`lift group relative flex flex-col rounded-sm border p-8 ${
                  pkg.popular
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/40"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.15em]">
                    <Star className="h-3 w-3" /> Most popular
                  </span>
                )}
                <h3 className="font-heading text-2xl">{pkg.name}</h3>
                <p
                  className={`mt-12 text-[11px] uppercase tracking-[0.2em] ${pkg.popular ? "opacity-80" : "text-muted-foreground"}`}
                >
                  starting from
                </p>
                <p className="font-heading text-6xl">{gbp(lowestPrice(pkg))}</p>
                <Link
                  to="/contact"
                  search={{ service: pkg.name }}
                  className={`mt-8 inline-flex items-center justify-between border-t pt-4 text-xs font-semibold uppercase tracking-[0.14em] ${
                    pkg.popular
                      ? "border-primary-foreground/40"
                      : "border-border group-hover:text-primary"
                  }`}
                >
                  Book now{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
          <div className="reveal mt-4 grid gap-4 sm:grid-cols-2">
            {widePackages.map((x) => (
              <div
                key={x.name}
                className="lift flex flex-col justify-between gap-4 rounded-sm border border-border bg-card p-8 hover:border-primary/40 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-heading text-2xl text-card-foreground">{x.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{x.description}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-heading text-4xl text-foreground">from {x.price}</p>
                  <Link
                    to="/contact"
                    search={{ service: x.name }}
                    className="link-wipe mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
                  >
                    {x.cta} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="reveal relative aspect-[4/5] overflow-hidden rounded-sm lg:col-span-5">
            <img
              src={exteriorImage}
              alt="Professional exterior detailing"
              className="h-full w-full object-cover"
              loading="lazy"
              width={1024}
              height={768}
            />
          </div>
          <div className="reveal lg:col-span-7">
            <p className="eyebrow">Why Davidan</p>
            <h2 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">
              Why drivers trust Davidan Services
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              We treat every vehicle like it&apos;s our own. From daily drivers to exotic
              collectibles, our process is meticulous, paint-safe, and built around lasting results.
            </p>
            <ul className="mt-10 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {highlights.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 border-t border-border pt-4 text-foreground"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:border-primary hover:text-primary"
              >
                Our story <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground"
              >
                Get a free quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <QuoteCta />
      <Faq />
    </>
  );
}
