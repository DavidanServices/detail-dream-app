import { Link } from "@tanstack/react-router";
import { FileText, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons";
import { SectionHeading } from "@/components/SectionHeading";
import { site, telHref, whatsappUrl } from "@/data/site";

// Three quick ways to start a conversation; the same actions live in the floating bubble.
export function QuoteCta() {
  return (
    <section className="border-t border-border bg-secondary py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <SectionHeading
          eyebrow="Request a quote"
          title="Tell us about your car"
          lead="Send a few details and we'll come back with availability and a clear, upfront price. No obligation."
        />
        <div className="reveal grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <Link
            to="/contact"
            search={{ service: "Not sure" }}
            className="btn-primary flex items-center justify-center gap-3 bg-primary px-6 py-5 text-xs font-semibold text-primary-foreground"
          >
            <FileText className="h-4 w-4" /> Request quote
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 border border-border px-6 py-5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366] hover:text-[#25D366]"
          >
            <WhatsappIcon className="h-4 w-4" /> WhatsApp
          </a>
          <a
            href={telHref}
            className="flex items-center justify-center gap-3 border border-border px-6 py-5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary"
          >
            <Phone className="h-4 w-4" /> {site.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
