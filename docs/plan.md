# Boracay SBKZ World Fiesta — Project Plan

## 0. Context

Static marketing site (`index.html`, `fiesta.html`, `passes.html`, `venue.html`, `gallery.html`) built with Tailwind CSS (CDN), Google Fonts, and Phosphor Icons — no build step, no backend. Currently hosted at `jdmikaelang.github.io/boracay/`. Goal: clean it up, apply every fix in `comments.pdf`, wire the registration form to Google Sheets + Drive, and launch it on GitHub with your own domain.

You said you don't want to do too much manual work — the plan below is written so Claude Code can execute nearly all of it in one sitting per phase, with you only doing the handful of steps that legally have to be done by a human (clicking "Allow" on Google's OAuth screen, buying/pointing the domain, approving the GitHub push).

---

## Phase 1 — Repo & File Sanity

**Goal:** the project folder stops looking like a design export and starts looking like a deployable site.

- Remove `.DS_Store`, `__MACOSX/`, and any other OS junk.
- Collapse the duplicated image folders — `DJ/`, `Main Artists/`, `Featured Artists and Performers/` currently exist both at project root *and* inside `images/`. Keep one canonical copy under `images/`.
- Rename every file/folder to lowercase kebab-case, no spaces, no `&` (e.g. `DJ K-bunny.png` → `dj-k-bunny.png`, `Adrian & Carol.png` → `adrian-and-carol.png`). Spaces and `&` in filenames break on some hosts and are a pain in `<img src>` paths.
- Identify `image8.jfif` (orphaned at project root) — move it into `images/` with a proper name, or delete if unused. Convert `.jfif` → `.jpg`.
- Move `comments.pdf` out of the site root into a local `docs/` folder that is **not** deployed (or delete it from the repo once its items are actioned — it shouldn't ship to production).
- Decide the fate of `gallery.html` — it exists but isn't linked in the nav on any page. Either link it in the header/footer or archive it out of the deployed folder.
- Update every `<img src>` reference across all five HTML files to match the renamed paths.

**Milestone:** `git status` shows a clean, logically named tree; every image loads with no 404s.

---

## Phase 2 — Content & Copy Fixes (every PDF comment addressed)

Full checklist, grouped by page, pulled directly from `comments.pdf`. Nothing here is optional — this is the "every single problem" list.

### Home
- [ ] Change button label "View Schedule" → **"View Artists & Schedule"**
- [ ] Set festival dates: main days **May 7–9, 2027**; add supporting copy for the full run — Pre-Party May 5, Artists & DJs Night May 6, Farewell Party May 10 (6 days total)
- [ ] Replace the text lockup **"BORACAY SBKZ FIESTA 3"** with the actual logo image, top-left, on every page
- [ ] Standardize venue name to exactly **"Boracay Ocean Club Resort & Spa"** everywhere it appears
- [ ] Add phone number **+63 917 519 0040**
- [ ] Contact section: add Facebook link → `https://www.facebook.com/boracaysbkzworldfiesta1`
- [ ] Contact section: add Instagram link → `https://www.instagram.com/boracaysbkz_worldfiesta/`

### Fiesta
- [ ] Use the logo in the page header
- [ ] Confirm/organize artist categories as: **Main Artists**, **Featured Artists & Performers**, **DJ**
- [ ] Normalize card sizing — Main Artists cards should match the (smaller) Featured Artists card size
- [ ] For any artist with no photo in the shared Drive, fall back to the sunset background image
- [ ] Fix spelling: "Marriel" → **"Massiel"**; double check "Christian & Karen" entry spelling
- [ ] Remove **"Escola de Samba de Manila"** (card + underlying image file)
- [ ] Add to Featured Artists & Performers: **Ian Romera, Joey Cooper Brooks, M-Dance, Descarga Latina, Rumpuree, Bailas Rosas**
- [ ] Standardize every CTA button to read **"BOOK FESTIVAL PASSES"**
- [ ] "One Unforgettable Fiesta" section — use a single photo on the right (use `performance7`), remove the second image
- [ ] Delete the 4 "Featured Festival Experiences" workshop cards: Salsa Workshops, Bachata Workshops, Kizomba Workshops, Zouk Workshops
- [ ] Remove the standalone "What's Included / Categories" icon row (Workshop / Pool Party / Boat Party / Performances / Jack & Jill) and fold that content into "Featured Festival Experiences" instead

### Passes
- [ ] Add **"Pay by Bank Transfer"** as a payment method card
- [ ] Reorder payment method cards: GCash & PayPal grouped together, Email sits under PayPal, Bank Transfer added as its own card
- [ ] Registration form must capture: **First/Last Name, Email, WhatsApp/Viber #, Pass Type, Number of Passes, Names of other attendees, Payment Method, Proof of Payment**
- [ ] Proof of Payment upload must land in a shared **Google Drive folder**
- [ ] All form submissions must write to a connected **Google Sheet** (see Phase 4)

### Venue
- No page-specific edits were called out beyond the global fixes below.

### Global / Footer
- [ ] Add new footer-only pages: **Terms & Conditions**, **Festival Pass Policy**, **Privacy Policy** — real copy already exists as `.docx` files in the project folder (`Boracay SBKZ World Fiesta - Terms and Conditions.docx`, `... - Festival Pass Policy.docx`, `... - Privacy Policy.docx`). Convert that copy into three matching HTML pages — **do not write new/placeholder legal text**, use the docx content as the source of truth, preserving headings/structure. Once converted, move the three `.docx` files into `docs/` alongside the other reference material so they don't ship in the deployed site.

**Milestone:** every checkbox above is ticked and visually verified in a local preview before deployment.

---

## Phase 3 — Forms → Google Sheets + Drive Integration

**Goal:** the Passes registration form submits to a Google Sheet, with the payment-proof file landing in a Drive folder — without a paid backend.

**Approach:** Google Apps Script Web App bound to a new Sheet. Claude Code writes the Apps Script `.gs` code and the client-side JS fetch call; you deploy it with a scripted set of clicks (Apps Script requires a human to click through the OAuth consent screen — no tool can do that step for you).

1. Claude Code drafts `Code.gs` (handles form POST → appends row to Sheet, saves uploaded file to a specific Drive folder, returns success/failure JSON).
2. You (2-minute manual step): create a blank Google Sheet, open Extensions → Apps Script, paste the code, deploy as Web App ("Execute as: me", "Who has access: Anyone"), copy the deployment URL.
3. Claude Code wires that URL into `passes.html`'s form submit handler.
4. Test end-to-end with a dummy submission; confirm the row appears in Sheets and the file appears in Drive.

**Milestone:** a real form submission produces a Sheet row + a file in Drive, and the user sees a success confirmation on the page.

---

## Phase 4 — GitHub + Domain Launch

1. Initialize git (if not already), commit the cleaned project.
2. Create a GitHub repo (public, since GitHub Pages free tier requires it — flag this to you if it matters).
3. Push, enable GitHub Pages on `main` (root or `/docs`, decided in Phase 1).
4. Add a `CNAME` file with your domain.
5. You add the DNS records at your registrar (A/ALIAS + CNAME) — this step requires access to your DNS provider account, which I can't do for you.
6. Verify HTTPS is issued and the custom domain resolves.

**Milestone:** the live site loads at your real URL over HTTPS.

---

## Phase 5 — QA Pass

- Click every nav link, every CTA, every footer link on desktop and mobile widths.
- Submit a real test registration and confirm the Sheet/Drive pipeline.
- Confirm every item in the Phase 2 checklist against the live site, not just the local copy.

---

## Phase 6 — Post-Launch QA Fixes (flagged after Prompts 1–5)

Found while investigating the "501 Unsupported method" error from a real test submission, plus a general UI/UX sweep of the updated zip. Phases/Prompts 1–5 are untouched and confirmed working — this is new work only.

- [ ] **Remove the leftover legacy checkout modal** (`#checkout-modal` / `#checkout-form` in `passes.html`). It's a duplicate of the already-working `#registration-form`, still has a literal placeholder `action="YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE"`, and is what the three "SELECT PASS" pricing buttons currently open — which is exactly what produced the error in the screenshot. Only one registration form should exist on the page.
- [ ] Make "SELECT PASS" buttons scroll to (and ideally pre-fill the Pass Type dropdown of) the real `#registration-form`, instead of opening the broken modal.
- [ ] **Fix the GCash number mismatch**: the reference card says `09175190040`; the (soon-to-be-removed) modal's copy button was using `09569015382`. Only one number should exist anywhere in the codebase — define it once and reference it everywhere, so this can't drift again.
- [ ] Fix or remove the placeholder PayPal link (`paypal.me/placeholder`) that lived in the modal — the real link is `Paypal.me/MarianitoMaralit`, already correct in the reference card.
- [ ] **Reorder the payment reference cards** so Email sits directly under PayPal: GCash/Alipay → PayPal → Email → Bank Transfer.
- [ ] Add copy-to-clipboard buttons to each payment detail (GCash number, PayPal link, email, each Bank Transfer field) with a safe fallback (select-text or a manual copy prompt) if `navigator.clipboard` isn't available, so copying never silently fails.
- [ ] Self-host the GCash logo in `images/` instead of hotlinking it from Wikimedia Commons.
- [ ] Re-test the real registration flow end-to-end against the actual deployed Apps Script URL (not `localhost`) and confirm a submission produces a Sheet row + Drive file.

**Milestone:** clicking any "SELECT PASS" button leads to exactly one working registration path, with payment details that are internally consistent and match the reference photo, and a successful test submission completes without error.

## Phase 7 — Pre-deployment security check (new, before GitHub push)

- [ ] Untrack `docs/` (which contains `Code.gs`, the actual backend source) and `claude.md` from git, and gitignore them going forward. As committed today, GitHub Pages would publish both publicly once pushed — including backend implementation details that should stay private.
- [ ] Confirm with `git ls-files` that neither `docs/` nor `claude.md` appear in the tracked list before pushing.

**Milestone:** `git ls-files` shows only the actual site files (HTML, images, CNAME once added) — nothing internal.

## Phase 8 — Live testing found a real submission failure

Deployed to `jdmikaelang.github.io` and tested with a real submission — form fails with "Could not submit your registration," even after recommitting to GitHub multiple times. **The actual reason nothing changed: GitHub and the Google Apps Script backend are separate systems.** A `git push` updates the static site only; it has no effect whatsoever on the script running in the site owner's Google account. `docs/Code.gs` in the repo is a reference copy, not the live code.

Confirmed real values to use going forward:
- Drive folder ID: `1Qh90tNFOcv-2bMseJLs3j2rx4YywZrnn`
- Deployed script URL (unchanged, already correct in `passes.html`): `https://script.google.com/macros/s/AKfycbxr-nKSuOSExmPowV2RH1eMlHDJQMFfRYUxaSz8EfiIgrLocjSLl7QyT-QIOsUtP5L3/exec`

See `claude.md` for the full debugging checklist and the round-2 finding: with Prompt 12's inline error display in place, the real browser error turned out to be **"Failed to fetch"** — a known CORS limitation when calling an Apps Script Web App via `fetch()` POST from an external domain, not an access-permission issue. Fix is Prompt 13 (switch to `mode: 'no-cors'` + a server-side confirmation email as the new source of truth for success, since the client can no longer read the response).

**Milestone:** a real test submission on the live site results in a confirmation email and a real row/file in the Sheet/Drive — the on-page message alone is no longer sufficient proof once Prompt 13 lands, by design.

## Phase 9 — Prompt 10 QA findings

Four issues surfaced by the full local QA pass:

1. **Footer Facebook/Instagram links wrong on 4 of 8 pages** (`fiesta.html`, `gallery.html`, `venue.html`, `passes.html`) — wrong domain form and wrong handles, while `index.html` and the 3 legal pages have it correct. Root cause: no shared footer template on a static site means per-page drift is easy. Fix: Prompt 14.
2. **Footer phone number missing entirely on the same 4 pages** — only the WhatsApp number shows; the required `+63 917 519 0040` doesn't appear. Same root cause, same fix (Prompt 14).
3. **`gallery.html` is fully orphaned** — no page links to it, it only links to itself. This was supposed to be resolved in Phase 1 (link it in, or archive it) and wasn't. **Needs a decision from the site owner** before any fix: link it into nav/footer, or pull it from the deployed site. (Prompt 15, currently a placeholder pending that decision.)
4. **"Christian & Karen" artist entry is missing** from `fiesta.html` — the original feedback asked to fix its spelling ("Christian & Karen"), but no such entry (or close variant) exists anywhere on the page now. Unclear whether it was dropped, renamed, or missed. **Needs the site owner to confirm** with whoever compiled the original comments before any fix is attempted — guessing at a name/entry to add back risks introducing wrong information. (Prompt 16, currently a placeholder pending that confirmation.)

**Milestone:** Prompt 14 lands and re-verifies footer consistency across all 8 pages; items 3 and 4 get a decision from the site owner, then Prompts 15/16 get filled in and run.

## Phase 10 — Deployment sequencing

Per the site owner's request, GitHub Desktop publishing (Prompt 17) and custom domain connection (Prompt 18) are deliberately held until every other known issue (Prompts 11–16) is resolved — no point wiring up a custom domain for a site that still has open bugs. Post-launch verification (Prompt 19) naturally follows once the domain is live.

**Milestone:** Prompts 11–16 are all confirmed done before Prompt 17 is run.

## What I need from you at each phase

| Phase | Your part |
|---|---|
| 1–2 | Nothing — review at the end |
| 3 | ~5 min: create the Sheet, paste the script, click through Google's deploy/consent screens |
| 4 | GitHub account confirmation, DNS record entry at your registrar |
| 5 | Final look-over before calling it launched |

See `prompts.md` for the exact prompts to feed back to execute each phase in order.
