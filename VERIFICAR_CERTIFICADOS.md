# Como Verificar se os Certificados São do IdP ou SP

## 🔍 Diferença Entre Certificados

### Certificados do Identity Provider (IDCS) - NECESSÁRIOS ✅
- **Função:** Validar as respostas SAML que o IDCS envia para nossa aplicação
- **Onde encontrar:** Identity Provider > CORP-IDCS > Certificates ou Details
- **Como identificar:** Geralmente têm "Identity Provider" ou "IdP" no nome
- **URLs relacionadas:** Contêm `/saml/sso` (não `/sp/sso`)

### Certificados do Service Provider (Nossa App) - OPCIONAIS ⚠️
- **Função:** Assinar requisições que nossa aplicação envia (opcional)
- **Onde encontrar:** Service Provider > Applications > [Nossa App] > Certificates
- **Como identificar:** Você já encontrou: "Service provider signing certificate"
- **URLs relacionadas:** Contêm `/sp/sso` ou `/sp/slo`

## ✅ O Que Você Precisa Configurar

### Obrigatório:
```bash
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso
OCI_IDP_CERTIFICATES=[certificados do Identity Provider]
```

### Opcional (para assinar requisições):
```bash
SAML_SP_PRIVATE_KEY=[chave privada do Service Provider]
SAML_SP_CERTIFICATE=[certificado do Service Provider]
```

## 🎯 URLs Corretas

Baseado no Provider ID que você encontrou:

### Identity Provider (IDCS) - O que precisamos:
- **SSO URL:** `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso`
- **SLO URL:** `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/slo`
- **Metadata URL:** `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`

### Service Provider (Nossa App) - já configurado:
- **ACS URL:** `https://notes.dailybits.tech/api/saml/callback`
- **Entity ID:** `https://notes.dailybits.tech/api/saml/metadata`

## 📝 Próximo Passo

1. **Verifique os certificados em @certs:**
   - Se são do **Identity Provider** → use-os em `OCI_IDP_CERTIFICATES`
   - Se são do **Service Provider** → não são necessários agora

2. **Configure o SSO URL:**
   ```bash
   OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso
   ```

3. **Teste novamente**

