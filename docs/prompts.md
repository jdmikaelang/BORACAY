# Prompts — feed these to Claude Code in order

Paste each prompt as its own message once the previous one is confirmed done. Reference `plan.md`, `claude.md`, and `buildspec.md` are assumed to already be in the project root — Claude Code should read them automatically, but the prompts remind it where to look just in case.

---

### Prompt 1 — Folder & filename cleanup
> Read `claude.md` and `buildspec.md` in this repo. Execute Phase 1 of `plan.md`: remove OS junk files (`.DS_Store`, `__MACOSX/`), delete the duplicate image folders at the project root (keep only the copies inside `images/`), rename every file and folder to lowercase kebab-case with no spaces or `&` characters per the naming convention in `buildspec.md`, resolve `image8.jfif`, and move `comments.pdf` into a `docs/` folder that's excluded from deployment. Update every `<img src>` and internal link across all HTML files to match the new paths. Show me a diff/summary of every rename before committing.

### Prompt 2 — Home page fixes
> Execute all Home page items from the Phase 2 checklist in `plan.md`: button label change, festival date copy, logo replacing the text lockup, venue name standardization, phone number addition, and the Facebook/Instagram links in the contact section. Show me the before/after for each change.

### Prompt 3 — Fiesta page fixes
> Execute all Fiesta page items from the Phase 2 checklist in `plan.md`: logo in header, artist category structure (Main Artists / Featured Artists & Performers / DJ), card sizing normalization, photo fallback logic for missing artist photos, the Massiel spelling fix, removing Escola de Samba de Manila, adding the six new Featured Artists & Performers, standardizing CTA copy to "BOOK FESTIVAL PASSES", trimming the "One Unforgettable Fiesta" section to a single photo (performance7), deleting the four workshop cards, and removing the standalone "What's Included / Categories" section by folding it into "Featured Festival Experiences." Show me each section before/after.

### Prompt 4 — Passes page fixes
> Execute all Passes page items from the Phase 2 checklist in `plan.md`: add Bank Transfer as a payment method, reorder the payment method cards (Email under PayPal, PayPal under/with GCash), and update the registration form fields to capture First/Last Name, Email, WhatsApp/Viber #, Pass Type, Number of Passes, Names of other attendees, Payment Method, and Proof of Payment. Don't wire the backend yet — just get the form fields and payment section UI correct first.

### Prompt 5 — Global consistency pass + new footer pages
> Do a sitewide pass across all pages: confirm the logo replaces "BORACAY SBKZ FIESTA 3" everywhere and sits top-left consistently, confirm "Boracay Ocean Club Resort & Spa" is used verbatim everywhere the venue is mentioned, and confirm every CTA button reads exactly "BOOK FESTIVAL PASSES." Then create three new pages — Terms & Conditions, Festival Pass Policy, and Privacy Policy — styled consistently with the rest of the site, linked only from the footer (not the main nav). Use reasonable placeholder legal copy and flag clearly that I need to review/replace it with real legal text before launch.

### Prompt 6 — Google Sheets + Drive backend
> Following the Forms & Backend spec in `buildspec.md`, write the Google Apps Script (`Code.gs`) that accepts the Passes registration form submission, appends a row to a Google Sheet, and saves the uploaded proof-of-payment file into a Google Drive folder. Also write the client-side JS in `passes.html` that submits the form via fetch to the deployed Apps Script Web App URL, with a loading state and success/error message. Give me the exact step-by-step instructions for the one-time manual setup (creating the Sheet, pasting the script, deploying, authorizing) since that part has to happen in my Google account.

### Prompt 7 — Local QA pass
> Do a full local QA pass: open every page, check every internal link and CTA, confirm mobile menu behavior, confirm every checklist item in `plan.md` Phase 2 is actually implemented (not just planned), and list anything still outstanding.

### Prompt 8 — Git + GitHub Pages deployment
> Initialize git if needed, write a clean `.gitignore` per `buildspec.md`, and prepare the repo for a GitHub push. Walk me through creating the GitHub repo and pushing this code, then enable GitHub Pages from the correct branch/folder. Add a `CNAME` file for [YOUR DOMAIN HERE] and tell me exactly what DNS records I need to add at my registrar.

### Prompt 9 — Post-launch verification
> Once DNS has propagated, verify the live custom domain: check every page loads over HTTPS, every image resolves, every internal link works, and the registration form actually writes to the Google Sheet and Drive folder in production, not just locally.

---

**Tip:** if any single prompt produces too much output at once (e.g. Prompt 3, which touches a lot), it's fine to split it further — e.g. run the artist-category items and the CTA/section-removal items as two separate messages.
