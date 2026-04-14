-- Social media clients table — stores per-client Meta API credentials
-- Each client connects their own Facebook Page and Instagram account.
-- Credentials are stored here instead of env vars so multiple clients can be managed.

create table if not exists social_clients (
  id                          uuid primary key default gen_random_uuid(),
  name                        text not null,
  fb_page_id                  text not null,
  fb_page_access_token        text not null,
  instagram_business_account_id text,
  token_expires_at            timestamptz,       -- null = non-expiring system user token
  active                      boolean not null default true,
  created_at                  timestamptz default now(),
  updated_at                  timestamptz default now()
);

-- Index for active client lookups
create index if not exists social_clients_active_idx on social_clients (active);

-- Trigger to keep updated_at current
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger social_clients_updated_at
  before update on social_clients
  for each row execute function set_updated_at();

-- Add foreign key from social_posts to social_clients (client_id already exists as uuid)
-- Make it non-null going forward — every post must belong to a client
alter table social_posts
  alter column client_id set not null,
  add constraint social_posts_client_id_fkey
    foreign key (client_id) references social_clients (id) on delete cascade;

-- Index for fast per-client post queries
create index if not exists social_posts_client_id_idx on social_posts (client_id);
create index if not exists social_posts_status_scheduled_idx on social_posts (status, scheduled_at);
