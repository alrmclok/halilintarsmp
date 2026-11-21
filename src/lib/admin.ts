// Part P: the rules and the database work behind the content dashboards. Server only.
// The middleware already lets only the super-admin and listed admins reach /admin and /api/admin.
import { adminDb, currentActor } from './auth';
// @ts-ignore (plain JS file)
import { toSlug } from './slug.js';

export type Kind = 'members' | 'fandoms' | 'gallery' | 'news';
type FieldType = 'text' | 'textarea' | 'date' | 'number' | 'checkbox' | 'sections' | 'picture';
export type Field = { name: string; label: string; type: FieldType; help?: string };
type Section = { heading: string; text: string };

const TZ = 'Asia/Jakarta'; // only for showing the "last published" time
export const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { timeZone: TZ, dateStyle: 'medium', timeStyle: 'short' }) + ' WIB';
export const today = () => new Date().toISOString().slice(0, 10);

const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const isDate = (s: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
};

const hiddenField: Field = { name: 'hidden', label: 'Hidden (left out of the site after the next Publish)', type: 'checkbox' };

export const KINDS: Record<Kind, {
  label: string; one: string; order: [string, boolean]; fields: Field[];
  title: (r: any) => string; sub: (r: any) => string;
}> = {
  members: {
    label: 'Members', one: 'member', order: ['slug', true],
    title: (r) => r.name,
    sub: (r) => `@${r.handle} · /${r.slug}/ · joined ${r.joined}`,
    fields: [
      { name: 'slug', label: 'Address piece (slug)', type: 'text', help: 'Lowercase letters, numbers and dashes, like "kate-m". Cannot change after saving (a custom page folder uses it).' },
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'handle', label: 'Handle (without @)', type: 'text' },
      { name: 'pronouns', label: 'Pronouns (optional)', type: 'text' },
      { name: 'picture', label: 'Picture (path or address, optional)', type: 'picture', help: 'Empty = gray box.' },
      { name: 'joined', label: 'Joined', type: 'date' },
      { name: 'intro', label: 'Intro', type: 'textarea' },
      { name: 'fandoms', label: 'Fandoms, in order, separated by commas', type: 'text', help: 'Each one must already exist in Fandoms.' },
      { name: 'sections', label: 'Sections', type: 'sections' },
      { name: 'edited', label: 'Last edited (optional)', type: 'date', help: 'Empty = the joined date is used.' },
      { name: 'custom', label: 'Custom page (own folder in public/members/<slug>/)', type: 'checkbox' },
      { name: 'featured', label: 'Featured', type: 'checkbox' },
      hiddenField,
    ],
  },
  fandoms: {
    label: 'Fandoms', one: 'fandom', order: ['slug', true],
    title: (r) => r.name,
    sub: (r) => `/${r.slug}/`,
    fields: [
      { name: 'name', label: 'Name', type: 'text', help: 'The page address comes from the name ("Pokémon" becomes pokemon), so renaming a fandom changes its page address. Two names that make the same address cannot both exist.' },
      { name: 'picture', label: 'Picture (optional)', type: 'picture', help: 'Empty = gray square.' },
      { name: 'description', label: 'Description (optional)', type: 'textarea' },
      hiddenField,
    ],
  },
  gallery: {
    label: 'Gallery', one: 'picture', order: ['position', true],
    title: (r) => r.title,
    sub: (r) => `${r.added} · ${r.credit} · /${r.slug}/`,
    fields: [
      { name: 'slug', label: 'Address piece (slug)', type: 'text', help: 'Picture page: /gallery/<slug>/. Cannot change after saving.' },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'credit', label: 'Credit', type: 'text' },
      { name: 'file', label: 'Picture', type: 'picture', help: 'Empty = gray box and no lightbox.' },
      { name: 'alt', label: 'Alt text (what the picture shows)', type: 'text' },
      { name: 'added', label: 'Added', type: 'date' },
      { name: 'position', label: 'Position (optional)', type: 'number', help: 'Breaks ties between pictures added on the same day. Empty = last.' },
      hiddenField,
    ],
  },
  news: {
    label: 'News', one: 'news item', order: ['position', true],
    title: (r) => r.title || String(r.summary || '').slice(0, 60) || '(no title)',
    sub: (r) => `${r.date} · ${r.author}`,
    fields: [
      { name: 'title', label: 'Title (optional)', type: 'text' },
      { name: 'pic', label: 'Picture (path or address, optional)', type: 'text' },
      { name: 'author', label: 'Author', type: 'text' },
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'summary', label: 'Text', type: 'textarea' },
      { name: 'position', label: 'Position (optional)', type: 'number', help: 'Lowest number is shown first; the home box shows the first three. Empty = new items go first.' },
      hiddenField,
    ],
  },
};

