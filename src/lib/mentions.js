// Turns member names inside gallery text into links, but only when a real member is found.
// So a name that no longer matches anyone (a member changed their handle) just stays plain text, and no link leads to a 404.
// Every function returns "parts": a list of { text } or { text, href }, which components/Parts.astro shows.
// Members need a `slug` (their file name), as the pages add it.

const norm = (s) => s.trim().toLowerCase();
const PUNCT_END = /[.,;:!?)\]}'"”’]+$/;

// Two lookups, built once per page: by handle and by name (capitals do not matter; the first member found wins).
export function buildLookup(members) {
  const byHandle = new Map();
  const byName = new Map();
  for (const m of [...members].sort((a, b) => a.slug.localeCompare(b.slug))) {
    if (m.handle && !byHandle.has(norm(m.handle))) byHandle.set(norm(m.handle), m.slug);
    if (m.name && !byName.has(norm(m.name))) byName.set(norm(m.name), m.slug);
  }
  return { byHandle, byName };
}

const href = (slug) => `/members/${slug}/`;

// Description text: a word that starts with @ becomes a link when it matches a member's handle.
// "@member_one!" links "@member_one" and leaves the "!" as plain text.
export function linkMentions(text, lookup) {
  const parts = [];
  let last = 0;
  for (const match of text.matchAll(/(^|\s)@([^\s@]+)/g)) {
    const raw = match[2];
    let handle = raw;
    let slug = lookup.byHandle.get(norm(handle));
    if (!slug) {
      handle = raw.replace(PUNCT_END, '');
      slug = handle ? lookup.byHandle.get(norm(handle)) : undefined;
    }
    if (!slug) continue; // no member with that handle: stays plain text
    const start = match.index + match[1].length;
    if (start > last) parts.push({ text: text.slice(last, start) });
    parts.push({ text: `@${handle}`, href: href(slug) });
    last = start + 1 + handle.length;
  }
  if (last < text.length) parts.push({ text: text.slice(last) });
  return parts;
}

// Credit: "by Name". The name becomes a link when it matches a member's name, or their handle (with or without @).
export function linkCredit(credit, lookup) {
  const slug = lookup.byName.get(norm(credit)) ?? lookup.byHandle.get(norm(credit.replace(/^@/, '')));
  return [{ text: 'by ' }, slug ? { text: credit, href: href(slug) } : { text: credit }];
}
