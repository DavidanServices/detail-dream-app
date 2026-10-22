import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { termsSections } from "@/data/legal";
import { text } from "@/data/page-text";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: () =>
    pageHead({
      title: "Terms and Conditions | Davidan Services",
      description:
        "Terms and conditions for Davidan Services: quotes, booking, payment, cancellation, your vehicle, results and our responsibility.",
      path: "/terms",
    }),
  component: TermsPage,
});

function TermsPage() {
  const { content } = Route.useLoaderData();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms and conditions"
      sections={termsSections((key) => text(content, key))}
    />
  );
}
