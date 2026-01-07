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
        console.error('Error details:', JSON.stringify(err, null, 2));
        
        // Provide more helpful error messages
        let errorMessage = 'Failed to initiate SSO login';
        let errorDetails = err.message || err.toString();
        
        if (errorDetails.includes('metadata') || errorDetails.includes('fetch')) {
          errorMessage = 'Failed to fetch IDP metadata. Please configure OCI_IDP_CERTIFICATES instead of OCI_IDP_METADATA_URL, or ensure the metadata URL is accessible.';
        } else if (errorDetails.includes('certificate') || errorDetails.includes('cert')) {
          errorMessage = 'IDP certificate configuration error. Please verify OCI_IDP_CERTIFICATES is correctly configured.';
        } else if (errorDetails.includes('sso_login_url') || errorDetails.includes('SSO URL')) {
          errorMessage = 'IDP SSO URL not configured. Please set OCI_IDP_SSO_URL or OCI_IDP_METADATA_URL.';
        }
        
        return res.status(500).json({ 
          error: errorMessage,
          details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' ? errorDetails : undefined,
          hint: 'Check Vercel logs for more details. Ensure OCI_IDP_METADATA_URL is accessible or use OCI_IDP_SSO_URL + OCI_IDP_CERTIFICATES instead.'
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
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'SAML configuration error',
      details: process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview' ? error.message : undefined,
      hint: 'Check that OCI_IDP_METADATA_URL or OCI_IDP_SSO_URL + OCI_IDP_CERTIFICATES are configured in Vercel environment variables.'
    });
  }
};

