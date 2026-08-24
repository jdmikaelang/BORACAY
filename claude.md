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

Phases/Prompts 1–5 are done and confirmed: folder cleanup, Home/Fiesta/Passes content fixes, global consistency pass, and real footer legal pages (converted from the source `.docx` files, which now live in `docs/`) are all committed. Phase 3 (Apps Script backend) is wired up with a real deployed URL in `#registration-form`. **Do not re-open or redo Phases/Prompts 1–5** — new work only, see Phase 6 in `plan.md`.

## Remaining known issues (Phase 6 — don't rediscover these, just fix them)

- **`docs/` and `claude.md` are committed to git without being excluded from deployment.** GitHub Pages publishes everything in the published branch, so `docs/Code.gs` (the backend source, including Sheet/Drive IDs), `docs/plan.md`, `docs/prompts.md`, `docs/buildspec.md`, `docs/SETUP.md`, and `claude.md` would all become publicly browsable once pushed. **Confirmed still true as of the latest zip check — `.gitignore` still only excludes `docs/*.pdf`.** Must be untracked (`git rm -r --cached`) and gitignored immediately — this is Prompt 11, still not done.
- No git remote configured yet, no `CNAME` file — expected, this is Prompts 13–14, not yet run.

## Active project location

**Confirmed final: the `BORACAY` repo (flat structure, full phase-by-phase git history) is the one and only project going forward.** Any earlier nested `boracay-sdk/boracay-final` copy is not in use — disregard it. All prompts and fixes apply to `BORACAY` as-is.

## Urgent, confirmed regression: Prompt 11 has not actually been applied yet

Checked the repo directly: **`.gitignore` only ever excludes `docs/*.pdf`**, never the rest of `docs/` or `claude.md`. `docs/Code.gs` (with the real Drive folder ID), `docs/plan.md`, `docs/prompts.md`, `docs/buildspec.md`, `docs/SETUP.md`, and the `.docx` legal source files are all still tracked. Since the site is confirmed live, this content is very likely already publicly exposed via GitHub Pages right now. This is not hypothetical — fix it immediately (Prompt 11), before anything else.

## Open questions from Prompt 10 QA — need site owner input before proceeding

- **`gallery.html` is a fully orphaned page** — no nav, footer, or CTA on any other page links to it; it only links to itself. `plan.md` Phase 1 said to either wire it into navigation or archive it out of the deployed folder, and neither happened. Waiting on the site owner: should it be linked (and if so, from the main nav or the footer?), or removed from the deployed site?
- **"Christian & Karen" artist entry can't be found anywhere in `fiesta.html`.** The original feedback said to double-check its spelling, but no artist by that name or a close variant currently exists on the page. Unknown whether it was dropped, renamed, or missed during an earlier edit. Waiting on the site owner to confirm with whoever compiled the original comments whether this entry should still exist and under what name.

## Live testing found a real bug (Phase 8)

Site is live and a real test submission on the Passes registration form fails. This has gone through two rounds:

**Round 1:** generic "Could not submit your registration. Please check your connection and try again." — fixed by Prompt 12, which added inline real-error display, confirmed `DRIVE_FOLDER_ID` (`1Qh90tNFOcv-2bMseJLs3j2rx4YywZrnn`), and added a `doGet` health-check handler.

**Round 2 (current):** with real-error display now in place, the actual browser error is confirmed to be **"Failed to fetch."** This is a well-documented CORS limitation specific to calling Google Apps Script Web Apps via `fetch()` POST from an external domain — Apps Script's response, after its internal redirect to `script.googleusercontent.com`, frequently lacks the CORS headers a cross-origin `fetch()` needs to read the response, even though the request itself does reach and execute the script. This is different from an access-permission problem (see diagnostic note below) and needs a different fix.

**Diagnostic done before committing to a fix:** visiting the deployed `/exec` URL directly in a browser (top-level navigation) shows whether the deployment requires a Google sign-in — if it does, "Who has access" is still misconfigured and must be fixed in Apps Script settings first. **Important caveat: direct navigation bypasses the CORS restrictions that apply to JS-initiated `fetch()` calls, so a successful direct visit does not by itself prove `fetch()` will work — it only rules out the "Who has access" failure mode.** Don't skip this check before applying the CORS fix below, since the fix (`mode: 'no-cors'`) would silently mask an access-permission problem if that were the actual cause (no-cors requests always resolve without throwing, even if Google secretly serves a login page instead of running the script).

**The fix (Prompt 13):** switch the fetch call to `mode: 'no-cors'`, which lets the POST reach and execute `doPost()` normally but makes the response unreadable by JS ("opaque" response). To compensate for losing the ability to confirm success/failure client-side, `Code.gs` sends a confirmation email via `MailApp.sendEmail()` after a successful `doPost()` — this becomes the real source of truth for whether a submission worked, not the on-page message (which will now always show "success" once the request leaves the browser, by design).

## Resolved (for history — no action needed)

- OS junk (`.DS_Store`, `__MACOSX/`) removed; duplicate root-level image folders removed; all filenames renamed to kebab-case; `image8.jfif` converted to `.jpg`; `comments.pdf` relocated into `docs/`.
- Nav-bar CTA button now consistently reads "BOOK FESTIVAL PASSES" sitewide.
- Footer legal pages built from real source `.docx` copy, linked only in the footer.
- No broken image paths anywhere across all 5 pages (verified by full sweep).
- Legacy checkout modal removed; "SELECT PASS" now routes to the one real registration form.
- Payment details (GCash, PayPal, email, bank transfer) come from a single source object, card order matches GCash → PayPal → Email → Bank Transfer, GCash logo self-hosted, copy-to-clipboard has a working fallback.

## Prompt 10 QA findings (Phase 9 — see plan.md)

- Footer Facebook/Instagram links and phone number were wrong/missing on 4 of 8 pages (`fiesta.html`, `gallery.html`, `venue.html`, `passes.html`) — fix is Prompt 14, straightforward, correct values already confirmed elsewhere in the project.
- Two open questions above still need the site owner's input before any fix is attempted.

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
