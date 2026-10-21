import { createFileRoute, redirect } from "@tanstack/react-router";

// Services became the Exterior Detailing page; keep old links and search results working.
export const Route = createFileRoute("/services")({
  beforeLoad: () => {
    throw redirect({ to: "/exterior-detailing", statusCode: 301 });
  },
});