// ---------------------------------------------------------------------------
// Form values
// ---------------------------------------------------------------------------

export function defaults(kind: Kind): Record<string, any> {
  const r: Record<string, any> = { sections: [] };
  for (const f of KINDS[kind].fields) r[f.name] ??= f.type === 'checkbox' ? false : '';
  if (kind === 'members') r.joined = today();
  if (kind === 'gallery') { r.added = today(); r.credit = 'Unknown'; }
  if (kind === 'news') r.date = today();
  return r;
}

export function readForm(kind: Kind, form: FormData): Record<string, any> {
  const raw = defaults(kind);
  for (const f of KINDS[kind].fields) {
    if (f.type === 'checkbox') raw[f.name] = form.get(f.name) === 'on';
    else if (f.type === 'sections') {
      const h = form.getAll('section_heading').map(String);
      const t = form.getAll('section_text').map(String);
      raw.sections = t
        .map((text, i) => ({ heading: (h[i] ?? '').trim(), text: text.trim() }))
        .filter((s) => s.heading || s.text);
    } else raw[f.name] = String(form.get(f.name) ?? '').trim();
  }
  return raw;
}

// ---------------------------------------------------------------------------
// Part R: picture uploads. The browser shrinks the picture and posts it with the form as `<field>_file`.
// The server stores it in the public Storage bucket and puts its address in the row.
// ---------------------------------------------------------------------------

const BUCKET = 'pictures'; // made by supabase/schema.sql
const MAX_PICTURE_BYTES = 1024 * 1024; // the browser aims for 300 KB; this only stops a picture that was not shrunk
const PICTURE_EXT: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif' };
const PICTURE_FIELD: Partial<Record<Kind, string>> = { members: 'picture', fandoms: 'picture', gallery: 'file' };

const PICTURE_PREFIX = '/storage/v1/object/public/pictures/';

// One naming rule: members/<slug>-photo-profile.<ext>, fandoms/<fandom-slug>.<ext>, gallery/<title-slug>-<timestamp>.<ext>
function pictureName(kind: Kind, raw: Record<string, any>, ext: string): string {
  const ok = (v: string) => (SLUG.test(v) ? v : 'picture');
  if (kind === 'members') return `members/${ok(String(raw.slug ?? ''))}-photo-profile.${ext}`;
  if (kind === 'fandoms') return `fandoms/${ok(toSlug(String(raw.name ?? '')))}.${ext}`;
  const ts = new Date().toISOString().replace(/\D/g, '').slice(0, 14); // yyyymmddhhmmss, UTC
  return `gallery/${ok(toSlug(String(raw.title ?? '')) || String(raw.slug ?? ''))}-${ts}.${ext}`;
}

