// Turns a name into a web address piece: "Fandom A" becomes "fandom-a".
// Capitals, spaces and symbols do not matter, and accents are dropped ("Pokémon" becomes "pokemon").
// Used by the home page, the member page and the fandom pages, so every link matches.
export const toSlug = (s) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
