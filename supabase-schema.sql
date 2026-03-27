-- ============================================
-- SF_USADOS — Supabase Schema (secure baseline)
-- Ejecutar en SQL Editor de Supabase
-- ============================================

create extension if not exists "uuid-ossp";

create table if not exists public.listings (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  brand text not null,
  model text not null,
  version text,
  year integer not null,
  km integer not null,
  price numeric(12, 2) not null,
  currency text not null default 'USD' check (currency in ('USD', 'ARS')),
  color text,
  fuel text,
  engine text,
  transmission text,
  description text,
  phone text not null,
  province text not null,
  city text,
  images text[] default '{}',
  is_featured boolean default false,
  is_active boolean default true,
  views integer default 0
);

create index if not exists listings_is_active_idx on public.listings (is_active);
create index if not exists listings_is_featured_idx on public.listings (is_featured);
create index if not exists listings_brand_idx on public.listings (brand);
create index if not exists listings_province_idx on public.listings (province);
create index if not exists listings_year_idx on public.listings (year);
create index if not exists listings_price_idx on public.listings (price);
create index if not exists listings_created_at_idx on public.listings (created_at desc);

alter table public.listings enable row level security;

-- Replace insecure policies if they already exist.
drop policy if exists "Public can view active listings" on public.listings;
drop policy if exists "Anyone can insert listings" on public.listings;
drop policy if exists "Anyone can update listings" on public.listings;
drop policy if exists "Anyone can delete listings" on public.listings;

drop policy if exists "Public read active listings" on public.listings;

create policy "Public read active listings"
  on public.listings
  for select
  to public
  using (is_active = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listings', 'listings', true, 10485760,
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view listing images" on storage.objects;
drop policy if exists "Anyone can upload listing images" on storage.objects;
drop policy if exists "Anyone can delete listing images" on storage.objects;
drop policy if exists "Public read listing images" on storage.objects;

create policy "Public read listing images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'listings');
