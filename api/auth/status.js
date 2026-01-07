/**
 * Authentication Status Endpoint
 * Returns current user session information
 */

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
    const cookies = req.headers.cookie || '';
    const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('saml_session='));
    
    if (!sessionCookie) {
      return res.status(200).json({
        authenticated: false,
        user: null
      });
    }

    const sessionToken = sessionCookie.split('=')[1];
    
    try {
      const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
      
      // Check if session expired
      if (sessionData.expires && Date.now() > sessionData.expires) {
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
          name: sessionData.name
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


