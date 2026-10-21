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

// PostgREST says a column is unknown when the database has not been migrated yet.
const isMissingColumn = (error: { code?: string }) =>
  error.code === "PGRST204" || error.code === "42703";

// Creates a quote request. Row level security only lets visitors insert these columns.
export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  if (!supabase)
    return {
      ok: false,
      error: "The booking form is temporarily unavailable. Please call or WhatsApp us.",
    };
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
