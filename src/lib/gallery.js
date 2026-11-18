// Reads the gallery list and tidies it, so the home page and the Gallery pages agree.
// Newest first. A missing field gets a safe default, so one forgotten line does not show "undefined".
// Each picture gets an address piece (slug) made from its title, like a member's page: "Gallery picture one" -> "gallery-picture-one".
// Two pictures with the same title get -2, -3 and so on. Changing a title changes the address of that picture's page.
import gallery from '../content/gallery.json';
import { toSlug } from './slug.js';

export function getGallery() {
  const seen = new Map();
  return gallery
    .map((g, i) => {
      const base = toSlug(g.title ?? '') || `picture-${i + 1}`;
      const n = (seen.get(base) ?? 0) + 1;
      seen.set(base, n);
      return {
        slug: n === 1 ? base : `${base}-${n}`,
        title: g.title ?? 'Untitled',
        description: g.description ?? '',
        credit: g.credit ?? 'Unknown',
        file: g.file ?? '', // path to the picture, e.g. "/gallery/my-picture.png". Empty = gray box
        alt: g.alt || g.title || '', // what the picture shows, for screen readers
        added: g.added ?? '',
      };
    })
    .sort((a, b) => b.added.localeCompare(a.added));
}
