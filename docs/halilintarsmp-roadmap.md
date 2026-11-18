# HalilintarSMP: roadmap

Last updated: 2026-11-18

This file is written for the AI that helps Almira build the site. It lists the work in ordered parts (A, B, C and so on). Each part is small enough to finish in one chat, and the next part is started in another chat. The context for everything is in `halilintarsmp-main.md`. This file only tracks progress.

## Rules for the AI

1. Almira sends both files at the start of every chat: the main document and this roadmap.
2. Read the main document first, then find the first part here that is not Done. Work only on that part.
3. Before starting a part, say in a few plain words what it will do. Then do it.
4. When the part is finished and nothing in the plan changed: update only this file. Set the status to Done, tick the checklist, and write short notes under "Notes".
5. When something in the real app changes what the main document says (a file or folder name, a decision, a color or size, a rule): update the main document too, so it matches the real site.
6. At the end of the chat, hand back the updated files.
7. Write plainly. Almira is learning, so explain new words in a short line. Write any mentioned person with they/them.
8. Do not add pages, features or boxes that are not in the main document. If an idea comes up, write it under "Open decisions" and ask.

Status words: **Not started**, **In progress**, **Done**.

---

## Part A: Project setup

Status: Done

Goal: an empty Astro site that is on GitHub and live on Vercel.

- [x] Create the Astro project with the folder layout from the main document (Part 1, "Folder layout").
- [x] Put it in the GitHub project.
- [x] Connect the GitHub project to Vercel, so a push rebuilds the site.
- [x] Check that a one-line test page shows on the Vercel address.
- [x] Write a short `README.md` that says how to run the site on a computer and how a change goes live.
- [ ] When Alvira and Kate say yes, invite them to the GitHub project.

Notes:

- The project is made and builds without errors on the AI's side (Astro 5.14.1). It has the folder layout, a one-line test page (`src/pages/index.astro`), the starter folder `templates/custom-member/` and the README.
- Almira did the GitHub and Vercel steps by hand and checked that the test page shows on the Vercel address.
- The invite for Alvira and Kate is still open. It waits until they say yes. It does not block any other part.
- Empty folders hold a `.gitkeep` file, because Git does not keep empty folders. Delete the `.gitkeep` once a folder has real files.

## Part B: Look base

Status: Done

Goal: the colors, the layout frame and the Box, so every later page is built from them.

- [x] Write `public/style.css`: the colors from Part 2 section 3 as variables, the font stack, the square flat look, the dotted row lines.
- [x] Build `Base.astro`: header band, yellow tab bar, maroon second bar, footer (Part 2 section 4).
- [x] Tabs: Home, Members, Fandoms, Gallery, About. Credits in the footer.
- [x] Build `Box.astro`: maroon title bar, yellow "More" link with the orange arrow, light body, rows with a small square picture (Part 2 section 5).
- [x] Use the placeholder logo `halilintarsmp-logo.png` in the header, the tab icon and the link preview.
- [x] Header figure: a plain empty labeled box.
- [x] Black corner box: Discord and WhatsApp links, with placeholder addresses.
- [x] Check text sizes and contrast against Part 2.

Notes:

- Files made: `public/style.css`, `src/layouts/Base.astro`, `src/components/Box.astro`, `public/halilintarsmp-logo.png` (a plain placeholder), and a test home page with one Box.
- `Base.astro` loads the style with a normal link to `/style.css`, so custom member pages can link to the same file later.
- Second bar links (Almira picked the suggested ones): Join, Rules, Server address, News. They point to `#` for now, because there is no Rules or Server address page yet.
- Search box is a stub: it shows, but does nothing. Almira's plan for it later is in the main document.
- Tab links go to `/members/`, `/fandoms/`, `/gallery/` and `/about/`. They show a "not found" page until Parts D to G make them.
- Splatters and the stripe strip are not in yet. They wait for the drawn pictures.
- Link previews: the preview picture needs the full web address, so it is set properly in Part I.

---

## Part C: Home page

Status: Done

Goal: the home page with placeholder content.

- [x] Hero box: a gray placeholder for the title picture, four placeholder facts with round bullets, and the big button ("Join the SMP" in white, "Ask an admin" in orange).
- [x] Row one: Gallery highlights (wide) and Featured member (narrow).
- [x] Row two: Fandoms, Members list and News (three equal boxes).
- [x] Fill every box with placeholder rows built from data files, not typed into the page.
- [x] A small news data file for the News box.

Notes:

- Home page is `src/pages/index.astro`. Every box reads from data files: members in `src/content/members/` (one JSON file each), gallery in `src/content/gallery.json`, news in `src/content/news.json`. The Fandoms box is made from the fandoms listed in the members' files.
- New small helper `src/components/Row.astro` (one row: square picture, bold title, smaller line), so every box builds its rows the same way. New `src/content.config.ts` tells Astro what a member file must contain, and warns if one is wrong. Part D can use both.
- The featured member is simply the first member for now. How it is picked is decided in Part D.
- Gallery highlights shows the three newest pictures, using an `added` date in the gallery file.
- The "News" link in the maroon bar now jumps to the News box on the home page. "More news" points to `#` because there is no news page.
- All words and members here are placeholders. Boxes fill with real text later.
- The grid stacks on phones in Part I, not here.

