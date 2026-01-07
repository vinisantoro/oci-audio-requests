# Configuração Passo a Passo - IDCS CORP-IDCS

## 📋 Informações Encontradas no OCI

Você encontrou informações do **Service Provider** (nossa aplicação):
- Provider ID: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com:443/fed`
- Assertion consumer service URL: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com:443/fed/v1/sp/sso`
- Service provider signing certificate (disponível para download)

**Mas precisamos das informações do Identity Provider (IDCS), não do Service Provider!**

## 🎯 O Que Precisamos

Para configurar o SAML SSO, precisamos de:

1. **SSO URL do Identity Provider (IDCS)** - onde o usuário faz login
2. **Certificados do Identity Provider (IDCS)** - para validar as respostas SAML

## 📝 Passo a Passo para Configurar

### Passo 1: Encontrar o SSO URL do Identity Provider

No console OCI:

1. Vá para: **Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**
2. Procure por uma seção chamada:
   - **"Identity Provider Details"** ou
   - **"IdP Information"** ou
   - **"SSO URL"** ou
   - **"Single Sign-On URL"**

3. O SSO URL do **Identity Provider** deve ser algo como:
   ```
   https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso
   ```
   (Note: `/saml/sso` para o IdP, não `/sp/sso` que é para o SP)

### Passo 2: Obter Certificados do Identity Provider

No console OCI, procure por:

1. **"Identity Provider Certificates"** ou
2. **"IdP Certificates"** ou
3. **"Signing Certificates"** (do Identity Provider, não do Service Provider)

4. Baixe ou copie os certificados do **Identity Provider**

### Passo 3: Alternativa - Usar Metadata do Identity Provider

Se você conseguir acesso à Metadata do Identity Provider:

1. Procure por **"Identity Provider Metadata"** ou **"IdP Metadata"**
2. A Metadata URL do IdP deve ser algo como:
   ```
   https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata
   ```
3. Se conseguir acessar (pode precisar estar autenticado), extraia:
   - O `<SingleSignOnService>` Location (SSO URL)
   - O `<X509Certificate>` (certificado)

### Passo 4: Configurar Variáveis de Ambiente na Vercel

No **Vercel Dashboard > Settings > Environment Variables** (Preview):

```bash
# SSO URL do Identity Provider (IDCS)
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso

# Certificados do Identity Provider (cole aqui os certificados que você encontrou em @certs)
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
[cole o primeiro certificado aqui]
-----END CERTIFICATE-----
-----SPLIT-----
-----BEGIN CERTIFICATE-----
[cole o segundo certificado aqui, se houver]
-----END CERTIFICATE-----

# Service Provider URLs (nossa aplicação)
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

## 🔍 Como Identificar se os Certificados São do IdP ou SP

### Certificados do Identity Provider (IDCS):
- Usados para **validar** as respostas SAML que o IDCS envia
- Necessários para a aplicação funcionar
- Geralmente encontrados em: **Identity Provider > Certificates** ou **IdP Details**

### Certificados do Service Provider (Nossa Aplicação):
- Usados para **assinar** as requisições que nossa aplicação envia
- Opcionais (não necessários para funcionamento básico)
- Você já encontrou esses: **Service provider signing certificate**

## ✅ Checklist

- [ ] Encontrei o SSO URL do **Identity Provider** (não do Service Provider)
- [ ] Encontrei os certificados do **Identity Provider** (em @certs ou em IdP Details)
- [ ] Configurei `OCI_IDP_SSO_URL` na Vercel
- [ ] Configurei `OCI_IDP_CERTIFICATES` na Vercel (certificados do IdP, não do SP)
- [ ] Configurei todas as outras variáveis SAML
- [ ] Fiz redeploy ou aguardei deploy automático
- [ ] Testei o botão "Entrar com SSO Corporativo"

## 🆘 Se Não Encontrar as Informações

1. **Verifique se está na seção correta:**
   - Deve ser **"Identity Providers"** > **"CORP-IDCS"**
   - Não deve ser **"Applications"** ou **"Service Providers"**

2. **Procure por "View Details" ou "Edit":**
   - Clique em **"View Details"** ou **"Edit"** no Identity Provider
   - As informações do IdP devem estar lá

3. **Verifique a aba "Certificates":**
   - Pode haver uma aba separada chamada **"Certificates"**
   - Procure por certificados de **"Signing"** do Identity Provider

4. **Use a Metadata URL (se acessível):**
   - Tente acessar: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`
   - Se retornar 401, você precisa estar autenticado no OCI primeiro
   - Se conseguir acessar, extraia o SSO URL e certificados do XML

## 📞 Próximos Passos

1. Confirme se os certificados em `@certs` são do **Identity Provider** ou do **Service Provider**
2. Encontre o **SSO URL do Identity Provider** (deve ter `/saml/sso` no final)
3. Configure as variáveis na Vercel conforme o Passo 4 acima
4. Teste novamente

