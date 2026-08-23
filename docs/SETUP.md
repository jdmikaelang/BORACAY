# One-time setup: Passes registration backend

> ⚠️ **Pushing to GitHub does NOT update the live registration backend.** GitHub and the Google
> Apps Script backend are two entirely separate systems. `docs/Code.gs` in this repo is a
> reference copy only — the backend only updates when you paste the new `Code.gs` into
> **Extensions → Apps Script** (inside the actual Google Sheet) and create a **new deployment
> version** via **Deploy → Manage deployments → pencil icon → New version → Deploy**. Editing
> the script and saving alone does nothing to the live URL, and neither does a `git push`.

This connects the Passes page registration form to a Google Sheet + Drive folder.
This part must be done by you, in your own Google account — Google requires a human
to click through the OAuth consent screen; it can't be scripted.

## 1. Create the Drive folder for proof-of-payment uploads

1. In Google Drive, create a new folder, e.g. "Boracay SBKZ Fiesta 3 — Proof of Payment".
2. Open the folder and copy its ID from the URL:
   `https://drive.google.com/drive/folders/`**`THIS_PART_IS_THE_ID`**

## 2. Create the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it, e.g. "Boracay SBKZ Fiesta 3 — Registrations".
3. Leave it empty — the script creates the header row and a "Registrations" tab automatically on first submission.

## 3. Paste the Apps Script

1. In the Sheet, go to **Extensions → Apps Script**.
2. Delete any placeholder code in `Code.gs`.
3. Paste in the full contents of [`Code.gs`](Code.gs) from this repo.
4. Near the top, set:
   ```js
   const DRIVE_FOLDER_ID = 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE';
   ```
   to the folder ID you copied in step 1.
5. Save the project (File → Save, or Cmd/Ctrl+S). Name it anything, e.g. "Passes Registration Backend".

## 4. Deploy as a Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in:
   - **Description:** anything, e.g. "v1"
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
4. Click **Deploy**.
5. Google will prompt you to **Authorize access**:
   - Click "Authorize access" → choose your Google account.
   - You'll see an "unverified app" warning — click **Advanced → Go to [project name] (unsafe)**. This is expected for a script you wrote and control yourself.
   - Review the permissions (Sheets + Drive access) and click **Allow**.
6. Copy the **Web app URL** shown after deployment. It looks like:
   `https://script.google.com/macros/s/AKfycb.../exec`

## 5. Wire the URL into the site

1. Open [`passes.html`](../passes.html).
2. Find this line near the bottom (in the `<script>` block, just above the registration form's submit handler):
   ```js
   const REGISTRATION_WEB_APP_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
   ```
3. Replace the placeholder with the URL you copied in step 4.6.
4. Save and re-deploy the site (commit + push, or just refresh if testing locally).

## 6. Test it end-to-end

1. Open the live Passes page, fill out the registration form with test data, and attach any small image as "proof of payment."
2. Submit. You should see the green "Thank you!" success message.
3. Check the Google Sheet — a new row should appear in the "Registrations" tab.
4. Check the Drive folder — the uploaded file should be there, named `LastName_FirstName_originalfilename`.

## If you ever need to redeploy

Any time you edit `Code.gs` in the Apps Script editor, you must create a **new deployment**
(Deploy → Manage deployments → pencil icon → New version → Deploy) for the changes to take
effect on the existing Web App URL — saving the script alone is not enough.
