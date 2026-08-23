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

- [x] **Remove the leftover legacy checkout modal** (`#checkout-modal` / `#checkout-form` in `passes.html`). It's a duplicate of the already-working `#registration-form`, still has a literal placeholder `action="YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE"`, and is what the three "SELECT PASS" pricing buttons currently open — which is exactly what produced the error in the screenshot. Only one registration form should exist on the page.
- [x] Make "SELECT PASS" buttons scroll to (and ideally pre-fill the Pass Type dropdown of) the real `#registration-form`, instead of opening the broken modal.
- [x] **Fix the GCash number mismatch**: the reference card says `09175190040`; the (soon-to-be-removed) modal's copy button was using `09569015382`. Only one number should exist anywhere in the codebase — define it once and reference it everywhere, so this can't drift again.
- [x] Fix or remove the placeholder PayPal link (`paypal.me/placeholder`) that lived in the modal — the real link is `Paypal.me/MarianitoMaralit`, already correct in the reference card.
- [x] **Reorder the payment reference cards** so Email sits directly under PayPal: GCash/Alipay → PayPal → Email → Bank Transfer.
- [x] Add copy-to-clipboard buttons to each payment detail (GCash number, PayPal link, email, each Bank Transfer field) with a safe fallback (select-text or a manual copy prompt) if `navigator.clipboard` isn't available, so copying never silently fails.
- [x] Self-host the GCash logo in `images/` instead of hotlinking it from Wikimedia Commons.
- [ ] Re-test the real registration flow end-to-end against the actual deployed Apps Script URL (not `localhost`) and confirm a submission produces a Sheet row + Drive file.

**Milestone:** clicking any "SELECT PASS" button leads to exactly one working registration path, with payment details that are internally consistent and match the reference photo, and a successful test submission completes without error.

## What I need from you at each phase

| Phase | Your part |
|---|---|
| 1–2 | Nothing — review at the end |
| 3 | ~5 min: create the Sheet, paste the script, click through Google's deploy/consent screens |
| 4 | GitHub account confirmation, DNS record entry at your registrar |
| 5 | Final look-over before calling it launched |

See `prompts.md` for the exact prompts to feed back to execute each phase in order.
