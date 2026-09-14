import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Users, Wrench, Calendar } from "lucide-react";
import heroImage from "../assets/hero-detailing.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Davidan Services" },
      { name: "description", content: "Learn about Davidan Services's commitment to premium car care, expert technicians, and customer satisfaction." },
      { property: "og:title", content: "About Us — Davidan Services" },
      { property: "og:description", content: "Learn about Davidan Services's commitment to premium car care." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const stats = [
  { label: "Mobile & Flexible Booking", value: "7 Days", icon: Calendar },
  { label: "Satisfaction Promise", value: "100%", icon: Award },
  { label: "Fully Insured & Careful", value: "Insured", icon: Users },
  { label: "Premium Products", value: "100%", icon: Wrench },
];

function AboutPage() {
  return (
    <>
      <section className="bg-secondary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="font-heading text-sm font-semibold uppercase tracking-widest text-primary">About Us</p>
              <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Passion for every finish
              </h1>
              <p className="mt-6 text-lg text-white/80">
                Davidan Services is a new detailing business built on a simple belief: every vehicle deserves to look its absolute best. We're just getting started, which means every single car gets our full attention and time — no rushing, no shortcuts.
              </p>
              <p className="mt-4 text-lg text-white/80">
                We use the same premium products and techniques as long-established studios, and we back every job with an honest price and a satisfaction promise. Early customers get our very best work as we build our reputation one finish at a time.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <img
                src={heroImage}
                alt="Davidan Services studio"
                className="h-full w-full object-cover"
                loading="lazy"
                width={1920}
                height={1080}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-all hover:border-primary/30"
              >
                <stat.icon className="mx-auto h-8 w-8 text-primary" />
                <p className="mt-4 font-heading text-3xl font-bold text-card-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-snow py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">Our promise</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We never rush a detail. Every vehicle is inspected, prepped, and finished with care. If you're not thrilled with the result, we'll make it right.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 glow-electric"
          >
            Book your detail <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
