# Configuração OIDC SSO com OCI Domains

Este documento descreve como configurar a autenticação OIDC SSO usando **OCI Identity Domains**.

## 🔄 Arquitetura

A aplicação usa **OCI Identity Domains** como Identity Provider OIDC:

```
Aplicação → OCI Identity Domain (OIDC) → Identity Provider SAML Federado → Usuário Autenticado
```

**Fluxo:**

1. Usuário acessa a aplicação
2. Aplicação redireciona para **OCI Identity Domain** (endpoint OAuth2)
3. OCI Domain redireciona para **Identity Provider SAML federado** (se configurado)
4. Usuário faz login no IdP corporativo (ex: CORP-IDCS)
5. IdP corporativo retorna para OCI Domain via SAML
6. OCI Domain retorna código de autorização OIDC
7. Aplicação troca código por tokens (access token, ID token)
8. Aplicação obtém informações do usuário via UserInfo endpoint
9. Usuário é autenticado na aplicação

**Nota:** Se você tem um Identity Provider SAML federado (como CORP-IDCS), você precisa configurar as **Sign-On Policies** no OCI Domain para usar o IdP SAML durante o fluxo OIDC. Veja [CONFIGURAR_SAML_FEDERATION_OIDC.md](CONFIGURAR_SAML_FEDERATION_OIDC.md) para detalhes.

## 📋 Pré-requisitos

1. ✅ **OCI Identity Domain configurado** no seu tenancy OCI
2. ✅ Aplicação OIDC registrada no OCI Domain
3. ✅ Acesso ao console OCI para obter Client ID e Client Secret
4. ✅ Acesso para configurar variáveis de ambiente na plataforma de hospedagem (Vercel)

## 🔧 Configuração no OCI Domain

### Passo 1: Criar Integrated Application no OCI Domain

1. Acesse o **Console OCI**
2. Navegue até **Identity & Security > Domains**
3. Selecione seu **Identity Domain**
4. Vá para **Applications**
5. Clique em **"Add Application"** ou **"Create Application"**
6. Selecione **"Integrated Application"** ou **"OAuth/OIDC Application"**

### Passo 2: Configurar URLs da Aplicação

Preencha os seguintes campos:

- **Application URL:** `https://notes.dailybits.tech`
- **Custom Sign-In URL:** `https://notes.dailybits.tech/api/auth/login` (ou deixe vazio)
- **Custom Sign-Out URL:** `https://notes.dailybits.tech/api/auth/logout`
- **Custom Social Linking Callback URL:** `https://notes.dailybits.tech/api/auth/callback`
- **Redirect URIs (OAuth Settings):** `https://notes.dailybits.tech/api/auth/callback`

### Passo 3: Obter Credenciais

Após criar a aplicação, obtenha:

1. **Client ID** - Disponível em: Applications > [Sua App] > Configuration
2. **Client Secret** - Disponível em: Applications > [Sua App] > Configuration (clique em "Show" para revelar)
3. **OCI Domain URL** - Formato: `https://<domain-id>.identity.oraclecloud.com` ou `https://<tenant>.idcs.oci.oraclecloud.com`

### Passo 4: Configurar Scopes e Grant Types

Na configuração da aplicação, certifique-se de que:

- **Grant Types:** Authorization Code (habilitado)
- **Scopes:** `openid`, `profile`, `email` (habilitados)
- **Client Type:** Confidential Client (para aplicações com backend)

## 🔧 Configuração na Aplicação

### Passo 1: Configurar Variáveis de Ambiente

Configure as seguintes variáveis de ambiente na Vercel:

```bash
# OCI Domain Configuration
OCI_DOMAIN_URL=https://<domain-id>.identity.oraclecloud.com

# OAuth2/OIDC Client Configuration
CLIENT_ID=your-client-id-here
CLIENT_SECRET=your-client-secret-here

# Callback URL (deve corresponder ao configurado no OCI)
CALLBACK_URL=https://notes.dailybits.tech/api/auth/callback

# Session Secret (gere um valor aleatório seguro)
SESSION_SECRET=your-session-secret-here

# OCI Object Storage (existente)
OCI_UPLOAD_URL=https://objectstorage.region.oraclecloud.com/p/par-id/n/namespace/b/bucket/o/

# Optional: Email Allowlist (camada extra de segurança)
ALLOWED_EMAILS=["email1@example.com","email2@example.com"]
```

