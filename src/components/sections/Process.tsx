import { SectionHeading } from "@/components/SectionHeading";
import { processSteps } from "@/data/content";
import { stagger } from "@/lib/motion";

export function Process() {
  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title="From booking to handover"
          lead="A simple, transparent process, so you always know what happens next."
        />
        <ol className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              style={stagger(i)}
              className="reveal group relative lg:border-l lg:border-border lg:px-8 lg:first:border-l-0 lg:first:pl-0"
            >
              <span className="font-mono text-xs text-primary">0{i + 1}</span>
              <step.icon className="mt-6 h-7 w-7 text-foreground transition-colors duration-300 group-hover:text-primary" />
              <h3 className="mt-5 font-heading text-2xl uppercase tracking-wide text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
