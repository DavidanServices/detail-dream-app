import { submitQuoteFn } from "@/lib/quote.functions";
import { insertQuote, type QuoteInput, type QuoteResult } from "@/lib/quote.shared";

export type { QuoteInput, QuoteResult } from "@/lib/quote.shared";

// Sends the booking form to the server, which saves it and emails offers@davidan.co.uk.
// If the server endpoint cannot be reached the request is still saved directly (without the email).
export async function submitQuote(input: QuoteInput): Promise<QuoteResult> {
  try {
    return await submitQuoteFn({ data: input });
  } catch (error) {
    // A validation message from the server is a real answer, not an outage.
    if (error instanceof Error && /Please enter|too long/.test(error.message)) {
      return { ok: false, error: error.message };
    }
    console.error("Booking endpoint unavailable, saving directly", error);
    return insertQuote(input);
  }
}
