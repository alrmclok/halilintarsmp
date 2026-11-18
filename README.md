# HalilintarSMP website

The website for the HalilintarSMP community. Built with Astro and hosted on Vercel.
Full plan: `halilintarsmp-main.md`. Progress: `halilintarsmp-roadmap.md`.

## Run it on your computer

You need Node.js (version 18.20 or newer). Node.js is the tool that runs the site's build steps.

1. Open a terminal in this folder.
2. Run `npm install` (downloads what the site needs, only the first time).
3. Run `npm run dev`.
4. Open the address it prints (usually http://localhost:4321). It updates by itself when you save a file.

## How a change goes live

1. Edit or add a file.
2. Push it to GitHub (on github.com, saving a file is called a "commit").
3. Vercel sees the push and rebuilds the site by itself, in about a minute.

## Where things are

- `src/pages/` the pages
- `src/layouts/` the shared frame (header, tabs, footer)
- `src/components/` reusable pieces, like the Box
- `src/content/members/` one data file per member
- `public/` files served exactly as they are (shared style, custom member pages)
- `templates/custom-member/` a starter folder to copy for a custom member page
