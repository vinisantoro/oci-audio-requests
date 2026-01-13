# Troubleshooting: State recebido mas Code não recebido

## Problema

Após fazer login no OCI Domain, você é redirecionado para:
```
https://notes.dailybits.tech/?error=missing_parameters&details=code%3Dfalse%2Cstate%3Dtrue%2Cmethod%3DGET
```

Isso significa que:
- ✅ O `state` está sendo recebido (`state=true`)
- ❌ O `code` não está sendo recebido (`code=false`)

## Causas Possíveis

### 1. Autenticação não completada

O OCI Domain só envia o `code` após a autenticação ser **completada com sucesso**. Se você:
- Cancelou o login
- Não inseriu as credenciais corretamente
- Houve algum erro durante a autenticação
- O usuário não tem permissão para acessar a aplicação

O OCI Domain pode redirecionar apenas com o `state` (para validar a sessão) mas sem o `code`.

### 2. Configuração incorreta no OCI Domain

Verifique se:

#### A. Redirect URI está correto
1. Acesse OCI Console > Identity & Security > Domains > [Seu Domain] > Applications > [Sua App]
2. Vá em **Configuration** > **OAuth/OIDC Settings**
3. Verifique se o **Redirect URI** está **exatamente** como:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
4. **IMPORTANTE:** Não deve haver espaços, caracteres especiais ou URLs diferentes

#### B. Application Type está correto
1. Na mesma página, verifique se **Application Type** está como:
   - ✅ **Confidential Application** (recomendado)
   - ❌ Não deve ser "Public Application" ou "Trusted Application"

#### C. Grant Types habilitados
1. Na seção **OAuth/OIDC Settings**, verifique se os seguintes **Grant Types** estão habilitados:
   - ✅ **Authorization Code** (obrigatório)
   - ✅ **Refresh Token** (opcional, mas recomendado)

#### D. Scopes configurados
1. Verifique se os **Scopes** estão configurados:
   - ✅ `openid`
   - ✅ `profile`
   - ✅ `email`

### 3. Usuário não autorizado

Se o usuário não tem permissão para acessar a aplicação no OCI Domain, o OCI pode redirecionar sem o `code`.

**Verificar:**
1. No OCI Console, vá para sua aplicação
2. Vá em **Users** ou **Groups**
3. Verifique se o usuário está atribuído à aplicação ou a um grupo que tem acesso

### 4. Custom Sign-In URL causando conflito

Se você configurou **Custom Sign-In URL**, isso pode estar interferindo no fluxo.

**Solução:**
- Deixe o **Custom Sign-In URL** vazio, OU
- Configure como `https://notes.dailybits.tech/api/auth/login` (deve ser diferente do callback)

## Como Diagnosticar

### 1. Verificar logs do Vercel

1. Acesse Vercel Dashboard > Seu projeto > **Functions** > `api/auth/callback`
2. Veja os logs após tentar fazer login
3. Procure por:
   ```
   Callback received: { fullUrl: '...', query: {...} }
   Missing parameters - detailed info: { ... }
   ```
4. Verifique a `fullUrl` para ver exatamente o que o OCI Domain está enviando

### 2. Verificar URL de redirecionamento no navegador

Quando você faz login no OCI Domain, observe a URL completa para onde você é redirecionado:

- ✅ **Correto:** `https://notes.dailybits.tech/api/auth/callback?code=ABC123&state=XYZ789`
- ❌ **Problema:** `https://notes.dailybits.tech/api/auth/callback?state=XYZ789` (sem code)
- ❌ **Problema:** `https://notes.dailybits.tech/?error=...` (redirecionado para home)

### 3. Testar com usuário diferente

Tente fazer login com outro usuário para verificar se é um problema específico do usuário ou da configuração.

### 4. Verificar no Console do Navegador

Abra o Console do navegador (F12) e verifique:
- Se há erros de JavaScript
- Se há erros de rede (Network tab)
- Qual é a URL exata após o login

## Solução Passo a Passo

### Passo 1: Verificar configuração completa no OCI Domain

1. **Redirect URIs:**
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
   (apenas esta URL, sem outras)

2. **Custom Social Linking Callback URL:**
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
   (deve ser igual ao Redirect URI)

3. **Custom Sign-In URL:**
   ```
   https://notes.dailybits.tech/api/auth/login
   ```
   (ou deixe vazio)

4. **Application Type:**
   ```
   Confidential Application
   ```

5. **Grant Types:**
   - ✅ Authorization Code
   - ✅ Refresh Token (opcional)

6. **Scopes:**
   - ✅ openid
   - ✅ profile
   - ✅ email

### Passo 2: Verificar variáveis de ambiente na Vercel

1. Acesse Vercel Dashboard > Seu projeto > **Settings** > **Environment Variables**
2. Verifique se todas estão configuradas:
   - `OCI_DOMAIN_URL`: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com`
   - `CLIENT_ID`: `99016db2a53c40a89ddf472380a84e63`
   - `CLIENT_SECRET`: (seu secret)
   - `CALLBACK_URL`: `https://notes.dailybits.tech/api/auth/callback`

### Passo 3: Limpar cookies e testar novamente

1. Limpe todos os cookies do navegador para `notes.dailybits.tech`
2. Use modo anônimo/privado
3. Acesse `https://notes.dailybits.tech`
4. Clique em "Entrar com SSO Corporativo"
5. **Complete o login completamente** (não cancele)
6. Observe a URL após o login

### Passo 4: Verificar permissões do usuário

1. No OCI Console, vá para sua aplicação
2. Vá em **Users** ou **Groups**
3. Verifique se o usuário que está tentando fazer login tem acesso à aplicação

## O que Esperar Após Correção

Após corrigir a configuração, quando você fizer login:

1. Você será redirecionado para o OCI Domain
2. Você fará login com suas credenciais
3. O OCI Domain redirecionará para:
   ```
   https://notes.dailybits.tech/api/auth/callback?code=ABC123&state=XYZ789
   ```
4. O callback processará o `code` e criará a sessão
5. Você será redirecionado para `https://notes.dailybits.tech/` autenticado

## Se o Problema Persistir

1. **Capture os logs completos do Vercel** após tentar fazer login
2. **Capture um screenshot** da configuração do OCI Domain (sem mostrar secrets)
3. **Verifique se há algum erro** no Console do navegador
4. **Teste com outro usuário** para verificar se é específico do usuário

## Nota Importante

O fato de receber `state` mas não `code` geralmente indica que:
- O OCI Domain reconheceu a requisição (por isso enviou o state)
- Mas a autenticação não foi completada ou houve algum problema (por isso não enviou o code)

Verifique especialmente se você está **completando o login completamente** no OCI Domain antes de ser redirecionado.
