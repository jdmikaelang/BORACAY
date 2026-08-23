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

- **`docs/` and `claude.md` are committed to git without being excluded from deployment.** GitHub Pages publishes everything in the published branch, so `docs/Code.gs` (the backend source, including Sheet/Drive IDs), `docs/plan.md`, `docs/prompts.md`, `docs/buildspec.md`, `docs/SETUP.md`, and `claude.md` would all become publicly browsable once pushed. Must be untracked (`git rm -r --cached`) and gitignored before the GitHub push — this is Prompt 11.
- No git remote configured yet, no `CNAME` file — expected, this is Prompts 13–14, not yet run.

## Open questions from Prompt 10 QA — need site owner input before proceeding

- **`gallery.html` is a fully orphaned page** — no nav, footer, or CTA on any other page links to it; it only links to itself. `plan.md` Phase 1 said to either wire it into navigation or archive it out of the deployed folder, and neither happened. Waiting on the site owner: should it be linked (and if so, from the main nav or the footer?), or removed from the deployed site?
- **"Christian & Karen" artist entry can't be found anywhere in `fiesta.html`.** The original feedback said to double-check its spelling, but no artist by that name or a close variant currently exists on the page. Unknown whether it was dropped, renamed, or missed during an earlier edit. Waiting on the site owner to confirm with whoever compiled the original comments whether this entry should still exist and under what name.

## Live testing found a real bug (Phase 8)

Site is live on `jdmikaelang.github.io`. A real test submission on the Passes registration form still fails with "Could not submit your registration. Please check your connection and try again." — even after the site owner recommitted and pushed multiple times. **Root cause of the confusion: GitHub and the Google Apps Script backend are two entirely separate systems.** Pushing this repo to GitHub only updates the static site — it never touches the script running in the site owner's Google account (Extensions → Apps Script, inside the bound Sheet). `docs/Code.gs` in this repo is a reference copy only; it is not what executes live. Do not assume a `git push` has any effect on backend behavior.

**Known-good values (confirmed by the site owner):**
- `DRIVE_FOLDER_ID`: `1Qh90tNFOcv-2bMseJLs3j2rx4YywZrnn`
- Deployed Web App URL: `https://script.google.com/macros/s/AKfycbxr-nKSuOSExmPowV2RH1eMlHDJQMFfRYUxaSz8EfiIgrLocjSLl7QyT-QIOsUtP5L3/exec` (already correctly wired in `passes.html` — unchanged)

What Claude Code *can* fix (Prompt 12): bake the real `DRIVE_FOLDER_ID` into `docs/Code.gs`, add a `doGet` health-check handler so the deployed URL gives an unambiguous self-test when opened directly in a browser, surface the real caught error inline on the page instead of only a generic message, and add a loud callout in `SETUP.md` explaining that GitHub pushes don't touch the backend.

What only the site owner can fix (cannot be done via file edits or git): paste the updated `Code.gs` into the actual Apps Script editor, create a **new deployment version** (Deploy → Manage deployments → pencil icon → New version → Deploy — editing the script and saving alone does nothing to the live URL), and confirm "Who has access" is set to "Anyone." Claude Code should say this explicitly at the end of Prompt 12's work rather than implying the fix is complete once files are committed.

Debugging checklist (for the site owner, in their Google account — not something Claude Code can click through):
1. Open the deployed `/exec` URL directly in a browser tab. A "Script function not found: doGet" page means the deployment is reachable; a Google sign-in redirect means "Who has access" isn't set to "Anyone." (Once Prompt 12 lands, this becomes an unambiguous friendly message instead.)
2. Fix via Deploy → Manage deployments → pencil icon → confirm "Who has access: Anyone" → Deploy.
3. Confirm `DRIVE_FOLDER_ID` in the *actual* Apps Script editor (not just this repo's copy of `Code.gs`) matches `1Qh90tNFOcv-2bMseJLs3j2rx4YywZrnn`.
4. Remember: editing `Code.gs` requires a **new deployment version** to take effect — saving alone does nothing to the live URL, and neither does a GitHub push.
5. Check the browser DevTools console during a real submit attempt for the actual underlying error (CORS / 404 / etc.) — or once Prompt 12 lands, the error will show inline on the page itself.

## Resolved (for history — no action needed)

- OS junk (`.DS_Store`, `__MACOSX/`) removed; duplicate root-level image folders removed; all filenames renamed to kebab-case; `image8.jfif` converted to `.jpg`; `comments.pdf` relocated into `docs/`.
- Nav-bar CTA button now consistently reads "BOOK FESTIVAL PASSES" sitewide.
- Footer legal pages built from real source `.docx` copy, linked only in the footer.
- No broken image paths anywhere across all 5 pages (verified by full sweep).
- Legacy checkout modal removed; "SELECT PASS" now routes to the one real registration form.
- Payment details (GCash, PayPal, email, bank transfer) come from a single source object, card order matches GCash → PayPal → Email → Bank Transfer, GCash logo self-hosted, copy-to-clipboard has a working fallback.

## Prompt 10 QA findings (Phase 9 — see plan.md)

- Footer Facebook/Instagram links and phone number were wrong/missing on 4 of 8 pages (`fiesta.html`, `gallery.html`, `venue.html`, `passes.html`) — fix is Prompt 16, straightforward, correct values already confirmed elsewhere in the project.
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
