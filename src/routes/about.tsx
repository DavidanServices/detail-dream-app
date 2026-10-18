import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Award, Users, Wrench, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-detailing.jpg";
import { stagger } from "@/lib/motion";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Us — Davidan Services",
      description:
        "Learn about Davidan Services's commitment to premium car care, expert technicians, and customer satisfaction.",
      ogDescription: "Learn about Davidan Services's commitment to premium car care.",
      path: "/about",
    }),
  component: AboutPage,
});

const stats = [
  { label: "Flexible Booking", value: "7 Days", icon: Calendar },
  { label: "Satisfaction Promise", value: "100%", icon: Award },
  { label: "Fully Insured & Careful", value: "Insured", icon: Users },
  { label: "Premium Products", value: "100%", icon: Wrench },
];

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-12">
          <div className="px-4 py-16 sm:px-8 lg:col-span-7 lg:py-28">
            <p style={stagger(0)} className="enter label-tech">03 — About Us</p>
            <h1 style={stagger(1)} className="enter mt-6 font-heading text-6xl text-foreground sm:text-8xl lg:text-9xl">
              Passion for <span className="text-primary">every</span> finish
            </h1>
            <div style={stagger(2)} className="enter mt-10 grid gap-6 border-l-2 border-primary pl-6 text-lg text-muted-foreground md:grid-cols-2">
              <p>
                Davidan Services is a new detailing business built on a simple belief: every vehicle deserves to look its absolute best. We're just getting started, which means every single car gets our full attention and time — no rushing, no shortcuts.
              </p>
              <p>
                We use the same premium products and techniques as long-established studios, and we back every job with an honest price and a satisfaction promise. Early customers get our very best work as we build our reputation one finish at a time.
              </p>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:col-span-5">
            <img src={heroImage} alt="Davidan Services studio" style={stagger(2)} className="enter-scale clip-corner absolute inset-0 h-full w-full object-cover" loading="lazy" width={1920} height={1080} />
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto grid max-w-[1440px] gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="reveal group bg-background p-8 transition-colors hover:bg-card">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <stat.icon className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
              </div>
              <p className="mt-10 font-heading text-6xl font-black text-foreground">{stat.value}</p>
              <p className="mt-2 label-tech">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="hairline-grid border-y border-border bg-snow py-24 lg:py-32">
        <div className="reveal mx-auto max-w-[1440px] px-4 sm:px-8">
          <h2 className="font-heading text-6xl font-black text-foreground sm:text-8xl">Our promise</h2>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-xl text-muted-foreground">
              We never rush a detail. Every vehicle is inspected, prepped, and finished with care. If you're not thrilled with the result, we'll make it right.
            </p>
            <Link to="/contact" className="group glow-electric inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-bold text-primary-foreground">
              Book your detail <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
