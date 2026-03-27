-- Apply this migration on existing projects to remove insecure write policies.

alter table public.listings enable row level security;

drop policy if exists "Anyone can insert listings" on public.listings;
drop policy if exists "Anyone can update listings" on public.listings;
drop policy if exists "Anyone can delete listings" on public.listings;
drop policy if exists "Public can view active listings" on public.listings;
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

drop policy if exists "Anyone can upload listing images" on storage.objects;
drop policy if exists "Anyone can delete listing images" on storage.objects;
drop policy if exists "Public can view listing images" on storage.objects;
drop policy if exists "Public read listing images" on storage.objects;

create policy "Public read listing images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'listings');
