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

module.exports = async (req, res) => {
  // Log request details for debugging
  console.log('Callback received:', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: {
      cookie: req.headers.cookie ? 'present' : 'missing',
      referer: req.headers.referer
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
    // Try to get from query string first (some OCI configurations send POST with query params)
    code = req.query?.code || req.body?.code;
    state = req.query?.state || req.body?.state;
    error = req.query?.error || req.body?.error;
    error_description = req.query?.error_description || req.body?.error_description;
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
      bodyKeys: Object.keys(req.body || {})
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
    const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
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
    return res.redirect(`/?error=${encodeURIComponent(error.message || 'authentication_failed')}`);
  }
};
