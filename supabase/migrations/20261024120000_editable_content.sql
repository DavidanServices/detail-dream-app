-- Editable content: the "what's included" lists, per-vehicle card text and page texts, all editable from /admin.
-- Run in Supabase > SQL Editor after the first three migrations. Safe to run once.

-- ============================================================================
-- Package "included" items (icon + title + text) and per-vehicle card text
-- ============================================================================
alter table public.packages
  add column highlights jsonb not null default '[]'::jsonb check (jsonb_typeof(highlights) = 'array');

alter table public.package_prices
  add column title text check (char_length(title) <= 80),
  add column blurb text check (char_length(blurb) <= 300);

-- ============================================================================
-- Page texts: one row per edited text. Rows are optional; the site falls back to built-in defaults.
-- ============================================================================
create table public.site_content (
  key text primary key check (key ~ '^[a-z0-9._-]+$' and char_length(key) <= 80),
  value text not null check (char_length(value) <= 2000),
  updated_at timestamptz not null default now()
);

create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();

revoke all on public.site_content from anon, authenticated;
grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

alter table public.site_content enable row level security;
create policy "site_content: public read" on public.site_content
  for select to anon, authenticated using (true);
create policy "site_content: admin all" on public.site_content
  for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- ============================================================================
-- Seed: current Interior and Exterior wording
-- ============================================================================
update public.packages set highlights = $json$[
  {"icon":"wind","title":"Full vacuum","text":"Full interior vacuum, including boot and underneath seats where accessible"},
  {"icon":"gauge","title":"Dashboard & trim","text":"Detailed cleaning of dashboard, air vents, buttons and interior trim"},
  {"icon":"door","title":"Doors & cupholders","text":"Cleaning of door panels, door shuts and cupholders, including steam cleaning where appropriate"},
  {"icon":"sparkles","title":"Interior glass","text":"Interior glass cleaning"},
  {"icon":"layers","title":"Mats & plastics","text":"Floor mat cleaning and restoration of interior plastic surfaces"},
  {"icon":"armchair","title":"Leather clean","text":"Leather cleaning to restore a clean, factory-style finish"},
  {"icon":"shield","title":"Seatbelts","text":"Seatbelt cleaning and restoration"}
]$json$::jsonb where id = 'interior';

update public.packages set highlights = $json$[
  {"icon":"droplets","title":"Pre-wash","text":"Pre-wash"},
  {"icon":"snowflake","title":"Shampoo or snow foam","text":"Shampooed or snow foamed (depending if the car has ceramic coating)"},
  {"icon":"hand","title":"Contact wash","text":"Contact wash and rinsed"},
  {"icon":"circle","title":"Alloys","text":"Alloys hand washed"},
  {"icon":"sparkles","title":"Tyre shine","text":"Tyre shine included"}
]$json$::jsonb where id = 'exterior';

update public.package_prices set
  title = case vehicle_type_id when 'hatchback' then 'Hatchback Interior Detail' when 'saloon' then 'Sedan Interior Detail' when 'suv' then 'SUV Interior Detail' end,
  blurb = case vehicle_type_id
    when 'hatchback' then 'A thorough interior cleaning service designed for maintained vehicles that need professional attention and a refreshed interior.'
    when 'saloon' then 'Professional interior detailing for saloon and sedan vehicles, covering all accessible interior surfaces.'
    when 'suv' then 'Comprehensive interior detailing for SUVs, with pricing reflecting the larger vehicle size.' end
where package_id = 'interior' and vehicle_type_id in ('hatchback', 'saloon', 'suv');

update public.package_prices set
  title = case vehicle_type_id when 'hatchback' then 'Hatchback Exterior Detail' when 'saloon' then 'Sedan Exterior Detail' when 'suv' then 'SUV Exterior Detail' end
where package_id = 'exterior' and vehicle_type_id in ('hatchback', 'saloon', 'suv');
