import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-detailing.jpg";
import { Process } from "@/components/sections/Process";
import { TrustStrip } from "@/components/sections/TrustStrip";
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

function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
          <div className="px-4 py-20 sm:px-6 lg:col-span-7 lg:px-8 lg:py-32">
            <p style={stagger(0)} className="enter eyebrow">
              About us
            </p>
            <h1
              style={stagger(1)}
              className="enter mt-6 font-heading text-5xl text-foreground sm:text-7xl lg:text-8xl"
            >
              Passion for <span className="text-primary">every</span> finish
            </h1>
            <div
              style={stagger(2)}
              className="enter mt-10 grid gap-6 border-l border-primary pl-6 leading-relaxed text-muted-foreground md:grid-cols-2"
            >
              <p>
                Davidan Services is a new detailing business built on a simple belief: every vehicle
                deserves to look its absolute best. We&apos;re just getting started, which means
                every single car gets our full attention and time, with no rushing and no shortcuts.
              </p>
              <p>
                We use the same premium products and techniques as long-established studios, and we
                back every job with an honest price and a satisfaction promise. Early customers get
                our very best work as we build our reputation one finish at a time.
              </p>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:col-span-5">
            <img
              src={heroImage}
              alt="Davidan Services studio"
              style={stagger(2)}
              className="enter-scale absolute inset-0 h-full w-full object-cover"
              loading="lazy"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent lg:bg-gradient-to-r" />
          </div>
        </div>
      </section>

      <TrustStrip />
      <Process />

      <section className="border-t border-border bg-snow py-24 lg:py-32">
        <div className="reveal mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 md:flex-row md:items-end md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Our promise</p>
            <h2 className="mt-5 font-heading text-4xl text-foreground sm:text-5xl lg:text-6xl">
              We never rush a detail
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Every vehicle is inspected, prepped, and finished with care. If you&apos;re not
              thrilled with the result, we&apos;ll make it right.
            </p>
          </div>
          <Link
            to="/contact"
            className="btn-primary group inline-flex shrink-0 items-center gap-3 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground"
          >
            Book your detail{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </>
  );
}
