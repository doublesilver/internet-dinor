alter table public.reviews add column if not exists author_name text;
alter table public.reviews add column if not exists source text not null default 'admin' check (source in ('admin', 'customer'));

alter table public.reviews drop constraint if exists reviews_status_check;
alter table public.reviews add constraint reviews_status_check check (status in ('draft', 'published', 'pending'));

create policy "public insert customer reviews"
on public.reviews
for insert
with check (source = 'customer' and status = 'pending');
