/**
 * OIDC Login Endpoint
 * Initiates OIDC flow by redirecting to OCI Domain authorization endpoint
 */

const { getAuthorizationURL } = require('../../lib/oidc-config');
const crypto = require('crypto');

module.exports = async (req, res) => {
  // Handle POST requests that might come from OCI Domain redirects
  // OCI Domain may redirect here after authentication, redirect to callback
  if (req.method === 'POST') {
    const callbackUrl = process.env.CALLBACK_URL || 'https://notes.dailybits.tech/api/auth/callback';
    const params = new URLSearchParams();
    
    // Collect parameters from query string or body
    if (req.query?.code) params.set('code', req.query.code);
    if (req.query?.state) params.set('state', req.query.state);
    if (req.query?.error) params.set('error', req.query.error);
    
    if (req.body) {
      if (req.body.code) params.set('code', req.body.code);
      if (req.body.state) params.set('state', req.body.state);
      if (req.body.error) params.set('error', req.body.error);
    }
    
    // Redirect to callback with any parameters found
    const redirectUrl = params.toString() 
      ? `${callbackUrl}?${params.toString()}`
      : callbackUrl;
    
    res.writeHead(302, {
      'Location': redirectUrl
    });
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate state and nonce for security
    const state = crypto.randomBytes(32).toString('hex');
    const nonce = crypto.randomBytes(32).toString('hex');

    // Store state and nonce in cookies for validation in callback
    // Detect production environment more reliably
    const isProduction = process.env.VERCEL_ENV === 'production' || 
                        (process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://'));
    const secureFlag = isProduction ? 'Secure; ' : '';
    const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
    
    res.setHeader('Set-Cookie', [
      `oidc_state=${state}; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=600`,
      `oidc_nonce=${nonce}; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=600`
    ]);

    // Get authorization URL
    const authUrl = getAuthorizationURL(state, nonce);

    // Redirect to OCI Domain authorization endpoint
    res.writeHead(302, {
      'Location': authUrl
    });
    res.end();
  } catch (error) {
    console.error('OIDC login error:', error);
    return res.status(500).json({ 
      error: 'OIDC configuration error',
      details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' ? error.message : undefined,
      hint: 'Check that OCI_DOMAIN_URL, CLIENT_ID, CLIENT_SECRET, and CALLBACK_URL are configured in Vercel environment variables.'
    });
  }
};
