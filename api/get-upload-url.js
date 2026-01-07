const allowedEmailsEnv = process.env.ALLOWED_EMAILS;
let allowedEmails = [];

if (allowedEmailsEnv) {
  try {
    allowedEmails = JSON.parse(allowedEmailsEnv);
  } catch (e) {
    allowedEmails = [];
  }
}

const allowedEmailSet = new Set(
  allowedEmails.map((email) => email.toLowerCase())
);

/**
 * Extract user session from cookie
 */
function getSessionFromCookie(req) {
  const cookies = req.headers.cookie || '';
  const sessionCookie = cookies.split(';').find(c => c.trim().startsWith('saml_session='));
  
  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionToken = sessionCookie.split('=')[1];
    const sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString());
    
    // Check if session expired
    if (sessionData.expires && Date.now() > sessionData.expires) {
      return null;
    }

    return sessionData;
  } catch (error) {
    console.error('Error parsing session:', error);
    return null;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Cookie');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get user from SAML session
    const session = getSessionFromCookie(req);
    
    if (!session || !session.email) {
      return res.status(401).json({ 
        error: 'Authentication required. Please log in via SSO.' 
      });
    }

    const normalizedEmail = session.email.toLowerCase();
    const OCI_UPLOAD_URL = process.env.OCI_UPLOAD_URL;

    // Optional: Validate against allowed emails list if configured
    // This provides an extra layer of security if you want to restrict
    // access even for authenticated SAML users
    if (allowedEmailSet.size > 0 && !allowedEmailSet.has(normalizedEmail)) {
      return res.status(403).json({ 
        error: 'Your account is not authorized for uploads' 
      });
    }

    if (!OCI_UPLOAD_URL) {
      return res.status(500).json({ 
        error: 'Server configuration incomplete' 
      });
    }

    const safeEmail = normalizedEmail.replace(/[^a-z0-9._-]/g, '-');
    const fileName = `${safeEmail}-${Date.now()}.webm`;
    const encodedName = encodeURIComponent(fileName);
    
    const trimmedUrl = OCI_UPLOAD_URL.trim();
    const endsWithSlash = trimmedUrl.endsWith('/');
    const uploadUrl = `${trimmedUrl}${endsWithSlash ? '' : '/'}${encodedName}`;

    return res.status(200).json({ 
      success: true,
      uploadUrl: uploadUrl,
      fileName: fileName,
      email: normalizedEmail,
      userName: session.name || normalizedEmail
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};
