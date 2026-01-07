# ⚡ Configuração Final - Pronto para Copiar e Colar

## 🎯 Configuração Completa para Vercel

Copie e cole estas variáveis no **Vercel Dashboard > Settings > Environment Variables** (Preview):

### Variáveis Obrigatórias:

```bash
OCI_IDP_SSO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso

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

SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

OCI_UPLOAD_URL=[configure sua URL do bucket OCI aqui]
```

### Variável Opcional (SLO URL):

```bash
OCI_IDP_SLO_URL=https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/slo
```

**Nota:** Se não configurar `OCI_IDP_SLO_URL`, será derivado automaticamente do SSO URL.

## ✅ Checklist

- [ ] Configurei `OCI_IDP_SSO_URL` na Vercel (Preview)
- [ ] Configurei `OCI_IDP_CERTIFICATES` na Vercel (Preview) - certificado completo acima
- [ ] Configurei `SAML_SP_BASE_URL` e outras URLs do Service Provider
- [ ] Configurei `OCI_UPLOAD_URL` com minha URL do bucket
- [ ] Fiz redeploy ou aguardei deploy automático
- [ ] Testei o botão "Entrar com SSO Corporativo"

## 🚀 Próximos Passos

1. **Configure as variáveis na Vercel** (copie e cole do bloco acima)
2. **Aguarde o redeploy** (automático ou manual)
3. **Teste:** Acesse `https://notes.dailybits.tech` e clique em "Entrar com SSO Corporativo"
4. **Deve redirecionar** para o IDCS para login

## 📝 Informações Extraídas do Metadata

- **Entity ID do IdP:** `https://idcs-9dc693e80d9b469480d7afe00e743931.identity-test.oraclecloud.com/fed`
- **SSO URL:** `https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/sso`
- **SLO URL:** `https://idcs-9dc693e80d9b469480d7afe00e743931.identity.oraclecloud.com/fed/v1/idp/slo`
- **Certificado:** Extraído e formatado acima

Tudo pronto para configurar! 🎉

