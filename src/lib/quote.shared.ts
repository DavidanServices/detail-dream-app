import { supabase } from "@/lib/supabase";

export type QuoteInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  vehicle: string;
  message: string;
  /** ISO date (yyyy-mm-dd) or empty. */
  preferredDate: string;
  addons: { id: string; name: string }[];
};

export type QuoteResult = { ok: true } | { ok: false; error: string };

const MAX = {
  name: 120,
  email: 254,
  phone: 40,
  service: 160,
  vehicle: 80,
  message: 4000,
  addon: 80,
};
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const text = (value: unknown, max: number, field: string) => {
  const s = typeof value === "string" ? value.trim() : "";
  if (s.length > max) throw new Error(`${field} is too long.`);
  return s;
};

// Server-side check of everything a visitor can send; nothing from the browser is trusted.
export function validateQuote(raw: unknown): QuoteInput {
  const input = (raw ?? {}) as Record<string, unknown>;
  const name = text(input["name"], MAX.name, "Name");
  const email = text(input["email"], MAX.email, "Email");
  if (!name) throw new Error("Please enter your name.");
  if (!EMAIL.test(email)) throw new Error("Please enter a valid email address.");
  const date = text(input["preferredDate"], 10, "Date");
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error("Please enter a valid date.");
  const addons = Array.isArray(input["addons"]) ? input["addons"].slice(0, 10) : [];
  return {
    name,
    email,
    phone: text(input["phone"], MAX.phone, "Phone"),
    service: text(input["service"], MAX.service, "Service"),
    vehicle: text(input["vehicle"], MAX.vehicle, "Vehicle"),
    message: text(input["message"], MAX.message, "Message"),
    preferredDate: date,
    addons: addons.map((a) => {
      const item = (a ?? {}) as Record<string, unknown>;
      return {
        id: text(item["id"], MAX.addon, "Add-on"),
        name: text(item["name"], MAX.addon, "Add-on"),
      };
    }),
  };
}

// PostgREST says a column is unknown when the database has not been migrated yet.
const isMissingColumn = (error: { code?: string }) =>
  error.code === "PGRST204" || error.code === "42703";

// Saves a quote request in Supabase. Row level security only lets visitors insert these columns.
export async function insertQuote(input: QuoteInput): Promise<QuoteResult> {
  if (!supabase) return { ok: false, error: "The booking form is temporarily unavailable." };
  const clean = (value: string) => value.trim() || null;
  const base = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: clean(input.phone),
    service: clean(input.service),
    vehicle: clean(input.vehicle),
    message: clean(input.message),
  };
  const hasExtras = Boolean(input.preferredDate) || input.addons.length > 0;

  let { error } = await supabase.from("quote_requests").insert({
    ...base,
    ...(input.preferredDate ? { preferred_date: input.preferredDate } : {}),
    ...(input.addons.length ? { addons: input.addons.map((a) => a.id) } : {}),
  });

  // Older database without the new columns: keep the details by adding them to the message.
  if (error && hasExtras && isMissingColumn(error)) {
    const note = [
      input.preferredDate && `Preferred date: ${input.preferredDate}.`,
      input.addons.length > 0 && `Add-ons: ${input.addons.map((a) => a.name).join(", ")}.`,
    ]
      .filter(Boolean)
      .join(" ");
    ({ error } = await supabase
      .from("quote_requests")
      .insert({ ...base, message: [base.message, note].filter(Boolean).join("\n\n") }));
  }

  if (error) {
    console.error("Quote request failed", error);
    return {
      ok: false,
      error: "Something went wrong sending your request. Please try again or call us.",
    };
  }
  return { ok: true };
}