// Uploads the chosen picture (if any) and puts its address in raw[field]. Returns the errors (empty when fine) and
// `after`, to call once the row is saved: it removes the replaced file, unless another row still uses it.
export async function applyUploads(kind: Kind, form: FormData, raw: Record<string, any>, id: string | null): Promise<{ errors: string[]; after: () => Promise<void> }> {
  const none = async () => {};
  const field = PICTURE_FIELD[kind];
  if (!field) return { errors: [], after: none };
  const file = form.get(`${field}_file`);
  if (!(file instanceof File) || !file.size) return { errors: [], after: none };
  const ext = PICTURE_EXT[file.type];
  if (!ext) return { errors: ['The picture must be a .webp, .jpg, .png or .gif file.'], after: none };
  if (file.size > MAX_PICTURE_BYTES) return { errors: ['The picture is over 1 MB. The browser shrinks pictures by itself, so turn JavaScript on, or shrink it first.'], after: none };
  const path = pictureName(kind, raw, ext);
  const db = adminDb();
  const { error } = await db.storage.from(BUCKET).upload(path, Buffer.from(await file.arrayBuffer()), {
    contentType: file.type,
    cacheControl: '3600',
    upsert: true, // members and fandoms keep one fixed name, so a new picture replaces the old one
  });
  if (error) return { errors: [`The picture did not upload: ${error.message}`], after: none };

  const old = String(raw[field] ?? '');
  const at = old.indexOf(PICTURE_PREFIX);
  const oldKey = at >= 0 ? decodeURIComponent(old.slice(at + PICTURE_PREFIX.length).split('?')[0]) : '';
  // ?v= makes the address new, so a cached older picture with the same name is not shown
  raw[field] = `${db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl}?v=${Date.now()}`;

  const after = async () => {
    if (!oldKey || oldKey === path) return;
    let q = db.from(kind).select('id').like(field, `%${oldKey}%`);
    if (id) q = q.neq('id', id);
    const { data } = await q.limit(1);
    if (!data?.length) await db.storage.from(BUCKET).remove([oldKey]); // best effort: a failure here is harmless
  };
  return { errors: [], after };
}

export async function loadRaw(kind: Kind, id: string): Promise<Record<string, any> | null> {
  const sel = kind === 'members' ? '*, member_fandoms(position, fandoms(name))' : '*';
  const { data } = (await adminDb().from(kind).select(sel).eq('id', id).maybeSingle()) as { data: any };
  if (!data) return null;
  const raw = defaults(kind);
  for (const f of KINDS[kind].fields) {
    if (f.type === 'sections' || (kind === 'members' && f.name === 'fandoms')) continue;
    const v = data[f.name];
    if (f.type === 'checkbox') raw[f.name] = !!v;
    else if (v != null) raw[f.name] = String(v);
  }
  raw.slug = data.slug ?? '';
  if (kind === 'members') {
    raw.sections = (Array.isArray(data.sections) ? data.sections : []).map((x: any) => ({ heading: String(x?.heading ?? ''), text: String(x?.text ?? '') }));
    raw.fandoms = (data.member_fandoms ?? [])
      .map((l: any) => ({ p: l.position ?? 0, n: (Array.isArray(l.fandoms) ? l.fandoms[0] : l.fandoms)?.name }))
      .filter((l: any) => l.n)
      .sort((a: any, b: any) => a.p - b.p)
      .map((l: any) => l.n)
      .join(', ');
  }
  return raw;
}

// ---------------------------------------------------------------------------
// Save: checks the same rules as the old data files, then writes and raises the unpublished count.
// ---------------------------------------------------------------------------

