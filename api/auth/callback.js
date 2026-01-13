/**
 * OIDC Callback Endpoint
 * Processes OIDC callback from OCI Domain
 */

const { exchangeCodeForTokens, getUserInfo, createSessionData } = require('../../lib/oidc-config');
const crypto = require('crypto');

/**
 * Parse cookies from request
 */
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    cookies[name] = rest.join('=');
  });
  
  return cookies;
}

/**
 * Parse request body for POST requests
 * Vercel automatically parses JSON and form-urlencoded, but we need to handle edge cases
 */
async function parseRequestBody(req) {
  if (req.method !== 'POST') {
    return {};
  }

  // Vercel already parses the body, but handle cases where it might not be available
  if (req.body) {
    return req.body;
  }

  // If body is a string (form-urlencoded), parse it
  if (typeof req.body === 'string') {
    const params = new URLSearchParams(req.body);
    const parsed = {};
    for (const [key, value] of params.entries()) {
      parsed[key] = value;
    }
    return parsed;
  }

  return {};
}

module.exports = async (req, res) => {
  try {
    // Log request details for debugging (but limit sensitive data)
    console.log('Callback received:', {
      method: req.method,
      url: req.url,
      hasQuery: !!req.query,
      hasBody: !!req.body,
      headers: {
        cookie: req.headers.cookie ? 'present' : 'missing',
        'content-type': req.headers['content-type']
      }
    });

    // Handle both GET and POST (OCI Domain might use POST)
    let code, state, error, error_description;
    
    if (req.method === 'GET') {
      code = req.query?.code;
      state = req.query?.state;
      error = req.query?.error;
      error_description = req.query?.error_description;
    } else if (req.method === 'POST') {
      // Parse body if needed
      const body = await parseRequestBody(req);
      
      // Try to get from query string first (some OCI configurations send POST with query params)
      code = req.query?.code || body?.code;
      state = req.query?.state || body?.state;
      error = req.query?.error || body?.error;
      error_description = req.query?.error_description || body?.error_description;
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Handle OAuth errors
    if (error) {
      console.error('OAuth error:', error, error_description);
      return res.redirect(`/?error=${encodeURIComponent(error_description || error)}`);
    }

    if (!code || !state) {
      console.error('Missing parameters:', { 
        hasCode: !!code, 
        hasState: !!state,
        method: req.method,
        queryKeys: Object.keys(req.query || {}),
        bodyKeys: Object.keys(await parseRequestBody(req))
      });
      return res.redirect('/?error=missing_parameters&details=' + encodeURIComponent(`code=${!!code},state=${!!state},method=${req.method}`));
    }

    // Validate state from cookie
    const cookies = parseCookies(req.headers.cookie);
    const storedState = cookies.oidc_state;
    const storedNonce = cookies.oidc_nonce;

    if (!storedState || storedState !== state) {
      console.error('State mismatch:', { received: state, stored: storedState });
      return res.redirect('/?error=invalid_state');
    }

    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get user info
    const userInfo = await getUserInfo(tokens.access_token);

    // Validate nonce if present in ID token (for production, should verify JWT)
    // For now, we'll trust the OCI Domain

    // Create session data
    const sessionData = createSessionData(userInfo, tokens);

    // Create session token
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    // Set session cookie
    // Detect production environment more reliably
    const isProduction = process.env.VERCEL_ENV === 'production' || 
                        (process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://'));
    const secureFlag = isProduction ? 'Secure; ' : '';
    const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
    
    const cookieOptions = [
      `oidc_session=${sessionToken}`,
      'HttpOnly',
      secureFlag ? 'Secure' : '',
      sameSiteFlag,
      'Path=/',
      `Max-Age=${8 * 60 * 60}` // 8 hours
    ].filter(Boolean).join('; ');

    res.setHeader('Set-Cookie', [
      cookieOptions,
      `oidc_state=; HttpOnly; Path=/; Max-Age=0`, // Clear state cookie
      `oidc_nonce=; HttpOnly; Path=/; Max-Age=0` // Clear nonce cookie
    ]);

    // Optional: Validate email against allowlist if configured
    const allowedEmailsEnv = process.env.ALLOWED_EMAILS;
    if (allowedEmailsEnv) {
      try {
        const allowedEmails = JSON.parse(allowedEmailsEnv);
        const allowedEmailSet = new Set(allowedEmails.map(email => email.toLowerCase()));
        const userEmail = sessionData.email.toLowerCase();
        
        if (!allowedEmailSet.has(userEmail)) {
          // Clear session and redirect with error
          res.setHeader('Set-Cookie', `oidc_session=; HttpOnly; Path=/; Max-Age=0`);
          return res.redirect('/?error=email_not_authorized');
        }
      } catch (e) {
        console.error('Error parsing ALLOWED_EMAILS:', e);
      }
    }

    // Redirect to application home (clean URL, no OAuth params)
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  } catch (error) {
    console.error('OIDC callback error:', error);
    console.error('Error stack:', error.stack);
    return res.redirect(`/?error=${encodeURIComponent(error.message || 'authentication_failed')}`);
  }
};
