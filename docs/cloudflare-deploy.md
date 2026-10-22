# Deploying to Cloudflare (Workers + GitHub)

The site is a TanStack Start app built for **Cloudflare Workers** (not Pages). The build (`npm run build`) writes the
Worker to `.output/` and a pointer in `.wrangler/deploy/config.json`, so the standard `npx wrangler deploy` works.
The Worker name is set in `wrangler.jsonc` (`davidan-services`). Size: about 2.5 MB (547 KiB gzipped), well inside limits.

## Connect the GitHub repo

1. Cloudflare dashboard > **Workers & Pages** > **Create** > **Import a repository** (Workers Builds).
2. Authorise the Cloudflare GitHub app and pick the repo.
3. Settings on the setup screen:

   | Field | Value |
   | --- | --- |
   | Project / Worker name | `davidan-services` (must match `name` in `wrangler.jsonc`) |
   | Production branch | `main` (merge the work into it first) |
   | Root directory | `/` |
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |

4. Add the variables below **before** the first build, then **Save and Deploy**.

## Variables

**Build variables** (Settings > Build > *Variables and secrets*). The site bakes these in while it builds:

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://eohbgtkezqukhqjoplip.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | the `sb_publishable_...` key (public by design) |

**Runtime variables** (Settings > *Variables and secrets*, the Worker itself). Needed for the quote emails, see
`docs/email-setup.md`:

| Name | Type | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | `re_...` |
| `QUOTE_EMAIL_FROM` | Text | `Davidan Services <website@davidan.co.uk>` |
| `QUOTE_NOTIFY_TO` | Text | optional, defaults to `offers@davidan.co.uk` |

Never add the Supabase `service_role` / secret key anywhere in this project.

## Domain

Worker > Settings > **Domains & Routes** > **Add** > *Custom domain*: `davidan.co.uk` and `www.davidan.co.uk`.
The domain's DNS zone must be in the same Cloudflare account. Until then the site is live on
`davidan-services.<account>.workers.dev`.

## After the first deploy

- Open `/admin` and sign in. In Supabase the admin user must exist in `admin_users` (see `supabase/README.md`).
- Send a test request from the contact form and check it in `/admin/requests` and in the mailbox.
- Each push to the production branch redeploys; other branches get preview URLs.

## If a build fails

- "Cannot find module ...": make sure `bun.lock` is committed and up to date (`bun install` regenerates it).
- Pages load but prices look old: the Supabase migrations are not run yet (`supabase/README.md`).
- Blank data everywhere: the two `VITE_SUPABASE_*` values were added as runtime variables instead of build variables.
