# Audio Upload Application

Web application for uploading audio files to Oracle Cloud Infrastructure (OCI) Object Storage with OIDC SSO authentication via OCI Identity Domains.

**🔒 Security:** Authentication is handled via OCI Identity Domains using OIDC (OpenID Connect). The OCI bucket URL is protected in the backend (Serverless Functions), not exposed in the frontend code.

**📱 PWA:** The application can be installed on the home screen of mobile devices, functioning as a native app (Android and iOS).

**🔐 Authentication:** Uses OIDC SSO with OCI Identity Domains. Users authenticate via corporate SSO before accessing the application.

## 🚀 Getting Started

### Prerequisites

- A hosting platform that supports Serverless Functions (e.g., Vercel, Netlify, AWS Lambda, etc.)
- An Oracle Cloud Infrastructure account with:
  - OCI Identity Domain configured
  - OIDC application registered in the Domain
  - Object Storage configured
  - A Pre-Authenticated Request (PAR) URL for direct uploads to OCI

### Configuration

Before deploying, you need to configure the following environment variables:

#### OIDC Authentication (Required)

1. **`OCI_DOMAIN_URL`** - URL base do OCI Identity Domain
   - Example: `https://<domain-id>.identity.oraclecloud.com`
   - Get this from: OCI Console > Identity & Security > Domains > [Your Domain] > Details

2. **`CLIENT_ID`** - Client ID da aplicação OIDC
   - Get this from: OCI Console > Identity & Security > Domains > [Your Domain] > Applications > [Your App] > Configuration

3. **`CLIENT_SECRET`** - Client Secret da aplicação OIDC
   - Get this from: OCI Console > Identity & Security > Domains > [Your Domain] > Applications > [Your App] > Configuration
   - **IMPORTANT:** Keep this secret secure and never commit it to version control

4. **`CALLBACK_URL`** - URL de callback OIDC
   - Example: `https://notes.dailybits.tech/callback`
   - Must match the "Custom Social Linking Callback URL" configured in OCI Domain

5. **`SESSION_SECRET`** - Secret para assinar cookies de sessão
   - Generate a random secure value (e.g., `openssl rand -base64 32`)

#### OCI Object Storage (Required)

6. **`OCI_UPLOAD_URL`** - Pre-Authenticated Request (PAR) endpoint URL
   - Example: `https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/`
   - Make sure this variable is available in all environments (Production, Preview, Development)

#### Optional Security Layer

7. **`ALLOWED_EMAILS`** - (Optional) JSON array of authorized email addresses
   - Example: `["user1@example.com","user2@example.com"]`
   - Provides an extra security layer even after OIDC authentication
   - **IMPORTANT:** Do NOT commit the email list to version control

### Deployment

#### Option 1: Using Vercel CLI (Recommended for large email lists)

1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Copy the example file: `cp ALLOWED_EMAILS.env.example ALLOWED_EMAILS.env`
4. Edit `ALLOWED_EMAILS.env` and add your real email list
5. Run the setup script:
   ```bash
   chmod +x scripts/setup-vercel-env.sh
   ./scripts/setup-vercel-env.sh
   ```
   Or manually set the variable:
   ```bash
   vercel env add ALLOWED_EMAILS production < ALLOWED_EMAILS.env
   vercel env add ALLOWED_EMAILS preview < ALLOWED_EMAILS.env
   vercel env add ALLOWED_EMAILS development < ALLOWED_EMAILS.env
   ```
6. Configure `OCI_UPLOAD_URL` via CLI or web interface
7. Deploy: `vercel --prod` or push to trigger automatic deployment

#### Option 2: Using Vercel Web Interface

1. Configure `OCI_UPLOAD_URL` in Settings > Environment Variables
2. For `ALLOWED_EMAILS`: If your list is small (< 2000 characters), you can paste it directly
3. If the list is too large, use **Option 1 (CLI)** instead
4. Deploy the application (push to trigger automatic deployment)

#### Testing

After deployment, test the application by:
- Validating an email from the allowed list
- Recording and uploading a test audio file

## 📁 Project Structure

