/**
 * Authentication Status Endpoint
 * Returns current user session information (OIDC)
 */

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

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Extract session from cookie
    const cookies = parseCookies(req.headers.cookie);
    const sessionCookie = cookies.oidc_session;
    
    if (!sessionCookie) {
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }

    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie, 'base64').toString());
      
      // Check if session expired
      if (sessionData.expiresAt && Date.now() > sessionData.expiresAt) {
        return res.status(200).json({
          authenticated: false,
          user: null,
          expired: true
        });
      }

      return res.status(200).json({
        authenticated: true,
        user: {
          email: sessionData.email,
          name: sessionData.name,
          sub: sessionData.sub
        }
      });
    } catch (parseError) {
      console.error('Error parsing session token:', parseError);
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }
  } catch (error) {
    console.error('Auth status error:', error);
    return res.status(500).json({ 
      error: 'Error checking authentication status'
    });
  }
};


