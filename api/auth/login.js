/**
 * OIDC Login Endpoint
 * Initiates OIDC flow by redirecting to OCI Domain authorization endpoint
 */

const { getAuthorizationURL } = require('../../lib/oidc-config');
const crypto = require('crypto');

module.exports = async (req, res) => {
  // Handle POST requests that might come from OCI Domain redirects
  // If this is a POST with OAuth parameters, redirect to callback
  if (req.method === 'POST' && (req.body?.code || req.query?.code)) {
    // OCI Domain redirected here with auth code, redirect to callback
    const callbackUrl = process.env.CALLBACK_URL || 'https://notes.dailybits.tech/api/auth/callback';
    const params = new URLSearchParams(req.query);
    if (req.body?.code) params.set('code', req.body.code);
    if (req.body?.state) params.set('state', req.body.state);
    if (req.body?.error) params.set('error', req.body.error);
    
    res.writeHead(302, {
      'Location': `${callbackUrl}?${params.toString()}`
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
    const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
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
