create table if not exists facebook_posts (
  id uuid primary key default gen_random_uuid(),
  week_number integer not null,
  post_type text not null check (post_type in ('Update', 'Offer', 'Event')),
  topic text not null,
  content text not null,
  scheduled_for timestamptz,
  published_at timestamptz,
  facebook_post_id text,
  status text not null default 'scheduled' check (status in ('scheduled', 'published', 'failed', 'skipped')),
  error text,
  created_at timestamptz default now()
);
