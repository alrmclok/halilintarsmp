// Reads the gallery list from the database and tidies it, so the home page and the Gallery pages agree.
// Newest first (`added`); pictures added on the same day keep their old file order (`position`).
// A missing field gets a safe default, so one forgotten value does not show "undefined".
// The address piece (slug) is stored in the database: it was made from the title once, at import, so no address changed.
import { getGalleryRows } from './db.js';

export async function getGallery() {
  const rows = await getGalleryRows();
  return rows
    .map((g) => ({
      slug: g.slug,
      title: g.title ?? 'Untitled',
      description: g.description ?? '',
      credit: g.credit ?? 'Unknown',
      file: g.file ?? '', // path to the picture, e.g. "/gallery/my-picture.png". Empty = gray box
      alt: g.alt || g.title || '', // what the picture shows, for screen readers
      added: g.added ?? '',
      position: g.position ?? 0,
    }))
    .sort((a, b) => b.added.localeCompare(a.added) || a.position - b.position);
}