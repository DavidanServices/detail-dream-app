import { PageHero } from "@/components/PageHero";
import { legalUpdated, type LegalSection } from "@/data/legal";

export function LegalPage({
  eyebrow,
  title,
  sections,
}: {
  eyebrow: string;
  title: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={`Last updated ${legalUpdated}.`} />
      <section className="bg-background py-24 lg:py-28">
        <div className="mx-auto max-w-3xl space-y-12 px-4 sm:px-6 lg:px-8">
          {sections.map((section, i) => (
            <div key={section.heading} className="reveal">
              <h2 className="font-heading text-2xl uppercase tracking-wide text-foreground">
                <span className="mr-3 font-mono text-xs text-primary">0{i + 1}</span>
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-muted-foreground">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
