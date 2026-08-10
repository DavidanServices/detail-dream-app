import { createFileRoute, useSearch } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book — Luxe Auto Detail" },
      { name: "description", content: "Book an appointment or get in touch with Luxe Auto Detail for premium car detailing services." },
      { property: "og:title", content: "Contact & Book — Luxe Auto Detail" },
      { property: "og:description", content: "Book an appointment or get in touch with Luxe Auto Detail." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <section className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">Get in Touch</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Book your detail
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Tell us about your vehicle and the service you're interested in. We'll respond with availability and a quote.
          </p>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Contact information</h2>
              <p className="mt-4 text-muted-foreground">
                Visit our studio or reach out directly. We typically respond within a few hours during business hours.
              </p>

              <ul className="mt-8 space-y-5">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">hello@luxeautodetail.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Studio</p>
                    <p className="text-muted-foreground">123 Detail Drive, Suite 100<br />Los Angeles, CA 90001</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/10 p-2.5 text-primary">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Hours</p>
                    <p className="text-muted-foreground">Mon–Fri: 8am – 6pm<br />Saturday: 9am – 4pm</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Form */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              {submitted ? (
                <div className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Send className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-heading text-xl font-semibold text-card-foreground">Message sent!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thanks for reaching out. We'll get back to you shortly with availability and pricing.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium text-card-foreground">Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-card-foreground">Email</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-card-foreground">Phone</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                      placeholder="(555) 000-0000"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="service" className="text-sm font-medium text-card-foreground">Service</label>
                    <select
                      id="service"
                      name="service"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                    >
                      <option>Exterior Detailing</option>
                      <option>Interior Detailing</option>
                      <option>Ceramic Coating</option>
                      <option>Paint Protection Film</option>
                      <option>Not sure / Multiple services</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-card-foreground">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus:ring-2 focus:ring-ring"
                      placeholder="Tell us about your vehicle and what you're looking for..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-electric"
                  >
                    <Send className="h-4 w-4" />
                    Request Appointment
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
