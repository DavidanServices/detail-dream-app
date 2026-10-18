import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { termsSections } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms of Service — Davidan Services",
      description: "Booking, cancellation and care terms for Davidan Services detailing work.",
      path: "/terms",
    }),
  component: () => <LegalPage eyebrow="Legal" title="Terms of service" sections={termsSections} />,
});
