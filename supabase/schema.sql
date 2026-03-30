-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- UGCs table
create table if not exists ugcs (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  phone text not null,
  email text not null unique,
  address text not null,
  city text not null,
  department text not null,
  instagram_handle text,
  tiktok_handle text,
  status text not null default 'pending' check (status in ('active', 'inactive', 'pending')),
  score integer not null default 0,
  created_at timestamptz not null default now()
);

-- Contracts table
create table if not exists contracts (
  id uuid primary key default uuid_generate_v4(),
  ugc_id uuid not null references ugcs(id) on delete cascade,
  type text not null default 'initial' check (type in ('initial', 'paid')),
  status text not null default 'pending' check (status in ('pending', 'signed', 'rejected')),
  signed_at timestamptz,
  content_url text,
  signer_ip text,
  created_at timestamptz not null default now()
);

-- Orders table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  ugc_id uuid not null references ugcs(id) on delete cascade,
  mastershop_order_id text,
  product_name text not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'in_transit', 'delivered')),
  tracking_url text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

-- Videos table
create table if not exists videos (
  id uuid primary key default uuid_generate_v4(),
  ugc_id uuid not null references ugcs(id) on delete cascade,
  drive_url text not null,
  upload_date timestamptz not null default now(),
  deadline timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'uploaded', 'late')),
  created_at timestamptz not null default now()
);

-- Campaigns table
create table if not exists campaigns (
  id uuid primary key default uuid_generate_v4(),
  video_id uuid references videos(id) on delete set null,
  ugc_id uuid not null references ugcs(id) on delete cascade,
  meta_campaign_id text,
  meta_ad_id text,
  start_date timestamptz not null default now(),
  end_date timestamptz,
  status text not null default 'running' check (status in ('running', 'paused', 'completed', 'failed')),
  cpa numeric,
  impressions integer,
  clicks integer,
  spend numeric,
  result text not null default 'pending' check (result in ('working', 'not_working', 'pending')),
  created_at timestamptz not null default now()
);

-- Notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  ugc_id uuid not null references ugcs(id) on delete cascade,
  type text not null,
  message text not null,
  channel text not null check (channel in ('whatsapp', 'in_app')),
  sent_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('sent', 'failed', 'pending'))
);

-- Briefs table
create table if not exists briefs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  reference_urls text[] default '{}',
  do_list text[] default '{}',
  dont_list text[] default '{}',
  created_at timestamptz not null default now()
);

-- Settings table
create table if not exists settings (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

-- Default settings
insert into settings (key, value) values ('cpa_threshold', '25000') on conflict (key) do nothing;

-- Row Level Security
alter table ugcs enable row level security;
alter table contracts enable row level security;
alter table orders enable row level security;
alter table videos enable row level security;
alter table campaigns enable row level security;
alter table notifications enable row level security;
alter table briefs enable row level security;

-- Policies: Admin can do everything (service role bypasses RLS)
-- UGC users can only see their own data (matched by email)
create policy "ugcs_self" on ugcs for select using (email = auth.email());
create policy "contracts_self" on contracts for select using (ugc_id in (select id from ugcs where email = auth.email()));
create policy "orders_self" on orders for select using (ugc_id in (select id from ugcs where email = auth.email()));
create policy "videos_self" on videos for all using (ugc_id in (select id from ugcs where email = auth.email()));
create policy "campaigns_self" on campaigns for select using (ugc_id in (select id from ugcs where email = auth.email()));
create policy "notifications_self" on notifications for select using (ugc_id in (select id from ugcs where email = auth.email()));
create policy "briefs_read" on briefs for select using (true);
