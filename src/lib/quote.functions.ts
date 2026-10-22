import { createServerFn } from "@tanstack/react-start";
import { validateQuote } from "@/lib/quote.shared";

// Browser -> server endpoint for the booking form. Validation runs here, on the server.
export const submitQuoteFn = createServerFn({ method: "POST" })
  .validator((input: unknown) => validateQuote(input))
  .handler(async ({ data }) => {
    const { processQuote } = await import("@/lib/quote.server");
    return processQuote(data);
  });
