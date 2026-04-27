/**
 * Wealth Identity Decoder — Purchase Validator
 * Deploy this as a Google Apps Script Web App.
 *
 * Sheet structure:
 *   Column C (index 2): verified purchaser email
 *   Column D (index 3): day1 submission marker (non-empty = submitted)
 *   Column E (index 4): day2 submission marker (non-empty = submitted)
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

      // Find the row where column C matches the email
      const rowIdx = data.findIndex(row =>
        String(row[2]).toLowerCase().trim() === email
      );

      if (rowIdx === -1) {
        result = { valid: false, day1_submitted: false, day2_submitted: false };
      } else {
        const row = data[rowIdx];
        const day1_submitted = String(row[3] !== undefined ? row[3] : '').trim() !== '';
        const day2_submitted = String(row[4] !== undefined ? row[4] : '').trim() !== '';
        result = { valid: true, day1_submitted, day2_submitted };
      }

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
