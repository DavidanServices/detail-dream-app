-- Davidan Services: price catalogue, PPF configurator prices, quote requests and admin access.
-- Paste this whole file into Supabase > SQL Editor > Run (safe to run once on an empty project).
--
-- After running it, create your admin user in Supabase > Authentication > Users, then run:
--   insert into public.admin_users (user_id) select id from auth.users where email = 'YOUR_EMAIL';

-- ============================================================================
-- Admin access
-- ============================================================================
create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

-- Each signed-in user may read only their own row, which is what is_admin() needs.
create policy "admin_users: read own row" on public.admin_users
  for select to authenticated
  using (user_id = (select auth.uid()));

-- SECURITY INVOKER on purpose: it runs under the caller's RLS and only reveals the caller's own status.
create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

create function public.touch_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- Catalogue: vehicle types, packages, prices
-- ============================================================================
create table public.vehicle_types (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  label text not null check (char_length(label) between 1 and 60),
  hint text not null default '' check (char_length(hint) <= 120),
  sort_order integer not null default 0,
  active boolean not null default true
);

create table public.packages (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  tagline text check (char_length(tagline) <= 120),
  features text[] not null default '{}',
  popular boolean not null default false,
  featured boolean not null default false, -- shown as a card in the home page price list
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.package_prices (
  package_id text not null references public.packages (id) on update cascade on delete cascade,
  vehicle_type_id text not null references public.vehicle_types (id) on update cascade on delete restrict,
  price numeric(10, 2) not null check (price >= 0),
  primary key (package_id, vehicle_type_id)
);
create index package_prices_vehicle_type_idx on public.package_prices (vehicle_type_id);

-- ============================================================================
-- Paint protection film (configurator)
-- ============================================================================
create table public.ppf_settings (
  id boolean primary key default true check (id), -- single-row table
  name text not null default 'Paint Protection Film',
  description text not null default '',
  tagline text not null default '',
  features text[] not null default '{}',
  starting_from numeric(10, 2) not null check (starting_from >= 0),
  full_car_price numeric(10, 2) not null check (full_car_price >= 0),
  updated_at timestamptz not null default now()
);

create table public.ppf_panels (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 60),
  price numeric(10, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  active boolean not null default true
);

-- ============================================================================
-- Quote requests (contact form)
-- ============================================================================
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 120),
  email text not null check (char_length(email) between 5 and 254 and email like '%_@_%._%'),
  phone text check (char_length(phone) <= 40),
  service text check (char_length(service) <= 160),
  vehicle text check (char_length(vehicle) <= 80),
  message text check (char_length(message) <= 4000),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'booked', 'completed', 'declined', 'spam')),
  quoted_price numeric(10, 2) check (quoted_price >= 0),
  admin_notes text check (char_length(admin_notes) <= 4000),
  handled_at timestamptz
);
create index quote_requests_status_created_idx on public.quote_requests (status, created_at desc);

-- ============================================================================
-- updated_at triggers
-- ============================================================================
create trigger packages_touch before update on public.packages
  for each row execute function public.touch_updated_at();
create trigger ppf_settings_touch before update on public.ppf_settings
  for each row execute function public.touch_updated_at();
create trigger quote_requests_touch before update on public.quote_requests
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Privileges (Data API): start from nothing, then grant exactly what is needed
-- ============================================================================
revoke all on public.admin_users, public.vehicle_types, public.packages, public.package_prices,
  public.ppf_settings, public.ppf_panels, public.quote_requests from anon, authenticated;

grant select on public.vehicle_types, public.packages, public.package_prices,
  public.ppf_settings, public.ppf_panels to anon, authenticated;

-- Visitors may only create a request, and only these columns (status etc. take their defaults).
grant insert (name, email, phone, service, vehicle, message) on public.quote_requests to anon, authenticated;

-- Signed-in users get table privileges; row level security below limits writes to admins.
grant select on public.admin_users to authenticated;
grant insert, update, delete on public.vehicle_types, public.packages, public.package_prices,
  public.ppf_settings, public.ppf_panels to authenticated;
grant select, update, delete on public.quote_requests to authenticated;

-- ============================================================================
-- Row level security
-- ============================================================================
alter table public.vehicle_types enable row level security;
alter table public.packages enable row level security;
alter table public.package_prices enable row level security;
alter table public.ppf_settings enable row level security;
alter table public.ppf_panels enable row level security;
alter table public.quote_requests enable row level security;

-- Public site: read the live catalogue.
create policy "vehicle_types: public read active" on public.vehicle_types
  for select to anon, authenticated using (active);
create policy "packages: public read active" on public.packages
  for select to anon, authenticated using (active);
create policy "package_prices: public read for active packages" on public.package_prices
  for select to anon, authenticated
  using (exists (select 1 from public.packages p where p.id = package_id and p.active));
