-- Interior Detailing update: new interior prices and wording, optional add-ons, and booking details.
-- Run in Supabase > SQL Editor after the first migration. Safe to run once.

-- ============================================================================
-- Vehicle type label and the Interior Detail package (prices from the brief)
-- ============================================================================
update public.vehicle_types
set label = 'Saloon / Sedan', hint = 'Saloons, sedans & coupes'
where id = 'saloon';

update public.packages
set description = 'A thorough interior detail for every vehicle size, from hatchback to SUV.',
    features = array[
      'Full interior vacuum, including boot and underneath seats where accessible',
      'Detailed cleaning of dashboard, air vents, buttons and interior trim',
      'Cleaning of door panels, door shuts and cupholders, including steam cleaning where appropriate',
      'Interior glass cleaning',
      'Floor mat cleaning and restoration of interior plastic surfaces',
      'Leather cleaning to restore a clean, factory-style finish',
      'Seatbelt cleaning and restoration'
    ]
where id = 'interior';

update public.package_prices
set price = case vehicle_type_id when 'hatchback' then 110 when 'saloon' then 150 when 'suv' then 180 end
where package_id = 'interior' and vehicle_type_id in ('hatchback', 'saloon', 'suv');

-- ============================================================================
-- Optional extras (add-ons)
-- ============================================================================
create table public.addons (
  id text primary key check (id ~ '^[a-z0-9-]+$'),
  name text not null check (char_length(name) between 1 and 80),
  description text not null default '' check (char_length(description) <= 300),
  price numeric(10, 2) not null check (price >= 0),
  sort_order integer not null default 0,
  active boolean not null default true
);

revoke all on public.addons from anon, authenticated;
grant select on public.addons to anon, authenticated;
grant insert, update, delete on public.addons to authenticated;

alter table public.addons enable row level security;
create policy "addons: public read active" on public.addons
  for select to anon, authenticated using (active);
create policy "addons: admin all" on public.addons
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into public.addons (id, name, description, price, sort_order) values
  ('leather-conditioning', 'Leather Conditioning',
   'Nourishes and protects leather surfaces, helping restore softness and maintain a factory-fresh finish.', 30, 1);

-- ============================================================================
-- Booking details on quote requests
-- ============================================================================
alter table public.quote_requests
  add column preferred_date date,
  add column addons text[] not null default '{}' check (cardinality(addons) <= 10);

-- Visitors may fill in these two extra columns (status, notes etc. stay admin-only).
grant insert (preferred_date, addons) on public.quote_requests to anon, authenticated;
