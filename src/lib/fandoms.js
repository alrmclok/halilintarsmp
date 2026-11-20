// Builds the list of fandoms from the members (read from the database), so the home page, the Fandoms list and the fandom pages all agree.
// Two spellings count as the same fandom when they make the same address piece ("Fandom A" = "fandom  a" = "FANDOM-A").
// The name shown is the first spelling found. Members are read in file-name order, so the shown name stays the same.
// Each member needs a `slug`, as the pages add it.
// A fandom's picture comes from the `fandoms` table (Supabase Storage since Part R). No picture there = the gray square.
import { toSlug } from './slug.js';
import { getFandomRows } from './db.js';

export async function getFandoms(members) {
  const byKey = new Map();
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
          pic: row?.picture || undefined,
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