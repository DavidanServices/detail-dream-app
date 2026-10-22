import { sendQuoteEmail } from "@/lib/email.server";
import { insertQuote, type QuoteInput, type QuoteResult } from "@/lib/quote.shared";

// Runs on the server: save the request, then email it. They are independent, so a database
// problem still delivers the lead by email, and an email problem still saves it for /admin.
export async function processQuote(input: QuoteInput): Promise<QuoteResult> {
  const [saved, emailed] = await Promise.all([insertQuote(input), sendQuoteEmail(input)]);
  if (saved.ok || emailed) return { ok: true };
  return saved;
}
