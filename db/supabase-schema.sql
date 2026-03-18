create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.carriers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  summary text,
  hero_title text,
  hero_description text,
  feature_points jsonb not null default '[]'::jsonb,
  price_data jsonb,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  carrier_id uuid references public.carriers(id) on delete set null,
  slug text not null unique,
  name text not null,
  summary text,
  description text,
  bundle_type text not null default 'internet_only' check (bundle_type in ('internet_only', 'internet_tv', 'business', 'custom')),
  internet_speed text,
  tv_included boolean not null default false,
  monthly_price_label text,
  benefit_label text,
  badge_tags jsonb not null default '[]'::jsonb,
  target_tags jsonb not null default '[]'::jsonb,
  hero_points jsonb not null default '[]'::jsonb,
  detail_sections jsonb not null default '[]'::jsonb,
  faq_items jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('event', 'guide', 'notice')),
  slug text not null unique,
  title text not null,
  summary text,
  body text not null,
  thumbnail_url text,
  cta_label text,
  related_product_slugs jsonb not null default '[]'::jsonb,
  is_featured boolean not null default false,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text not null,
  review_type text not null default 'internet_tv' check (review_type in ('internet_only', 'internet_tv', 'moving', 'bundle', 'renewal')),
  tags jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  inquiry_type text not null check (inquiry_type in ('quick', 'product', 'apply')),
  name text not null,
  phone text not null,
  product_id uuid references public.products(id) on delete set null,
  carrier_slug text,
  source_page text not null,
  status text not null default 'new' check (status in ('new', 'pending', 'contacted', 'retry', 'consulted', 'in_progress', 'closed')),
  privacy_agreed boolean not null,
  region_label text,
  contact_time_preference text,
  payload_json jsonb not null default '{}'::jsonb,
  utm_json jsonb not null default '{}'::jsonb,
  admin_memo text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  site_name text not null default '인터넷공룡',
  phone_label text not null default '010-0000-0000',
  phone_link text not null default 'tel:01000000000',
  hero_cta_label text not null default '30초 상담 받기',
  secondary_cta_label text default '전화 상담',
  business_info_json jsonb not null default '{}'::jsonb,
  policy_links_json jsonb not null default '{}'::jsonb,
  footer_notice text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.admin_profiles (
  id uuid primary key,
  email text not null unique,
  display_name text not null,
  role text not null default 'operator' check (role in ('super_admin', 'operator')),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_carriers_status_sort on public.carriers(status, sort_order);
create index if not exists idx_products_status_sort on public.products(status, sort_order);
create index if not exists idx_products_carrier on public.products(carrier_id);
create index if not exists idx_products_featured on public.products(is_featured, status);
create index if not exists idx_posts_type_status_published on public.posts(type, status, published_at desc);
create index if not exists idx_reviews_status_published on public.reviews(status, published_at desc);
create index if not exists idx_reviews_featured on public.reviews(featured, status);
create index if not exists idx_inquiries_status_created on public.inquiries(status, created_at desc);
create index if not exists idx_inquiries_type_created on public.inquiries(inquiry_type, created_at desc);
create index if not exists idx_inquiries_product on public.inquiries(product_id);

drop trigger if exists trg_carriers_updated_at on public.carriers;
create trigger trg_carriers_updated_at
before update on public.carriers
for each row execute function public.set_updated_at();

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists trg_inquiries_updated_at on public.inquiries;
create trigger trg_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

drop trigger if exists trg_site_settings_updated_at on public.site_settings;
create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

drop trigger if exists trg_admin_profiles_updated_at on public.admin_profiles;
create trigger trg_admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

alter table public.carriers enable row level security;
alter table public.products enable row level security;
alter table public.posts enable row level security;
alter table public.reviews enable row level security;
alter table public.inquiries enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_profiles enable row level security;

drop policy if exists "public read carriers" on public.carriers;
create policy "public read carriers"
on public.carriers
for select
using (status = 'published');

drop policy if exists "public read products" on public.products;
create policy "public read products"
on public.products
for select
using (status = 'published');

drop policy if exists "public read posts" on public.posts;
create policy "public read posts"
on public.posts
for select
using (status = 'published');

drop policy if exists "public read reviews" on public.reviews;
create policy "public read reviews"
on public.reviews
for select
using (status = 'published');

drop policy if exists "public insert inquiries" on public.inquiries;
create policy "public insert inquiries"
on public.inquiries
for insert
with check (privacy_agreed = true);

comment on table public.carriers is '통신사 기본 정보';
comment on table public.products is '상품 정보 및 상세 콘텐츠';
comment on table public.posts is '이벤트/가이드/공지 통합 게시물';
comment on table public.reviews is '후기 게시물';
comment on table public.inquiries is '상담 문의 접수 데이터';
comment on table public.site_settings is '사이트 공통 설정';
comment on table public.admin_profiles is '관리자 프로필';
