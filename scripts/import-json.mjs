// Copies the content files into Supabase: src/content/members/*.json, gallery.json and news.json.
// Run it with:
//   npm run db:import:dry   checks the files and prints a report, writes nothing, needs no keys
//   npm run db:import       really copies (needs the keys in .env)
//   npm run db:import -- --only-new   copies only rows that are not in the database yet
//
// Safe to run again: members, fandoms and gallery pictures are matched by their slug, and news by a fingerprint
// of its text, so a second run updates the same rows instead of making doubles.
// A normal run OVERWRITES the fields of rows that already exist with what is in the files. Once the dashboards
// are in use, use --only-new, or do not run it at all, or you would undo edits made there.
// It never changes `hidden`, and it never deletes a row.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { toSlug } from '../src/lib/slug.js'; // the same rule the site uses, so the slugs match

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DRY = process.argv.includes('--dry-run');
const ONLY_NEW = process.argv.includes('--only-new');

const errors = [];
const warnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

const isStr = (v) => typeof v === 'string';
const isDate = (v) => {
  if (!isStr(v) || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const d = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
};

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    err(`${path.relative(ROOT, file)}: cannot read it as JSON (${e.message})`);
    return null;
  }
}

// ---------------------------------------------------------------------------
// 1. Members: src/content/members/*.json
// ---------------------------------------------------------------------------

const membersDir = path.join(ROOT, 'src', 'content', 'members');
const memberFiles = fs.existsSync(membersDir)
  ? fs.readdirSync(membersDir).filter((f) => f.endsWith('.json')).sort()
  : [];
if (!memberFiles.length) warn('src/content/members/ has no .json files.');

const members = []; // rows for the `members` table, each also carries `fandomNames` for later
for (const file of memberFiles) {
  const where = `members/${file}`;
  const j = readJson(path.join(membersDir, file));
  if (!j) continue;
  const slug = path.basename(file, '.json');
  if (slug !== slug.toLowerCase()) warn(`${where}: the file name has capitals. The slug is kept as written, but Astro may lowercase the address.`);

  const bad = [];
  for (const f of ['name', 'handle', 'intro']) if (!isStr(j[f])) bad.push(`"${f}" must be text`);
  if (!Array.isArray(j.fandoms) || j.fandoms.some((x) => !isStr(x))) bad.push('"fandoms" must be a list of text');
  if (!isDate(j.joined)) bad.push(`"joined" must be a real date like 2026-11-01 (it is ${JSON.stringify(j.joined)})`);
  if (j.pronouns !== undefined && !isStr(j.pronouns)) bad.push('"pronouns" must be text');
  if (j.picture !== undefined && !isStr(j.picture)) bad.push('"picture" must be text');
  for (const f of ['custom', 'featured']) if (j[f] !== undefined && typeof j[f] !== 'boolean') bad.push(`"${f}" must be true or false`);
  if (j.edited !== undefined && j.edited !== '' && !isDate(j.edited)) bad.push(`"edited" must be empty or a real date (it is ${JSON.stringify(j.edited)})`);
  if (j.sections !== undefined && (!Array.isArray(j.sections) || j.sections.some((s) => !s || !isStr(s.heading) || !isStr(s.text)))) {
    bad.push('"sections" must be a list of {heading, text}');
  }
  if (bad.length) {
    bad.forEach((b) => err(`${where}: ${b}`));
    continue;
  }

  members.push({
    slug,
    name: j.name,
    handle: j.handle,
    pronouns: j.pronouns?.trim() ? j.pronouns.trim() : null,
    picture: j.picture ?? '',
    joined: j.joined,
    intro: j.intro,
    custom: j.custom ?? false,
    featured: j.featured ?? false,
    edited: j.edited ? j.edited : null,
    sections: (j.sections ?? []).map((s) => ({ heading: s.heading, text: s.text })),
    fandomNames: j.fandoms,
  });
}

// ---------------------------------------------------------------------------
// 2. Fandoms: built from the members, like src/lib/fandoms.js
// ---------------------------------------------------------------------------

// Pictures in public/fandoms/: the file name without its extension, cleaned like a fandom name.
const fandomImages = new Map();
const fandomsPicDir = path.join(ROOT, 'public', 'fandoms');
if (fs.existsSync(fandomsPicDir)) {
  for (const file of fs.readdirSync(fandomsPicDir).sort()) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (!ext || !base) continue;
    const key = toSlug(base);
    if (!key) continue;
    if (fandomImages.has(key)) warn(`public/fandoms/: "${file}" and "${path.basename(fandomImages.get(key))}" are the same fandom ("${key}"). Keeping the first.`);
    else fandomImages.set(key, `/fandoms/${file}`);
  }
}

