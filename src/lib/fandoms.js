// Builds the list of fandoms from the members (read from the database), so the home page, the Fandoms list and the fandom pages all agree.
// Two spellings count as the same fandom when they make the same address piece ("Fandom A" = "fandom  a" = "FANDOM-A").
// The name shown is the first spelling found. Members are read in file-name order, so the shown name stays the same.
// Each member needs a `slug`, as the pages add it.
// A fandom's picture comes from the `fandoms` table. Until Part R, a fandom with no picture there falls back to public/fandoms/.
import fs from 'node:fs';
import path from 'node:path';
import { toSlug } from './slug.js';
import { getFandomRows } from './db.js';

const FANDOMS_DIR = path.join(process.cwd(), 'public', 'fandoms');

function getFandomImages() {
  const map = new Map();
  if (!fs.existsSync(FANDOMS_DIR)) return map;

  for (const file of fs.readdirSync(FANDOMS_DIR)) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    if (ext && base) {
      map.set(toSlug(base), `/fandoms/${file}`);
    }
  }
  return map;
}

export async function getFandoms(members) {
  const byKey = new Map();
  const images = getFandomImages();
  const rows = await getFandomRows();
  const ordered = [...members].sort((a, b) => a.slug.localeCompare(b.slug));

  for (const m of ordered) {
    for (const raw of m.fandoms) {
      const name = raw.trim().replace(/\s+/g, ' ');
      const slug = toSlug(name);
      if (!slug) {
        console.warn(`Fandom "${raw}" (member ${m.slug}) has no letters or numbers, so it is skipped.`);
        continue;
      }
      if (!byKey.has(slug)) {
        const row = rows.get(slug);
        byKey.set(slug, {
          name: row?.name ?? name,
          slug,
          pic: row?.picture || images.get(slug),
          description: row?.description,
          members: [],
        });
      }
      const f = byKey.get(slug);
      if (!f.members.some((x) => x.slug === m.slug)) f.members.push(m);
    }
  }

  return [...byKey.values()]
    .map((f) => ({ ...f, members: f.members.sort((a, b) => a.name.localeCompare(b.name)), count: f.members.length }))
    .sort((a, b) => a.name.localeCompare(b.name));
}