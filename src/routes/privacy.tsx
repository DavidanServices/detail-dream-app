import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { privacySections } from "@/data/legal";
import { text } from "@/data/page-text";
import { loadCatalog } from "@/lib/catalog";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  loader: () => loadCatalog(),
  staleTime: 60_000,
  head: () =>
    pageHead({
      title: "Privacy Policy | Davidan Services",
      description:
        "How Davidan Services collects, uses and protects your personal information, and the rights you have under UK data protection law.",
      path: "/privacy",
    }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { content } = Route.useLoaderData();
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy policy"
      sections={privacySections((key) => text(content, key))}
    />
  );
}
