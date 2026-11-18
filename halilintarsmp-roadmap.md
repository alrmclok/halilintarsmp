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

Status: Not started

Goal: the home page with placeholder content.

- [ ] Hero box: a gray placeholder for the title picture, four placeholder facts with round bullets, and the big button ("Join the SMP" in white, "Ask an admin" in orange).
- [ ] Row one: Gallery highlights (wide) and Featured member (narrow).
- [ ] Row two: Fandoms, Members list and News (three equal boxes).
- [ ] Fill every box with placeholder rows built from data files, not typed into the page.
- [ ] A small news data file for the News box.

Notes:

---

## Part D: Members

Status: Not started

Goal: the Members list and the default member page.

- [ ] Member data files, one per member, with: name, handle, picture, fandoms, joined date, a one-line intro and a `custom` flag.
- [ ] A few placeholder members to test with.
- [ ] Members list page.
- [ ] Default member page `members/[slug].astro` in the article style: title, one-line intro, infobox on the right, sections, categories line at the bottom, "Last edited" line (Part 2 section 7).
- [ ] Skip members with `custom: true` so their folder is used instead.
- [ ] Home page boxes (Featured member, Members list) read from the same data.

Notes:

---

## Part E: Fandoms

Status: Not started

Goal: the Fandoms list and one category page per fandom, made from member data.

- [ ] Fandoms list page.
- [ ] A page for each fandom that lists its members.
- [ ] The categories line on member pages links to these pages.
- [ ] Home page Fandoms box reads from the same data.

Notes:

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

Status: Not started

Goal: the site works well on a phone.

- [ ] Boxes stack in one column.
- [ ] The tab bar scrolls sideways.
- [ ] The header drawing becomes small or goes away.
- [ ] Two or three ink splatters at most.
- [ ] Buttons and links are at least 44 px tall. Text is at least 14 px.
- [ ] Test on a real phone.
- [ ] Each page has its own title and link-preview tags.

Notes:

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
- Search, later: the plan mentions searching in "posts", but there is no Posts page. What are posts: the News items? (Part for search, not yet planned)
- The drawn logo, header figure, hero title picture, ink splatters and stripe strip. Placeholders until drawn.

## Progress log

One line per finished part: date, part, what was done.

- 2026-11-18, Part A: Astro project made, put on GitHub, live on Vercel with a test page. README written.
- 2026-11-18, Part B: colors, frame (header, tabs, maroon bar, footer) and Box built. Search is a stub.
