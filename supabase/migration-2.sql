-- Migration 2 (Part Q): run once in the Supabase SQL Editor. Safe to run again. Never deletes rows.
alter table public.member_requests
  add column if not exists kind text not null default 'new',
  add column if not exists member_id uuid references public.members (id) on delete set null,
  add column if not exists reason text,
  add column if not exists ip_hash text;

do $$ begin
  if not exists (select 1 from pg_constraint where conname = 'member_requests_kind') then
    alter table public.member_requests add constraint member_requests_kind check (kind in ('new', 'edit'));
  end if;
end $$;
create index if not exists member_requests_ip_idx on public.member_requests (ip_hash, created_at);

-- A suggested new description for a fandom (Part Q).
create table if not exists public.fandom_requests (
  id           uuid primary key default gen_random_uuid(),
  status       text not null default 'pending',
  fandom_id    uuid references public.fandoms (id) on delete cascade,
  description  text not null default '',
  reason       text,
  ip_hash      text,
  review_note  text,
  reviewed_by  text,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  constraint fandom_requests_status check (status in ('pending', 'approved', 'rejected'))
);
create index if not exists fandom_requests_status_idx on public.fandom_requests (status, created_at);
create index if not exists fandom_requests_ip_idx on public.fandom_requests (ip_hash, created_at);

alter table public.fandom_requests enable row level security;
revoke all on table public.fandom_requests from anon, authenticated;
grant all on table public.fandom_requests to service_role;
