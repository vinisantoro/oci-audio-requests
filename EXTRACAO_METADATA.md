# Extração de Informações do Metadata XML

## ✅ Informações Extraídas do Metadata

### Identity Provider (IDCS) - O que precisamos configurar:

**Entity ID:**
```
https://idcs-9dc693e80d9b469480d7afe00e743931.identity-test.oraclecloud.com/fed
```

**SSO URL (Single Sign-On):**
```
https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso
```

**SLO URL (Single Logout):**
```
https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/slo
```

**Certificado do Identity Provider (signing):**
```
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
```

## 🔧 Configuração na Vercel

### Variáveis de Ambiente (Preview):

```bash
# Identity Provider (IDCS) - SSO URL
OCI_IDP_SSO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso

# Identity Provider (IDCS) - SLO URL (opcional, será derivado automaticamente)
OCI_IDP_SLO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/slo

# Identity Provider (IDCS) - Certificado
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

# Service Provider (Nossa Aplicação)
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=[sua URL do bucket]
```

## 📝 Nota Importante

Note que o Entity ID tem `identity-test` mas as URLs SSO/SLO usam `identity` (sem `-test`). Use as URLs com `identity.oraclecloud.com` (sem `-test`).