export async function saveRow(kind: Kind, id: string | null, raw: Record<string, any>, keepSlug?: string): Promise<{ errors: string[] }> {
  const db = adminDb();
  const errors: string[] = [];
  const s = (k: string) => String(raw[k] ?? '');
  const need = (k: string, label: string) => { if (!s(k)) errors.push(`${label} is required.`); };
  const date = (k: string, label: string, required: boolean) => {
    const v = s(k);
    if (!v) { if (required) errors.push(`${label} is required.`); return null; }
    if (!isDate(v)) { errors.push(`${label} must be a real date like 2026-11-20.`); return null; }
    return v;
  };

  const row: Record<string, any> = { hidden: !!raw.hidden };
  let slug = '';
  let fandomIds: string[] = [];

  if (kind === 'members') {
    for (const [k, l] of [['name', 'Name'], ['handle', 'Handle'], ['intro', 'Intro']]) need(k, l);
    Object.assign(row, {
      name: s('name'), handle: s('handle').replace(/^@+/, ''), pronouns: s('pronouns') || null, picture: s('picture'),
      joined: date('joined', 'Joined', true), edited: date('edited', 'Last edited', false), intro: s('intro'),
      custom: !!raw.custom, featured: !!raw.featured,
    });
    slug = id ? keepSlug ?? '' : s('slug');
    const secs: Section[] = raw.sections ?? [];
    secs.forEach((x, i) => { if (!x.text) errors.push(`Section ${i + 1} has a heading but no text.`); });
    row.sections = secs.filter((x) => x.text).map(({ heading, text }) => ({ heading, text }));

    const { data } = await db.from('fandoms').select('id, slug');
    const bySlug = new Map((data ?? []).map((f: any) => [f.slug, f.id]));
    const seen = new Set<string>();
    for (const n of s('fandoms').split(',').map((x) => x.trim()).filter(Boolean)) {
      const k = toSlug(n);
      if (seen.has(k)) continue;
      seen.add(k);
      const fid = bySlug.get(k);
      if (fid) fandomIds.push(fid as string);
      else errors.push(`Unknown fandom "${n}". Add it in Fandoms first, or fix the spelling.`);
    }
  } else if (kind === 'fandoms') {
    need('name', 'Name');
    slug = toSlug(s('name'));
    if (s('name') && !slug) errors.push('The name needs at least one letter or number.');
    Object.assign(row, { name: s('name'), picture: s('picture') || null, description: s('description') || null });
  } else if (kind === 'gallery') {
    need('title', 'Title');
    slug = id ? keepSlug ?? '' : s('slug');
    Object.assign(row, {
      title: s('title'), description: s('description'), credit: s('credit') || 'Unknown',
      file: s('file'), alt: s('alt'), added: date('added', 'Added', true),
    });
  } else {
    need('author', 'Author');
    Object.assign(row, { title: s('title') || null, pic: s('pic') || null, author: s('author'), date: date('date', 'Date', true), summary: s('summary') });
  }

  if (kind === 'members' || kind === 'gallery') {
    if (!slug) errors.push('Address piece (slug) is required.');
    else if (!SLUG.test(slug)) errors.push('Address piece (slug) may only have lowercase letters, numbers and single dashes, like "kate-m".');
  }

  if (slug && SLUG.test(slug) && (!id || kind === 'fandoms')) {
    row.slug = slug;
    let q = db.from(kind).select('id').eq('slug', slug);
    if (id) q = q.neq('id', id);
    const { data } = await q.limit(1);
    if (data?.length) {
      errors.push(kind === 'fandoms'
        ? `Another fandom already has the same address piece "${slug}" (the same name apart from capitals or symbols). Edit that one instead.`
        : `Another ${KINDS[kind].one} already uses the address piece "${slug}".`);
    }
  }

  if (kind === 'gallery' || kind === 'news') {
    const p = s('position');
    if (p && !/^-?\d+$/.test(p)) errors.push('Position must be a whole number.');
    else if (p) row.position = parseInt(p, 10);
    else if (!id) {
      const { data } = await db.from(kind).select('position').order('position', { ascending: kind === 'news' }).limit(1);
      const base = data?.[0]?.position ?? 0;
      row.position = kind === 'news' ? base - 1 : base + 1; // news: the home box shows the lowest first
    }
  }

  if (errors.length) return { errors };

  const fail = (e: { code?: string; message: string }) => ({
    errors: [e.code === '23505' ? 'That address piece is already used by another row.' : `Database error: ${e.message}`],
  });

  let before: Record<string, any> | null = null;
  if (id) before = (await db.from(kind).select('*').eq('id', id).maybeSingle()).data;
  let fandomsChanged = false;

  let rowId = id;
  if (id) {
    const { error } = await db.from(kind).update(row).eq('id', id);
    if (error) return fail(error);
  } else {
    const { data, error } = await db.from(kind).insert(row).select('id').single();
    if (error) return fail(error);
    rowId = data.id;
  }

  if (kind === 'members') {
    // Keep the old links so a failed insert can put them back (no member is left without fandoms).
    const old = await db.from('member_fandoms').select('member_id, fandom_id, position').eq('member_id', rowId);
    if (old.error) return fail(old.error);
    const del = await db.from('member_fandoms').delete().eq('member_id', rowId);
    if (del.error) return fail(del.error);
    fandomsChanged = JSON.stringify([...(old.data ?? [])].sort((a: any, b: any) => a.position - b.position).map((x: any) => x.fandom_id)) !== JSON.stringify(fandomIds);
    if (fandomIds.length) {
      const ins = await db.from('member_fandoms').insert(fandomIds.map((fid, i) => ({ member_id: rowId, fandom_id: fid, position: i })));
      if (ins.error) {
        if (old.data?.length) await db.from('member_fandoms').insert(old.data);
        return fail(ins.error);
      }
    }
  }

  await bumpPending();
  if (id) {
    const changed = before ? Object.keys(row).filter((k) => JSON.stringify(before![k] ?? null) !== JSON.stringify(row[k] ?? null)) : [];
    if (fandomsChanged) changed.push('fandoms');
    await logChange('edit', kind, KINDS[kind].title(row), changed.length ? 'changed: ' + changed.join(', ') : 'saved');
  } else {
    await logChange('create', kind, KINDS[kind].title(row));
  }
  return { errors: [] };
}

