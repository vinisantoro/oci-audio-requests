# 🔧 Como Corrigir Redirect para /api/auth/login

## ❌ Problema

Após fazer login no OCI Domain, você é redirecionado para `/api/auth/login` e recebe:
```json
{"error":"Method not allowed"}
```

## 🔍 Causa

O OCI Domain está configurado para redirecionar para `/api/auth/login` após autenticação, mas essa rota só aceita GET e é usada apenas para **iniciar** o fluxo OAuth, não para receber o callback.

O callback deve ir para `/api/auth/callback`.

## ✅ Solução: Configurar OCI Domain Corretamente

### Passo 1: Verificar Callback URL no OCI Domain

1. Acesse o **OCI Console**
2. Vá para **Identity & Security > Domains > Default > Applications**
3. Abra a aplicação com Client ID: `99016db2a53c40a89ddf472380a84e63`
4. Vá para **Configuration** ou **OAuth Settings**

### Passo 2: Configurar URLs Corretas

Configure exatamente assim:

#### Custom Social Linking Callback URL
```
https://notes.dailybits.tech/api/auth/callback
```

**⚠️ IMPORTANTE:** Deve ser `/api/auth/callback`, não `/login`!

#### Redirect URIs (na seção OAuth/OIDC)
Adicione esta URL na lista de Redirect URIs permitidas:
```
https://notes.dailybits.tech/api/auth/callback
```

#### Custom Sign-In URL (opcional)
Se houver este campo, configure como:
```
https://notes.dailybits.tech/api/auth/login
```
Ou deixe vazio.

**⚠️ IMPORTANTE:** A "Custom Sign-In URL" é apenas informativa. O OCI Domain **NÃO deve** usar essa URL como redirect após autenticação.

### Passo 3: Verificar Variável de Ambiente

Certifique-se de que na **Vercel** a variável `CALLBACK_URL` está configurada como:
```
https://notes.dailybits.tech/api/auth/callback
```

## 🔄 Após Configurar

1. **Salve** as alterações no OCI Domain
2. **Aguarde 1-2 minutos** para propagação
3. **Teste novamente:**
   - Acesse: `https://notes.dailybits.tech`
   - Clique em "Entrar com SSO Corporativo"
   - Após login no OCI Domain, você deve ser redirecionado para `/api/auth/callback`
   - Depois será redirecionado para `/` (home) autenticado

## 📝 Resumo das URLs Corretas

| Configuração | URL Correta |
|--------------|-------------|
| **Redirect URI / Callback URL** | `https://notes.dailybits.tech/api/auth/callback` |
| **Custom Sign-In URL** | `https://notes.dailybits.tech/api/auth/login` (ou vazio) |
| **Application URL** | `https://notes.dailybits.tech` |
| **Custom Sign-Out URL** | `https://notes.dailybits.tech/api/auth/logout` |

## 🆘 Se Ainda Não Funcionar

Se mesmo após configurar corretamente o OCI Domain ainda redirecionar para `/login`:

1. Verifique se você salvou as alterações
2. Verifique se não há cache no navegador
3. Tente criar uma nova aplicação OCI Domain do zero
4. Verifique os logs do Vercel para ver qual URL está sendo chamada

---

**O código foi atualizado para aceitar POST em `/api/auth/login` e redirecionar para o callback, mas a solução correta é configurar o OCI Domain para usar `/api/auth/callback` como redirect.**
