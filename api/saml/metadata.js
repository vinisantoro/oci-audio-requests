/**
 * SAML Metadata Endpoint
 * Returns Service Provider metadata for registration in OCI Identity Provider
 */

const { getSPConfig } = require('../../lib/saml-config');
const saml2 = require('saml2-js');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const spOptions = getSPConfig();
    const sp = new saml2.ServiceProvider(spOptions);
    
    // Generate metadata XML
    sp.create_metadata((err, metadata) => {
      if (err) {
        console.error('Error creating SAML metadata:', err);
        return res.status(500).json({ 
          error: 'Failed to generate SAML metadata',
          details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
      }

      res.setHeader('Content-Type', 'application/xml');
      res.status(200).send(metadata);
    });
  } catch (error) {
    console.error('SAML metadata error:', error);
    return res.status(500).json({ 
      error: 'Error generating SAML metadata',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


