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
> Do a sitewide pass across all pages: confirm the logo replaces "BORACAY SBKZ FIESTA 3" everywhere and sits top-left consistently, confirm "Boracay Ocean Club Resort & Spa" is used verbatim everywhere the venue is mentioned, and confirm **every** CTA button reads exactly "BOOK FESTIVAL PASSES" — including the small nav-bar button in the header, not just the large hero/section buttons (double-check `index.html`, `venue.html`, `passes.html`, and `gallery.html`, since the nav button was missed last pass). Then create three new pages — Terms & Conditions, Festival Pass Policy, and Privacy Policy — styled consistently with the rest of the site, linked only from the footer (not the main nav). **Use the real copy already in the project folder** (`Boracay SBKZ World Fiesta - Terms and Conditions.docx`, `... - Festival Pass Policy.docx`, `... - Privacy Policy.docx`) — convert each docx's content into its matching HTML page, preserving the heading structure and section order, don't write placeholder text. Once converted, move the three `.docx` files into `docs/` so they aren't part of the deployed site.

### Prompt 6 — Google Sheets + Drive backend
> Following the Forms & Backend spec in `buildspec.md`, write the Google Apps Script (`Code.gs`) that accepts the Passes registration form submission, appends a row to a Google Sheet, and saves the uploaded proof-of-payment file into a Google Drive folder. Also write the client-side JS in `passes.html` that submits the form via fetch to the deployed Apps Script Web App URL, with a loading state and success/error message. Give me the exact step-by-step instructions for the one-time manual setup (creating the Sheet, pasting the script, deploying, authorizing) since that part has to happen in my Google account.

### Prompt 7 — Local QA pass
> Do a full local QA pass: open every page, check every internal link and CTA, confirm mobile menu behavior, confirm every checklist item in `plan.md` Phase 2 is actually implemented (not just planned), and list anything still outstanding.

### Prompt 8 — Git + GitHub Pages deployment
> Initialize git if needed, write a clean `.gitignore` per `buildspec.md`, and prepare the repo for a GitHub push. Walk me through creating the GitHub repo and pushing this code, then enable GitHub Pages from the correct branch/folder. Add a `CNAME` file for [YOUR DOMAIN HERE] and tell me exactly what DNS records I need to add at my registrar.

### Prompt 9 — Post-launch verification
> Once DNS has propagated, verify the live custom domain: check every page loads over HTTPS, every image resolves, every internal link works, and the registration form actually writes to the Google Sheet and Drive folder in production, not just locally.

---

### Prompt 10 — Remove the duplicate/broken checkout modal
> In `passes.html`, there's a leftover legacy modal (`#checkout-modal` containing `#checkout-form`) that duplicates the already-working `#registration-form`. It still has a literal placeholder `action="YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE"`, which is why submitting it threw a raw browser POST error instead of using the real Apps Script integration. Remove the modal entirely — the markup, the `openModal`/`closeModal` JS, and the modal-only payment buttons inside it. Then update the three "SELECT PASS" buttons on the pricing cards (Full Festival Pass, Performer Pass, Party Pass) so they smooth-scroll down to the real `#registration-form` and pre-select the matching option in its "Pass Type" dropdown. There should be exactly one registration form on this page afterward.

### Prompt 11 — Fix payment data consistency and ordering
> Two payment values were inconsistent between the (now-removed) modal and the reference payment cards: the modal used GCash number `09569015382` while the reference card correctly shows `09175190040`, and the modal's PayPal button pointed at `paypal.me/placeholder` instead of the real `Paypal.me/MarianitoMaralit`. Make sure only the correct values now exist anywhere in the page — define each payment detail (GCash number, PayPal link, email, bank details) once, in one place, and reference it everywhere it's needed so it can't drift out of sync again. Then reorder the payment reference cards so the sequence is: GCash/Alipay → PayPal → Email → Bank Transfer (Email must sit directly under PayPal, not after Bank Transfer). Confirm the actual displayed values still match this reference photo exactly: [attach the payment-details screenshot]. Finally, add a copy-to-clipboard button next to each payment detail (GCash number, PayPal link, email address, each bank transfer field) with a safe fallback for browsers/contexts where `navigator.clipboard` isn't available, so copying never fails silently.

### Prompt 12 — Small hardening pass
> Self-host the GCash logo image (currently hotlinked from `upload.wikimedia.org`) into `images/` and update the reference. Then do a final check: click every "SELECT PASS" button and confirm it reaches the one real registration form; submit a real test registration against the actual deployed Apps Script URL (not `localhost`) and confirm a row appears in the Google Sheet and the file lands in the Drive folder; check the browser console for any errors on every page.

---

**Tip:** if any single prompt produces too much output at once (e.g. Prompt 3, which touches a lot), it's fine to split it further — e.g. run the artist-category items and the CTA/section-removal items as two separate messages.
