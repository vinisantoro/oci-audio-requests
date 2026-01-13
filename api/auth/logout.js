/**
 * OIDC Logout Endpoint
 * Ends user session and optionally redirects to OCI Domain logout
 */

const { getOIDCConfig } = require('../../lib/oidc-config');

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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear session cookie
    const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
    const secureFlag = isProduction ? 'Secure; ' : '';
    const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
    
    res.setHeader('Set-Cookie', [
      `oidc_session=; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=0`,
      `oidc_state=; HttpOnly; Path=/; Max-Age=0`,
      `oidc_nonce=; HttpOnly; Path=/; Max-Age=0`
    ]);

    // Optional: Redirect to OCI Domain logout endpoint for single logout
    // For now, just redirect to home
    const postLogoutUrl = req.query.redirect || '/';

    res.writeHead(302, {
      'Location': postLogoutUrl
    });
    res.end();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if there's an error, clear cookies and redirect
    res.setHeader('Set-Cookie', `oidc_session=; HttpOnly; Path=/; Max-Age=0`);
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  }
};
