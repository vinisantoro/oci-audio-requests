# 🔐 Registrar Aplicação no IDCS - Passo a Passo

## 🔴 Problema: 401 Authorization Required

Você está recebendo `401 Authorization Required` ao tentar acessar o SSO URL do IDCS. Isso significa que:

**A aplicação ainda não está registrada no IDCS como Service Provider confiável.**

## ✅ Solução: Registrar a Aplicação no IDCS

### Passo 1: Obter Metadata da Nossa Aplicação

A metadata da nossa aplicação está disponível em:
```
https://notes.dailybits.tech/api/saml/metadata
```

**Teste primeiro:** Acesse essa URL no navegador para verificar se está retornando XML válido.

### Passo 2: Registrar no IDCS

No console OCI:

1. **Acesse:** Identity & Security > Domains > [Seu Domain] > Identity Providers > **CORP-IDCS**

2. **Vá para a seção "Applications" ou "Service Providers"**
   - Pode estar em uma aba separada
   - Ou em um botão "Add Application" / "Register Service Provider"

3. **Clique em "Add Application" ou "Register Service Provider"**

4. **Configure usando Metadata URL (Recomendado):**
   - **Metadata URL:** `https://notes.dailybits.tech/api/saml/metadata`
   - O IDCS importará automaticamente todas as configurações

5. **OU configure manualmente:**
   - **Entity ID:** `https://notes.dailybits.tech/api/saml/metadata`
   - **Assertion Consumer Service (ACS) URL:** `https://notes.dailybits.tech/api/saml/callback`
   - **Single Logout Service URL (opcional):** `https://notes.dailybits.tech/api/saml/logout`
   - **Name ID Format:** `urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress`

6. **Configure atributos SAML:**
   - Certifique-se de que o **email do usuário** será enviado
   - O IDCS deve estar configurado para passar o email em um dos atributos:
     - `name_id` (NameID)
     - `email` ou `mail`
     - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

7. **Salve a configuração**

### Passo 3: Verificar Configuração

Após registrar:

1. **Verifique se a aplicação aparece na lista** de Applications/Service Providers
2. **Verifique se o status está "Active" ou "Enabled"**
3. **Teste novamente:** Acesse `https://notes.dailybits.tech` e clique em "Entrar com SSO Corporativo"

## 🔍 Onde Encontrar "Applications" no IDCS

Dependendo da interface do OCI, pode estar em:

- **Opção A:** Identity Providers > CORP-IDCS > **"Applications"** (aba ou seção)
- **Opção B:** Identity Providers > CORP-IDCS > **"Service Providers"** (aba ou seção)
- **Opção C:** Identity Providers > CORP-IDCS > **"View Details"** > **"Applications"**
- **Opção D:** Identity Providers > CORP-IDCS > **"Edit"** > **"Applications"**

## 📋 Informações Necessárias para Registro

### Metadata URL (Recomendado):
```
https://notes.dailybits.tech/api/saml/metadata
```

### Configuração Manual:

**Entity ID:**
```
https://notes.dailybits.tech/api/saml/metadata
```

**ACS URL (Assertion Consumer Service):**
```
https://notes.dailybits.tech/api/saml/callback
```

**SLO URL (Single Logout Service):**
```
https://notes.dailybits.tech/api/saml/logout
```

**Name ID Format:**
```
urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
```

## ✅ Checklist

- [ ] Acessei `https://notes.dailybits.tech/api/saml/metadata` e vi XML válido
- [ ] Encontrei a seção "Applications" ou "Service Providers" no IDCS
- [ ] Registrei a aplicação usando Metadata URL ou configuração manual
- [ ] Configurei para enviar email do usuário nos atributos SAML
- [ ] Salvei a configuração
- [ ] Verifiquei que a aplicação está "Active" ou "Enabled"
- [ ] Testei novamente o botão "Entrar com SSO Corporativo"

## 🐛 Se Ainda Não Funcionar

1. **Verifique os logs do Vercel:**
   - Vercel Dashboard > Deployments > [Seu Deployment] > Logs
   - Procure por erros relacionados a SAML

2. **Verifique se a Metadata está acessível:**
   - Acesse: `https://notes.dailybits.tech/api/saml/metadata`
   - Deve retornar XML válido

3. **Verifique se as URLs estão corretas no IDCS:**
   - Certifique-se de que está usando `https://notes.dailybits.tech` (não `http://`)
   - Certifique-se de que as URLs estão exatamente como acima

4. **Aguarde alguns minutos:**
   - Após registrar, pode levar alguns minutos para propagar

## 📝 Nota Importante

O erro 401 do IDCS significa que o IDCS não reconhece nossa aplicação como um Service Provider confiável. Isso é diferente do erro anterior - agora a configuração SAML está correta, mas falta o registro da aplicação no IDCS.

