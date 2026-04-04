-- Lead Generator: scraped_leads table
create table if not exists public.scraped_leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  website text,
  contact_email text,
  phone text,
  address text,
  category text,
  source text,
  -- Audit scores
  overall_score integer,
  seo_score integer,
  security_score integer,
  performance_score integer,
  mobile_score integer,
  content_score integer,
  issues jsonb,
  platform text,
  -- AI email draft
  email_subject text,
  email_body text,
  -- Workflow status
  status text not null default 'new',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- Status values: new | audited | drafted | approved | sent | failed | skipped

-- RLS
alter table public.scraped_leads enable row level security;

create policy "Service role full access"
  on public.scraped_leads
  for all
  to service_role
  using (true)
  with check (true);

create policy "Anon can insert"
  on public.scraped_leads
  for insert
  to anon
  with check (true);

-- Index for fast status queries
create index if not exists scraped_leads_status_idx on public.scraped_leads(status);
create index if not exists scraped_leads_created_idx on public.scraped_leads(created_at desc);
