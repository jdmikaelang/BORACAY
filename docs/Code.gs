/**
 * Boracay SBKZ World Fiesta 3 — Passes registration backend.
 *
 * Bound to the registration Google Sheet. Deployed as a Web App
 * ("Execute as: Me", "Who has access: Anyone"). Receives JSON POSTs
 * from passes.html, appends a row to the Sheet, and saves the
 * uploaded proof-of-payment file to a Drive folder.
 *
 * One-time setup: set DRIVE_FOLDER_ID below to the target Drive
 * folder's ID (see SETUP.md for how to get it).
 */

const DRIVE_FOLDER_ID = 'PASTE_YOUR_DRIVE_FOLDER_ID_HERE';
const SHEET_NAME = 'Registrations';

const SHEET_HEADERS = [
  'Timestamp',
  'First Name',
  'Last Name',
  'Email',
  'WhatsApp/Viber',
  'Pass Type',
  'Number of Passes',
  'Other Attendee Names',
  'Payment Method',
  'Proof of Payment (Drive link)',
];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const required = ['firstName', 'lastName', 'email', 'whatsappViber', 'passType', 'numberOfPasses', 'paymentMethod'];
    for (const field of required) {
      if (!data[field]) {
        return jsonResponse({ success: false, error: 'Missing required field: ' + field });
      }
    }
    if (!data.proofOfPayment || !data.proofOfPayment.base64 || !data.proofOfPayment.filename) {
      return jsonResponse({ success: false, error: 'Missing proof of payment file' });
    }

    const driveLink = saveProofOfPayment(data.proofOfPayment, data);
    appendRegistrationRow(data, driveLink);

    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function saveProofOfPayment(fileData, data) {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const bytes = Utilities.base64Decode(fileData.base64);
  const blob = Utilities.newBlob(bytes, fileData.mimeType || 'application/octet-stream', fileData.filename);

  const safeName = [data.lastName, data.firstName, fileData.filename].join('_').replace(/[^\w.\- ]/g, '_');
  blob.setName(safeName);

  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function appendRegistrationRow(data, driveLink) {
  const sheet = getOrCreateSheet();
  sheet.appendRow([
    new Date(),
    data.firstName,
    data.lastName,
    data.email,
    data.whatsappViber,
    data.passType,
    data.numberOfPasses,
    data.otherAttendees || '',
    data.paymentMethod,
    driveLink,
  ]);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(SHEET_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
