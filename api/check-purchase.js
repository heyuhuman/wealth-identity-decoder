/**
 * Vercel serverless function — purchase validation proxy.
 * Calls the Google Apps Script (server-to-server, no CORS issues)
 * and returns { valid: true | false }.
 */

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyC6gUFfl_-HL892Ig5kmRGslrKIVgzB01tmsPXAfKUvwJwl6-N6qbjfQIZ9T9I3PFadQ/exec';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const email = ((req.query.email) || '').toLowerCase().trim();

  if (!email) {
    return res.status(200).json({ valid: false });
  }

  try {
    const upstream = await fetch(
      `${APPS_SCRIPT_URL}?email=${encodeURIComponent(email)}`,
      { redirect: 'follow' }
    );

    const data = await upstream.json();
    return res.status(200).json({
      valid: data.valid === true,
      day1_submitted: data.day1_submitted === true,
      day2_submitted: data.day2_submitted === true,
    });

  } catch (err) {
    // Fail open — don't block real purchasers due to a lookup error
    console.error('check-purchase error:', err.message);
    return res.status(200).json({ valid: true, error: 'lookup_failed' });
  }
}
