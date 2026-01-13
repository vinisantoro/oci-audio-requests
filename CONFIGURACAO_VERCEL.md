# Configuração de Variáveis de Ambiente na Vercel

Este documento contém as instruções para configurar as variáveis de ambiente na Vercel (Preview e Production).

## 📋 Variáveis Necessárias

Configure as seguintes variáveis no Vercel Dashboard:

### 1. OCI Domain URL

**Variável:** `OCI_DOMAIN_URL`  
**Valor:** `https://<domain-id>.identity.oraclecloud.com`  
**Como encontrar:**

- Acesse OCI Console
- Vá para **Identity & Security > Domains**
- Selecione seu Domain (OCID: `ocid1.domain.oc1..aaaaaaaab77apuidncb43h7tgvbhinpqzichb3a5l2yvenjfantfuscykbeq`)
- Na página de detalhes, procure por **"Domain URL"** ou **"Hostname"**
- Copie a URL completa (formato: `https://<domain-id>.identity.oraclecloud.com`)

### 2. Client ID

**Variável:** `CLIENT_ID`  
**Valor:** `99016db2a53c40a89ddf472380a84e63`

### 3. Client Secret

**Variável:** `CLIENT_SECRET`  
**Valor:** `idcscs-a3cec1f2-44b7-4108-bb3c-68e7538a8f32`  
**⚠️ IMPORTANTE:** Mantenha este valor seguro e não o compartilhe publicamente.

### 4. Callback URL

**Variável:** `CALLBACK_URL`  
**Valor:** `https://notes.dailybits.tech/api/auth/callback`  
**⚠️ IMPORTANTE:** Deve ser `/api/auth/callback`, não `/callback` ou `/login`!  
**Nota:** Deve corresponder exatamente ao "Custom Social Linking Callback URL" e "Redirect URIs" configurados no OCI Domain.

### 5. Session Secret

**Variável:** `SESSION_SECRET`  
**Valor:** `SJSDdWGyPdYdFAK5OLJFscsj7+M3E9RHcOUPf+WE3io=`  
**Nota:** Este é um valor aleatório seguro gerado para assinar cookies de sessão.

### 6. OCI Upload URL

**Variável:** `OCI_UPLOAD_URL`  
**Valor:** Substitua pelos valores reais do seu bucket OCI  
**Formato:** `https://objectstorage.<region>.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/`

### 7. ALLOWED_EMAILS (Opcional)

**Variável:** `ALLOWED_EMAILS`  
**Valor:** `["email1@example.com","email2@example.com"]` (formato JSON array)  
**Nota:** Por enquanto, manter vazio (não configurar).

## 🚀 Como Configurar na Vercel

### Opção 1: Via Dashboard Web

1. Acesse [Vercel Dashboard](https://vercel.com/dashboard)
2. Selecione seu projeto
3. Vá para **Settings > Environment Variables**
4. Para cada variável acima:
   - Clique em **"Add New"**
   - Digite o nome da variável
   - Digite o valor
   - Selecione os ambientes: **Preview** e **Production**
   - Clique em **"Save"**

### Opção 2: Via Vercel CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Login
vercel login

# Configurar variáveis para Preview
vercel env add OCI_DOMAIN_URL preview
vercel env add CLIENT_ID preview
vercel env add CLIENT_SECRET preview
vercel env add CALLBACK_URL preview
vercel env add SESSION_SECRET preview
vercel env add OCI_UPLOAD_URL preview

# Configurar variáveis para Production (quando estiver pronto)
vercel env add OCI_DOMAIN_URL production
vercel env add CLIENT_ID production
vercel env add CLIENT_SECRET production
vercel env add CALLBACK_URL production
vercel env add SESSION_SECRET production
vercel env add OCI_UPLOAD_URL production
```

## ✅ Verificação

Após configurar todas as variáveis:

1. Faça um novo deploy (push para o repositório ou deploy manual)
2. Acesse: `https://notes.dailybits.tech`
3. Clique em "Entrar com SSO Corporativo"
4. Você deve ser redirecionado para o OCI Domain para autenticação

## 🔍 Troubleshooting

### Erro: "OIDC configuration error"

- Verifique se `OCI_DOMAIN_URL` está correto e acessível
- Certifique-se de que todas as variáveis estão configuradas no ambiente correto (Preview/Production)

### Erro: "invalid_state" ou "Token exchange failed"

- Verifique se `CLIENT_SECRET` está correto
- Verifique se `CALLBACK_URL` corresponde exatamente ao configurado no OCI Domain

### Erro: "User email not found"

- Verifique se o OCI Domain está configurado para retornar o email do usuário no UserInfo endpoint
- Verifique os scopes configurados na aplicação OCI (deve incluir `email`)

## 📝 Checklist

- [ ] `OCI_DOMAIN_URL` configurado (descobrir a URL do domain)
- [ ] `CLIENT_ID` configurado: `99016db2a53c40a89ddf472380a84e63`
- [ ] `CLIENT_SECRET` configurado: `idcscs-a3cec1f2-44b7-4108-bb3c-68e7538a8f32`
- [ ] `CALLBACK_URL` configurado: `https://notes.dailybits.tech/api/auth/callback`
- [ ] `SESSION_SECRET` configurado: `SJSDdWGyPdYdFAK5OLJFscsj7+M3E9RHcOUPf+WE3io=`
- [ ] `OCI_UPLOAD_URL` configurado com valores reais
- [ ] URLs configuradas no OCI Domain Application:
  - [ ] Application URL: `https://notes.dailybits.tech`
  - [ ] Custom Sign-In URL: `https://notes.dailybits.tech/login`
  - [ ] Custom Sign-Out URL: `https://notes.dailybits.tech/logout`
  - [ ] Custom Social Linking Callback URL: `https://notes.dailybits.tech/api/auth/callback`
  - [ ] Redirect URIs (OAuth Settings): `https://notes.dailybits.tech/api/auth/callback`
