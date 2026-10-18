import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/LegalPage";
import { privacySections } from "@/data/legal";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy Policy — Davidan Services",
      description: "How Davidan Services collects, uses and protects your personal information.",
      path: "/privacy",
    }),
  component: () => <LegalPage eyebrow="Legal" title="Privacy policy" sections={privacySections} />,
});
