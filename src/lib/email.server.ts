import { site } from "@/data/site";
import type { QuoteInput } from "@/lib/quote.shared";

// Sends the "new quote request" email through Resend. Configuration (all optional except the key):
//   RESEND_API_KEY     secret from resend.com; without it no email is sent (requests are still saved)
//   QUOTE_NOTIFY_TO    who receives it, default offers@davidan.co.uk
//   QUOTE_EMAIL_FROM   sender on a domain verified in Resend, e.g. "Davidan Website <website@davidan.co.uk>"
//   RESEND_API_URL     override for testing
const DEFAULT_TO = "offers@davidan.co.uk";
const DEFAULT_FROM = "Davidan Website <onboarding@resend.dev>";
const DEFAULT_API = "https://api.resend.com/emails";

const env = (key: string) =>
  (typeof process !== "undefined" ? process.env[key] : undefined)?.trim() || undefined;

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function lines(q: QuoteInput) {
  return [
    ["Name", q.name],
    ["Email", q.email],
    ["Phone", q.phone || "—"],
    ["Service", q.service || "—"],
    ["Vehicle", q.vehicle || "—"],
    ["Preferred date", q.preferredDate || "—"],
    ["Extras", q.addons.length ? q.addons.map((a) => a.name).join(", ") : "—"],
  ] as const;
}

/** Returns true when the email was accepted by Resend. Never throws: a failed email must not fail the request. */
export async function sendQuoteEmail(q: QuoteInput): Promise<boolean> {
  const key = env("RESEND_API_KEY");
  if (!key) {
    console.warn("RESEND_API_KEY is not set: quote email skipped (the request is still saved).");
    return false;
  }
  const rows = lines(q);
  const textBody = [
    "New quote request from the website",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Message:",
    q.message || "—",
    "",
    "Reply to this email to answer the customer directly.",
    `All requests: ${site.url}/admin/requests`,
  ].join("\n");
  const htmlBody = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#111">
<h2 style="margin:0 0 12px">New quote request</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(
      ([k, v]) =>
        `<tr><td style="color:#666;vertical-align:top">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`,
    )
    .join("")}</table>
<p style="margin:16px 0 4px;color:#666">Message</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(q.message || "—")}</p>
<p style="margin:20px 0 0;color:#666">Reply to this email to answer the customer directly.<br>
<a href="${site.url}/admin/requests">Open all requests</a></p></div>`;

  try {
    const response = await fetch(env("RESEND_API_URL") ?? DEFAULT_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env("QUOTE_EMAIL_FROM") ?? DEFAULT_FROM,
        to: [env("QUOTE_NOTIFY_TO") ?? DEFAULT_TO],
        reply_to: q.email,
        subject: `New quote request: ${q.name}${q.service ? ` — ${q.service}` : ""}`.slice(0, 200),
        text: textBody,
        html: htmlBody,
      }),
    });
    if (!response.ok) {
      console.error("Resend rejected the quote email", response.status, await response.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("Could not reach Resend", error);
    return false;
  }
}
