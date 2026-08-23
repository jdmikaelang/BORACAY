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

## Status

Phases 1 (folder/naming cleanup), 2 (Home, Fiesta, Passes content fixes), and 5 (global consistency pass + footer legal pages) are done. Forms/backend (Phase 3) and GitHub Pages deployment (Phase 4, confusingly numbered ahead of the forms work in `prompts.md`) are not yet done.

## Remaining known issues (don't rediscover these — just fix them)

- `gallery.html` exists and **is** currently linked in the footer's Explore section on every page — confirmed in the nav grep, so no decision needed here anymore (superseded note from earlier: this used to be an orphan page). It's still intentionally excluded from the main top nav per the original brief.

## Resolved (for history — no action needed)

- OS junk (`.DS_Store`, `__MACOSX/`) removed.
- Duplicate root-level image folders (`DJ/`, `Main Artists/`, `Featured Artists and Performers/`) removed; `images/` is the single source of truth.
- All filenames renamed to kebab-case, no spaces/`&`.
- `image8.jfif` converted to `images/image8.jpg`.
- `comments.pdf` relocated into `docs/`.
- Logo image now used top-left on every page (was text on `passes.html`, `venue.html`, `gallery.html`); "Boracay Ocean Club Resort & Spa" verbatim everywhere; every CTA (including pricing-card and sticky mobile buttons) reads "BOOK FESTIVAL PASSES".
- `terms-and-conditions.html`, `festival-pass-policy.html`, `privacy-policy.html` built from the real `.docx` copy (see `docs/`), linked only from the footer's Legal column.

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
