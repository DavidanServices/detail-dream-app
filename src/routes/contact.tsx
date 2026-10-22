import { createFileRoute } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useMemo } from "react";
import { text } from "@/data/page-text";
import { mapsUrl, site, telHref } from "@/data/site";
import { stagger } from "@/lib/motion";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";
import { MapEmbed } from "@/components/MapEmbed";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import { SectionHeading } from "@/components/SectionHeading";

type ContactSearch = {
  service?: string | undefined;
  coverage?: string | undefined;
  vehicle?: string | undefined;
  addons?: string | undefined;
  date?: string | undefined;
};

export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): ContactSearch => {
    const out: ContactSearch = {};
    for (const key of ["service", "coverage", "vehicle", "addons", "date"] as const) {
      if (typeof search[key] === "string") out[key] = search[key];
    }
    return out;
  },
  head: () =>
    pageHead({
      title: "Contact & Book — Davidan Services",
      description:
        "Book an appointment or get in touch with Davidan Services for premium car detailing services.",
      ogDescription: "Book an appointment or get in touch with Davidan Services.",
      path: "/contact",
    }),
  loader: () => loadCatalog(),
  staleTime: 60_000,
  component: ContactPage,
});

function ContactPage() {
  const { packages, ppf, vehicleTypes, addons, content } = Route.useLoaderData();
  const search = Route.useSearch();
  const preset = useMemo(
    () => ({
      nonce: 1,
      service: search.service,
      vehicle: search.vehicle,
      addonIds: search.addons?.split(",").filter(Boolean),
      date: search.date,
      message: search.coverage ? `PPF coverage requested: ${search.coverage}.` : undefined,
    }),
    [search.service, search.vehicle, search.addons, search.date, search.coverage],
  );

  return (
    <>
      <PageHero
        eyebrow="Get in touch"
        title={
          <>
            Book your <span className="text-primary">detail</span>
          </>
        }
        lead="Tell us about your vehicle and the service you're interested in. We'll respond with availability and a quote."
      />

      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="reveal">
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Contact information
              </h2>
              <p className="mt-4 text-muted-foreground">
                Visit our studio or reach out directly. We typically respond within a few hours
                during business hours.
              </p>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-4">
                  <div className="rounded-sm bg-primary/10 p-2.5 text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <a
                      href={telHref}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {site.phone}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-sm bg-primary/10 p-2.5 text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <a
                      href={`mailto:${site.email}`}
                      className="text-muted-foreground transition-colors hover:text-primary"
                    >
                      {site.email}
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-sm bg-primary/10 p-2.5 text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Studio</p>
                    <p className="text-muted-foreground">
                      {site.address.lines[0]}
                      <br />
                      {site.address.lines[1]}
                    </p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="link-wipe mt-1 inline-block text-xs font-semibold uppercase tracking-[0.12em] text-primary"
                    >
                      Get directions
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-sm bg-primary/10 p-2.5 text-primary transition-transform duration-300 hover:scale-110 hover:rotate-6">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Hours</p>
                    <p className="text-muted-foreground">
                      {site.hours[0]}
                      <br />
                      {site.hours[1]}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div
              style={stagger(2)}
              className="reveal border border-border border-t-2 border-t-primary bg-card p-6 sm:p-8"
            >
              <QuoteForm
                packages={packages}
                ppf={ppf}
                vehicleTypes={vehicleTypes}
                addons={addons}
                preset={preset}
                disclaimer={text(content, "pricing.disclaimer")}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="border-t border-border bg-snow py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Find us"
            title="Visit the studio"
            lead="Drop by, or get directions straight from the map."
            className="mb-12"
          />
          <MapEmbed />
        </div>
      </section>
    </>
  );
}
