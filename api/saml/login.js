/**
 * SAML Login Endpoint
 * Initiates SSO flow by redirecting to Identity Provider
 */

const { createServiceProvider } = require('../../lib/saml-config');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sp, idp } = createServiceProvider();
    
    // Generate SAML AuthnRequest
    sp.create_login_request_url(idp, {}, (err, loginUrl, requestId) => {
      if (err) {
        console.error('Error creating SAML login request:', err);
        return res.status(500).json({ 
          error: 'Failed to initiate SSO login',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      // Store requestId in session/cookie for validation later
      // For serverless, we'll use a cookie
      const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
      const secureFlag = isProduction ? 'Secure; ' : '';
      const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
      res.setHeader('Set-Cookie', `saml_request_id=${requestId}; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=300`);
      
      // Redirect to Identity Provider
      res.writeHead(302, {
        'Location': loginUrl
      });
      res.end();
    });
  } catch (error) {
    console.error('SAML login error:', error);
    return res.status(500).json({ 
      error: 'SAML configuration error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