create policy "ppf_settings: public read" on public.ppf_settings
  for select to anon, authenticated using (true);
create policy "ppf_panels: public read active" on public.ppf_panels
  for select to anon, authenticated using (active);

-- Admin: full control (each policy also covers reading inactive rows).
create policy "vehicle_types: admin all" on public.vehicle_types
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "packages: admin all" on public.packages
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "package_prices: admin all" on public.package_prices
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "ppf_settings: admin all" on public.ppf_settings
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "ppf_panels: admin all" on public.ppf_panels
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- Quote requests: anyone can submit a fresh request; only admins can read or manage them.
create policy "quote_requests: public can submit" on public.quote_requests
  for insert to anon, authenticated
  with check (status = 'new' and quoted_price is null and admin_notes is null and handled_at is null);
create policy "quote_requests: admin read" on public.quote_requests
  for select to authenticated using ((select public.is_admin()));
create policy "quote_requests: admin update" on public.quote_requests
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "quote_requests: admin delete" on public.quote_requests
  for delete to authenticated using ((select public.is_admin()));

-- ============================================================================
-- Seed data (current prices from the website)
-- ============================================================================
insert into public.vehicle_types (id, label, hint, sort_order) values
  ('hatchback', 'Hatchback', 'Small & compact cars', 1),
  ('saloon', 'Saloon / Coupe', 'Sedans & coupes', 2),
  ('suv', 'SUV', '4x4s, MPVs & large vehicles', 3);

insert into public.packages (id, name, description, tagline, features, popular, featured, sort_order) values
  ('interior', 'Interior Detail', 'Deep clean and restore your cabin from top to bottom.', null,
    array['Vacuuming & shampoo','Leather conditioning','Steam sanitization','Odor elimination'], false, true, 1),
  ('exterior', 'Exterior Detail', 'Hand wash, clay bar, and protect your paintwork.', null,
    array['Hand wash & dry','Clay bar treatment','Paint decontamination','Sealant or wax protection'], false, true, 2),
  ('exterior-interior', 'Exterior + Interior', 'Our most popular combo — a complete inside-and-out refresh.', null,
    array['Full exterior detail','Full interior detail','Paint-safe techniques','Cabin deep clean'], true, true, 3),
  ('ceramic', 'Ceramic Coating', 'Long-lasting hydrophobic protection with a deep gloss finish.', null,
    array['Multi-year protection','Hydrophobic finish','UV resistance','Enhanced depth & gloss'], false, true, 4),
  ('complete', 'The Complete Bundle', 'Everything in one package: exterior, interior, and ceramic coating.', 'Exterior + Interior + Ceramic Coating',
    array['Exterior + Interior detail','Ceramic coating application','Full protection & gloss','Best value'], false, false, 5);

insert into public.package_prices (package_id, vehicle_type_id, price) values
  ('interior', 'hatchback', 105), ('interior', 'saloon', 120), ('interior', 'suv', 140),
  ('exterior', 'hatchback', 110), ('exterior', 'saloon', 130), ('exterior', 'suv', 150),
  ('exterior-interior', 'hatchback', 185), ('exterior-interior', 'saloon', 210), ('exterior-interior', 'suv', 250),
  ('ceramic', 'hatchback', 175), ('ceramic', 'saloon', 200), ('ceramic', 'suv', 220),
  ('complete', 'hatchback', 310), ('complete', 'saloon', 360), ('complete', 'suv', 420);

insert into public.ppf_settings (name, description, tagline, features, starting_from, full_car_price) values
  ('Paint Protection Film', 'Invisible, self-healing armor for high-impact areas.', 'Custom coverage for high-impact areas',
    array['Self-healing technology','UV stable','Prevents rock chips','Custom coverage options'], 350, 1800);

insert into public.ppf_panels (id, name, price, sort_order) values
  ('front-bumper', 'Front bumper', 220, 1),
  ('rear-bumper', 'Rear bumper', 210, 2),
  ('bonnet', 'Bonnet', 260, 3),
  ('roof', 'Roof', 240, 4),
  ('boot', 'Boot', 180, 5),
  ('headlights', 'Headlights', 60, 6),
  ('wing-l', 'Left front wing', 95, 7),
  ('wing-r', 'Right front wing', 95, 8),
  ('door-fl', 'Left front door', 105, 9),
  ('door-fr', 'Right front door', 105, 10),
  ('door-rl', 'Left rear door', 100, 11),
  ('door-rr', 'Right rear door', 100, 12),
  ('quarter-l', 'Left rear quarter', 100, 13),
  ('quarter-r', 'Right rear quarter', 100, 14),
  ('mirror-l', 'Left wing mirror', 35, 15),
  ('mirror-r', 'Right wing mirror', 35, 16);
