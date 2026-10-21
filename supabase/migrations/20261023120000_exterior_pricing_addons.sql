-- Exterior Detailing update: new exterior prices and wording, and per-package add-ons (Polish).
-- Run in Supabase > SQL Editor after the first two migrations. Safe to run once.

-- Exterior Detail package
update public.package_prices
set price = case vehicle_type_id when 'hatchback' then 130 when 'saloon' then 160 when 'suv' then 190 end
where package_id = 'exterior' and vehicle_type_id in ('hatchback', 'saloon', 'suv');

update public.packages
set description = 'A clean, glossy and refreshed exterior with a premium finish.',
    features = array[
      'Pre-wash',
      'Shampooed or snow foamed (depending if the car has ceramic coating)',
      'Contact wash and rinsed',
      'Alloys hand washed',
      'Tyre shine included'
    ]
where id = 'exterior';

-- Add-ons now belong to a package, and can be a starting rate ("From £150") instead of "+£30".
alter table public.addons
  add column package_id text references public.packages (id) on update cascade on delete set null,
  add column starts_from boolean not null default false,
  add column note text check (char_length(note) <= 120);

update public.addons set package_id = 'interior' where id = 'leather-conditioning';

insert into public.addons (id, name, description, price, sort_order, package_id, starts_from, note) values
  ('polish', 'Polish', 'Available as an add-on to Exterior Detail.', 150, 2, 'exterior', true, 'Depending on car size');
