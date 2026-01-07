# Configuração Local - CORP-IDCS

## ✅ Provider ID Confirmado

Seu Identity Provider está configurado corretamente:
- **Nome**: CORP-IDCS
- **Provider ID**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com:443/fed`

## 🔧 Configuração Local

### 1. Criar arquivo `.env.local`

Crie o arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```bash
# ============================================================================
# OCI Identity Provider Configuration (IDCS - CORP-IDCS)
# ============================================================================

# Metadata URL do IDCS (Recomendado)
OCI_IDP_METADATA_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata

# ============================================================================
# Service Provider Configuration (Sua Aplicação Local)
# ============================================================================

# URLs da aplicação local
VERCEL_URL=http://localhost:3000

# Entity ID da aplicação
SAML_SP_ENTITY_ID=http://localhost:3000/api/saml/metadata

# Assertion Consumer Service URL (callback)
SAML_ACS_URL=http://localhost:3000/api/saml/callback

# Single Logout Service URL
SAML_SLO_URL=http://localhost:3000/api/saml/logout

# ============================================================================
# OCI Object Storage
# ============================================================================

# Configure sua URL de upload do bucket OCI
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/

# ============================================================================
# Segurança Adicional (Opcional)
# ============================================================================

# Deixe vazio para permitir todos os usuários autenticados via SAML
# ALLOWED_EMAILS=["user1@example.com","user2@example.com"]
```

**Importante:** Substitua `<par-id>`, `<namespace>` e `<bucket>` na `OCI_UPLOAD_URL` pelos valores reais do seu bucket.

### 2. Instalar Dependências

```bash
npm install
```

### 3. Registrar Aplicação no OCI Identity Provider

Antes de testar, você precisa registrar sua aplicação local no CORP-IDCS:

1. Acesse: **OCI Console > Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**

2. Vá para a seção **"Applications"** ou procure por **"Service Providers"**

3. Clique em **"Add Application"** ou **"Register Service Provider"**

4. **Para desenvolvimento local, você precisará usar um túnel** (veja seção abaixo sobre ngrok)

5. Configure:

   **Opção A: Usar Metadata URL**
   - Metadata URL: `https://seu-tunel.ngrok.io/api/saml/metadata`
   - O IDCS importará automaticamente as configurações

   **Opção B: Configuração Manual**
   - **Entity ID**: `https://seu-tunel.ngrok.io/api/saml/metadata`
   - **Assertion Consumer Service (ACS) URL**: `https://seu-tunel.ngrok.io/api/saml/callback`
   - **Single Logout Service URL**: `https://seu-tunel.ngrok.io/api/saml/logout`

### 4. Configurar Túnel para Localhost

O IDCS precisa acessar sua aplicação local. Use ngrok:

#### Instalar ngrok

```bash
# macOS
brew install ngrok

# Ou baixe de: https://ngrok.com/download
```

#### Rodar ngrok

```bash
ngrok http 3000
```

Você verá algo como:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### Atualizar `.env.local` com URL do ngrok

```bash
# Substitua a URL do túnel
VERCEL_URL=https://abc123.ngrok.io
SAML_SP_ENTITY_ID=https://abc123.ngrok.io/api/saml/metadata
SAML_ACS_URL=https://abc123.ngrok.io/api/saml/callback
SAML_SLO_URL=https://abc123.ngrok.io/api/saml/logout
```

**Importante:** Use a URL HTTPS do ngrok (não HTTP), pois o IDCS geralmente exige HTTPS.

### 5. Rodar Aplicação Localmente

```bash
# Login no Vercel (se ainda não fez)
vercel login

# Rodar servidor de desenvolvimento
vercel dev
```

A aplicação estará disponível em:
- Local: `http://localhost:3000`
- Túnel: `https://abc123.ngrok.io` (use esta URL para acessar)

### 6. Testar Fluxo Completo

1. Acesse: `https://seu-tunel.ngrok.io` (URL do ngrok)

2. Você deve ser redirecionado para o **CORP-IDCS**

3. O CORP-IDCS redirecionará para seu **IdP Corporativo**

4. Faça login com suas credenciais corporativas

5. Você será redirecionado de volta para a aplicação local

6. Teste a gravação e upload de áudio

## 🔍 Verificações

### Verificar Metadata URL

Acesse no navegador:
```
https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata
```

Você deve ver um XML com os metadados do IDCS. Se não funcionar, tente:
```
https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com:443/fed/v1/metadata
```

### Verificar Metadata da Aplicação

Com o servidor rodando, acesse:
```
https://seu-tunel.ngrok.io/api/saml/metadata
```

Você deve ver o XML de metadados da sua aplicação.

## 🐛 Troubleshooting

### Erro: "SAML configuration error"

- Verifique se `.env.local` existe e está configurado
- Verifique se `OCI_IDP_METADATA_URL` está acessível no navegador
- Tente acessar: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`

### Erro: "Invalid SAML response"

- Verifique se a aplicação está registrada no CORP-IDCS
- Verifique se as URLs no IDCS estão corretas (usar URL do ngrok)
- Verifique se está usando HTTPS (ngrok fornece HTTPS)

### Cookies não funcionam

- Certifique-se de usar a URL do ngrok (HTTPS)
- Verifique se cookies não estão sendo bloqueados pelo navegador
- Limpe cookies do navegador e tente novamente

### ngrok desconecta

- ngrok gratuito tem limite de conexões
- Se desconectar, reinicie o ngrok e atualize o registro no IDCS com a nova URL
- Considere usar ngrok com conta paga para URLs estáveis

## 📝 URLs Importantes

- **IDCS Metadata**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`
- **IDCS SSO**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso`
- **IDCS SLO**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/slo`

## ✅ Checklist

- [ ] Arquivo `.env.local` criado e configurado
- [ ] Dependências instaladas (`npm install`)
- [ ] ngrok instalado e rodando
- [ ] `.env.local` atualizado com URL do ngrok
- [ ] Aplicação registrada no CORP-IDCS com URLs do ngrok
- [ ] Servidor local rodando (`vercel dev`)
- [ ] Testado acesso via URL do ngrok
- [ ] Testado fluxo completo de autenticação

## 🚀 Próximos Passos

Após testar localmente:

1. Configure variáveis de ambiente na Vercel para produção
2. Faça deploy da aplicação
3. Atualize registro no CORP-IDCS com URLs de produção
4. Teste em produção