const fandomsBySlug = new Map(); // slug -> { slug, name, picture }
const links = []; // { memberSlug, fandomSlug, position }
const byMemberSlug = [...members].sort((a, b) => a.slug.localeCompare(b.slug)); // same order as fandoms.js, so the shown spelling matches
for (const m of byMemberSlug) {
  let position = 0;
  const seen = new Set();
  for (const raw of m.fandomNames) {
    const name = raw.trim().replace(/\s+/g, ' ');
    const slug = toSlug(name);
    if (!slug) {
      warn(`Fandom "${raw}" (member ${m.slug}) has no letters or numbers, so it is skipped.`);
      continue;
    }
    if (!fandomsBySlug.has(slug)) fandomsBySlug.set(slug, { slug, name, picture: fandomImages.get(slug) ?? null });
    if (seen.has(slug)) continue; // the same fandom written twice by one member
    seen.add(slug);
    links.push({ memberSlug: m.slug, fandomSlug: slug, position: position++ });
  }
}
const fandoms = [...fandomsBySlug.values()];
const unmatchedImages = [...fandomImages.entries()].filter(([k]) => !fandomsBySlug.has(k)).map(([, v]) => v);

// ---------------------------------------------------------------------------
// 3. Gallery: src/content/gallery.json, slugs made like src/lib/gallery.js
// ---------------------------------------------------------------------------

const galleryJson = readJson(path.join(ROOT, 'src', 'content', 'gallery.json'));
const gallery = [];
if (galleryJson) {
  if (!Array.isArray(galleryJson)) err('gallery.json must be a list.');
  else {
    const counts = new Map();
    galleryJson.forEach((g, i) => {
      const where = `gallery.json item ${i + 1}`;
      const base = toSlug(g?.title ?? '') || `picture-${i + 1}`;
      const n = (counts.get(base) ?? 0) + 1; // numbered in file order, exactly like gallery.js
      counts.set(base, n);
      if (!isDate(g?.added)) return err(`${where} ("${g?.title ?? ''}"): "added" must be a real date like 2026-11-01`);
      gallery.push({
        slug: n === 1 ? base : `${base}-${n}`,
        title: g.title ?? 'Untitled',
        description: g.description ?? '',
        credit: g.credit ?? 'Unknown',
        file: g.file ?? '',
        alt: g.alt || g.title || '',
        added: g.added,
        position: i,
      });
    });
    const slugs = new Set();
    for (const g of gallery) {
      if (slugs.has(g.slug)) err(`gallery.json: two pictures end up with the slug "${g.slug}". Change one title.`);
      slugs.add(g.slug);
    }
  }
}

// ---------------------------------------------------------------------------
// 4. News: src/content/news.json (title and pic are optional)
// ---------------------------------------------------------------------------

const newsJson = readJson(path.join(ROOT, 'src', 'content', 'news.json'));
const news = [];
if (newsJson) {
  if (!Array.isArray(newsJson)) err('news.json must be a list.');
  else {
    const keys = new Set();
    newsJson.forEach((n, i) => {
      const where = `news.json item ${i + 1}`;
      if (!isStr(n?.by) || !n.by) return err(`${where}: "by" is needed`);
      if (!isDate(n?.date)) return err(`${where}: "date" must be a real date like 2026-11-01`);
      const row = {
        import_key: '',
        title: isStr(n.title) && n.title.trim() ? n.title : null,
        pic: isStr(n.pic) && n.pic ? n.pic : null,
        author: n.by,
        date: n.date,
        summary: n.summary ?? '',
        position: i,
      };
      // A fingerprint of the text: the same item always gets the same key, so a second run finds it again.
      row.import_key = `news-${crypto.createHash('sha1').update([row.title ?? '', row.author, row.date, row.summary].join('\u0001')).digest('hex').slice(0, 16)}`;
      if (keys.has(row.import_key)) return err(`${where}: it is exactly the same as another item (same title, author, date and summary)`);
      keys.add(row.import_key);
      news.push(row);
    });
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

function printReport() {
  const count = (arr, f) => arr.filter(f).length;
  console.log('\nWhat the files hold:');
  console.log(`  members         ${members.length}   (custom page: ${count(members, (m) => m.custom)}, featured: ${count(members, (m) => m.featured)}, with pronouns: ${count(members, (m) => m.pronouns)})`);
  console.log(`  fandoms         ${fandoms.length}   (with a picture: ${count(fandoms, (f) => f.picture)})`);
  console.log(`  member-fandom links  ${links.length}`);
  console.log(`  gallery         ${gallery.length}`);
  console.log(`  news            ${news.length}   (without a title: ${count(news, (n) => !n.title)}, with a picture: ${count(news, (n) => n.pic)})`);
  if (unmatchedImages.length) {
    console.log(`\nNote: ${unmatchedImages.length} picture(s) in public/fandoms/ match no fandom, so they are not used (same as on the site today):`);
    unmatchedImages.forEach((p) => console.log(`  ${p}`));
  }
  if (warnings.length) {
    console.log('\nWarnings:');
    warnings.forEach((w) => console.log(`  - ${w}`));
  }
  if (errors.length) {
    console.log('\nProblems (nothing was written):');
    errors.forEach((e) => console.log(`  - ${e}`));
  }
}

if (errors.length) {
  printReport();
  process.exit(1);
}

if (DRY) {
  printReport();
  console.log('\nDry run: nothing was written and no keys were used.');
  process.exit(0);
}

// ---------------------------------------------------------------------------
// 5. Write to Supabase
// ---------------------------------------------------------------------------

const url = process.env.PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error('PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env (see .env.example). Use "npm run db:import", not "node scripts/import-json.mjs".');
  process.exit(1);
}

let createClient;
try {
  ({ createClient } = await import('@supabase/supabase-js'));
} catch {
  console.error('The package @supabase/supabase-js is not installed. Run: npm install @supabase/supabase-js');
  process.exit(1);
}
const db = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });

