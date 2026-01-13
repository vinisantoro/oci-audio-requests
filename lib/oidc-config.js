/**
 * OIDC Configuration for OCI Domains
 * 
 * This module provides OIDC configuration for connecting to OCI Identity Domains.
 * Adapted for Vercel serverless functions (no Express/Passport.js needed).
 */

/**
 * Get OIDC configuration from environment variables
 */
function getOIDCConfig() {
  const ociDomainUrl = process.env.OCI_DOMAIN_URL;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const callbackUrl = process.env.CALLBACK_URL || 'https://notes.dailybits.tech/api/auth/callback';
  const baseUrl = process.env.BASE_URL || 'https://notes.dailybits.tech';

  if (!ociDomainUrl) {
    throw new Error(
      'OCI_DOMAIN_URL environment variable is required. ' +
      'Get this from OCI Console > Identity & Security > Domains > [Your Domain] > Details. ' +
      'Format: https://<domain-id>.identity.oraclecloud.com'
    );
  }

  if (!clientId) {
    throw new Error(
      'CLIENT_ID environment variable is required. ' +
      'Get this from OCI Console > Identity & Security > Domains > [Your Domain] > Applications > [Your App] > Configuration'
    );
  }

  if (!clientSecret) {
    throw new Error(
      'CLIENT_SECRET environment variable is required. ' +
      'Get this from OCI Console > Identity & Security > Domains > [Your Domain] > Applications > [Your App] > Configuration'
    );
  }

  // Normalize domain URL (remove trailing slash)
  const normalizedDomainUrl = ociDomainUrl.replace(/\/$/, '');

  return {
    domainUrl: normalizedDomainUrl,
    clientId,
    clientSecret,
    callbackUrl,
    baseUrl,
    authorizationURL: `${normalizedDomainUrl}/oauth2/v1/authorize`,
    tokenURL: `${normalizedDomainUrl}/oauth2/v1/token`,
    userInfoURL: `${normalizedDomainUrl}/oauth2/v1/userinfo`,
    logoutURL: `${normalizedDomainUrl}/oauth2/v1/logout`,
    scope: 'openid profile email',
    responseType: 'code',
    grantType: 'authorization_code'
  };
}

/**
 * Generate OAuth2 authorization URL
 */
function getAuthorizationURL(state, nonce) {
  const config = getOIDCConfig();
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callbackUrl,
    response_type: config.responseType,
    scope: config.scope,
    state: state,
    nonce: nonce
  });

  return `${config.authorizationURL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
async function exchangeCodeForTokens(code) {
  const config = getOIDCConfig();
  
  const params = new URLSearchParams({
    grant_type: config.grantType,
    code: code,
    redirect_uri: config.callbackUrl,
    client_id: config.clientId,
    client_secret: config.clientSecret
  });

  const response = await fetch(config.tokenURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: params.toString()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token exchange failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Get user info from access token
 */
async function getUserInfo(accessToken) {
  const config = getOIDCConfig();
  
  const response = await fetch(config.userInfoURL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`UserInfo request failed: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Create session data from user info
 */
function createSessionData(userInfo, tokens) {
  return {
    email: userInfo.email || userInfo.sub || userInfo.preferred_username,
    name: userInfo.name || userInfo.display_name || userInfo.preferred_username,
    sub: userInfo.sub,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + (tokens.expires_in * 1000),
    sessionId: require('crypto').randomBytes(32).toString('hex')
  };
}

module.exports = {
  getOIDCConfig,
  getAuthorizationURL,
  exchangeCodeForTokens,
  getUserInfo,
  createSessionData
};
