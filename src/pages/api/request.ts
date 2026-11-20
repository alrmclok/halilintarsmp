// Part Q: the one PUBLIC endpoint that writes. It saves a pending request and nothing else.
// Protection: same-origin check, hidden trap field, length limits, Cloudflare Turnstile, and a per-visitor rate limit
// (the visitor is a salted hash of their address, never the address itself). src/middleware.ts leaves this path alone.
import type { APIRoute } from 'astro';
import { createHash } from 'node:crypto';
import { adminDb } from '../../lib/auth';

export const prerender = false;

const MAX_BODY = 60_000, PER_HOUR = 3, PER_DAY = 8, MAX_PENDING = 200;
const json = (o: unknown, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const isDate = (x: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(x)) return false;
  const d = new Date(x + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === x;
};

export const POST: APIRoute = async (ctx) => {
  const { request, url } = ctx;
  let sameSite = false;
  try { const o = request.headers.get('origin'); sameSite = !!o && new URL(o).host === url.host; } catch {}
  if (!sameSite) return json({ error: 'Not allowed from here.' }, 403);

  const text = await request.text();
  if (text.length > MAX_BODY) return json({ error: 'That is too long.' }, 413);
  let b: any;
  try { b = JSON.parse(text); } catch { return json({ error: 'Bad request.' }, 400); }
  if (!b || typeof b !== 'object') return json({ error: 'Bad request.' }, 400);
  if (str(b.botcheck)) return json({ ok: true }); // a bot filled the hidden field: pretend it worked

  const type = str(b.type);
  if (!['member-new', 'member-edit', 'fandom-edit'].includes(type)) return json({ error: 'Bad request.' }, 400);

  const errors: string[] = [];
  const reason = str(b.reason);
  if (reason.length > 300) errors.push('The note is too long (300 characters at most).');
  let record: Record<string, any> = {};
  const table = type === 'fandom-edit' ? 'fandom_requests' : 'member_requests';

  if (type === 'fandom-edit') {
    const description = str(b.description);
    if (description.length > 1000) errors.push('The description is too long (1000 characters at most).');
    record = { description, reason: reason || null };
  } else {
    const name = str(b.name), handle = str(b.handle).replace(/^@+/, ''), pronouns = str(b.pronouns), intro = str(b.intro), joined = str(b.joined);
    if (!name || name.length > 80) errors.push('Name is required (80 characters at most).');
    if (!handle || handle.length > 40) errors.push('Handle is required (40 characters at most).');
    if (pronouns.length > 40) errors.push('Pronouns are too long (40 characters at most).');
    if (!intro || intro.length > 300) errors.push('Intro is required (300 characters at most).');
    if (joined && !isDate(joined)) errors.push('The joined date is not a real date.');
    const fandoms: string[] = Array.isArray(b.fandoms) ? b.fandoms.map(str).filter(Boolean) : [];
    if (fandoms.length > 20 || fandoms.some((f) => f.length > 60)) errors.push('Too many fandoms, or a fandom name is too long.');
    const sections = (Array.isArray(b.sections) ? b.sections : [])
      .map((x: any) => ({ heading: str(x?.heading), text: str(x?.text) }))
      .filter((x: any) => x.heading || x.text);
    if (sections.length > 12 || sections.some((x: any) => x.heading.length > 80 || x.text.length > 4000)) errors.push('Too many sections, or a section is too long.');
    if (sections.some((x: any) => !x.text)) errors.push('Every section needs text.');
    if (type === 'member-new' && !sections.length) errors.push('Add at least one section.');
    record = { kind: type === 'member-edit' ? 'edit' : 'new', name, handle, pronouns: pronouns || null, intro, joined: joined || null, fandoms, sections, reason: reason || null };
  }
  if (errors.length) return json({ error: errors.join(' ') }, 400);

  const db = adminDb();
  if (type !== 'member-new') {
    const t = type === 'fandom-edit' ? 'fandoms' : 'members';
    const { data } = (await db.from(t).select(t === 'members' ? 'id, custom, hidden' : 'id, hidden').eq('slug', str(b.slug)).maybeSingle()) as { data: any };
    if (!data || data.hidden || data.custom) return json({ error: 'That page was not found.' }, 404);
    record[type === 'fandom-edit' ? 'fandom_id' : 'member_id'] = data.id;
  }

  let ip = 'unknown';
  try { ip = ctx.clientAddress; } catch {}
  const ipHash = createHash('sha256').update(ip + ':' + (import.meta.env.SUPABASE_SECRET_KEY ?? '')).digest('hex').slice(0, 32);
  const count = async (q: (t: string) => any) => {
    let n = 0;
    for (const t of ['member_requests', 'fandom_requests']) n += (await q(t)).count ?? 0;
    return n;
  };
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const mine = (ms: number) => count((t) => db.from(t).select('id', { count: 'exact', head: true }).eq('ip_hash', ipHash).gte('created_at', since(ms)));
  if ((await mine(3600_000)) >= PER_HOUR || (await mine(86_400_000)) >= PER_DAY) {
    return json({ error: 'You sent a few requests already. Please try again later.' }, 429);
  }
  if ((await count((t) => db.from(t).select('id', { count: 'exact', head: true }).eq('status', 'pending'))) >= MAX_PENDING) {
    return json({ error: 'Too many requests are waiting right now. Please try again later.' }, 503);
  }

  const secret = import.meta.env.TURNSTILE_SECRET_KEY as string | undefined;
  if (!secret) return json({ error: 'The form is not set up yet.' }, 503);
  let human = false;
  try {
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: str(b.token), ...(ip !== 'unknown' && { remoteip: ip }) }),
    });
    human = !!(await r.json()).success;
  } catch (e) {
    console.error('[request] Turnstile check failed', e);
  }
  if (!human) return json({ error: 'The check did not pass. Please try again.' }, 400);

  const { error } = await db.from(table).insert({ ...record, ip_hash: ipHash });
  if (error) {
    console.error('[request] insert failed', error.message);
    return json({ error: 'Could not save it. Please try again later.' }, 500);
  }
  return json({ ok: true });
};
