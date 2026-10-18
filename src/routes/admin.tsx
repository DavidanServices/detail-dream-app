import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { useAdminAuth } from "@/lib/admin";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  // The session is stored in the browser, so the admin renders on the client only.
  ssr: false,
  head: () => ({
    meta: [{ title: "Admin — Davidan Services" }, { name: "robots", content: "noindex,nofollow" }],
  }),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", exact: true },
  { to: "/admin/requests", label: "Requests", exact: false },
  { to: "/admin/pricing", label: "Pricing", exact: false },
  { to: "/admin/ppf", label: "PPF", exact: false },
] as const;

function AdminLayout() {
  const auth = useAdminAuth();

  const newCount = useQuery({
    queryKey: ["admin", "new-count"],
    enabled: auth.status === "admin",
    refetchInterval: 30_000,
    queryFn: async () => {
      const { count } = await supabase!
        .from("quote_requests")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      return count ?? 0;
    },
  });

  if (auth.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }
  if (auth.status !== "admin") {
    return (
      <>
        <AdminLogin {...(auth.status === "not-admin" ? { notAdminEmail: auth.email } : {})} />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3">
          <Link to="/admin" className="font-heading text-xl uppercase tracking-wide">
            Davidan <span className="text-primary">Admin</span>
          </Link>
          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exact }}
                className="relative px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground [&.active]:text-foreground [&.active]:after:absolute [&.active]:after:inset-x-3 [&.active]:after:bottom-0 [&.active]:after:h-px [&.active]:after:bg-primary"
              >
                {item.label}
                {item.label === "Requests" && (newCount.data ?? 0) > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {newCount.data}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-1">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              View site <ExternalLink className="h-3 w-3" />
            </a>
            <ThemeToggle />
            <button
              type="button"
              onClick={() => supabase?.auth.signOut()}
              className="flex items-center gap-1 px-2 py-2 text-xs text-muted-foreground hover:text-foreground"
              title={auth.email}
            >
              Sign out <LogOut className="h-3 w-3" />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
      <Toaster />
    </div>
  );
}
