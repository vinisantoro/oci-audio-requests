# Configuração Local (.env.local)

## 📝 Criar Arquivo .env.local

Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# OIDC SSO Configuration for OCI Domains
# IMPORTANTE: Este arquivo está no .gitignore e NÃO será commitado

# ============================================================================
# OCI Domain Configuration
# ============================================================================
# IMPORTANTE: Descubra a URL do Domain seguindo INSTRUCOES_DESCOBRIR_DOMAIN_URL.md
# Substitua <SUBSTITUA_PELA_URL_DO_DOMAIN> pela URL real
OCI_DOMAIN_URL=https://<SUBSTITUA_PELA_URL_DO_DOMAIN>

# ============================================================================
# OAuth2/OIDC Client Configuration
# ============================================================================
CLIENT_ID=99016db2a53c40a89ddf472380a84e63
CLIENT_SECRET=idcscs-a3cec1f2-44b7-4108-bb3c-68e7538a8f32

# URL de callback OIDC
# Para desenvolvimento local, você precisará usar ngrok ou similar
# Exemplo: CALLBACK_URL=https://abc123.ngrok.io/callback
# Ou configure para usar o domínio de preview: CALLBACK_URL=https://notes.dailybits.tech/callback
CALLBACK_URL=http://localhost:3000/callback

# ============================================================================
# Session Configuration
# ============================================================================
SESSION_SECRET=SJSDdWGyPdYdFAK5OLJFscsj7+M3E9RHcOUPf+WE3io=

# ============================================================================
# OCI Object Storage Configuration
# ============================================================================
# IMPORTANTE: Substitua pelos valores reais do seu bucket OCI
OCI_UPLOAD_URL=https://objectstorage.region.oraclecloud.com/p/par-id/n/namespace/b/bucket/o/

# ============================================================================
# Optional: Email Allowlist
# ============================================================================
# Descomente se desejar restringir acesso por email
# ALLOWED_EMAILS=["email1@example.com","email2@example.com"]
```

## 🚀 Passos para Configuração Local

1. **Descubra a URL do OCI Domain:**
   - Siga as instruções em `INSTRUCOES_DESCOBRIR_DOMAIN_URL.md`
   - Anote a URL completa

2. **Crie o arquivo `.env.local`:**
   ```bash
   cp OIDC_CONFIG.env.example .env.local
   ```

3. **Edite `.env.local`** e substitua:
   - `<SUBSTITUA_PELA_URL_DO_DOMAIN>` pela URL real do Domain
   - Os valores de `OCI_UPLOAD_URL` pelos valores reais do seu bucket

4. **Para desenvolvimento local com callback:**
   - Opção A: Use ngrok para expor localhost:
     ```bash
     ngrok http 3000
     ```
     Depois atualize `CALLBACK_URL` no `.env.local` com a URL do ngrok
   
   - Opção B: Use o domínio de preview da Vercel:
     ```bash
     CALLBACK_URL=https://notes.dailybits.tech/callback
     ```
     Mas configure também no OCI Domain para aceitar este callback

5. **Execute o servidor local:**
   ```bash
   npm run dev
   # ou
   vercel dev
   ```

## ⚠️ Importante

- O arquivo `.env.local` está no `.gitignore` e **NÃO será commitado**
- Mantenha os valores seguros, especialmente `CLIENT_SECRET` e `SESSION_SECRET`
- Para produção/preview, configure as variáveis na Vercel (veja `CONFIGURACAO_VERCEL.md`)
