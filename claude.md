# CLAUDE.md — Boracay SBKZ World Fiesta

This file is project context for Claude Code. Read this before doing any work in this repo.

## What this project is

Marketing + registration site for **Boracay SBKZ World Fiesta 3**, a salsa/bachata/kizomba/zouk destination dance festival. Main event dates: **May 7–9, 2027**, full run May 5–10, at **Boracay Ocean Club Resort & Spa**, Station 3, Boracay Island, Philippines.

Currently a preview build lives at `jdmikaelang.github.io/boracay/`. This repo is being cleaned up and relaunched on GitHub Pages under the owner's own domain.

## Tech stack (do not change without asking)

- Plain HTML5, one file per page — **no framework, no build step, no bundler**.
- Styling: **Tailwind CSS via CDN** (`cdn.tailwindcss.com`), configured inline in a `<script>` block per page.
- Fonts: Google Fonts — **Playfair Display** (serif, headings/display) + **Inter** (sans, body).
- Icons: **Phosphor Icons** via `unpkg.com/@phosphor-icons/web`.
- No package.json, no npm dependencies, no server-side code except the Google Apps Script backend for the registration form (Phase 3 of `plan.md`).
- Deployment target: **GitHub Pages**, custom domain via `CNAME` file.

Keep it this way. Don't introduce React, Vite, npm, or a CSS build pipeline unless explicitly asked — the whole point of this stack is that it deploys with zero build step.

## Brand tokens

```
brand-dark:      #121C1F   (page background)
brand-card:      #1A2A2E
brand-cardhover: #22363B
brand-gold:      #E5B96D   (primary accent / CTA color)
brand-goldhover: #D4A355
brand-light:     #F8FAFC
brand-muted:     #94A3B8
```

Font families are registered in Tailwind config as `font-sans` (Inter) and `font-serif` (Playfair Display). Headlines use serif; body copy and UI use sans.

## File structure (target, post-cleanup)

```
/
├── index.html
├── fiesta.html
├── passes.html
├── venue.html
├── (gallery.html — decide: link it or archive it, see plan.md Phase 1)
├── CNAME
├── images/
│   ├── logo.png
│   ├── main-artists/
│   ├── featured-artists-and-performers/
│   ├── dj/
│   └── ... (all other site images)
└── docs/          (repo-only, not deployed — planning docs, comments.pdf, etc.)
```

All filenames: lowercase, kebab-case, no spaces, no `&`. See `buildspec.md` for the full naming rule.

## Known issues in the current export (already tracked, don't rediscover these)

- Duplicate image folders exist at both project root and inside `images/` — root-level copies are dupes and should be deleted, not merged.
- File/folder names contain spaces and `&` characters (`DJ K-bunny.png`, `Adrian & Carol.png`) — needs renaming project-wide, including every `<img src>` reference.
- `image8.jfif` sits orphaned at project root with an unclear purpose — identify and either relocate or delete.
- `comments.pdf` (the raw client feedback) is currently sitting in the deployed folder — must not ship to production.
- `gallery.html` exists but is not linked from the nav on any page.
- CTA button copy is inconsistent across pages ("BOOK PASSES" / "Book a Pass" / etc.) — must be standardized to **"BOOK FESTIVAL PASSES"** everywhere.

## The source of truth for content fixes

`plan.md` Phase 2 contains the full, page-by-page checklist derived from the client's raw feedback (`comments.pdf`). Treat every line item there as a requirement, not a suggestion — the brief was "address every single problem," so partial fixes aren't acceptable.

## Forms / backend

The Passes page registration form has no real backend yet. It needs to submit to a Google Sheet (via a Google Apps Script Web App) and route the uploaded proof-of-payment file to a Google Drive folder. See `buildspec.md` → Forms & Backend, and `plan.md` Phase 3. This is the one part of the project that requires the site owner to click through Google's own consent/deploy screens — no amount of automation removes that step.

## Deployment

GitHub Pages, custom domain via `CNAME` file at repo root. DNS is managed by the site owner outside of this repo — Claude Code should never assume DNS is already pointed correctly; always ask before treating the custom domain as live.

## Working conventions for this repo

- Every HTML file should stay self-contained (Tailwind config + custom `<style>` block inline) — this project intentionally avoids a shared external stylesheet build step, so keep any shared CSS in a single small `assets/site.css` file at most if truly needed, not a build pipeline.
- Don't add new npm dependencies or `package.json` — there's no reason to introduce Node tooling into a static Tailwind-CDN site.
- Commit messages should be plain-English and describe the actual content/visual fix (e.g. `fix: standardize CTA copy to "BOOK FESTIVAL PASSES" across all pages`), not generic messages like `update files`.
