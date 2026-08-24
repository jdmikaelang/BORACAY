# Prompts — feed these to Claude Code in order

Paste each prompt as its own message once the previous one is confirmed done. Reference `plan.md`, `claude.md`, and `buildspec.md` are assumed to already be in the project root — Claude Code should read them automatically, but the prompts remind it where to look just in case.

**Active project:** `BORACAY` (flat structure, as-is) is the final, confirmed repo. Any earlier nested `boracay-sdk/boracay-final` copy is not in use.

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

---

### Prompt 6 — Google Sheets + Drive backend
> Following the Forms & Backend spec in `buildspec.md`, write the Google Apps Script (`Code.gs`) that accepts the Passes registration form submission, appends a row to a Google Sheet, and saves the uploaded proof-of-payment file into a Google Drive folder. Also write the client-side JS in `passes.html` that submits the form via fetch to the deployed Apps Script Web App URL, with a loading state and success/error message. Give me the exact step-by-step instructions for the one-time manual setup (creating the Sheet, pasting the script, deploying, authorizing) since that part has to happen in my Google account.

### Prompt 7 — Remove the duplicate/broken checkout modal
> In `passes.html`, there's a leftover legacy modal (`#checkout-modal` containing `#checkout-form`) that duplicates the already-working `#registration-form`. It still has a literal placeholder `action="YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE"`, which is why submitting it threw a raw browser POST error instead of using the real Apps Script integration. Remove the modal entirely — the markup, the `openModal`/`closeModal` JS, and the modal-only payment buttons inside it. Then update the three "SELECT PASS" buttons on the pricing cards (Full Festival Pass, Performer Pass, Party Pass) so they smooth-scroll down to the real `#registration-form` and pre-select the matching option in its "Pass Type" dropdown. There should be exactly one registration form on this page afterward.

### Prompt 8 — Fix payment data consistency and ordering
> Two payment values were inconsistent between the (now-removed) modal and the reference payment cards: the modal used GCash number `09569015382` while the reference card correctly shows `09175190040`, and the modal's PayPal button pointed at `paypal.me/placeholder` instead of the real `Paypal.me/MarianitoMaralit`. Make sure only the correct values now exist anywhere in the page — define each payment detail (GCash number, PayPal link, email, bank details) once, in one place, and reference it everywhere it's needed so it can't drift out of sync again. Then reorder the payment reference cards so the sequence is: GCash/Alipay → PayPal → Email → Bank Transfer (Email must sit directly under PayPal, not after Bank Transfer). Confirm the actual displayed values still match this reference photo exactly: [attach the payment-details screenshot]. Finally, add a copy-to-clipboard button next to each payment detail (GCash number, PayPal link, email address, each bank transfer field) with a safe fallback for browsers/contexts where `navigator.clipboard` isn't available, so copying never fails silently.

### Prompt 9 — Small hardening pass
> Self-host the GCash logo image (currently hotlinked from `upload.wikimedia.org`) into `images/` and update the reference. Then do a first-pass check: click every "SELECT PASS" button and confirm it reaches the one real registration form; submit a real test registration against the actual deployed Apps Script URL (not `localhost`) and confirm a row appears in the Google Sheet and the file lands in the Drive folder; check the browser console for any errors on every page.

### Prompt 10 — Full local QA pass
> Do a full local QA pass across the whole site: open every page, check every internal link and CTA, confirm mobile menu behavior, confirm every checklist item in `plan.md` Phase 2 is actually implemented (not just planned), confirm every Phase 6 fix (checkout modal removal, payment data consistency, copy-to-clipboard) is holding up, and list anything still outstanding before we move to deployment.

### Prompt 11 — Stop internal docs from being publicly deployed
> `docs/` (containing `plan.md`, `buildspec.md`, `prompts.md`, `SETUP.md`, and `Code.gs` — the actual Apps Script backend source, including the real Drive folder ID) plus `claude.md` are committed to git without being excluded from deployment. Since GitHub Pages publishes everything in the published branch/folder, all of this is likely already publicly browsable at the live domain right now. Fix this immediately: create a `.gitignore` that excludes the entire `docs/` folder and `claude.md`, remove them from git's tracking with `git rm -r --cached docs claude.md` (keeping the actual files on disk), and commit and push that as an urgent cleanup. Confirm afterward with `git ls-files` that neither `docs/` nor `claude.md` appear in the tracked file list, and confirm the change is actually live (not just committed locally).

