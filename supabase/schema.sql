-- HalilintarSMP: database schema (Part M)
--
-- How to use: open your Supabase project, go to SQL Editor, paste this whole file, press Run.
-- It is safe to run again: it only makes what is missing and rewrites the access rules.
-- Running it again never deletes rows.
--
-- Two kinds of access:
--   * The public (publishable) key can READ the public tables, and only rows that are not hidden.
--     It can never write, and it cannot touch the admin tables at all.
--   * The secret key (server only) bypasses these rules. The import script and, later, the
--     dashboards use it.

-- ---------------------------------------------------------------------------
-- Helper: keep `updated_at` correct on every edit
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Members (same fields as the old member data file, plus slug and hidden)
-- ---------------------------------------------------------------------------

create table if not exists public.members (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,            -- the old file name, so no address changes
  name        text not null,
  handle      text not null,
  pronouns    text,                            -- empty = nothing shown
  picture     text not null default '',        -- path or address of a small square picture; empty = gray box
  joined      date not null,
  intro       text not null,
  custom      boolean not null default false,  -- true = own page folder in public/members/<slug>/
  featured    boolean not null default false,
  edited      date,                            -- null = use the joined date for "Last edited"
  sections    jsonb not null default '[]'::jsonb,  -- [{"heading": "...", "text": "..."}]
  hidden      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint members_sections_is_list check (jsonb_typeof(sections) = 'array')
);

-- ---------------------------------------------------------------------------
-- Fandoms (their own list; the slug uses the same rule as toSlug in src/lib/slug.js)
-- ---------------------------------------------------------------------------

