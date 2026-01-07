# ⚡ Configuração Rápida - IDCS CORP-IDCS

## 🎯 Informações que Você Já Tem

**Provider ID encontrado:**
```
https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com:443/fed
```

## ✅ URLs do Identity Provider (IDCS)

Baseado no Provider ID, as URLs corretas são:

```bash
# SSO URL (onde o usuário faz login)
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso

# SLO URL (logout) - opcional, será derivado automaticamente se não fornecido
OCI_IDP_SLO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/slo
```

## 📋 Configuração Completa na Vercel

No **Vercel Dashboard > Settings > Environment Variables** (Preview):

### 1. Identity Provider (IDCS) - OBRIGATÓRIO

```bash
# SSO URL do IDCS
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso

# Certificados do IDCS (os que você encontrou em @certs)
# Se tiver múltiplos certificados, separe com -----SPLIT-----
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
[cole o certificado do Identity Provider aqui]
-----END CERTIFICATE-----
```

### 2. Service Provider (Nossa Aplicação) - JÁ CONFIGURADO

```bash
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout
```

### 3. OCI Object Storage

```bash
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

## 🔍 Verificar se os Certificados em @certs São do IdP

### Como Identificar:

1. **Certificados do Identity Provider (IDCS):**
   - ✅ **NECESSÁRIOS** para funcionar
   - Geralmente encontrados em: **Identity Providers > CORP-IDCS > Certificates**
   - Ou em: **Identity Providers > CORP-IDCS > View Details > Certificates**
   - Usados para **validar** respostas SAML do IDCS

2. **Certificados do Service Provider (Nossa App):**
   - ⚠️ **OPCIONAIS** (não necessários agora)
   - Você já encontrou: "Service provider signing certificate"
   - Usados para **assinar** requisições (opcional)

### Se os Certificados em @certs São do Identity Provider:

✅ **Use-os diretamente** em `OCI_IDP_CERTIFICATES`

### Se os Certificados em @certs São do Service Provider:

❌ **Não use-os agora** - você precisa encontrar os certificados do **Identity Provider**

## 📝 Onde Encontrar Certificados do Identity Provider

No console OCI:

1. **Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**
2. Clique em **"View Details"** ou **"Edit"**
3. Procure por:
   - **"Certificates"** (aba ou seção)
   - **"Signing Certificates"** (do Identity Provider)
   - **"IdP Certificates"**

4. **OU** baixe o **"Service Provider Metadata"** que você encontrou:
   - Pode conter informações úteis
   - Mas você ainda precisa dos certificados do **IdP**

## 🚀 Próximos Passos

1. **Verifique os certificados em @certs:**
   - Se são do **Identity Provider** → configure em `OCI_IDP_CERTIFICATES`
   - Se são do **Service Provider** → encontre os do **Identity Provider**

2. **Configure na Vercel:**
   ```bash
   OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso
   OCI_IDP_CERTIFICATES=[certificados do Identity Provider]
   ```

3. **Redeploy e teste**

## ✅ Checklist Final

- [ ] Configurei `OCI_IDP_SSO_URL` com a URL acima
- [ ] Encontrei certificados do **Identity Provider** (não do Service Provider)
- [ ] Configurei `OCI_IDP_CERTIFICATES` com os certificados do IdP
- [ ] Configurei todas as outras variáveis
- [ ] Fiz redeploy
- [ ] Testei o botão "Entrar com SSO Corporativo"

## 🆘 Se Ainda Não Funcionar

1. **Verifique os logs do Vercel:**
   - Vercel Dashboard > Deployments > [Seu Deployment] > Logs
   - Procure por erros relacionados a SAML ou certificados

2. **Teste a URL do SSO diretamente:**
   - Acesse: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso`
   - Deve redirecionar para login (se funcionar, a URL está correta)

3. **Verifique se a aplicação está registrada no IDCS:**
   - OCI Console > Identity Providers > CORP-IDCS > Applications
   - Certifique-se de que `https://notes.dailybits.tech/api/saml/metadata` está registrado

