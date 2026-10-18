# Davidan Services: Supabase setup

The website reads prices from Supabase and stores contact-form requests there. The admin area at
`/admin` edits all of it, so prices never need a code change.

## One-time setup

1. **Create the tables.** Supabase dashboard > SQL Editor > New query. Paste the whole of
   `migrations/20261018120000_davidan_admin.sql` and press Run. It creates the tables, security rules
   (row level security) and loads today's prices.
2. **Create your admin login.** Authentication > Users > Add user (email + password, tick "Auto confirm").
3. **Make that user an admin.** In the SQL Editor run (use your own email):
   ```sql
   insert into public.admin_users (user_id) select id from auth.users where email = 'you@example.com';
   ```
4. **Connect the website.** Settings > API: copy the Project URL and the publishable key into a `.env.local`
   file (see `.env.example`):
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   ```
   On Cloudflare, add the same two variables under Settings > Variables and Secrets (build) and redeploy.
   Never put the `service_role` / secret key in the website; it is not needed.
5. **Optional: turn off public sign-ups.** Authentication > Sign In / Providers > disable "Allow new users to
   sign up". Only people listed in `admin_users` can use `/admin` either way.

## What lives where

| Table | Edited in | Used by |
| --- | --- | --- |
| `vehicle_types`, `packages`, `package_prices` | /admin/pricing | Home, Services, booking form |
| `ppf_settings`, `ppf_panels` | /admin/ppf | PPF configurator, Services, Home |
| `quote_requests` | /admin/requests | Contact form (visitors can only add rows) |
| `admin_users` | SQL only | Who may use /admin |

If Supabase is unreachable the public site falls back to the prices bundled in `src/data/`, so it never breaks.
