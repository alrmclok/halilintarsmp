-- Migration 4 (Part BAHDNNYBGTSOOMFF): run once in the Supabase SQL Editor. Safe to run again. Never deletes rows.

-- A suggested news item (Part BAHDNNYBGTSOOMFF). An approved one becomes a row in `news`.
create table if not exists public.news_requests (
  id           uuid primary key default gen_random_uuid(),
  status       text not null default 'pending',
  title        text,                           -- optional, like news.title
  author       text not null,                  -- typed by the sender; the reviewer may change it
  date         date not null default current_date,
  summary      text not null default '',
  reason       text,                           -- the sender's optional note for the reviewer
  ip_hash      text,                           -- salted hash of the sender's address, used only for the rate limit
  review_note  text,
  reviewed_by  text,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  constraint news_requests_status check (status in ('pending', 'approved', 'rejected'))
);
create index if not exists news_requests_status_idx on public.news_requests (status, created_at);
create index if not exists news_requests_ip_idx on public.news_requests (ip_hash, created_at);

alter table public.news_requests enable row level security;
revoke all on table public.news_requests from anon, authenticated;
grant all on table public.news_requests to service_role;
