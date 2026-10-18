import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { gbp, lowestPrice } from "@/data/packages";
import { mapsUrl, site, telHref } from "@/data/site";
import { stagger } from "@/lib/motion";
import { loadCatalog } from "@/lib/catalog";
import { submitQuote } from "@/lib/quote";
import { pageHead } from "@/lib/seo";
import { MapEmbed } from "@/components/MapEmbed";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";

export const Route = createFileRoute("/contact")({
  validateSearch: (
    search: Record<string, unknown>,
  ): {
    service?: string | undefined;
    coverage?: string | undefined;
    vehicle?: string | undefined;
  } => {
    const out: {
      service?: string | undefined;
      coverage?: string | undefined;
      vehicle?: string | undefined;
    } = {};
    if (typeof search["service"] === "string") out.service = search["service"];
    if (typeof search["coverage"] === "string") out.coverage = search["coverage"];
    if (typeof search["vehicle"] === "string") out.vehicle = search["vehicle"];
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
  const { packages, ppf: ppfPackage } = Route.useLoaderData();
  const serviceOptions = [
    ...packages.map((pkg) => `${pkg.name} — from ${gbp(lowestPrice(pkg))}`),
    `${ppfPackage.name} — from ${gbp(ppfPackage.startingFrom)}`,
    "Not sure / Multiple services",
  ];
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [service, setService] = useState(serviceOptions[0] ?? "");
  const [message, setMessage] = useState("");
  const search = useSearch({ from: "/contact" });

  useEffect(() => {
    const requested = search.service;
    if (typeof requested === "string") {
      const matched = serviceOptions.find((option) =>
        option.toLowerCase().startsWith(requested.toLowerCase()),
      );
      if (matched) setService(matched);
    }
  }, [search.service]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const parts: string[] = [];
    if (typeof search.vehicle === "string" && search.vehicle) {
      parts.push(`Vehicle type: ${search.vehicle}.`);
    }
    if (typeof search.coverage === "string" && search.coverage) {
      parts.push(`PPF coverage requested: ${search.coverage}.`);
    }
    if (parts.length) setMessage(parts.join(" "));
  }, [search.coverage, search.vehicle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    // Hidden field real visitors never fill in: bots do. Pretend success and drop it.
    if (form.get("website")) {
      setSubmitted(true);
      return;
    }
    setSending(true);
    setError("");
    const result = await submitQuote({
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      service: service.split(" — from")[0] ?? service,
      vehicle: typeof search.vehicle === "string" ? search.vehicle : "",
      message,
    });
    setSending(false);
    if (result.ok) setSubmitted(true);
    else setError(result.error);
  };

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
              {submitted ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 animate-[pop_.5s_ease-out_both] items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-card-foreground">
                    Message sent!
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Thanks for reaching out. We'll get back to you shortly with availability and
                    pricing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="hidden" aria-hidden>
                    <label htmlFor="website">Leave this field empty</label>
                    <input
                      id="website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-card-foreground">
                        Name
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        maxLength={120}
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-card-foreground">
                      Phone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring"
                      placeholder="07123 456789"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium text-card-foreground">
                      Service
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring"
                    >
                      {serviceOptions.map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-card-foreground">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={message}
                      maxLength={4000}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-sm border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background transition-shadow duration-200 focus:ring-2 focus:ring-ring"
                      placeholder="Tell us about your vehicle and what you're looking for..."
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                    {sending ? "Sending..." : "Request Appointment"}
                  </button>
                </form>
              )}
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