```
/
├── api/                          # Serverless Functions (Backend)
│   └── auth/                     # OIDC Authentication APIs
│       ├── login.js              # Initiates OIDC flow
│       ├── callback.js           # Processes OIDC callback
│       ├── logout.js             # Ends user session
│       └── status.js             # Checks authentication status
│   └── get-upload-url.js         # API that returns PAR upload URL
├── lib/                          # Shared libraries
│   └── oidc-config.js           # OIDC configuration and utilities
├── app.js                        # Frontend (no sensitive data)
├── pwa.js                        # PWA code (installation and service worker)
├── sw.js                         # Service Worker (caching and offline support)
├── manifest.json                 # PWA manifest (app configuration)
├── icon-192.png                  # PWA icon 192x192
├── icon-512.png                  # PWA icon 512x512
├── icon-oracle.svg               # SVG source for icons
├── index.html                    # HTML interface
├── styles.css                    # Styles
├── OIDC_CONFIG.env.example       # Example OIDC configuration
└── vercel.json                   # Platform-specific configuration (if applicable)
```

**Notes:**

- OIDC authentication is handled via OCI Identity Domains
- All configuration is done via environment variables (see Configuration section)
- **PWA:** Icons are included in the project. The application can be installed on the home screen.

## 🔐 Security Implementation

### Architecture

- ✅ OIDC authentication via OCI Identity Domains (secure SSO)
- ✅ OCI bucket URL protected in `OCI_UPLOAD_URL` environment variable (not exposed)
- ✅ Optional email allowlist via `ALLOWED_EMAILS` environment variable (extra security layer)
- ✅ Email validation performed on the backend
- ✅ Direct upload to OCI using Pre-Authenticated Request (PAR) URLs
- ✅ No sensitive data in frontend code or version control

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

1. Go to your hosting platform's environment variables settings
2. Edit the `ALLOWED_EMAILS` environment variable
3. Update the JSON array string with the new list of emails
   - Example: `["email1@example.com","email2@example.com","newemail@example.com"]`
4. Save the changes
5. Redeploy your application (or wait for automatic redeploy if enabled)

**Important:**

- The email list is stored only in environment variables, never in code files
- This ensures it's not accessible as a static file or exposed in version control
- You only need to update the environment variable (no code changes needed)
- **Security:** Never commit the email list to version control. It should only exist in your hosting platform's environment variables.
- See `ALLOWED_EMAILS.env.example` for the complete list format

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

1. **OIDC Authentication:**

   - User accesses application
   - Frontend checks authentication status via `/api/auth/status`
   - If not authenticated, user is prompted to login
   - User clicks "Entrar com SSO Corporativo"
   - Frontend redirects to `/api/auth/login`
   - Backend redirects to OCI Identity Domain OAuth2 endpoint
   - User authenticates with corporate credentials
   - OCI Domain redirects back to `/api/auth/callback` with authorization code
   - Backend exchanges code for tokens and creates session
   - User is redirected to application authenticated

2. **Audio Recording:**

   - User records audio in browser (MediaRecorder API)
   - Audio is available for preview

3. **Upload:**
   - Frontend calls `/api/get-upload-url` (POST)
   - Backend validates OIDC session and returns PAR URL for upload
   - Frontend uploads **directly** to OCI using PAR URL (PUT)
   - Upload bypasses the server, avoiding timeout for large files
   - Success/error toast appears based on result

## 📋 Política de Uso

### 1. Uso Autorizado

Esta ferramenta é destinada exclusivamente para uso corporativo autorizado. Apenas colaboradores com endereço de e-mail corporativo validado podem utilizar o serviço.

### 2. Responsabilidades do Usuário

O usuário é responsável por:

- Garantir que o conteúdo do áudio enviado esteja em conformidade com as políticas corporativas
- Manter a confidencialidade de suas credenciais de acesso
- Não utilizar a ferramenta para fins não autorizados
- Respeitar direitos de propriedade intelectual e privacidade

### 3. Limitações

- Os arquivos de áudio são armazenados temporariamente e podem ser removidos conforme políticas de retenção
- A ferramenta não garante backup automático dos arquivos enviados
- O uso indevido pode resultar em suspensão do acesso

### 4. Privacidade e Segurança

Todos os dados são tratados de acordo com as políticas de segurança e privacidade corporativas. Os arquivos são transmitidos e armazenados de forma segura no Oracle Cloud Infrastructure.

## 📖 Como Usar

### Exemplo de conteúdo esperado:

