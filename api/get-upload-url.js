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

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { email } = req.body;
    const OCI_UPLOAD_URL = process.env.OCI_UPLOAD_URL;

    if (!email) {
      return res.status(400).json({ 
        error: 'Uploader email is required' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    if (!allowedEmailSet.has(normalizedEmail)) {
      return res.status(403).json({ 
        error: 'Email not authorized for upload' 
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
      email: normalizedEmail
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
};
