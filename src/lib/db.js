// The one place the site reads Supabase. Only the BUILD calls this, never a visitor's browser.
// It uses the public (publishable) key, so the database rules apply: hidden rows never come back.
// Every loader hands back the same shapes the old JSON files gave, so the pages barely change.
// Each loader asks Supabase once per build and remembers the answer.
import { createClient } from '@supabase/supabase-js';

const URL = import.meta.env.PUBLIC_SUPABASE_URL;
const KEY = import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY;
/**
 * @typedef {{ heading: string, text: string }} Section
 * @typedef {{ slug: string, name: string, handle: string, pronouns?: string, picture: string, joined: string, intro: string, custom: boolean, featured: boolean, edited?: string, sections: Section[], fandoms: string[] }} Member
 * @typedef {{ id: string, data: Omit<Member, 'slug'> }} MemberEntry
 * @typedef {{ slug: string, title: string, description: string, credit: string, file: string, alt: string, added: string, position: number }} GalleryRow
 * @typedef {{ title?: string, pic?: string, by: string, date: string, summary: string }} NewsItem
 * @typedef {{ name: string, picture?: string, description?: string }} FandomRow
 */

const PAGE = 1000; // Supabase returns at most 1000 rows per request, so we ask in pages

let client;
function db() {
  if (!URL || !KEY) {
    throw new Error(
      'Supabase is not set up: PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set (in .env, or in Vercel > Settings > Environment Variables).'
    );
  }
  client ??= createClient(URL, KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

/** @type {Map<string, Promise<any>>} */
const cache = new Map();
/**
 * @template T
 * @param {string} name
 * @param {() => Promise<T>} load
 * @returns {Promise<T>}
 */
function once(name, load) {
  if (!cache.has(name)) cache.set(name, load());
  return cache.get(name);
}

// Reads a whole table, page by page. `order` is a list of [column, ascending]; id is added so pages never overlap.
/**
 * @param {string} table
 * @param {string} columns
 * @param {Array<[string, boolean]>} order
 * @returns {Promise<any[]>}
 */
async function fetchAll(table, columns, order) {
  const rows = [];
  for (let from = 0; ; from += PAGE) {
    let q = db().from(table).select(columns).range(from, from + PAGE - 1);
    for (const [col, asc] of [...order, ['id', true]]) q = q.order(col, { ascending: asc });
    const { data, error } = await q;
    if (error) {
      throw new Error(`Could not read "${table}" from Supabase (${error.message}). The build stops here so the site is not published with missing content.`);
    }
    rows.push(...data);
    if (data.length < PAGE) break;
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Members: { slug, name, handle, pronouns?, picture, joined, intro, custom, featured, edited?, sections, fandoms }
// ---------------------------------------------------------------------------

/** @returns {Section[]} */
function cleanSections(slug, sections) {
  /** @type {Section[]} */
  const ok = [];
  (Array.isArray(sections) ? sections : []).forEach((s, i) => {
    if (s && typeof s.text === 'string') {
      ok.push({ heading: typeof s.heading === 'string' ? s.heading : '', text: s.text });
    } else {
      console.warn(`[db] Member "${slug}": section ${i + 1} has no text, so it is skipped.`);
    }
  });
  return ok;
}

/** @returns {Promise<Member[]>} */
export function getMembers() {
  return once('members', async () => {
    const rows = await fetchAll(
      'members',
      'id, slug, name, handle, pronouns, picture, joined, intro, custom, featured, edited, sections, member_fandoms(position, fandoms(name))',
      [['slug', true]]
    );
    /** @type {Member[]} */
    const members = [];
    for (const r of rows) {
      if (!r.slug || !r.name || !r.handle || !r.joined || !r.intro) {
        console.warn(`[db] Member row "${r.slug ?? r.id}" is missing a required field, so it is skipped.`);
        continue;
      }
      const fandoms = (r.member_fandoms ?? [])
        .map((l) => ({ position: l.position ?? 0, name: (Array.isArray(l.fandoms) ? l.fandoms[0] : l.fandoms)?.name }))
        .filter((l) => l.name)
        .sort((a, b) => a.position - b.position || a.name.localeCompare(b.name))
        .map((l) => l.name);
      members.push({
        slug: r.slug,
        name: r.name,
        handle: r.handle,
        pronouns: r.pronouns || undefined, // empty = nothing shown
        picture: r.picture ?? '',
        joined: r.joined,
        intro: r.intro,
        custom: !!r.custom,
        featured: !!r.featured,
        edited: r.edited ?? undefined,
        sections: cleanSections(r.slug, r.sections),
        fandoms,
      });
    }
    return members;
  });
}

// The same list shaped like Astro's old content entries ({ id, data }), so `e.id` and `e.data` in the pages keep working.
/** @returns {Promise<MemberEntry[]>} */
export async function getMemberEntries() {
  return (await getMembers()).map(({ slug, ...data }) => ({ id: slug, data }));
}

// ---------------------------------------------------------------------------
// Fandoms: a Map of slug -> { name, picture, description }. fandoms.js uses it for pictures.
// ---------------------------------------------------------------------------

/** @returns {Promise<Map<string, FandomRow>>} */
export function getFandomRows() {
  return once('fandoms', async () => {
    const rows = await fetchAll('fandoms', 'id, slug, name, picture, description', [['slug', true]]);
    return new Map(rows.map((r) => [r.slug, { name: r.name, picture: r.picture || undefined, description: r.description || undefined }]));
  });
}

// ---------------------------------------------------------------------------
// Gallery: raw rows. gallery.js tidies and sorts them.
// ---------------------------------------------------------------------------

/** @returns {Promise<GalleryRow[]>} */
export function getGalleryRows() {
  return once('gallery', () =>
    fetchAll('gallery', 'id, slug, title, description, credit, file, alt, added, position', [['position', true]])
  );
}

// ---------------------------------------------------------------------------
// News: { title?, pic?, by, date, summary } in file order (the home box takes the first three).
// ---------------------------------------------------------------------------

/** @returns {Promise<NewsItem[]>} */
export function getNews() {
  return once('news', async () => {
    const rows = await fetchAll('news', 'id, title, pic, author, date, summary, position', [['position', true]]);
    return rows.map((r) => ({
      title: r.title || undefined, // some items have no title
      pic: r.pic || undefined,
      by: r.author,
      date: r.date,
      summary: r.summary ?? '',
    }));
  });
}