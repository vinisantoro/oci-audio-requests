# 🔐 Solução: 401 Authorization Required do IDCS

## 🔴 Problema

Ao clicar em "Entrar com SSO Corporativo", você recebe:
```
401 Authorization Required
```

Na URL: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso?...`

## ✅ Causa

O erro 401 do IDCS significa que **a aplicação não está registrada como Service Provider confiável** no IDCS.

O IDCS precisa saber que nossa aplicação (`https://notes.dailybits.tech`) é um Service Provider autorizado antes de permitir o login SSO.

## 🎯 Solução: Registrar a Aplicação no IDCS

### Passo 1: Verificar Metadata da Aplicação

Primeiro, verifique se a metadata está acessível:

1. **Acesse no navegador:**
   ```
   https://notes.dailybits.tech/api/saml/metadata
   ```

2. **Deve retornar XML válido** com informações do Service Provider

3. **Se não funcionar**, verifique:
   - Se o deploy foi concluído
   - Se as variáveis de ambiente estão configuradas
   - Logs do Vercel para erros

### Passo 2: Registrar no IDCS

No **console OCI**:

1. **Acesse:** Identity & Security > Domains > [Seu Domain] > Identity Providers > **CORP-IDCS**

2. **Procure por uma das opções:**
   - **"Applications"** (aba ou seção)
   - **"Service Providers"** (aba ou seção)
   - **"Add Application"** (botão)
   - **"Register Service Provider"** (botão)

3. **Clique em "Add Application" ou "Register Service Provider"**

4. **Configure usando Metadata URL (Recomendado):**
   ```
   Metadata URL: https://notes.dailybits.tech/api/saml/metadata
   ```
   - O IDCS importará automaticamente todas as configurações

5. **OU configure manualmente:**
   - **Entity ID:** `https://notes.dailybits.tech/api/saml/metadata`
   - **Assertion Consumer Service (ACS) URL:** `https://notes.dailybits.tech/api/saml/callback`
   - **Single Logout Service URL:** `https://notes.dailybits.tech/api/saml/logout`
   - **Name ID Format:** `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`

6. **Configure atributos SAML:**
   - Certifique-se de que o **email do usuário** será enviado
   - O IDCS deve passar o email em um dos atributos:
     - `name_id` (NameID)
     - `email` ou `mail`
     - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

7. **Salve a configuração**

### Passo 3: Verificar Status

Após registrar:

1. **Verifique se a aplicação aparece** na lista de Applications/Service Providers
2. **Verifique se o status está "Active" ou "Enabled"**
3. **Aguarde alguns minutos** para propagar

### Passo 4: Testar Novamente

1. Acesse: `https://notes.dailybits.tech`
2. Clique em "Entrar com SSO Corporativo"
3. **Deve redirecionar** para o IDCS sem erro 401
4. O IDCS redirecionará para o IdP corporativo
5. Após login, retornará para a aplicação

## ⚠️ Nota Importante: IDs Diferentes

Notei que há dois IDs diferentes:

1. **No erro:** `idcs-1beedd4f72ff4293a5339e0437f00ac0` (ID original que você encontrou)
2. **No metadata XML:** `idcs-9dc693e80d9b469480d7afe00e743931` (ID diferente)

**Verifique qual ID está correto:**

- O ID no **SSO URL** que você configurou em `OCI_IDP_SSO_URL` deve corresponder ao ID do Identity Provider que você está usando
- Se os IDs são diferentes, pode ser que você tenha múltiplos Identity Providers ou está usando o ID errado

**Solução:** Use o mesmo ID em todas as configurações. Se você configurou `OCI_IDP_SSO_URL` com `idcs-1beedd4f72ff4293a5339e0437f00ac0`, então registre a aplicação no Identity Provider com esse mesmo ID.

## 📋 Checklist Completo

- [ ] Verifiquei que `https://notes.dailybits.tech/api/saml/metadata` retorna XML válido
- [ ] Encontrei a seção "Applications" ou "Service Providers" no IDCS
- [ ] Registrei a aplicação usando Metadata URL ou configuração manual
- [ ] Configurei para enviar email do usuário nos atributos SAML
- [ ] Verifiquei que a aplicação está "Active" ou "Enabled"
- [ ] Verifiquei que o ID do Identity Provider corresponde ao ID usado nas variáveis de ambiente
- [ ] Aguardei alguns minutos para propagar
- [ ] Testei novamente o botão "Entrar com SSO Corporativo"

## 🐛 Se Ainda Não Funcionar

1. **Verifique qual ID está sendo usado:**
   - Compare o ID na URL do erro com o ID configurado em `OCI_IDP_SSO_URL`
   - Certifique-se de que são o mesmo ID

2. **Verifique os logs do Vercel:**
   - Vercel Dashboard > Deployments > [Seu Deployment] > Logs
   - Procure por erros relacionados a SAML

3. **Teste a Metadata URL diretamente:**
   - Acesse: `https://notes.dailybits.tech/api/saml/metadata`
   - Deve retornar XML válido

4. **Verifique se a aplicação está registrada no IDCS correto:**
   - Certifique-se de que está registrando no mesmo Identity Provider que está configurado nas variáveis de ambiente

