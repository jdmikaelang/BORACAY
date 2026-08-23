# Build Spec — Boracay SBKZ World Fiesta

## 1. Stack

| Layer | Choice |
|---|---|
| Markup | Static HTML5, one file per page, no templating engine |
| Styling | Tailwind CSS via CDN (`https://cdn.tailwindcss.com`) — no PostCSS build, no Tailwind config file, config lives inline per page |
| Fonts | Google Fonts: **Inter** (300/400/500/600) for body/UI, **Playfair Display** (400/500/600/700, italic 400) for headings/display |
| Icons | Phosphor Icons via `unpkg.com/@phosphor-icons/web` |
| JS | Vanilla JS only, inline `<script>` or a single `assets/site.js` if it grows — no framework |
| Forms backend | Google Apps Script Web App (see §5) — the only "server" in this project |
| Hosting | GitHub Pages |
| Domain | Custom domain via `CNAME` file at repo root, DNS managed externally by site owner |

**Explicitly out of scope:** React/Vue, npm/Vite/Webpack, a CMS, a database, a paid backend. This is a zero-infrastructure static site by design — don't add complexity that isn't needed to hit the brief.

## 2. Typography rules

- **Display/headline text** (hero titles, section headers): `font-serif` (Playfair Display). Large sizes (`text-5xl` → `text-8xl` for hero, `text-3xl`–`text-4xl` for section headers). Occasional italic for eyebrow/label text above a headline (matches existing pattern, e.g. "The" above the homepage hero).
- **Body copy, nav, buttons, form labels**: `font-sans` (Inter), regular weight 400 for paragraphs, 500–600 for buttons/labels/emphasis.
- **Eyebrow labels** (small caps-style labels above section headers, e.g. "SECURE YOUR SPOT", "WHAT'S INCLUDED"): small, uppercase, letter-spaced, gold or muted color, Inter.
- Never mix serif into buttons or form fields — serif is reserved for editorial/display moments only.

## 3. Color tokens

```css
--brand-dark:      #121C1F;  /* page background, default */
--brand-card:      #1A2A2E;  /* card backgrounds */
--brand-cardhover: #22363B;  /* card hover state */
--brand-gold:      #E5B96D;  /* primary accent, CTAs, active nav state */
--brand-goldhover: #D4A355;  /* CTA hover */
--brand-light:     #F8FAFC;  /* primary text on dark */
--brand-muted:     #94A3B8;  /* secondary text, inactive nav */
```

All buttons that trigger the main conversion action (buying/registering for passes) use `brand-gold` fill with `brand-dark` text. Secondary buttons are outline/ghost style using `brand-muted`/`brand-light` borders.

**CTA copy rule:** every primary call-to-action button, on every page, reads exactly **"BOOK FESTIVAL PASSES"** — no variants ("Book Passes," "Buy Passes," "Reserve Your Spot," etc.). This was an explicit client fix; treat it as a hard rule, not a style preference.

## 4. File & folder structure

### Naming convention (applies to every file and folder, no exceptions)
- lowercase only
- words separated by hyphens (`kebab-case`)
- no spaces
- no `&` — spell out `and` or omit
- no special characters beyond hyphens
- keep original file extension unless it's non-standard (convert `.jfif` → `.jpg`)

Examples:
- `DJ K-bunny.png` → `dj-k-bunny.png`
- `Adrian & Carol.png` → `adrian-and-carol.png`
- `Featured Artists and Performers/` → `featured-artists-and-performers/`

### Target structure

```
/
├── index.html
├── fiesta.html
├── passes.html
├── venue.html
├── gallery.html            (only if kept — must be linked in nav/footer if so)
├── terms-and-conditions.html      (content sourced from the "Terms and Conditions.docx" already in the project folder)
├── festival-pass-policy.html      (content sourced from the "Festival Pass Policy.docx" already in the project folder)
├── privacy-policy.html            (content sourced from the "Privacy Policy.docx" already in the project folder)
├── CNAME
├── assets/
│   └── site.js             (only if shared JS grows beyond a few lines per page)
├── images/
│   ├── logo.png
│   ├── homepage-background.png
│   ├── main-artists/
│   │   └── <artist-name>.png
│   ├── featured-artists-and-performers/
│   │   └── <artist-name>.png
│   ├── dj/
│   │   └── dj-<name>.png
│   ├── performance-1.jpg ... performance-7.jpg
│   ├── workshop-1.jpg
│   ├── jack-and-jill-1.jpg, jack-and-jill-2.jpg
│   └── socials-1.jpg ... socials-3.jpg
└── docs/                    (repo-only — not deployed)
    └── comments.pdf         (original client feedback, kept for reference)
```