### Passo 2: Deploy da Aplicação

1. Faça push das alterações para o repositório
2. O Vercel fará deploy automaticamente
3. Verifique se todas as variáveis de ambiente estão configuradas

### Passo 3: Testar

1. Acesse: `https://notes.dailybits.tech`
2. Clique em "Entrar com SSO Corporativo"
3. Você deve ser redirecionado para o OCI Domain
4. Faça login com suas credenciais
5. Você será redirecionado de volta para a aplicação autenticado

## 📝 Endpoints da Aplicação

- **Login:** `GET /api/auth/login` - Inicia fluxo OIDC
- **Callback:** `GET /api/auth/callback` - Processa retorno OIDC
- **Logout:** `GET /api/auth/logout` - Encerra sessão
- **Status:** `GET /api/auth/status` - Verifica status de autenticação

## 🔐 Segurança

- **Confidential Client:** A aplicação usa padrão "Confidential Client" pois tem backend
- **State e Nonce:** Usados para prevenir ataques CSRF e replay
- **HTTPS:** Obrigatório em produção (Vercel fornece automaticamente)
- **Cookies HttpOnly:** Sessões armazenadas em cookies HttpOnly
- **Session Expiry:** Sessões expiram após 8 horas

## 🐛 Troubleshooting

### Erro: "OIDC configuration error"

- Verifique se `OCI_DOMAIN_URL`, `CLIENT_ID`, `CLIENT_SECRET` e `CALLBACK_URL` estão configurados
- Certifique-se de que o `CALLBACK_URL` corresponde exatamente ao configurado no OCI Domain

### Erro: "invalid_state"

- O estado OAuth não corresponde. Isso pode acontecer se cookies não estiverem sendo enviados corretamente
- Verifique se está usando HTTPS em produção
- Verifique configurações de SameSite nos cookies

### Erro: "Token exchange failed"

- Verifique se o Client Secret está correto
- Verifique se o código de autorização não expirou (códigos expiram rapidamente)
- Verifique se o `CALLBACK_URL` corresponde exatamente ao configurado no OCI

### Usuário não é redirecionado após login

- Verifique se o `CALLBACK_URL` está correto no OCI Domain
- Verifique se a rota `/callback` está acessível
- Verifique logs do Vercel para erros

### Erro: "missing_parameters" - State recebido mas Code não recebido

Se você recebe `state` mas não `code`, isso geralmente significa:

1. **Autenticação não completada:** O usuário não completou o login no IdP corporativo
2. **SAML Federation não configurada:** Se você tem um Identity Provider SAML federado, você precisa configurar as **Sign-On Policies** no OCI Domain
3. **Usuário sem permissão:** O usuário pode não ter permissão para acessar a aplicação

**Solução:** Veja [CONFIGURAR_SAML_FEDERATION_OIDC.md](CONFIGURAR_SAML_FEDERATION_OIDC.md) para configurar SAML federation com OIDC.

### Login não redireciona para IdP corporativo (SAML)

Se você tem um Identity Provider SAML federado mas o login não redireciona para ele:

1. Verifique se o Identity Provider SAML está **ativo** no OCI Domain
2. Configure uma **Sign-On Policy** que use o Identity Provider SAML
3. Associe a Sign-On Policy à sua aplicação OIDC
4. Veja [CONFIGURAR_SAML_FEDERATION_OIDC.md](CONFIGURAR_SAML_FEDERATION_OIDC.md) para instruções detalhadas

## 🔗 Referências

- [CONFIGURAR_SAML_FEDERATION_OIDC.md](CONFIGURAR_SAML_FEDERATION_OIDC.md) - **IMPORTANTE:** Como configurar SAML Federation com OIDC
- [TROUBLESHOOTING_STATE_SEM_CODE.md](TROUBLESHOOTING_STATE_SEM_CODE.md) - Troubleshooting quando state é recebido mas code não
- [OCI_DOMAINS_REQUISITOS.md](OCI_DOMAINS_REQUISITOS.md) - Checklist de requisitos
- [OIDC_CONFIG.env.example](OIDC_CONFIG.env.example) - Exemplo de arquivo de configuração
- [Documentação OCI Identity Domains](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/overview.htm)
- [OAuth 2.0 / OIDC Specification](https://openid.net/specs/openid-connect-core-1_0.html)
