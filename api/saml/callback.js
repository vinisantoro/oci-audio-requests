/**
 * SAML Callback Endpoint
 * Processes SAML Response from Identity Provider
 */

const { createServiceProvider } = require('../../lib/saml-config');
const { URL } = require('url');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sp, idp } = createServiceProvider();
    
    // Vercel parses form-urlencoded automatically, but handle both cases
    let samlResponse, relayState;
    if (typeof req.body === 'string') {
      // If body is a string, parse it manually
      const params = new URLSearchParams(req.body);
      samlResponse = params.get('SAMLResponse');
      relayState = params.get('RelayState') || '/';
    } else {
      // Body is already parsed
      samlResponse = req.body?.SAMLResponse;
      relayState = req.body?.RelayState || '/';
    }

    if (!samlResponse) {
      return res.status(400).json({ error: 'SAMLResponse is required' });
    }

    // Parse and validate SAML response
    sp.post_assert(idp, { SAMLResponse: samlResponse }, (err, samlAssertion) => {
      if (err) {
        console.error('Error validating SAML response:', err);
        return res.status(401).json({ 
          error: 'Invalid SAML response',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      // Extract user information from SAML assertion
      const userEmail = samlAssertion.user?.name_id || 
                       samlAssertion.user?.email || 
                       samlAssertion.user?.mail ||
                       samlAssertion.user?.attributes?.email?.[0] ||
                       samlAssertion.user?.attributes?.mail?.[0] ||
                       samlAssertion.user?.attributes?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']?.[0];

      if (!userEmail) {
        console.error('No email found in SAML assertion:', JSON.stringify(samlAssertion.user, null, 2));
        return res.status(400).json({ 
          error: 'User email not found in SAML assertion'
        });
      }

      // Create session token (simple approach for serverless)
      // In production, use a proper session store or JWT
      const sessionToken = Buffer.from(JSON.stringify({
        email: userEmail.toLowerCase(),
        name: samlAssertion.user?.name || samlAssertion.user?.displayName || userEmail,
        sessionId: require('crypto').randomBytes(32).toString('hex'),
        expires: Date.now() + (8 * 60 * 60 * 1000) // 8 hours
      })).toString('base64');

      // Set session cookie
      // Use Secure only in production (HTTPS), allow SameSite=Lax for local dev
      const isProduction = process.env.VERCEL_URL && process.env.VERCEL_URL.startsWith('https://');
      const cookieOptions = [
        `saml_session=${sessionToken}`,
        'HttpOnly',
        isProduction ? 'Secure' : '',
        isProduction ? 'SameSite=None' : 'SameSite=Lax',
        'Path=/',
        `Max-Age=${8 * 60 * 60}` // 8 hours
      ].filter(Boolean).join('; ');

      res.setHeader('Set-Cookie', cookieOptions);

      // Redirect to application
      const redirectUrl = relayState.startsWith('http') ? relayState : 
                         `${req.headers.origin || process.env.VERCEL_URL || 'https://your-app.vercel.app'}${relayState}`;
      
      res.writeHead(302, {
        'Location': redirectUrl
      });
      res.end();
    });
  } catch (error) {
    console.error('SAML callback error:', error);
    return res.status(500).json({ 
      error: 'Error processing SAML callback',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

