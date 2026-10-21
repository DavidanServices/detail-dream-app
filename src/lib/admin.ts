import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type AdminState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "not-admin"; email: string }
  | { status: "admin"; email: string };

// Session lives in the browser. The real protection is row level security in the database:
// a signed-in user who is not listed in admin_users cannot read or change anything.
export function useAdminAuth(): AdminState {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    const client = supabase;
    if (!client) {
      setState({ status: "signed-out" });
      return;
    }
    let active = true;

    const check = async (email: string | null) => {
      if (!email) return active && setState({ status: "signed-out" });
      const { data, error } = await client.from("admin_users").select("user_id").maybeSingle();
      if (!active) return;
      setState(data && !error ? { status: "admin", email } : { status: "not-admin", email });
    };

    client.auth.getSession().then(({ data }) => check(data.session?.user.email ?? null));
    const { data: sub } = client.auth.onAuthStateChange((_event, session) => {
      // Deferred: calling the client inside this callback can deadlock the auth lock.
      window.setTimeout(() => check(session?.user.email ?? null), 0);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export const REQUEST_STATUSES = [
  { value: "new", label: "New", tone: "bg-primary/15 text-primary border-primary/30" },
  {
    value: "contacted",
    label: "Contacted",
    tone: "bg-sky-500/15 text-sky-600 border-sky-500/30 dark:text-sky-400",
  },
  {
    value: "quoted",
    label: "Quoted",
    tone: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
  },
  {
    value: "booked",
    label: "Booked",
    tone: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
  },
  { value: "completed", label: "Completed", tone: "bg-muted text-muted-foreground border-border" },
  { value: "declined", label: "Declined", tone: "bg-muted text-muted-foreground border-border" },
  {
    value: "spam",
    label: "Spam",
    tone: "bg-destructive/15 text-destructive border-destructive/30",
  },
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number]["value"];

export type QuoteRequest = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  vehicle: string | null;
  message: string | null;
  status: RequestStatus;
  quoted_price: number | null;
  admin_notes: string | null;
  handled_at: string | null;
  preferred_date?: string | null;
  addons?: string[] | null;
};

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" });

// UK numbers: 07xxx -> 447xxx for wa.me links.
export function whatsappLink(phone: string, text = "") {
  const digits = phone.replace(/\D/g, "");
  const intl = digits.startsWith("0") ? `44${digits.slice(1)}` : digits;
  return `https://wa.me/${intl}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
