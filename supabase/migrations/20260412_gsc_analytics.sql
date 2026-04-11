-- Google Search Console daily rollups.
-- Populated by scripts/sync-gsc.ts (manual) and the /api/cron/sync-gsc cron.
-- All tables are idempotent via (date, dimension_value) primary keys so re-syncs upsert cleanly.

create table if not exists gsc_daily (
  date date primary key,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6, 4) not null default 0,
  position numeric(6, 2) not null default 0,
  synced_at timestamptz not null default now()
);

create table if not exists gsc_queries_daily (
  date date not null,
  query text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6, 4) not null default 0,
  position numeric(6, 2) not null default 0,
  synced_at timestamptz not null default now(),
  primary key (date, query)
);

create index if not exists gsc_queries_daily_date_idx on gsc_queries_daily (date desc);
create index if not exists gsc_queries_daily_clicks_idx on gsc_queries_daily (clicks desc);

create table if not exists gsc_pages_daily (
  date date not null,
  page text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6, 4) not null default 0,
  position numeric(6, 2) not null default 0,
  synced_at timestamptz not null default now(),
  primary key (date, page)
);

create index if not exists gsc_pages_daily_date_idx on gsc_pages_daily (date desc);
create index if not exists gsc_pages_daily_clicks_idx on gsc_pages_daily (clicks desc);

create table if not exists gsc_countries_daily (
  date date not null,
  country text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6, 4) not null default 0,
  position numeric(6, 2) not null default 0,
  synced_at timestamptz not null default now(),
  primary key (date, country)
);

create index if not exists gsc_countries_daily_date_idx on gsc_countries_daily (date desc);

create table if not exists gsc_devices_daily (
  date date not null,
  device text not null,
  clicks integer not null default 0,
  impressions integer not null default 0,
  ctr numeric(6, 4) not null default 0,
  position numeric(6, 2) not null default 0,
  synced_at timestamptz not null default now(),
  primary key (date, device)
);

create index if not exists gsc_devices_daily_date_idx on gsc_devices_daily (date desc);
