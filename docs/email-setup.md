# Email notifications for new quote requests

Every request from the website form is saved in Supabase (visible in `/admin/requests`) **and** emailed to
`offers@davidan.co.uk`. The email has the customer as "Reply-To", so pressing Reply answers them directly.
If the email service is not configured, requests are still saved and the form still works.

The email is sent by [Resend](https://resend.com) (free: 3,000 emails a month). The key stays on the server and is
never sent to the browser.

## One-time setup

1. Create a free account at resend.com.
2. **Domains > Add domain** > `davidan.co.uk`. Resend shows 2-3 DNS records (SPF/DKIM). Add them where the DNS for
   `davidan.co.uk` is managed (Cloudflare or the domain registrar) and wait until Resend shows "Verified".
3. **API Keys > Create API key** (permission: "Sending access"). Copy the key (`re_...`).
4. In Cloudflare: **Workers & Pages > your project > Settings > Variables and Secrets** and add:

   | Name | Type | Value |
   | --- | --- | --- |
   | `RESEND_API_KEY` | Secret | the `re_...` key |
   | `QUOTE_EMAIL_FROM` | Text | `Davidan Services <website@davidan.co.uk>` (any address on the verified domain) |
   | `QUOTE_NOTIFY_TO` | Text | optional; defaults to `offers@davidan.co.uk` |

5. Redeploy, then send a test request from the website.

## Notes

- Before the domain is verified, Resend only lets you send from `onboarding@resend.dev` and only to the email
  address of your own Resend account. That is enough to test, not for production.
- Spam: the form has a hidden honeypot field and server-side validation. Because every submission now sends an email,
  also add a Cloudflare rate-limiting rule for `POST` requests to the site (Security > WAF > Rate limiting rules).
- Local testing: start the dev server with `RESEND_API_KEY=... npm run dev`.