export async function setHidden(kind: Kind, id: string, hidden: boolean): Promise<string | null> {
  const db = adminDb();
  const { data: row } = await db.from(kind).select('*').eq('id', id).maybeSingle();
  const { error } = await db.from(kind).update({ hidden }).eq('id', id);
  if (error) return error.message;
  await bumpPending();
  await logChange(hidden ? 'hide' : 'unhide', kind, row ? KINDS[kind].title(row) : id);
  return null;
}

// Every successful save raises the count (read, then write: fine for a few admins).
async function bumpPending() {
  const db = adminDb();
  const { data } = await db.from('publish_state').select('pending_changes').eq('id', 1).maybeSingle();
  await db.from('publish_state').update({ pending_changes: (data?.pending_changes ?? 0) + 1 }).eq('id', 1);
}

export async function stats() {
  const db = adminDb();
  const counts = await Promise.all(
    (Object.keys(KINDS) as Kind[]).map(async (kind) => {
      const [all, hid] = await Promise.all([
        db.from(kind).select('id', { count: 'exact', head: true }),
        db.from(kind).select('id', { count: 'exact', head: true }).eq('hidden', true),
      ]);
      return { kind, total: all.count ?? 0, hidden: hid.count ?? 0 };
    })
  );
  const { data } = await db.from('publish_state').select('last_published_at, pending_changes').eq('id', 1).maybeSingle();
  return { counts, pending: data?.pending_changes ?? 0, last: (data?.last_published_at as string | null) ?? null };
}

// Part Q: makes the fandoms (name only) that do not exist yet, so a request that names a new fandom can be approved.
export async function ensureFandoms(names: string[]): Promise<string | null> {
  const db = adminDb();
  const { data, error } = await db.from('fandoms').select('slug');
  if (error) return error.message;
  const have = new Set((data ?? []).map((f: any) => f.slug));
  const add = new Map<string, string>();
  for (const n of names.map((x) => x.trim()).filter(Boolean)) {
    const k = toSlug(n);
    if (k && !have.has(k) && !add.has(k)) add.set(k, n);
  }
  if (!add.size) return null;
  const { error: e2 } = await db.from('fandoms').insert([...add].map(([slug, name]) => ({ slug, name })));
  return e2?.message ?? null;
}

// ---------------------------------------------------------------------------
// Part S: change log, delete for good, admins, keep-alive. Server only.
// ---------------------------------------------------------------------------

// Writes one line in the private change log. Best effort: a failure never stops the real work.
export async function logChange(action: string, kind: string, label: string, detail = '') {
  try {
    const { error } = await adminDb().from('change_log').insert({
      actor: currentActor()?.email ?? 'unknown', action, kind,
      label: label.slice(0, 200), detail: detail.slice(0, 500),
    });
    if (error) console.error('[log] could not write the change log:', error.message);
  } catch (e) {
    console.error('[log] could not write the change log:', e);
  }
}

export async function recentLog(limit = 200) {
  const { data, error } = await adminDb().from('change_log').select('*').order('created_at', { ascending: false }).limit(limit);
  return { rows: (data ?? []) as any[], error: error?.message ?? '' };
}