### Prompt 12 — Fix the registration backend for real this time
> The Passes registration form is still failing live with "Could not submit your registration," even after recommitting to GitHub — because GitHub pushes never touch the Apps Script backend; that only lives in the Google account, in Extensions → Apps Script. Make these code-level fixes:
>
> 1. In `docs/Code.gs`, hardcode the real values instead of placeholders:
>    ```js
>    const DRIVE_FOLDER_ID = '1Qh90tNFOcv-2bMseJLs3j2rx4YywZrnn';
>    ```
> 2. Add a `doGet(e)` function to `Code.gs` that returns a simple friendly response, e.g. `ContentService.createTextOutput('Boracay SBKZ registration backend is live and reachable.')`. Right now visiting the deployed URL directly in a browser gives an ambiguous "Script function not found: doGet" page that's hard for a non-technical person to interpret — a real `doGet` turns that into an unambiguous yes/no self-test: open `https://script.google.com/macros/s/AKfycbxr-nKSuOSExmPowV2RH1eMlHDJQMFfRYUxaSz8EfiIgrLocjSLl7QyT-QIOsUtP5L3/exec` in a browser tab — if you see the friendly message, the deployment is reachable and public; if you see a Google sign-in prompt instead, "Who has access" needs to be changed to "Anyone" in Apps Script (Deploy → Manage deployments → pencil icon).
> 3. In `passes.html`'s registration submit handler, change the `catch (err)` block so it also displays the real caught error inline in the on-page message (not just the generic text) — e.g. `setRegFormMessage('Could not submit: ' + (err && err.message ? err.message : 'unknown error') + '. Please screenshot this and send it to the developer.', 'error')`. This means the next time something breaks, the actual reason shows up on screen without needing to open DevTools.
> 4. Update `docs/SETUP.md` with a short, unmissable callout near the top: **"Editing files in this repo and pushing to GitHub does NOT update the live registration backend. The backend only updates when you paste the new `Code.gs` into Extensions → Apps Script (inside the actual Google Sheet) and create a new deployment version via Deploy → Manage deployments → pencil icon → New version → Deploy."**
>
> After you make these changes, I (the site owner) still have to manually: (a) copy the full updated `Code.gs` into the Apps Script editor in my Google account, replacing what's there now, (b) create a new deployment version, and (c) test the new `doGet` self-test URL in a browser before retrying the form. Tell me clearly at the end of your work that these three manual steps are still required — don't let me think pushing to GitHub was enough.

### Prompt 13 — Fix the "Failed to fetch" CORS issue on submit
> After Prompt 12's fix, the form now shows a real underlying error on submit: "Could not submit: Failed to fetch." This is a well-documented CORS limitation when calling a Google Apps Script Web App via `fetch()` from an external domain (like GitHub Pages) for a POST request — Apps Script's response, after its internal redirect, often doesn't carry the CORS headers browsers require for JS to read a cross-origin `fetch()` response, even though the request itself reaches the script fine. **I already confirmed [visiting the deployed URL directly shows the friendly "backend is live and reachable" message / does NOT redirect to a Google sign-in page]** — access permissions are not the issue.
>
> Fix: change the registration form's `fetch()` call to use `mode: 'no-cors'`. This sidesteps the CORS restriction entirely and lets the POST actually reach and run `doPost()` in Apps Script (so it still writes to the Sheet and Drive), but it means the response becomes "opaque" — JS can no longer read whether the script itself reported success or failure. To compensate for losing that read-back:
> 1. Treat the form submission as successful once the `no-cors` fetch resolves without throwing (network-level failures, like being fully offline, will still throw and can still show a real error).
> 2. In `Code.gs`, add a confirmation email sent via `MailApp.sendEmail()` after a successful `doPost()` — to the registrant's submitted email, confirming their registration was received, and optionally BCC the organizer's own email so there's an independent, real-time signal that submissions are actually landing (not just a hopeful "it probably worked" on the frontend).
> 3. Update `docs/SETUP.md` to explain this tradeoff plainly: submissions will always show "success" client-side once they leave the browser, so the organizer should rely on the confirmation email and the Sheet itself — not the on-page message — as the real source of truth.
>
> Remind me at the end that this still requires the same manual step as before: paste the updated `Code.gs` into the Apps Script editor and create a new deployment version.

