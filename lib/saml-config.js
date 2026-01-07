/**
 * SAML Configuration for OCI Identity Providers
 * 
 * This module provides SAML Service Provider configuration
 * to connect to OCI Identity Provider as a broker/intermediary.
 * 
 * Flow: Application -> OCI Identity Provider -> Corporate SAML IdP
 * The OCI Identity Provider acts as an intermediary/broker between
 * the application and the corporate SAML Identity Provider.
 */

const saml2 = require('saml2-js');

/**
 * Get SAML Service Provider configuration
 */
function getSPConfig() {
  // Use custom domain if available, otherwise fallback to VERCEL_URL or default
  const baseUrl = process.env.SAML_SP_BASE_URL || 
                  process.env.VERCEL_URL || 
                  'https://notes.dailybits.tech';
  
  const spEntityId = process.env.SAML_SP_ENTITY_ID || 
    `${baseUrl}/api/saml/metadata`;
  
  const assertionConsumerServiceUrl = process.env.SAML_ACS_URL || 
    `${baseUrl}/api/saml/callback`;
  
  const singleLogoutServiceUrl = process.env.SAML_SLO_URL || 
    `${baseUrl}/api/saml/logout`;

  return {
    entity_id: spEntityId,
    private_key: process.env.SAML_SP_PRIVATE_KEY || '',
    certificate: process.env.SAML_SP_CERTIFICATE || '',
    assert_endpoint: assertionConsumerServiceUrl,
    force_authn: true,
    auth_context: {
      comparison: 'exact',
      class_refs: ['urn:oasis:names:tc:SAML:1.0:am:password']
    },
    nameid_format: 'urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress',
    sign_get_request: false,
    allow_unencrypted_assertion: true
  };
}

/**
 * Get SAML Identity Provider configuration
 * 
 * This configures the OCI Identity Provider as the Identity Provider.
 * The OCI Identity Provider acts as a broker/intermediary to the corporate SAML IdP.
 */
function getIdPConfig() {
  // OCI Identity Provider metadata URL (preferred method)
  const ociIdpMetadataUrl = process.env.OCI_IDP_METADATA_URL;
  
  // OCI Identity Provider direct configuration (alternative)
  const ociIdpSsoUrl = process.env.OCI_IDP_SSO_URL;
  const ociIdpSloUrl = process.env.OCI_IDP_SLO_URL;
  const ociIdpCertificates = process.env.OCI_IDP_CERTIFICATES;

  // Legacy support: if OCI-specific vars not set, try generic SAML vars
  const idpMetadataUrl = ociIdpMetadataUrl || process.env.SAML_IDP_METADATA_URL;
  const idpSsoUrl = ociIdpSsoUrl || process.env.SAML_IDP_SSO_URL;
  const idpSloUrl = ociIdpSloUrl || process.env.SAML_IDP_SLO_URL;
  const idpCertificates = ociIdpCertificates || process.env.SAML_IDP_CERTIFICATES;

  if (!idpSsoUrl && !idpMetadataUrl) {
    throw new Error(
      'Either OCI_IDP_SSO_URL or OCI_IDP_METADATA_URL (or SAML_IDP_SSO_URL/SAML_IDP_METADATA_URL) ' +
      'environment variable is required. ' +
      'Get these from OCI Console > Identity & Security > Identity > Identity Providers > [Your IdP] > Metadata'
    );
  }

  const config = {
    sso_login_url: idpSsoUrl,
    sso_logout_url: idpSloUrl || (idpSsoUrl ? idpSsoUrl.replace('/sso', '/slo').replace('/saml2/idp/sso', '/saml2/idp/slo') : undefined),
    certificates: []
  };

  // If certificates are provided as environment variable (can be multiple, separated by -----SPLIT-----)
  if (idpCertificates) {
    const certs = idpCertificates.split('-----SPLIT-----').map(cert => cert.trim()).filter(Boolean);
    config.certificates = certs;
  } else if (idpMetadataUrl) {
    // Note: saml2-js doesn't automatically fetch metadata, so we need to provide certificates
    // For now, we'll throw a helpful error suggesting to use certificates directly
    throw new Error(
      'OCI_IDP_METADATA_URL is set but certificates are required. ' +
      'Please either:\n' +
      '1. Set OCI_IDP_CERTIFICATES with the certificate from the metadata URL, or\n' +
      '2. Fetch the metadata manually and extract the certificate, or\n' +
      '3. Use OCI_IDP_SSO_URL + OCI_IDP_CERTIFICATES instead.\n\n' +
      'To get the certificate:\n' +
      '1. Access: ' + idpMetadataUrl + '\n' +
      '2. Find the <X509Certificate> element\n' +
      '3. Copy the certificate content and set it as OCI_IDP_CERTIFICATES'
    );
  } else {
    throw new Error(
      'Either OCI_IDP_CERTIFICATES or OCI_IDP_SSO_URL + OCI_IDP_CERTIFICATES ' +
      '(or SAML_IDP_CERTIFICATES/SAML_IDP_SSO_URL + SAML_IDP_CERTIFICATES) ' +
      'must be provided. Get these from OCI Console > Identity & Security > Identity > Identity Providers'
    );
  }

  return config;
}

/**
 * Create SAML Service Provider instance
 */
function createServiceProvider() {
  try {
    const spOptions = getSPConfig();
    const idpOptions = getIdPConfig();

    return {
      sp: new saml2.ServiceProvider(spOptions),
      idp: new saml2.IdentityProvider(idpOptions)
    };
  } catch (error) {
    console.error('Error creating SAML Service Provider:', error);
    throw error;
  }
}

module.exports = {
  getSPConfig,
  getIdPConfig,
  createServiceProvider
};