create table if not exists public.fandoms (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  picture      text,                           -- null = gray square
  description  text,
  hidden       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint fandoms_slug_shape check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- A member's fandoms, in the order the member wants them (position 0 is first).
create table if not exists public.member_fandoms (
  member_id  uuid not null references public.members (id) on delete cascade,
  fandom_id  uuid not null references public.fandoms (id) on delete cascade,
  position   integer not null default 0,
  primary key (member_id, fandom_id)
);
create index if not exists member_fandoms_fandom_idx on public.member_fandoms (fandom_id);

-- ---------------------------------------------------------------------------
-- Gallery (same fields as gallery.json, plus slug, hidden and the file order)
-- ---------------------------------------------------------------------------

create table if not exists public.gallery (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,           -- the picture page address: /gallery/<slug>/
  title        text not null,
  description  text not null default '',
  credit       text not null default 'Unknown',
  file         text not null default '',       -- empty = gray box and no lightbox
  alt          text not null default '',
  added        date not null,
  position     integer not null default 0,     -- the order in gallery.json (breaks ties between pictures added on the same day)
  hidden       boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  constraint gallery_slug_shape check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$')
);

-- ---------------------------------------------------------------------------
-- News (like news.json: title and pic are optional, `by` is called author here)
-- ---------------------------------------------------------------------------

create table if not exists public.news (
  id          uuid primary key default gen_random_uuid(),
  title       text,                            -- some items have no title
  pic         text,                            -- optional picture path
  author      text not null,
  date        date not null,
  summary     text not null default '',
  position    integer not null default 0,      -- the order in news.json (the home box shows the first three)
  import_key  text unique,                     -- set only by the import script, so running it again makes no doubles; rows made in a dashboard leave it empty
  hidden      boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admin tables (nobody but the server can touch these)
-- ---------------------------------------------------------------------------

create table if not exists public.admins (
  email      text primary key,
  added_by   text,
  added_at   timestamptz not null default now(),
  constraint admins_email_lowercase check (email = lower(email))
);

create table if not exists public.member_requests (
  id           uuid primary key default gen_random_uuid(),
  status       text not null default 'pending',
  name         text not null,
  handle       text not null,
  pronouns     text,
  fandoms      text[] not null default '{}',   -- as typed in the form, matched to real fandoms when a reviewer approves
  joined       date,                           -- the form does not require it
  intro        text not null,
  sections     jsonb not null default '[]'::jsonb,
  review_note  text,
  reviewed_by  text,
  reviewed_at  timestamptz,
  created_at   timestamptz not null default now(),
  kind         text not null default 'new',   -- 'new' = a new member, 'edit' = a change to member_id's page (Part Q)
  member_id    uuid references public.members (id) on delete set null,
  reason       text,                           -- the sender's optional note
  ip_hash      text,                           -- salted hash of the sender's address, used only for the rate limit
  constraint member_requests_kind check (kind in ('new', 'edit')),
  constraint member_requests_status check (status in ('pending', 'approved', 'rejected')),
  constraint member_requests_sections_is_list check (jsonb_typeof(sections) = 'array')
);
create index if not exists member_requests_status_idx on public.member_requests (status, created_at);
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

create table if not exists public.heartbeat (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now()
);

-- Exactly one row (id is always 1).
create table if not exists public.publish_state (
  id                 integer primary key default 1,
  last_published_at  timestamptz,
  pending_changes    integer not null default 0,
  last_ping_at       timestamptz,                -- the last keep-alive ping (Part S)
  constraint publish_state_one_row check (id = 1)
);
insert into public.publish_state (id) values (1) on conflict (id) do nothing;

-- The change log (Part S): who did what in the dashboards. Private, like the other admin tables.
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

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------

drop trigger if exists members_updated_at on public.members;
create trigger members_updated_at before update on public.members
  for each row execute function public.set_updated_at();

drop trigger if exists fandoms_updated_at on public.fandoms;
create trigger fandoms_updated_at before update on public.fandoms
  for each row execute function public.set_updated_at();

drop trigger if exists gallery_updated_at on public.gallery;
create trigger gallery_updated_at before update on public.gallery
  for each row execute function public.set_updated_at();

drop trigger if exists news_updated_at on public.news;
create trigger news_updated_at before update on public.news
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Access rules
-- ---------------------------------------------------------------------------

alter table public.members         enable row level security;
alter table public.fandoms         enable row level security;
alter table public.member_fandoms  enable row level security;
alter table public.gallery         enable row level security;
alter table public.news            enable row level security;
alter table public.admins          enable row level security;
alter table public.member_requests enable row level security;
alter table public.fandom_requests enable row level security;
alter table public.news_requests   enable row level security;
alter table public.heartbeat       enable row level security;
alter table public.publish_state   enable row level security;
alter table public.change_log      enable row level security;

-- Start from nothing: take every right away from the public roles on every table.
revoke all on table
  public.members, public.fandoms, public.member_fandoms, public.gallery, public.news,
  public.admins, public.member_requests, public.fandom_requests, public.news_requests, public.heartbeat, public.publish_state, public.change_log
from anon, authenticated;

-- The secret key (the service_role) bypasses the row rules but still needs the table rights, so say it out loud
-- instead of relying on defaults that Supabase may change.
grant all on table
  public.members, public.fandoms, public.member_fandoms, public.gallery, public.news,
  public.admins, public.member_requests, public.fandom_requests, public.news_requests, public.heartbeat, public.publish_state, public.change_log
to service_role;

-- ...then give back reading to the public roles, and only on the public tables.
grant select on table
  public.members, public.fandoms, public.member_fandoms, public.gallery, public.news
to anon, authenticated;

-- Which rows may be read. "anon" is a visitor, "authenticated" is someone logged in with the same public key.
drop policy if exists "public reads visible members" on public.members;
create policy "public reads visible members" on public.members
  for select to anon, authenticated using (not hidden);

drop policy if exists "public reads visible fandoms" on public.fandoms;
create policy "public reads visible fandoms" on public.fandoms
  for select to anon, authenticated using (not hidden);

-- A link is readable only when BOTH its member and its fandom are readable.
-- (The two sub-selects run under the same rules, so hidden rows are not found.)
drop policy if exists "public reads visible links" on public.member_fandoms;
create policy "public reads visible links" on public.member_fandoms
  for select to anon, authenticated using (
    exists (select 1 from public.members m where m.id = member_id)
    and exists (select 1 from public.fandoms f where f.id = fandom_id)
  );

drop policy if exists "public reads visible gallery" on public.gallery;
create policy "public reads visible gallery" on public.gallery
  for select to anon, authenticated using (not hidden);

drop policy if exists "public reads visible news" on public.news;
create policy "public reads visible news" on public.news
  for select to anon, authenticated using (not hidden);

-- admins, the request tables, heartbeat, publish_state and change_log get no policy and no grant:
-- the public key cannot read or write them. Only the secret key can.
-- No table has an insert, update or delete policy, so the public key can never write.

-- ---------------------------------------------------------------------------
-- Pictures (Part R): one public Storage bucket
-- ---------------------------------------------------------------------------
-- Anyone can open a picture by its address, but only the secret key can add or change files:
-- no policy is made on storage.objects, so the public key cannot write or list. Folders: members/, fandoms/, gallery/.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pictures', 'pictures', true, 2097152, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
