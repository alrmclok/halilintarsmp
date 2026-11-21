-- HalilintarSMP: migration 3 (Part S). Run once in the Supabase SQL Editor. Safe to run again. Deletes nothing.
-- Adds the private change log and the "last keep-alive ping" time.

alter table public.publish_state add column if not exists last_ping_at timestamptz;

create table if not exists public.change_log (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  actor       text not null,
  action      text not null,
  kind        text not null,
  label       text not null default '',
  detail      text not null default ''
);
create index if not exists change_log_created_idx on public.change_log (created_at desc);

alter table public.change_log enable row level security;
revoke all on table public.change_log from anon, authenticated;
grant all on table public.change_log to service_role;
