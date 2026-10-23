import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { gallery, results } from "@/data/gallery";
import { stagger } from "@/lib/motion";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/gallery")({
  head: () =>
    pageHead({
      title: "Gallery — Davidan Services",
      description:
        "A look at the finish we deliver: exterior and interior detailing, ceramic coating and paint protection film.",
      path: "/gallery",
    }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title={
          <>
            The <span className="text-primary">finish</span> speaks for itself
          </>
        }
        lead="A look at the standard we hold every vehicle to, from paint correction to protection."
      />
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid auto-rows-[18rem] gap-4 md:grid-cols-3">
            {gallery.map((item, i) => (
              <figure
                key={item.caption}
                style={stagger(i)}
                className={`reveal group relative overflow-hidden rounded-sm border border-border ${item.span}`}
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                <figcaption className="absolute inset-x-0 bottom-0 translate-y-1 p-5 font-heading text-xl uppercase tracking-wide text-white transition-transform duration-500 group-hover:translate-y-0">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-24">
            <SectionHeading
              eyebrow="Results so far"
              title="Before and after"
              lead="Real interiors from our work: the car as it arrived on the left, and after our detail on the right."
            />
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {results.map((item, i) => (
                <figure
                  key={item.caption}
                  style={stagger(i % 2)}
                  className={`reveal overflow-hidden rounded-sm border border-border bg-card ${i === 0 ? "md:col-span-2" : ""}`}
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={1536}
                    height={1024}
                    loading="lazy"
                    className="h-auto w-full"
                  />
                  <figcaption className="flex items-center justify-between border-t border-border px-5 py-3 font-heading text-lg uppercase tracking-wide text-foreground">
                    {item.caption}
                    <span className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                      BEFORE / AFTER
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="reveal mt-16 flex flex-col items-start justify-between gap-6 border-t border-border pt-10 sm:flex-row sm:items-center">
            <p className="max-w-md text-lg text-muted-foreground">
              Want results like these on your own vehicle?
            </p>
            <Link
              to="/contact"
              className="btn-primary group inline-flex items-center gap-3 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground"
            >
              Book an appointment{" "}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
