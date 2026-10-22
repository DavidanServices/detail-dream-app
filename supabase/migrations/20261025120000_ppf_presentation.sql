-- Paint protection film presentation page: packages by vehicle size (price optional) and a colour palette.
-- Run in Supabase > SQL Editor after the earlier migrations. Safe to run once.
-- The old configurator table (ppf_panels) is left in place but is no longer used by the website.

-- ============================================================================
-- PPF packages by vehicle size. A NULL price means "price on request".
-- ============================================================================
create table public.ppf_sizes (
  vehicle_type_id text primary key references public.vehicle_types (id) on update cascade on delete cascade,
  title text not null default '' check (char_length(title) <= 80),
  blurb text not null default '' check (char_length(blurb) <= 300),
  price numeric(10, 2) check (price >= 0)
);

-- ============================================================================
-- PPF colour palette (presentation only)
-- ============================================================================
create table public.ppf_colors (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 60),
  hex text not null check (hex ~ '^#[0-9a-fA-F]{6}$'),
  finish text not null default 'gloss' check (finish in ('gloss', 'satin', 'matte')),
  sort_order integer not null default 0,
  active boolean not null default true
);

-- ============================================================================
-- Privileges and row level security
-- ============================================================================
revoke all on public.ppf_sizes, public.ppf_colors from anon, authenticated;
grant select on public.ppf_sizes, public.ppf_colors to anon, authenticated;
grant insert, update, delete on public.ppf_sizes, public.ppf_colors to authenticated;

alter table public.ppf_sizes enable row level security;
alter table public.ppf_colors enable row level security;

create policy "ppf_sizes: public read" on public.ppf_sizes
  for select to anon, authenticated using (true);
create policy "ppf_sizes: admin all" on public.ppf_sizes
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "ppf_colors: public read active" on public.ppf_colors
  for select to anon, authenticated using (active);
create policy "ppf_colors: admin all" on public.ppf_colors
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ============================================================================
-- Seed: three sizes without prices, and a starter palette (edit both in /admin > PPF)
-- ============================================================================
insert into public.ppf_sizes (vehicle_type_id, title, blurb) values
  ('hatchback', 'Small car', 'Hatchbacks and compact cars'),
  ('saloon', 'Medium car', 'Saloons, sedans and coupes'),
  ('suv', 'Large car', 'SUVs, 4x4s and large vehicles');

insert into public.ppf_colors (id, name, hex, finish, sort_order) values
  ('gloss-black', 'Gloss Black', '#0b0b0d', 'gloss', 1),
  ('midnight-blue', 'Midnight Blue', '#14233f', 'gloss', 2),
  ('racing-red', 'Racing Red', '#b3121b', 'gloss', 3),
  ('british-green', 'British Green', '#0f3b2a', 'gloss', 4),
  ('arctic-white', 'Arctic White', '#f2f3f5', 'gloss', 5),
  ('nardo-grey', 'Nardo Grey', '#7c7f84', 'gloss', 6),
  ('satin-black', 'Satin Black', '#1a1a1c', 'satin', 7),
  ('satin-graphite', 'Satin Graphite', '#3b3e43', 'satin', 8),
  ('satin-silver', 'Satin Silver', '#a9adb3', 'satin', 9),
  ('matte-black', 'Matte Black', '#101012', 'matte', 10),
  ('matte-army-green', 'Matte Army Green', '#4b5238', 'matte', 11),
  ('matte-sand', 'Matte Sand', '#b9a789', 'matte', 12);