No file lives at repo root except the HTML pages, `CNAME`, and standard repo files (`README.md`, `.gitignore`).

**Legal page copy source:** the three footer pages (Terms & Conditions, Festival Pass Policy, Privacy Policy) are **not** placeholder content — real, final legal copy already exists as `.docx` files in the project folder (drafted for entity "SBKZ PHILIPPINES OPC," referencing RA 10173/Data Privacy Act compliance, festival dates, transfer/refund terms, etc.). Convert that copy directly into the HTML pages rather than generating new text. After conversion, relocate the source `.docx` files into `docs/` so they're kept for reference but not deployed.

### .gitignore
```
.DS_Store
__MACOSX/
docs/*.pdf   # optional — exclude raw feedback docs from the public repo if the site owner wants it private
```

## 5. Forms & backend spec

**Requirement (from client feedback):** the Passes registration form must capture First/Last Name, Email, WhatsApp/Viber #, Pass Type, Number of Passes, Names of other attendees, Payment Method, and a Proof of Payment file upload — writing to a Google Sheet, with the uploaded file landing in a Google Drive folder.

**Implementation:**

1. **Google Sheet** — one tab, columns matching the form fields exactly: `Timestamp | First Name | Last Name | Email | WhatsApp/Viber | Pass Type | Number of Passes | Other Attendee Names | Payment Method | Proof of Payment (Drive link)`.
2. **Google Apps Script Web App**, bound to that Sheet:
   - Accepts a POST with form fields + base64-encoded file.
   - Decodes and saves the file into a specified Drive folder (folder ID hardcoded in the script or passed as a param).
   - Appends a row to the Sheet, with the Drive file's shareable link in the last column.
   - Returns a JSON success/error response.
   - Deployed with "Execute as: Me" and "Who has access: Anyone" (required so the public form can hit it without the visitor needing a Google login).
3. **Client-side (`passes.html`)**: form submit handler does a `fetch()` POST (as `multipart/form-data` or base64 JSON, whichever Apps Script deployment expects) to the Web App URL, shows a loading state, then a success/error message. No page reload.
4. **Manual, one-time setup step (site owner only):** create the Sheet, paste the Apps Script code, click "Deploy → New deployment → Web app," authorize the OAuth consent screen, copy the deployment URL into the site config. This step cannot be automated — Google requires the account owner to click through consent.

**Payment methods to support on the Passes page (per feedback):** GCash/Alipay, PayPal, Email (for manual payment coordination — grouped under/near PayPal), Bank Transfer (new addition).

## 6. Deployment guidelines

1. Repo pushed to GitHub (public, for free GitHub Pages).
2. GitHub Pages enabled from the `main` branch, root folder.
3. `CNAME` file at repo root containing the target domain (e.g. `boracaysbkzworldfiesta.com`) — GitHub Pages reads this automatically.
4. At the domain registrar: add an `A` record (or `ALIAS`/`ANAME`) pointing the apex domain to GitHub Pages' IPs, and/or a `CNAME` record for a `www` subdomain pointing to `<username>.github.io`. GitHub's own docs list the current IPs at the time of setup — verify against GitHub's current documentation rather than a hardcoded list, since these can change.
5. Enable "Enforce HTTPS" in the repo's Pages settings once DNS has propagated and GitHub issues the certificate.
6. Smoke-test every page and every internal link against the live custom domain, not just the `github.io` preview URL — relative paths that work on one can occasionally break on the other if a path was hardcoded incorrectly.

## 7. Accessibility & performance baseline

- All `<img>` tags need descriptive `alt` text (artist names, event photos, etc.) — currently missing on several images.
- Images should be reasonably compressed before commit (the artist/DJ photos are PNGs that could likely be JPEG/WebP without visible quality loss, meaningfully shrinking repo size and load time).
- Maintain existing keyboard-navigable mobile menu behavior; don't regress it during cleanup.