---

## Part CA: Look rework to match the screenshot

Status: Done

Goal: make the look much closer to the Winamp screenshot (shapes, spacing, fonts, hero).

- [x] Colors compared with the screenshot. The content background is now `#d0ccbf` (measured).
- [x] The top block (logo, tabs, maroon bar) and the content are two separate blocks, with a strip of page color between them.
- [x] Active tab: slanted left edge, sticks up above the bar. Yellow bar end slanted. Black corner box starts higher and has one rounded corner.
- [x] Fonts: Verdana for text, Trebuchet MS bold for the bars, box titles and "More" links.
- [x] Spacing and sizes closer to the screenshot: 6 px gaps, picture 76 x 58 px, "More" arrow points up and right.
- [x] Hero is one full picture. The facts and the button sit on top of it. Placeholder `public/hero-title.png`.

Notes:

- Almira draws the hero picture and saves it over `public/hero-title.png` (1520 x 660 px). Leave room at the bottom left (facts) and bottom right (button).
- Not done yet: ink splatters, stripe strip, small pictures in the title bars. They wait for the drawn pictures.
- Phones are still Part I. The tab bar and the hero text will need that part.
- Not seen on a real screen yet by the AI. Almira checks it on Vercel.

---

## Part D: Members

Status: Done

Goal: the Members list and the default member page.

- [x] Member data files, one per member, with: name, handle, picture, fandoms, joined date, a one-line intro and a `custom` flag.
- [x] A few placeholder members to test with.
- [x] Members list page.
- [x] Default member page `members/[slug].astro` in the article style: title, one-line intro, infobox on the right, sections, categories line at the bottom, "Last edited" line (Part 2 section 7).
- [x] Skip members with `custom: true` so their folder is used instead.
- [x] Home page boxes (Featured member, Members list) read from the same data.

Notes:

- New files: `src/pages/members/index.astro` (list, A to Z), `src/pages/members/[slug].astro` (default page), `src/lib/slug.js` (one shared `toSlug`, so every link matches; the home page now uses it too). Two new placeholder members: `member-two.json`, `member-three.json`.
- Three optional fields were added to the member data file, so the article has something to show: `sections`, `edited` and `featured`. They are in `src/content.config.ts` and listed in the main document ("The member data file").
- Featured member: a member with `"featured": true` is shown. If nobody has it, the first member is shown. Almira can change this rule. (Placeholder: Member Two has the flag, to test it.)
- Home page Members box now shows the newest six by `joined` date, newest first.
- A member with `custom: true` gets no default page (tested). The Members list still links to `/members/name/`.
- Fandom links on member pages (`/fandoms/fandom-a/`) show "not found" until Part E.
- Not done: the contents box (the main document says "if the page is long"). Add it when a member page really gets long.
- Built and tested with a real Astro build (5.14.1) on the AI's side. Not seen on a real screen. Almira checks it on Vercel.
- The infobox floats right at 220 px. On phones it still needs the stack rule in Part I.

---

## Part DA: Look check, round 2, and phones

Status: Done

Goal: match the Winamp screenshot more closely (spacing, sizes, hero) and make the site work on a phone.

- [x] Measured the screenshot. Content edge to box edge is 7 px, gap between boxes 7 px sideways and 10 px between rows, title bar 23 px, sub bar 25 px, rows 6 px from the box edge. The CSS now uses these.
- [x] Boxes are wider inside: less padding in the box body, hero flush with the content block (it is shown at its real 760 px).
- [x] Row one is 1.45 to 1 (it was 2 to 1), so "Featured member" and "More members" fit on one line.
- [x] The big hero button is tilted, and a placeholder "Hero figure" box stands behind its top edge.
- [x] Phone layout (see Part I, most of its list is done here).

Notes:

- Bug fixed: the hero button text used the class names `top` and `bottom`, and `.top` is also the header block, so the button was about 66 px too tall. They are now `btn-top` and `btn-bottom`.
- Bug fixed from Part D: the infobox title on member pages was maroon on maroon. Section headings on the article are now `.article > section > h2` only.
- The hero figure is a placeholder box (`.hero-figure`). Remove it when the figure is drawn into `hero-title.png` or a real picture is added.
- Tested in a real browser engine on the AI's side at 830 px and at 375 px wide (no sideways scroll). The logo and hero pictures used there were gray placeholders. Almira still checks on a real phone and with the real logo, because the logo width decides if it fits next to the corner box.
- Not done: ink splatters, stripe strip, small pictures in the title bars (they wait for the drawn pictures), and the extra space at the bottom of the content block that the screenshot has for the splatter.

---

## Part E: Fandoms

Status: Done

Goal: the Fandoms list and one category page per fandom, made from member data.

