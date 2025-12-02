# Audio Upload Application

Web application for validating authorized users and uploading audio files to Oracle Cloud Infrastructure (OCI) Object Storage.

**🔒 Security:** The allowed email list and OCI bucket URL are protected in the backend (Serverless Functions), not exposed in the frontend code.

**📱 PWA:** The application can be installed on the home screen of mobile devices, functioning as a native app (Android and iOS).

## 🚀 Getting Started

### Prerequisites

- A hosting platform that supports Serverless Functions (e.g., Vercel, Netlify, AWS Lambda, etc.)
- An Oracle Cloud Infrastructure account with Object Storage configured
- A Pre-Authenticated Request (PAR) URL for direct uploads to OCI

### Configuration

Before deploying, you need to configure:

1. **Environment Variable:**
   - **Key:** `OCI_UPLOAD_URL`
   - **Value:** Your complete Pre-Authenticated Request (PAR) endpoint URL
     - Example: `https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/`
   - Make sure this variable is available in all environments (Production, Preview, Development)

2. **Email List:**
   - Edit the `allowedEmails` array in both `/api/validate-email.js` and `/api/get-upload-url.js`
   - Add or remove authorized email addresses
   - The list is embedded in the code to prevent it from being exposed as a static file

### Deployment

1. Configure the environment variable in your hosting platform
2. Deploy the application (the method depends on your hosting platform)
3. The Serverless Functions in the `/api` folder will be automatically deployed
4. Test the application by:
   - Validating an email from the allowed list
   - Recording and uploading a test audio file

## 📁 Project Structure

```
/
├── api/                          # Serverless Functions (Backend)
│   ├── validate-email.js        # Email validation API (email list embedded in code)
│   └── get-upload-url.js        # API that returns PAR upload URL
├── app.js                        # Frontend (no sensitive data)
├── pwa.js                        # PWA code (installation and service worker)
├── sw.js                         # Service Worker (caching and offline support)
├── manifest.json                 # PWA manifest (app configuration)
├── icon-192.png                  # PWA icon 192x192
├── icon-512.png                  # PWA icon 512x512
├── icon-oracle.svg               # SVG source for icons
├── index.html                    # HTML interface
├── styles.css                    # Styles
└── vercel.json                   # Platform-specific configuration (if applicable)
```

**Notes:**

- The email list is embedded directly in `validate-email.js` and `get-upload-url.js`. This ensures it's not accessible as a static file, even in local development.
- No `config.js` file is needed - configuration is done via environment variables.
- **PWA:** Icons are included in the project. The application can be installed on the home screen.

## 🔐 Security Implementation

### Architecture

- ✅ Email list embedded directly in Serverless Functions (not accessible as static file)
- ✅ OCI bucket URL protected in `OCI_UPLOAD_URL` environment variable (not exposed)
- ✅ Email validation performed on the backend
- ✅ Direct upload to OCI using Pre-Authenticated Request (PAR) URLs
- ✅ No sensitive data in frontend code

### How It Works

1. **Email Validation:**
   - User enters email in frontend
   - Frontend calls `/api/validate-email` (POST)
   - Backend checks against protected list
   - Returns `valid: true/false` without exposing the list

2. **Upload:**
   - Frontend calls `/api/get-upload-url` (POST) with email
   - Backend validates email and returns PAR URL for upload
   - Frontend uploads **directly** to OCI using the PAR URL (PUT)
   - Upload bypasses the server, avoiding timeout issues for large files

## 📝 Managing Email List

To add or remove authorized emails:

1. Edit both `/api/validate-email.js` and `/api/get-upload-url.js`
2. Add or remove emails from the `allowedEmails` array in both files
3. Commit and push changes
4. Your hosting platform will automatically deploy the updates

**Important:**

- The list is embedded in the Serverless Functions code, not as a separate file
- This ensures it's not accessible as a static file
- You must update the list in BOTH files (`validate-email.js` and `get-upload-url.js`)

## 🛠️ Local Development

### Option 1: Using Platform CLI (Recommended)

If your hosting platform provides a CLI (e.g., Vercel CLI, Netlify CLI):

```bash
# Install platform CLI
npm i -g <platform-cli>

# Login
<platform-cli> login

# Pull environment variables locally
<platform-cli> env pull .env.local

# Run locally
<platform-cli> dev
```