const fail = (what, error) => {
  console.error(`\nStopped: ${what}\n  ${error.message}${error.hint ? `\n  hint: ${error.hint}` : ''}`);
  if (/relation .* does not exist|schema cache/i.test(error.message)) console.error('  Did you run supabase/schema.sql in the SQL Editor first?');
  process.exit(1);
};

async function existing(table, column) {
  const { data, error } = await db.from(table).select(column);
  if (error) fail(`could not read "${table}"`, error);
  return new Set(data.map((r) => r[column]).filter((v) => v != null)); // rows made in a dashboard have no import_key
}

async function upsert(table, rows, onConflict) {
  for (let i = 0; i < rows.length; i += 100) {
    const { error } = await db.from(table).upsert(rows.slice(i, i + 100), { onConflict, ignoreDuplicates: ONLY_NEW });
    if (error) fail(`could not write "${table}"`, error);
  }
}

const before = {
  members: await existing('members', 'slug'),
  fandoms: await existing('fandoms', 'slug'),
  gallery: await existing('gallery', 'slug'),
  news: await existing('news', 'import_key'),
};

const memberRows = members.map(({ fandomNames, ...row }) => row);
await upsert('members', memberRows, 'slug');
await upsert('fandoms', fandoms, 'slug');
await upsert('gallery', gallery, 'slug');
await upsert('news', news, 'import_key');

// Links: for every member that was written, replace its links with the ones in the file.
const memberIds = new Map();
const fandomIds = new Map();
{
  const m = await db.from('members').select('id, slug');
  if (m.error) fail('could not read "members"', m.error);
  m.data.forEach((r) => memberIds.set(r.slug, r.id));
  const f = await db.from('fandoms').select('id, slug');
  if (f.error) fail('could not read "fandoms"', f.error);
  f.data.forEach((r) => fandomIds.set(r.slug, r.id));
}
const writtenMembers = new Set(members.filter((m) => !ONLY_NEW || !before.members.has(m.slug)).map((m) => m.slug));
const writtenIds = [...writtenMembers].map((s) => memberIds.get(s));
for (let i = 0; i < writtenIds.length; i += 100) {
  const { error } = await db.from('member_fandoms').delete().in('member_id', writtenIds.slice(i, i + 100));
  if (error) fail('could not clear old links in "member_fandoms"', error);
}
const linkRows = links
  .filter((l) => writtenMembers.has(l.memberSlug))
  .map((l) => ({ member_id: memberIds.get(l.memberSlug), fandom_id: fandomIds.get(l.fandomSlug), position: l.position }));
for (let i = 0; i < linkRows.length; i += 100) {
  const { error } = await db.from('member_fandoms').insert(linkRows.slice(i, i + 100));
  if (error) fail('could not write "member_fandoms"', error);
}

// Compare with the database.
async function countOf(table) {
  const { count, error } = await db.from(table).select('*', { count: 'exact', head: true });
  if (error) fail(`could not count "${table}"`, error);
  return count;
}
const rows = [
  ['members', members.length, await countOf('members')],
  ['fandoms', fandoms.length, await countOf('fandoms')],
  ['member_fandoms', links.length, await countOf('member_fandoms')],
  ['gallery', gallery.length, await countOf('gallery')],
  ['news', news.length, await countOf('news')],
];

printReport();
console.log(`\nDone${ONLY_NEW ? ' (only new rows were added)' : ''}. Files vs database:`);
for (const [name, inFiles, inDb] of rows) console.log(`  ${name.padEnd(15)} files: ${String(inFiles).padStart(3)}   database: ${String(inDb).padStart(3)}   ${inFiles === inDb ? 'same' : 'DIFFERENT'}`);

// Rows in the database that are not in the files (for example made in a dashboard, or left over from an edited file).
const extra = [
  ['members', before.members, new Set(members.map((m) => m.slug))],
  ['fandoms', before.fandoms, fandomsBySlug],
  ['gallery', before.gallery, new Set(gallery.map((g) => g.slug))],
  ['news', before.news, new Set(news.map((n) => n.import_key))],
]
  .map(([name, had, now]) => [name, [...had].filter((k) => !now.has(k))])
  .filter(([, list]) => list.length);
if (extra.length) {
  console.log('\nIn the database before this run but not in the files (left untouched):');
  extra.forEach(([name, list]) => console.log(`  ${name}: ${list.join(', ')}`));
}