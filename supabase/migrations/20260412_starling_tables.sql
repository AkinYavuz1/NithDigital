-- Starling Bank transactions (upsert on feed_item_uid)
create table if not exists starling_transactions (
  feed_item_uid   text primary key,
  transaction_date date not null,
  direction       text not null,         -- 'IN' | 'OUT'
  amount          numeric(10,2) not null,
  currency        text not null default 'GBP',
  counter_party   text,
  category        text,
  status          text,
  reference       text,
  synced_at       timestamptz not null default now()
);

create index if not exists starling_transactions_date_idx on starling_transactions (transaction_date desc);

-- Daily balance snapshots
create table if not exists starling_balance_daily (
  date                date primary key,
  cleared_balance     numeric(10,2) not null,
  effective_balance   numeric(10,2) not null,
  pending_out         numeric(10,2) not null default 0,
  synced_at           timestamptz not null default now()
);
