# 🔧 Corrigir Erro: "SAML configuration error"

## 🔴 Erro Atual

```
OCI_IDP_METADATA_URL is set but certificates are required
```

## ✅ Solução

Você tem duas opções:

### Opção 1: Remover OCI_IDP_METADATA_URL e Usar SSO URL + Certificados (Recomendado)

**Remova** a variável `OCI_IDP_METADATA_URL` da Vercel e **configure**:

```bash
# SSO URL do Identity Provider (OBRIGATÓRIO)
OCI_IDP_SSO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso

# Certificados do Identity Provider (OBRIGATÓRIO)
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
MIIDXzCCAkegAwIBAgIGAVzrkMwxMA0GCSqGSIb3DQEBCwUAMFcxEzARBgoJkiaJ
k/IsZAEZFgNjb20xFjAUBgoJkiaJk/IsZAEZFgZvcmFjbGUxFTATBgoJkiaJk/Is
ZAEZFgVjbG91ZDERMA8GA1UEAxMIQ2xvdWQ5Q0EwHhcNMTcwNjI3MjE1OTEzWhcN
MjcwNjI3MjE1OTEzWjBWMRMwEQYDVQQDEwpzc2xEb21haW5zMQ8wDQYDVQQDEwZD
bG91ZDkxLjAsBgNVBAMTJWlkY3MtOWRjNjkzZTgwZDliNDY5NDgwZDdhZmUwMGU3
NDM5MzEwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCbfja2mpzXIqGM
eyX7N6z7AJ76Z2Xn3KyjsYxwHf/vkOPQ+2TaMoGpKe85mcEQaBIt8P0+p++LSs/o
p5E35gtMBCJg4UQ4HBNMBTU8A7IRO9EGEKkMJlkZSe3cp3HfwZWLuXrVaZfJO0fT
srQQrrPfH8iWkHa4JLy6vpHIAVk4f2AadBHbqkq0dxm0JQYRxwYFJxrquVnkT6+1
fQ08uuOgAMjL99Yb53rlpYXWbBQTdxFcdpKM0NsbcSMf0PRXqGbp8tyXrB9HnEAV
WrJ/vNKt8YAIESCZ6wvLdvUt8GTy3H3y68gj6j54FnILYF5k3P2bY1hhObwDLiAr
nEH19nKJAgMBAAGjMjAwMB0GA1UdDgQWBBQTnSw+to4iZknMKRYZ6FQeymuGHzAP
BgNVHQ8BAf8EBQMDB9gAMA0GCSqGSIb3DQEBCwUAA4IBAQBEH33S4jlptPVFPHuC
cuXAkmhYvaemkZfpPObeQ20+Z+3bS17IlXbb2gwbWrQuzOy2SW55ZUOLb3xt/EXs
5ILuy94FXAefrWewQJF1qEVjp/4RmbpDVlgZc647qonNdosXpxTUyAeL82cwNRhQ
NNVfTYD9+tc/q4EZ3ChRRwUnw2OdmeZO/GKu6pY1BFi9WhbO3RQg2RIlEomOeCF0
7fd4Kuhf9rQTkmm/B4JTaa4mHkzFEYRk+aHmIl3Hc9TuqJmc0Ax5r31ZuqKVKsSE
xPeII7jejhjoKVGNT0DpnrYIxyY0TPWwaW51GBHuY5BYY1HW96av2uPtktrLCWaR
H2OM
-----END CERTIFICATE-----

# Service Provider URLs
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=[sua URL do bucket]
```

### Opção 2: Manter OCI_IDP_METADATA_URL e Adicionar Certificados

Se quiser manter `OCI_IDP_METADATA_URL`, você **também precisa** adicionar `OCI_IDP_CERTIFICATES`:

```bash
# Metadata URL (opcional, apenas para referência)
OCI_IDP_METADATA_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata

# SSO URL (OBRIGATÓRIO mesmo com metadata URL)
OCI_IDP_SSO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso

# Certificados (OBRIGATÓRIO)
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
[mesmo certificado acima]
-----END CERTIFICATE-----
```

## 🎯 Recomendação: Use Opção 1

**Remova** `OCI_IDP_METADATA_URL` e use apenas:
- `OCI_IDP_SSO_URL`
- `OCI_IDP_CERTIFICATES`

Isso é mais simples e direto.

## 📋 Checklist de Configuração

No **Vercel Dashboard > Settings > Environment Variables** (Preview):

- [ ] **Removi** `OCI_IDP_METADATA_URL` (se estava configurada)
- [ ] **Configurei** `OCI_IDP_SSO_URL` com a URL acima
- [ ] **Configurei** `OCI_IDP_CERTIFICATES` com o certificado acima
- [ ] **Configurei** todas as outras variáveis SAML
- [ ] **Configurei** `OCI_UPLOAD_URL`
- [ ] **Fiz redeploy** ou aguardei deploy automático

## 🚀 Após Configurar

1. Aguarde alguns minutos para o deploy
2. Teste: `https://notes.dailybits.tech`
3. Clique em "Entrar com SSO Corporativo"
4. Deve redirecionar para o IDCS

## ⚠️ Importante

- **NÃO** configure apenas `OCI_IDP_METADATA_URL` sem certificados
- **SEMPRE** configure `OCI_IDP_SSO_URL` + `OCI_IDP_CERTIFICATES`
- A biblioteca `saml2-js` não busca metadados automaticamente, então precisa dos certificados diretamente

