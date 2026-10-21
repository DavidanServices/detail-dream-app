import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { stagger } from "@/lib/motion";

type Stat = { label: string; value: string; accent?: boolean };

type Props = {
  eyebrow: string;
  title: ReactNode;
  lead: string;
  image: string;
  imageAlt: string;
  stats: Stat[];
};

export function DetailingHero({ eyebrow, title, lead, image, imageAlt, stats }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl lg:grid-cols-12">
        <div className="relative z-10 px-4 py-20 sm:px-6 lg:col-span-7 lg:px-8 lg:py-28">
          <p style={stagger(0)} className="enter eyebrow">
            {eyebrow}
          </p>
          <h1
            style={stagger(1)}
            className="enter mt-6 font-heading text-5xl text-foreground sm:text-7xl lg:text-7xl"
          >
            {title}
          </h1>
          <p
            style={stagger(2)}
            className="enter mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
          >
            {lead}
          </p>
          <div style={stagger(3)} className="enter mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#book"
              className="btn-primary group inline-flex items-center justify-center gap-3 bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground"
            >
              Book Your Detail
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#packages"
              className="inline-flex items-center justify-center border border-border px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground/5"
            >
              View Packages
            </a>
          </div>

          {stats.length > 0 && (
            <dl
              style={stagger(4)}
              className="enter mt-12 grid max-w-xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="bg-background/80 p-4 backdrop-blur">
                  <dt className="label-tech">{stat.label}</dt>
                  <dd
                    className={`mt-1 font-heading text-3xl ${stat.accent ? "text-primary" : "text-foreground"}`}
                  >
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="relative min-h-[300px] lg:col-span-5">
          <img
            src={image}
            alt={imageAlt}
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
  );
}
