create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid,
  platform text not null check (platform in ('facebook', 'instagram', 'both')),
  content text not null,
  image_url text,
  scheduled_at timestamptz not null,
  published_at timestamptz,
  status text not null default 'scheduled' check (status in ('scheduled', 'published', 'failed')),
  meta_post_id text,
  error_message text,
  created_at timestamptz default now()
);
