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

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        valid: false, 
        error: 'Email is required' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const isValid = allowedEmailSet.has(normalizedEmail);

    if (isValid) {
      return res.status(200).json({ 
        valid: true, 
        message: 'Email validated successfully' 
      });
    } else {
      return res.status(200).json({ 
        valid: false, 
        error: 'This email is not authorized. Please verify you entered the correct corporate address.' 
      });
    }
  } catch (error) {
    return res.status(500).json({ 
      valid: false, 
      error: 'Internal server error' 
    });
  }
};
