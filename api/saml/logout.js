/**
 * SAML Logout Endpoint
 * Handles user logout and SAML SLO if configured
 */

const { createServiceProvider } = require('../../lib/saml-config');

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Clear session cookie
    const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
    const secureFlag = isProduction ? 'Secure; ' : '';
    const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
    res.setHeader('Set-Cookie', [
      `saml_session=; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=0`,
      `saml_request_id=; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=0`
    ]);

    // If SAML SLO is configured, initiate logout with IdP
    const { sp, idp } = createServiceProvider();
    
    if (idp.sso_logout_url) {
      sp.create_logout_request_url(idp, {}, (err, logoutUrl) => {
        if (err) {
          console.error('Error creating SAML logout request:', err);
          // Still clear local session even if SLO fails
          return res.writeHead(302, {
            'Location': '/'
          });
        }

        // Redirect to IdP for SLO
        res.writeHead(302, {
          'Location': logoutUrl
        });
        res.end();
      });
    } else {
      // Just clear local session
      res.writeHead(302, {
        'Location': '/'
      });
      res.end();
    }
  } catch (error) {
    console.error('SAML logout error:', error);
    // Clear cookies anyway
    const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
    const secureFlag = isProduction ? 'Secure; ' : '';
    const sameSiteFlag = isProduction ? 'SameSite=None' : 'SameSite=Lax';
    res.setHeader('Set-Cookie', [
      `saml_session=; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=0`,
      `saml_request_id=; HttpOnly; ${secureFlag}${sameSiteFlag}; Path=/; Max-Age=0`
    ]);
    
    res.writeHead(302, {
      'Location': '/'
    });
    res.end();
  }
};

