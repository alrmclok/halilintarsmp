// Moves the old pictures from public/ into Supabase Storage (Part R). Run it once.
//   npm run db:move-pictures:dry   shows what would move, changes nothing
//   npm run db:move-pictures       uploads the files to the "pictures" bucket and points the rows at the new addresses
// Safe to run again: a picture already in Storage with the right name is skipped; one with a different name is renamed in place
// (so after a naming change, just run it again: no need to empty the bucket). A file with the same name is replaced.
// Names follow the dashboard rule: members/<slug>-photo-profile.<ext>, fandoms/<slug>.<ext>, gallery/<slug>-<timestamp>.<ext>.
// It never deletes anything. After you check the site, delete the old files in public/ yourself.
// Run supabase/schema.sql first: it makes the bucket.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DRY = process.argv.includes('--dry-run');
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BUCKET = 'pictures';
const PREFIX = '/storage/v1/object/public/pictures/';
const TS = new Date().toISOString().replace(/\D/g, '').slice(0, 14); // yyyymmddhhmmss, for the gallery names
const TYPES = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif' };
const TARGETS = [
  { table: 'members', col: 'picture', name: (slug, ext) => `members/${slug}-photo-profile${ext}` },
  { table: 'fandoms', col: 'picture', name: (slug, ext) => `fandoms/${slug}${ext}` },
  { table: 'gallery', col: 'file', name: (slug, ext) => `gallery/${slug}-${TS}${ext}` },
];

const url = process.env.PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY;
if (!url || !secret) {
  console.error('PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env. Use "npm run db:move-pictures", not "node scripts/move-pictures.mjs".');
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

let moved = 0, skipped = 0, problems = 0;
for (const t of TARGETS) {
  const { data, error } = await db.from(t.table).select(`id, slug, ${t.col}`);
  if (error) { console.error(`${t.table}: ${error.message}`); problems++; continue; }
  for (const row of data ?? []) {
    const value = String(row[t.col] ?? '');
    const at = value.indexOf(PREFIX);
    if (at >= 0) {
      // Already in Storage: only rename the file when its name does not follow the rule.
      const oldKey = decodeURIComponent(value.slice(at + PREFIX.length).split('?')[0]);
      const want = t.name(row.slug, path.extname(oldKey).toLowerCase());
      const fine = t.table === 'gallery' ? /^gallery\/[a-z0-9-]+-\d{14}\.\w+$/.test(oldKey) : oldKey === want;
      if (fine) { skipped++; continue; }
      if (DRY) { console.log(`would rename ${oldKey} -> ${want}`); moved++; continue; }
      const mv = await db.storage.from(BUCKET).move(oldKey, want);
      if (mv.error) { console.warn(`${t.table}/${row.slug}: rename failed: ${mv.error.message}`); problems++; continue; }
      const upd2 = await db.from(t.table).update({ [t.col]: `${db.storage.from(BUCKET).getPublicUrl(want).data.publicUrl}?v=${Date.now()}` }).eq('id', row.id);
      if (upd2.error) { console.warn(`${t.table}/${row.slug}: ${upd2.error.message}`); problems++; continue; }
      console.log(`renamed ${t.table}/${row.slug}: ${oldKey} -> ${want}`);
      moved++;
      continue;
    }
    if (!value.startsWith('/')) { skipped++; continue; } // empty, or an address from somewhere else
    const ext = path.extname(value).toLowerCase();
    const local = path.join(ROOT, 'public', decodeURI(value));
    if (!TYPES[ext] || !fs.existsSync(local)) {
      console.warn(`${t.table}/${row.slug}: no usable file at public${value}, left as it is.`);
      problems++;
      continue;
    }
    const key = t.name(row.slug, ext === '.jpeg' ? '.jpg' : ext); // the same naming rule as the dashboard upload
    if (DRY) { console.log(`would move public${value} -> ${BUCKET}/${key}`); moved++; continue; }
    const up = await db.storage.from(BUCKET).upload(key, fs.readFileSync(local), { contentType: TYPES[ext], upsert: true, cacheControl: '31536000' });
    if (up.error) {
      const hint = /bucket not found/i.test(up.error.message) ? ' (run supabase/schema.sql first)' : '';
      console.warn(`${t.table}/${row.slug}: upload failed: ${up.error.message}${hint}`);
      problems++;
      continue;
    }
    const addr = `${db.storage.from(BUCKET).getPublicUrl(key).data.publicUrl}?v=${Date.now()}`;
    const upd = await db.from(t.table).update({ [t.col]: addr }).eq('id', row.id);
    if (upd.error) { console.warn(`${t.table}/${row.slug}: ${upd.error.message}`); problems++; continue; }
    console.log(`moved ${t.table}/${row.slug}: ${value} -> ${key}`);
    moved++;
  }
}

if (moved && !DRY) {
  const { data } = await db.from('publish_state').select('pending_changes').eq('id', 1).maybeSingle();
  await db.from('publish_state').update({ pending_changes: (data?.pending_changes ?? 0) + 1 }).eq('id', 1);
}
console.log(`\n${DRY ? 'Would move' : 'Moved'}: ${moved}. Skipped (empty, already correctly named, or an outside address): ${skipped}. Problems: ${problems}.`);
if (moved && !DRY) console.log('Press Publish on the dashboard so the site shows the new addresses. Delete the old files in public/ only after you check the site.');
process.exit(problems ? 1 : 0);
