import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle } from "lucide-react";
import { PackageCard } from "@/components/PackageCard";
import { services } from "@/data/services";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { Faq } from "@/components/sections/Faq";
import { QuoteCta } from "@/components/sections/QuoteCta";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      title: "Our Services — Davidan Services",
      description:
        "Explore our premium auto detailing services: exterior detailing, interior detailing, ceramic coating, and paint protection film.",
      ogDescription: "Explore our premium auto detailing services.",
      path: "/services",
    }),
  loader: () => loadCatalog(),
  staleTime: 60_000,
  component: ServicesPage,
});

function ServicesPage() {
  const { packages, vehicleTypes, ppf: ppfPackage } = Route.useLoaderData();

  return (
    <>
      <PageHero
        eyebrow="What we do"
        title={
          <>
            Premium <span className="text-primary">detailing</span> services
          </>
        }
        lead="Protect, restore, and elevate your vehicle with our specialised detailing packages."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <h2 className="font-heading text-5xl font-bold text-foreground sm:text-6xl">
              Packages & Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Transparent pricing for every level of care. Pick a service, then choose your vehicle
              type to see the exact price.
            </p>
          </div>

          <div className="reveal grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} vehicleTypes={vehicleTypes} />
            ))}

            <div className="lift relative flex flex-col border border-border border-t-2 border-t-primary bg-card p-6 hover:border-primary/30 hover:bg-muted sm:col-span-2 lg:col-span-1">
              <h3 className="font-heading text-xl font-semibold text-card-foreground">
                {ppfPackage.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{ppfPackage.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-bold text-foreground">
                  £{ppfPackage.startingFrom}
                </span>
                <span className="text-muted-foreground">starting from</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {ppfPackage.features.map((feature) => (
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

      <section className="bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal mb-16 text-center">
            <h2 className="font-heading text-5xl font-bold text-foreground sm:text-6xl">
              Service Details
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              A closer look at what's included in every treatment we offer.
            </p>
          </div>
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                id={service.id}
                className={`reveal grid items-center gap-10 lg:grid-cols-2 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
              >
                <div className={`${index % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={1024}
                      height={768}
                    />
                  </div>
                </div>
                <div className={`${index % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="inline-flex items-center gap-2 rounded-sm bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                    <service.icon className="h-4 w-4" />
                    {service.title}
                  </div>
                  <h2 className="mt-4 font-heading text-5xl font-bold text-foreground sm:text-6xl">
                    {service.short}
                  </h2>
                  <p className="mt-4 text-lg text-muted-foreground">{service.description}</p>
                  <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-foreground">
                        <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {service.id === "ppf" && (
                    <Link
                      to="/ppf"
                      className="mt-6 inline-flex items-center gap-2 btn-primary bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
                    >
                      Open the PPF configurator <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuoteCta />
      <Faq />
    </>
  );
}
