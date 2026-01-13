# Troubleshooting: Erro "missing_parameters"

## Problema

Após fazer login no OCI Domain, você é redirecionado para:
```
https://notes.dailybits.tech/?error=missing_parameters
```

Isso significa que o callback não está recebendo os parâmetros `code` e `state` do OCI Domain.

## Causas Possíveis

### 1. Redirect URI incorreto no OCI Domain

O OCI Domain pode estar redirecionando para uma URL diferente da configurada.

**Verificar:**
1. Acesse OCI Console > Identity & Security > Domains > [Seu Domain] > Applications > [Sua App]
2. Vá em **Configuration** > **OAuth/OIDC Settings**
3. Verifique se o **Redirect URI** está exatamente como:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
4. Verifique se não há espaços extras ou caracteres especiais

### 2. Custom Social Linking Callback URL incorreto

**Verificar:**
1. Na mesma página da aplicação, vá em **General Settings**
2. Verifique se **Custom Social Linking Callback URL** está como:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
3. **IMPORTANTE:** Este campo deve ser igual ao Redirect URI

### 3. Custom Sign-In URL causando conflito

Se você configurou **Custom Sign-In URL** como `/api/auth/login`, o OCI Domain pode estar redirecionando para lá em vez do callback.

**Solução:**
- Deixe o **Custom Sign-In URL** vazio, OU
- Configure como `https://notes.dailybits.tech/api/auth/login` (deve ser diferente do callback)

### 4. OCI Domain usando POST em vez de GET

Algumas configurações do OCI Domain podem usar POST para o callback.

**Solução:** O código já foi atualizado para aceitar POST, mas verifique os logs do Vercel para confirmar.

## Como Verificar

### 1. Verificar logs do Vercel

1. Acesse Vercel Dashboard > Seu projeto > **Functions** > `api/auth/callback`
2. Veja os logs recentes após tentar fazer login
3. Procure por mensagens como:
   ```
   Callback received: { method: 'GET', url: '...', query: {...} }
   Missing parameters: { hasCode: false, hasState: false, ... }
   ```

### 2. Verificar URL de redirecionamento

Quando você faz login no OCI Domain, observe a URL para onde você é redirecionado:

- ✅ **Correto:** `https://notes.dailybits.tech/api/auth/callback?code=...&state=...`
- ❌ **Incorreto:** `https://notes.dailybits.tech/?error=missing_parameters`
- ❌ **Incorreto:** `https://notes.dailybits.tech/api/auth/login?code=...&state=...`

### 3. Testar diretamente

Abra o console do navegador e execute:
```javascript
// Verificar cookies
document.cookie

// Verificar URL atual
window.location.href

// Verificar parâmetros da URL
new URLSearchParams(window.location.search).get('code')
new URLSearchParams(window.location.search).get('state')
```

## Solução Passo a Passo

### Passo 1: Limpar configuração atual

1. No OCI Console, vá para sua aplicação
2. Anote todas as URLs configuradas
3. Limpe os campos:
   - Custom Sign-In URL (deixe vazio)
   - Custom Social Linking Callback URL (deixe vazio temporariamente)

### Passo 2: Configurar Redirect URI

1. Vá em **Configuration** > **OAuth/OIDC Settings**
2. Em **Redirect URIs**, adicione **APENAS**:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
3. Remova qualquer outra URL de callback
4. Salve as alterações

### Passo 3: Configurar Custom Social Linking Callback URL

1. Vá em **General Settings**
2. Em **Custom Social Linking Callback URL**, adicione:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
3. Salve as alterações

### Passo 4: Verificar variáveis de ambiente na Vercel

1. Acesse Vercel Dashboard > Seu projeto > **Settings** > **Environment Variables**
2. Verifique se `CALLBACK_URL` está configurado como:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
3. Se não estiver, atualize e faça um novo deploy

### Passo 5: Testar novamente

1. Aguarde 30-60 segundos para propagação das mudanças no OCI
2. Limpe os cookies do navegador (ou use modo anônimo)
3. Acesse `https://notes.dailybits.tech`
4. Clique em "Entrar com SSO Corporativo"
5. Faça login
6. Observe a URL após o login - deve ser `/api/auth/callback?code=...&state=...`

## Configuração Final Recomendada

### OCI Domain Application Settings:

- **Application URL:** `https://notes.dailybits.tech/`
- **Custom Sign-In URL:** (vazio ou `https://notes.dailybits.tech/api/auth/login`)
- **Custom Sign-Out URL:** `https://notes.dailybits.tech/api/auth/logout`
- **Custom Social Linking Callback URL:** `https://notes.dailybits.tech/api/auth/callback`
- **Redirect URIs (OAuth/OIDC):** `https://notes.dailybits.tech/api/auth/callback` (apenas esta)

### Vercel Environment Variables:

- `CALLBACK_URL`: `https://notes.dailybits.tech/api/auth/callback`
- `OCI_DOMAIN_URL`: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com`
- `CLIENT_ID`: (seu Client ID)
- `CLIENT_SECRET`: (seu Client Secret)

## Se o problema persistir

1. Verifique os logs do Vercel para ver exatamente o que está sendo recebido
2. Capture um screenshot da configuração do OCI Domain
3. Verifique se há algum proxy ou CDN na frente que possa estar modificando as URLs
4. Teste com um cliente OAuth2 simples (como Postman) para verificar se o OCI Domain está funcionando corretamente
