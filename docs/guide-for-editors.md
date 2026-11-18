# Guide for editing the HalilintarSMP site

Last updated: 2026-11-19

## The idea in one minute

- The site is made of files. Change a file, and the site changes.
- The files live on **GitHub**, a website that stores the project and keeps every old version of every file.
- **Vercel** (the host) sees a change and rebuilds the site by itself. It takes about a minute.
- You do not need to install anything. A browser is enough.

Two words you will see: the **project** (also called a "repository" or "repo") is the folder of all the files, online. A **commit** is saving a change on GitHub, with a short note about what you did.

## 1. Get the invite

1. Make a free GitHub account at github.com if you do not have one. Tell Almira your GitHub username.
2. Almira invites you. GitHub sends you an email. Open it, click "View invitation", then accept.
3. Open the HalilintarSMP project from the link in the email, or from your GitHub home page.

You will see these folders: `docs`, `src`, `public` and `templates`. Section 4 says what is where.

## 2. Edit a file

1. Click through the folders until you reach the file.
2. Click the pencil icon ("Edit this file") at the top right of the file.
3. Change the text.
4. Click the green "Commit changes" button. Write a short note, like "add a member file". Keep "Commit directly to the main branch" selected (the main branch is the version that is live). Click "Commit changes" again.
5. Wait about a minute, then reload the site. If you do not see the change, reload without the saved copy (Ctrl + F5, or hold Shift and reload).

## 3. Add a new file or a picture

- In the folder, click "Add file" (top right).
  - "Create new file" is for text. Type the file name at the top.
  - "Upload files" is for pictures. Drag them in.
- Then commit, like in section 2.
- Pictures must be small: about 1200 px wide at most and under 300 KB. Name them in lowercase with no spaces, like `my-picture.png`.

## 4. Where things are

| What | Where |
|---|---|
| Members (one file each) | `src/content/members/` |
| A member's own custom page | `public/members/their-name/` |
| The gallery list | `src/content/gallery.json` |
| Gallery pictures | `public/gallery/` |
| Fandom pictures | `public/fandoms/` |
| News | `src/content/news.json` |
| Starter folder for a custom page | `templates/custom-member/` |
| Notes for members about custom pages | `templates/README.md` |
| The full details of everything | `docs/halilintarsmp-main.md` |

The site's code is in files ending in `.astro`, `.js` or `.ts`, and in `public/style.css`. Please ask Almira before you edit those. One small mistake there can stop the site from building.

## 5. Add a member

Make a new file in `src/content/members/`. The file name is the member's address: `sample-member.json` becomes `/members/sample-member/`.

```json
{
  "name": "Sample Member",
  "handle": "sample_handle",
  "pronouns": "they/them",
  "fandoms": ["Fandom A", "Fandom B"],
  "joined": "2026-11-19",
  "intro": "One short line about them."
}
```

- Needed: `name`, `handle`, `fandoms`, `joined`, `intro`.
- Optional: `pronouns`, `picture`, `custom`, `featured`, `edited`, `sections`. The full list is in the main document, under "The member data file".
- Where member pictures go is not decided yet. For now, send the picture to Almira.

This file style is called **JSON**. A few rules keep it working:

- Text goes in "double quotes".
- Lines are separated by commas, but there is no comma after the last line.
- A list goes in `[ ]`, like the fandoms.
- Dates are written year-month-day.

If a file has a mistake, the build may fail. When that happens the old version of the site stays live, so nobody sees a broken site. Fix the file and commit again.

## 6. Give a fandom a picture

1. Upload the picture to `public/fandoms/`.
2. Name it after the fandom. `fandom-a.png` and `Fandom A.jpg` both work for "Fandom A". Capitals, spaces and symbols do not matter.
3. Use one picture per fandom. A fandom with no picture shows a gray square.

Nothing has to be written in a data file.

## 7. Add a gallery picture

1. Upload the picture to `public/gallery/`.
2. Open `src/content/gallery.json`. It is a list inside `[ ]`. Add a new entry inside it, and put a comma after the new `{ }` if another entry follows:

```json
{
  "title": "Sunset at spawn",
  "description": "Say hi to @sample_handle!",
  "credit": "Sample Member",
  "file": "/gallery/sunset-at-spawn.png",
  "alt": "A sunset behind the spawn tower",
  "added": "2026-11-19"
}
```

- `@sample_handle` becomes a link to that member, only if a member has that handle.
- The `credit` links to a member when the name matches.
- The title makes the picture's page address. If you change the title later, the address changes.
- `alt` is a few words about what the picture shows, for people who use screen readers.

## 8. Add news

Open `src/content/news.json`. Copy an existing item and change its words. Put the newest item on top. The home page shows the first three.

## 9. Custom member pages

A member can build their own page with plain HTML, CSS and JS, in their own folder. The steps are in `templates/README.md`. The page also needs `"custom": true` in the member's file. The rules:

- A custom page only changes files inside its own folder.
- One of the three of you (Almira, Katz, Kate) looks at it before it goes live, because its script runs on the site. Open `script.js` and read it. If a line is unclear, ask Almira.
- Keep pictures small.
- The page links back to `/members/`.

## 10. If something breaks

- If the site looks wrong after a change, it was most likely the last change. GitHub keeps every old version.
- Open the file and click "History". Click the change you made. Red lines are what was removed and green lines are what was added.
- Copy the red text. Go back to the file, click the pencil, put the old text back and commit.
- If you are stuck, tell Almira. Do not delete files you did not make.