async function removeUnusedPicture(kind: Kind, field: string, url: string, exceptId: string) {
  const at = url.indexOf(PICTURE_PREFIX);
  if (at < 0) return; // not one of ours (an outside address or an old /public path)
  const key = decodeURIComponent(url.slice(at + PICTURE_PREFIX.length).split('?')[0]);
  const db = adminDb();
  const { data } = await db.from(kind).select('id').like(field, `%${key}%`).neq('id', exceptId).limit(1);
  if (!data?.length) await db.storage.from(BUCKET).remove([key]); // best effort
}

// Super-admin only. The row must be hidden, and the person must type DELETE. A fandom that members still use is refused.
export async function deleteRow(kind: Kind, id: string, confirm: string): Promise<string | null> {
  if (currentActor()?.role !== 'super') return 'Only the super-admin can delete.';
  if (confirm.trim() !== 'DELETE') return 'Type DELETE (capitals) to confirm.';
  const db = adminDb();
  const { data: row } = await db.from(kind).select('*').eq('id', id).maybeSingle();
  if (!row) return 'That row no longer exists.';
  if (!row.hidden) return 'Hide it first. Only hidden rows can be deleted.';
  if (kind === 'fandoms') {
    const { count, error } = await db.from('member_fandoms').select('member_id', { count: 'exact', head: true }).eq('fandom_id', id);
    if (error) return error.message;
    if (count) return `${count} member${count === 1 ? '' : 's'} still use this fandom. Remove it from them first.`;
  }
  const { error } = await db.from(kind).delete().eq('id', id);
  if (error) return error.message;
  const field = PICTURE_FIELD[kind];
  if (field) await removeUnusedPicture(kind, field, String(row[field] ?? ''), id);
  await logChange('delete', kind, KINDS[kind].title(row), [row.slug ? `slug: ${row.slug}` : '', row.custom ? 'its custom page folder stays in GitHub' : ''].filter(Boolean).join('; '));
  return null;
}

export async function listAdmins() {
  const { data } = await adminDb().from('admins').select('email, added_by, added_at').order('added_at', { ascending: true });
  return (data ?? []) as { email: string; added_by: string | null; added_at: string }[];
}

export async function addAdmin(emailRaw: string): Promise<string | null> {
  const me = currentActor();
  if (me?.role !== 'super') return 'Only the super-admin can add admins.';
  const email = emailRaw.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'That does not look like an email address.';
  const superEmail = ((import.meta.env.SUPER_ADMIN_EMAIL as string | undefined) ?? '').trim().toLowerCase();
  if (email === superEmail) return 'That is the super-admin email. It already has full access.';
  const { error } = await adminDb().from('admins').insert({ email, added_by: me.email });
  if (error) return error.code === '23505' ? 'That email is already an admin.' : error.message;
  await logChange('admin_add', 'admins', email);
  return null;
}

export async function removeAdmin(emailRaw: string): Promise<string | null> {
  if (currentActor()?.role !== 'super') return 'Only the super-admin can remove admins.';
  const email = emailRaw.trim().toLowerCase();
  const { error } = await adminDb().from('admins').delete().eq('email', email);
  if (error) return error.message;
  await logChange('admin_remove', 'admins', email);
  return null;
}

// Keep-alive: adds a dummy row to `heartbeat`, deletes it, notes the time. Also drops log lines older than 180 days.
// It never touches the real tables. Called by the button on /admin/super/ and by the Vercel cron job.
export async function keepAlive(): Promise<string | null> {
  const db = adminDb();
  const ins = await db.from('heartbeat').insert({}).select('id').single();
  if (ins.error) return ins.error.message;
  const del = await db.from('heartbeat').delete().eq('id', ins.data.id);
  if (del.error) return del.error.message;
  await db.from('publish_state').update({ last_ping_at: new Date().toISOString() }).eq('id', 1);
  await db.from('change_log').delete().lt('created_at', new Date(Date.now() - 180 * 86400000).toISOString());
  return null;
}

export async function lastPing(): Promise<string | null> {
  const { data } = await adminDb().from('publish_state').select('last_ping_at').eq('id', 1).maybeSingle();
  return (data?.last_ping_at as string | null) ?? null;
}
