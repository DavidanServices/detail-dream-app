import type { ReactNode } from "react";
import { stagger } from "@/lib/motion";

type Props = { eyebrow: string; title: ReactNode; lead?: ReactNode; children?: ReactNode };

// Shared hero for inner pages: left aligned, soft red glow, hairline base.
export function PageHero({ eyebrow, title, lead, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-secondary">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(60% 90% at 88% 0%, color-mix(in oklab, var(--primary) 20%, transparent), transparent 70%)",
        }}
      />
      <div
        className="hairline-grid pointer-events-none absolute inset-0 opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <p style={stagger(0)} className="enter eyebrow">
          {eyebrow}
        </p>
        <h1
          style={stagger(1)}
          className="enter mt-6 max-w-4xl font-heading text-5xl text-foreground sm:text-7xl lg:text-8xl"
        >
          {title}
        </h1>
        {lead && (
          <p
            style={stagger(2)}
            className="enter mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
          >
            {lead}
          </p>
        )}
        {children && (
          <div style={stagger(3)} className="enter mt-8">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
