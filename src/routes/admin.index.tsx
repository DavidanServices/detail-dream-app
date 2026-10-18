import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Inbox, PoundSterling, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { REQUEST_STATUSES, formatDate, type QuoteRequest } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/")({ component: Dashboard });

function Dashboard() {
  const requests = useQuery({
    queryKey: ["admin", "requests", "dashboard"],
    refetchInterval: 30_000,
    queryFn: async () => {
      const { data, error } = await supabase!
        .from("quote_requests")
        .select("id,created_at,name,service,status")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Pick<QuoteRequest, "id" | "created_at" | "name" | "service" | "status">[];
    },
  });

  const rows = requests.data ?? [];
  const count = (status: string) => rows.filter((r) => r.status === status).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Quote requests from the website and quick access to prices.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(["new", "contacted", "quoted", "booked"] as const).map((status) => (
          <Link
            key={status}
            to="/admin/requests"
            search={{ status }}
            className="group border border-border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {REQUEST_STATUSES.find((s) => s.value === status)?.label}
            </p>
            <p
              className={`mt-3 font-heading text-5xl ${status === "new" && count("new") > 0 ? "text-primary" : ""}`}
            >
              {requests.isLoading ? "–" : count(status)}
            </p>
          </Link>
        ))}
      </div>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-heading text-2xl">
            <Inbox className="h-5 w-5 text-primary" /> Latest requests
          </h2>
          <Link
            to="/admin/requests"
            className="flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary"
          >
            All requests <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="divide-y divide-border border border-border bg-card">
          {requests.isError && (
            <p className="p-5 text-sm text-destructive">Could not load requests.</p>
          )}
          {!requests.isLoading && rows.length === 0 && !requests.isError && (
            <p className="p-5 text-sm text-muted-foreground">
              No requests yet. New enquiries from the contact form appear here.
            </p>
          )}
          {rows.slice(0, 6).map((r) => (
            <Link
              key={r.id}
              to="/admin/requests"
              search={{ open: r.id }}
              className="flex flex-wrap items-center justify-between gap-3 p-4 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.service ?? "No service selected"} · {formatDate(r.created_at)}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/admin/pricing"
          className="flex items-center gap-4 border border-border bg-card p-5 transition-colors hover:border-primary/50"
        >
          <PoundSterling className="h-6 w-6 text-primary" />
          <div>
            <p className="font-heading text-xl">Packages & prices</p>
            <p className="text-sm text-muted-foreground">
              Edit detailing packages and prices per vehicle type.
            </p>
          </div>
        </Link>
        <Link
          to="/admin/ppf"
          className="flex items-center gap-4 border border-border bg-card p-5 transition-colors hover:border-primary/50"
        >
          <ShieldCheck className="h-6 w-6 text-primary" />
          <div>
            <p className="font-heading text-xl">PPF configurator</p>
            <p className="text-sm text-muted-foreground">
              Panel prices, starting price and full-car price.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