### Prompt 14 — Fix footer inconsistencies found by Prompt 10 QA
> The Prompt 10 QA pass found the footer is inconsistent across pages: `fiesta.html`, `gallery.html`, `venue.html`, and `passes.html` link to the wrong Facebook/Instagram URLs (`facebook.com/boracaysbkzworldfestival` and `instagram.com/boracaysbkzworldfiesta` — wrong domain form and wrong handles) and are missing the contact phone number entirely, showing only the WhatsApp number. `index.html`, `terms-and-conditions.html`, `privacy-policy.html`, and `festival-pass-policy.html` already have the correct footer. Standardize all four broken pages to match the correct ones exactly:
> - Facebook → `https://www.facebook.com/boracaysbkzworldfiesta1`
> - Instagram → `https://www.instagram.com/boracaysbkz_worldfiesta/`
> - Phone number `+63 917 519 0040` shown alongside the existing WhatsApp number `+63 956 124 3591` (matching how the correct pages display both)
>
> Since the root cause was "the footer partial was updated in only half the pages" on a site with no shared templating, also flag for me whether it's worth extracting the footer into a single shared source (e.g. one JS-injected partial loaded on every page) so this specific class of bug can't recur — don't do the refactor without me confirming first, since `buildspec.md` intentionally avoids adding build-step complexity to this project.

### Prompt 15 — Resolve `gallery.html` (pending decision)
> *(Fill in once decided.)* Either: (a) link `gallery.html` into [the main nav / the footer], matching the styling of the existing nav/footer links, or (b) remove `gallery.html` and its assets from the deployed site entirely, keeping a copy in `docs/` if it might be used later.

### Prompt 16 — Resolve the "Christian & Karen" artist entry (pending decision)
> *(Fill in once confirmed with whoever compiled the original feedback.)* Either: (a) add a "Christian & Karen" [or corrected name] entry to the appropriate artist category in `fiesta.html` with [photo/details], or (b) confirm no action is needed because the entry was intentionally merged into an existing card / correctly removed.

---

### Prompt 17 — Commit and push with GitHub Desktop, then enable Pages
> Walk me through publishing this repo using **GitHub Desktop** (not the command line), step by step:
> 1. Installing GitHub Desktop and signing in.
> 2. Adding this existing local project folder as a repository (File → Add Local Repository).
> 3. Using the "Publish repository" button to create the GitHub repo and push everything in one step — tell me exactly what to name it and to make sure it's **public** (required for free GitHub Pages).
> 4. What "committing" actually looks like going forward: after you make code changes, I'll see a list of changed files in GitHub Desktop, write a one-line summary, click "Commit to main," then click "Push origin" — confirm this is the full loop I'll repeat every time.
> Then walk me through enabling GitHub Pages on the new repo (Settings → Pages → deploy from the `main` branch, root folder) and tell me how to know it worked.

### Prompt 18 — Connect my custom domain
> I already own a domain. Walk me through connecting it to this GitHub Pages site: what to type into the repo's Settings → Pages → Custom domain field (confirm this also creates the `CNAME` file automatically, or tell me if I need to add it myself), exactly which DNS records to add at my domain registrar (A records for the apex domain and/or a CNAME record for `www`), and how to know once it's resolved and HTTPS is enforced.

### Prompt 19 — Post-launch verification
> Once DNS has propagated, verify the live custom domain: check every page loads over HTTPS, every image resolves, every internal link works, and the registration form actually writes to the Google Sheet and Drive folder in production, not just locally.

---

**Tip:** if any single prompt produces too much output at once (e.g. Prompt 3, which touches a lot), it's fine to split it further — e.g. run the artist-category items and the CTA/section-removal items as two separate messages.
