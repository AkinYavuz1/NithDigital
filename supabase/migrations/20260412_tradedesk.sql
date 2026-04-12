-- ============================================================
-- TradeDesk — WhatsApp back-office for tradespeople
-- ============================================================

-- 1. Users
create table if not exists tradedesk_users (
  id            uuid primary key default gen_random_uuid(),
  phone_number  text not null unique,
  name          text,
  business_name text,
  website_url   text,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_td_users_phone on tradedesk_users(phone_number);

-- 2. Portfolio posts
create table if not exists tradedesk_portfolio_posts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references tradedesk_users(id) on delete cascade,
  image_url        text not null,
  ai_caption       text,
  raw_caption      text,
  social_post_text text,
  published        boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_td_portfolio_user on tradedesk_portfolio_posts(user_id, created_at desc);

-- 3. Expenses
create table if not exists tradedesk_expenses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references tradedesk_users(id) on delete cascade,
  image_url  text,
  supplier   text,
  date       date,
  amount     numeric(10,2),
  vat        numeric(10,2),
  category   text check (category in ('Materials','Tools','Fuel','Insurance','Subcontractor','Office','Vehicle','Other')),
  raw_text   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_td_expenses_user on tradedesk_expenses(user_id, created_at desc);

-- 4. Messages (full audit log)
create table if not exists tradedesk_messages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references tradedesk_users(id) on delete cascade,
  direction    text not null check (direction in ('in','out')),
  message_body text,
  media_url    text,
  flow         text,
  created_at   timestamptz not null default now()
);
create index if not exists idx_td_messages_user on tradedesk_messages(user_id, created_at desc);
create index if not exists idx_td_messages_created on tradedesk_messages(created_at desc);

-- updated_at trigger (CREATE OR REPLACE — safe if already exists from other migrations)
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger td_users_updated_at
  before update on tradedesk_users
  for each row execute function update_updated_at_column();

create trigger td_portfolio_updated_at
  before update on tradedesk_portfolio_posts
  for each row execute function update_updated_at_column();

create trigger td_expenses_updated_at
  before update on tradedesk_expenses
  for each row execute function update_updated_at_column();

-- RLS
alter table tradedesk_users enable row level security;
alter table tradedesk_portfolio_posts enable row level security;
alter table tradedesk_expenses enable row level security;
alter table tradedesk_messages enable row level security;

-- Public read for published portfolio posts (portfolio pages are public)
create policy "public_read_portfolio" on tradedesk_portfolio_posts
  for select using (published = true);

-- All other access goes through the service role key in API routes (bypasses RLS)
