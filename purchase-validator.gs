/**
 * Wealth Identity Decoder — Purchase Validator
 * Deploy this as a Google Apps Script Web App.
 *
 * Sheet structure: The script searches ALL cells in the active sheet
 * for the email address, so column order doesn't matter.
 */

const SHEET_ID = '1XWMwuwCKOJh9YCk7PVhyV6w4o8E9XDWuyA_YQ_pAWuk';

function doGet(e) {
  const email    = ((e.parameter.email) || '').toLowerCase().trim();
  const callback = e.parameter.callback; // JSONP callback name

  let result;

  if (!email) {
    result = { valid: false, error: 'no_email' };
  } else {
    try {
      const ss    = SpreadsheetApp.openById(SHEET_ID);
      const sheet = ss.getActiveSheet();
      const data  = sheet.getDataRange().getValues();

      // Search every cell in the sheet for the email
      const found = data.some(row =>
        row.some(cell => String(cell).toLowerCase().trim() === email)
      );

      result = { valid: found };

    } catch (err) {
      // If lookup fails for any reason, fail OPEN so real purchasers
      // aren't accidentally blocked by a script/permissions error.
      result = { valid: true, error: 'lookup_failed' };
    }
  }

  // Return JSONP if a callback name was provided (used by the chatbot)
  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(result)})`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // Plain JSON fallback
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
