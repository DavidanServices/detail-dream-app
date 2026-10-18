import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/data/content";

export function Faq() {
  return (
    <section className="border-t border-border bg-snow py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <div>
          <SectionHeading
            eyebrow="FAQ"
            title="Questions, answered"
            lead="Can't find what you need? Ask us directly and we'll reply with availability and a quote."
          />
          <Link
            to="/contact"
            className="reveal link-wipe mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-primary"
          >
            Ask a question <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Accordion type="single" collapsible className="reveal w-full">
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="py-6 text-left font-heading text-xl uppercase tracking-wide hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
