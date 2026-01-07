# ⚠️ URGENTE: Registrar Aplicação no IDCS

## 🔴 Problema Atual

Você está recebendo **401 Authorization Required** do IDCS. Isso significa:

**A aplicação `https://notes.dailybits.tech` precisa ser registrada no IDCS antes de poder fazer SSO.**

## ⚠️ IMPORTANTE: Verificar ID Correto

Notei uma discrepância nos IDs:

- **ID no erro:** `idcs-1beedd4f72ff4293a5339e0437f00ac0` (ID original)
- **ID no metadata XML:** `idcs-9dc693e80d9b469480d7afe00e743931` (ID diferente)

**Verifique qual ID você configurou em `OCI_IDP_SSO_URL`:**

1. Vercel Dashboard > Settings > Environment Variables
2. Verifique o valor de `OCI_IDP_SSO_URL`
3. Use o **mesmo ID** para registrar a aplicação no IDCS

## ✅ Solução: Registrar Aplicação no IDCS

### Passo 1: Verificar Metadata da Aplicação

Acesse no navegador:
```
https://notes.dailybits.tech/api/saml/metadata
```

**Deve retornar XML válido.** Se não retornar, há um problema com o deploy.

### Passo 2: Registrar no IDCS

No **console OCI**:

1. **Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**

2. **Procure por:**
   - "Applications" (aba ou seção)
   - "Service Providers" (aba ou seção)
   - "Add Application" (botão)
   - "Register Service Provider" (botão)

3. **Clique em "Add Application" ou "Register Service Provider"**

4. **Configure usando Metadata URL (Mais Fácil):**
   ```
   Metadata URL: https://notes.dailybits.tech/api/saml/metadata
   ```
   - O IDCS importará automaticamente todas as configurações

5. **OU configure manualmente:**
   - **Entity ID:** `https://notes.dailybits.tech/api/saml/metadata`
   - **ACS URL:** `https://notes.dailybits.tech/api/saml/callback`
   - **SLO URL:** `https://notes.dailybits.tech/api/saml/logout`

6. **Configure atributos SAML:**
   - Certifique-se de que o **email** será enviado
   - Atributos esperados: `name_id`, `email`, `mail`, ou `http://schemas.xmlsoac.org/ws/2005/05/identity/claims/emailaddress`

7. **Salve**

### Passo 3: Verificar ID do Identity Provider

**IMPORTANTE:** Certifique-se de que está registrando no **mesmo Identity Provider** que está configurado nas variáveis de ambiente.

- Se `OCI_IDP_SSO_URL` usa `idcs-1beedd4f72ff4293a5339e0437f00ac0` → registre no Identity Provider com esse ID
- Se `OCI_IDP_SSO_URL` usa `idcs-9dc693e80d9b469480d7afe00e743931` → registre no Identity Provider com esse ID

## 📋 Checklist Rápido

- [ ] Verifiquei qual ID está em `OCI_IDP_SSO_URL` na Vercel
- [ ] Acessei `https://notes.dailybits.tech/api/saml/metadata` e vi XML válido
- [ ] Encontrei "Applications" ou "Service Providers" no IDCS correto
- [ ] Registrei a aplicação usando Metadata URL ou configuração manual
- [ ] Configurei para enviar email nos atributos SAML
- [ ] Salvei a configuração
- [ ] Aguardei alguns minutos
- [ ] Testei novamente

## 🚀 Após Registrar

1. Aguarde 2-5 minutos para propagar
2. Teste: `https://notes.dailybits.tech`
3. Clique em "Entrar com SSO Corporativo"
4. **Não deve mais retornar 401** - deve redirecionar para login

## 🆘 Se Ainda Não Funcionar

1. **Verifique se está no Identity Provider correto:**
   - Compare o ID na URL do erro com o ID em `OCI_IDP_SSO_URL`
   - Devem ser iguais

2. **Verifique se a Metadata está acessível:**
   - `https://notes.dailybits.tech/api/saml/metadata` deve retornar XML

3. **Verifique logs do Vercel:**
   - Procure por erros relacionados a SAML

4. **Aguarde mais tempo:**
   - Pode levar até 10 minutos para propagar completamente