> Hoje, na reunião sobre o projeto de Automação de Atendimento, participaram João Silva, Gerente de TI, e Maria Santos, Arquiteta de Soluções. O objetivo da reunião foi alinhar os requisitos técnicos e funcionais para a implementação do novo sistema de integração, bem como discutir prazos, responsabilidades e riscos associados ao projeto. Os principais pontos discutidos incluíram a visão geral da arquitetura proposta para a solução e as limitações técnicas identificadas no ambiente atual. As decisões tomadas foram a aprovação da arquitetura de referência apresentada e a definição do uso de serviços cloud gerenciados, com o objetivo de reduzir o esforço operacional. Como próximos passos, ficou definido elaborar o desenho detalhado da arquitetura até a próxima semana e agendar a prova de conceito com a equipa técnica.

### Passo 1: Valide seu e-mail

Digite seu endereço de e-mail corporativo no campo indicado e clique em "Validar". O sistema verificará se você tem permissão para usar a ferramenta.

### Passo 2: Inicie a gravação

Após a validação, clique no botão "Iniciar gravação". O sistema solicitará permissão para acessar o microfone do seu dispositivo. Permita o acesso quando solicitado.

### Passo 3: Grave seu áudio

Fale claramente no microfone. Você verá um cronômetro indicando a duração da gravação. Quando terminar, clique novamente no botão (que agora mostrará "Parar gravação").

### Passo 4: Pré-visualize

Antes de enviar, você pode ouvir o áudio gravado usando o player de áudio que aparecerá na tela. Certifique-se de que o conteúdo está correto.

### Passo 5: Envie

Clique no botão "Enviar gravação". O arquivo será enviado diretamente para o Oracle Cloud Infrastructure. Aguarde a confirmação de sucesso antes de fechar a página.

### Dicas

- Use um ambiente silencioso para melhor qualidade de áudio
- Mantenha o dispositivo próximo durante a gravação
- Verifique sua conexão com a internet antes de enviar
- Em dispositivos móveis, você pode instalar o app na tela inicial para acesso rápido

## 🎙️ Melhorando seu áudio

Este aplicativo destina-se ao registo e à organização automática de informações de reuniões a partir de áudios fornecidos pelos utilizadores. O áudio submetido **não pode ultrapassar 5 (cinco) minutos**, sendo este limite essencial para garantir o correto processamento e a qualidade do conteúdo gerado.

### Exemplo de conteúdo esperado:

> Hoje, na reunião sobre o projeto de Automação de Atendimento, participaram João Silva, Gerente de TI, e Maria Santos, Arquiteta de Soluções. O objetivo da reunião foi alinhar os requisitos técnicos e funcionais para a implementação do novo sistema de integração, bem como discutir prazos, responsabilidades e riscos associados ao projeto. Os principais pontos discutidos incluíram a visão geral da arquitetura proposta para a solução e as limitações técnicas identificadas no ambiente atual. As decisões tomadas foram a aprovação da arquitetura de referência apresentada e a definição do uso de serviços cloud gerenciados, com o objetivo de reduzir o esforço operacional. Como próximos passos, ficou definido elaborar o desenho detalhado da arquitetura até a próxima semana e agendar a prova de conceito com a equipa técnica.

**Importante:** O conteúdo gerado pelo aplicativo constitui apenas um resumo estruturado com base no áudio fornecido e não substitui atas oficiais, documentos formais ou decisões com valor jurídico. A validação final das informações é de responsabilidade dos participantes da reunião.

## 🐛 Troubleshooting

### Error: "OIDC configuration error"

- Verify that `OCI_DOMAIN_URL`, `CLIENT_ID`, `CLIENT_SECRET`, and `CALLBACK_URL` are configured
- Check that `CALLBACK_URL` matches exactly what's configured in OCI Domain
- See [README_OIDC.md](README_OIDC.md) for detailed OIDC troubleshooting

### Error: "Authentication required"

- User session may have expired (sessions expire after 8 hours)
- User needs to login again via SSO
- Check that cookies are enabled in the browser

### Error: "Server configuration incomplete"

- Verify `OCI_UPLOAD_URL` environment variable is configured
- Ensure the variable is available in all environments (Production, Preview, Development)

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

- [README_OIDC.md](README_OIDC.md) - Complete OIDC SSO configuration guide
- [OCI_DOMAINS_REQUISITOS.md](OCI_DOMAINS_REQUISITOS.md) - OCI Domains requirements checklist
- [Oracle Cloud Infrastructure - Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm)
- [OCI Identity Domains Documentation](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/overview.htm)
- [Progressive Web Apps - MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com/)
- [MediaRecorder API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [OAuth 2.0 / OIDC Specification](https://openid.net/specs/openid-connect-core-1_0.html)

## 📄 License

This project is open source and available for anyone to implement their own version.
