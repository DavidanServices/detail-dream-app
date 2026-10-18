import { supabase } from "@/lib/supabase";

export type QuoteInput = {
  name: string;
  email: string;
  phone: string;
  service: string;
  vehicle: string;
  message: string;
};

export type QuoteResult = { ok: true } | { ok: false; error: string };

// Creates a quote request. Row level security only lets visitors insert these columns.
export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  if (!supabase)
    return {
      ok: false,
      error: "The booking form is temporarily unavailable. Please call or WhatsApp us.",
    };
  const clean = (value: string) => value.trim() || null;
  const { error } = await supabase.from("quote_requests").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    phone: clean(input.phone),
    service: clean(input.service),
    vehicle: clean(input.vehicle),
    message: clean(input.message),
  });
  if (error) {
    console.error("Quote request failed", error);
    return {
      ok: false,
      error: "Something went wrong sending your request. Please try again or call us.",
    };
  }
  return { ok: true };
}