- [x] Fandoms list page.
- [x] A page for each fandom that lists its members.
- [x] The categories line on member pages links to these pages.
- [x] Home page Fandoms box reads from the same data.

Notes:

- New files: `src/lib/fandoms.js` (one helper that builds the fandom list from the members, used by every fandom page and the home page), `src/pages/fandoms/index.astro` (list, A to Z, with member counts) and `src/pages/fandoms/[slug].astro` (one fandom: a Box with its members as rows, "All fandoms" link in the title bar).
- Changed: `src/lib/slug.js` now drops accents ("Pokémon" becomes `pokemon`). `src/pages/index.astro` now gets its Fandoms box from the helper.
- Decision: two spellings are the same fandom when they make the same address piece, so capitals, extra spaces and symbols do not matter ("Fandom A", "fandom  a" and "FANDOM-A" are one fandom). The name shown is the first spelling found, going through members in file-name order. A fandom name with no letters or numbers is skipped with a warning in the build log.
- The member page "Categories" line and infobox already linked with `toSlug`, so they needed no change. They now work, because the pages exist.
- Members with `custom: true` are still listed in their fandoms, and link to their own folder.
- The Home page Fandoms box shows every fandom. If the list gets long, cut it to the biggest few (like the Members box does with six).
- Not run on the AI's side (no Astro here). Almira checks `/fandoms/` and `/fandoms/fandom-a/` on Vercel and reads the build log for warnings.

---

## Part F: Gallery

Status: Not started

Goal: the gallery as a list with captions.

- [ ] A gallery data file: each picture has a file, a title, a short description and a credit.
- [ ] Gallery page.
- [ ] Gallery highlights box on the home page, newest first.
- [ ] Pictures are small files and have alt text.

Notes:

---

## Part G: About and Credits

Status: Not started

Goal: the last two pages.

- [ ] About page with placeholder text about the SMP.
- [ ] Credits page, linked from the footer.

Notes:

---

## Part H: Custom member pages

Status: Not started

Goal: members can have their own page as a plain folder.

- [ ] Make `templates/custom-member/` with `index.html`, an empty `style.css`, an empty `script.js` and a link back to `/members/`.
- [ ] Make one test custom page in `public/members/` and check it at `/members/member-name/`.
- [ ] Set `custom: true` for that member and check that the default page maker skips them.
- [ ] Check that a custom page can link to `public/style.css` to get the box look.
- [ ] Write the "Rules for custom pages" from the main document into a short `members/README` style note for members.

Notes:

---

## Part I: Phone check and polish

Status: In progress

Goal: the site works well on a phone.

- [x] Boxes stack in one column. (Done in Part DA.)
- [x] The tab bar scrolls sideways. (Done in Part DA.)
- [x] The header drawing becomes small or goes away. (Done in Part DA.)
- [ ] Two or three ink splatters at most. (Waits for the drawn splatters.)
- [x] Buttons and links are at least 44 px tall. Text is at least 14 px. (Done in Part DA; check again as new pages are added.)
- [ ] Test on a real phone.
- [ ] Each page has its own title and link-preview tags. (Titles are done. The preview picture needs the full web address.)

Notes:

- Most of this part was done early in Part DA. What is left needs the drawn pictures or a real phone.
- New pages (Fandoms, Gallery, About, Credits) must be checked on a phone when they are built.

---

## Part J: Guide for the people who edit

Status: Not started

Goal: a short plain guide for Alvira and Kate.

- [ ] How to get the invite and open the project.
- [ ] How to edit a file in the browser on GitHub and save it (a "commit").
- [ ] Where member files, custom pages and gallery files are.
- [ ] The rules for custom pages.
- [ ] What to do if something breaks (GitHub keeps old versions).

Notes:

---

## Open decisions

Ask about these when the part that needs them starts. Do not decide them silently.

- Real facts for the hero list. Placeholders for now. (Part C)
- The orange line on the hero button ("Ask an admin" is a first try). (Part C)
- May custom member pages break the Part 2 style rules, or must they follow them? (Part H)
- The drawn logo, header figure, hero title picture, ink splatters and stripe strip. Placeholders until drawn.

## Progress log

One line per finished part: date, part, what was done.

- 2026-11-18, Part A: Astro project made, put on GitHub, live on Vercel with a test page. README written.
- 2026-11-18, Part B: colors, frame (header, tabs, maroon bar, footer) and Box built. Search is a stub.
- 2026-11-18, Part C: home page built (hero, gallery highlights, featured member, fandoms, members, news) from placeholder data files.
- 2026-11-18, Part CA: look reworked to match the screenshot (separate top block and content, slanted tab, fonts, full hero picture).
- 2026-11-18, Part D: Members list, default member page (article style), three placeholder members, home boxes read from the same data.
- 2026-11-18, Part DA: look check against the screenshot (measured spacing, wider boxes, flush hero, tilted button with a hero figure placeholder), phone layout, two bugs fixed.
- 2026-11-18, Part E: Fandoms list and one page per fandom, built from member data with one shared helper. Same-fandom matching ignores capitals, spaces and symbols.