The application will be available at `http://localhost:3000` (or the port specified by your platform)

### Option 2: Static Server (Limited Functionality)

For basic frontend testing without backend APIs:

```bash
# Use a simple static server
npx serve .
```

**Note:** Serverless Functions APIs will only work completely when deployed or using the platform's local development server.

## 📱 PWA (Progressive Web App)

The application can be installed on the home screen of mobile devices (Android and iOS), functioning as a native application.

### PWA Features

- ✅ Home screen installation
- ✅ Offline functionality (after first visit)
- ✅ Full-screen mode (no browser bar)
- ✅ Custom icon on home screen
- ✅ Custom install prompt

### Testing on Mobile

#### Android (Chrome/Edge)

1. Open **Chrome** or **Edge** on your mobile device
2. Navigate to your application URL
3. Wait a few seconds - a banner will appear at the bottom:
   ```
   Install this app on your home screen for quick access!
   [Install] [Not now]
   ```
4. Tap **"Install"**
5. Confirm when the system prompts
6. The icon will appear on your home screen

**If the prompt doesn't appear:**

- Tap the **3 dots** (menu) → **"Install app"** or **"Add to home screen"**

#### iOS (iPhone/iPad) - Safari Only

**⚠️ IMPORTANT:** On iOS, PWA only works in Safari. Chrome/Firefox/Edge do not support it.

1. Open **Safari** (does not work in Chrome/Firefox on iOS)
2. Navigate to your application URL
3. Tap the **share button** (square with upward arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Confirm
6. The icon will appear on your home screen

### PWA Icons

Icons are included in the project:

- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
- `icon-oracle.svg` (SVG source)

To regenerate icons, use the `icon-oracle.svg` file as a base and convert to PNG at the required sizes.

### Customizing PWA

To change theme colors, edit `manifest.json`:

```json
{
  "theme_color": "#c74634",
  "background_color": "#f4f2f0"
}
```

To change the app name, edit `manifest.json`:

```json
{
  "name": "Audio Upload App",
  "short_name": "Audio App"
}
```

## 🔄 Application Flow

1. **Email Validation:**
   - User enters email in frontend
   - Frontend calls `/api/validate-email` (POST)
   - Backend verifies against protected list
   - Returns `valid: true/false` without exposing the list
   - Error toast appears if email is invalid

2. **Audio Recording:**
   - User records audio in browser (MediaRecorder API)
   - Audio is available for preview

3. **Upload:**
   - Frontend calls `/api/get-upload-url` (POST) with email
   - Backend validates email and returns PAR URL for upload
   - Frontend uploads **directly** to OCI using PAR URL (PUT)
   - Upload bypasses the server, avoiding timeout for large files
   - Success/error toast appears based on result

## 🐛 Troubleshooting

### Error: "Email not authorized"

- Verify the email is in the list in `/api/validate-email.js` and `/api/get-upload-url.js`
- Ensure the email is lowercase in the list
- Remember to update the list in BOTH files

### Error: "Server configuration incomplete"

- Verify the `OCI_UPLOAD_URL` environment variable is configured
- Ensure the variable is available in all environments

### Error: "Upload failed"

- Verify the OCI PAR is active and has write permissions
- Check your hosting platform's function logs
- Since upload is done directly from browser to OCI, also check the browser console for CORS or network errors

### APIs don't work locally

- Use your platform's local development server (e.g., `vercel dev`, `netlify dev`)
- Or deploy to your hosting platform for complete testing

### PWA doesn't work on iOS

- **Use Safari only** - Chrome/Firefox/Edge on iOS do not support PWA
- Verify you're accessing via HTTPS (required for PWA)
- Clear Safari cache if necessary

### Install prompt doesn't appear

- Verify you're on HTTPS (required)
- Check browser console for errors
- Some browsers only show after multiple visits
- On Android, use the browser menu (3 dots → Install app)

### Icons don't appear

- Verify `icon-192.png` and `icon-512.png` files are in the project root
- Verify paths in `manifest.json` are correct
- Clear browser cache

## 📚 Resources

- [Oracle Cloud Infrastructure - Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm)
- [Progressive Web Apps - MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com/)
- [MediaRecorder API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

## 📄 License

This project is open source and available for anyone to implement their own version.
