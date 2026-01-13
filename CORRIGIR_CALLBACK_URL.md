# 🔧 Como Corrigir o Erro "invalid_redirect_uri"

## ❌ Erro Recebido

```
{"error":"invalid_redirect_uri","error_description":"O cliente 99016db2a53c40a89ddf472380a84e63 solicitou um URL de redirecionamento inválido: https://notes.dailybits.tech/callback"}
```

## 🔍 Causa

A URL de callback `https://notes.dailybits.tech/api/auth/callback` não está registrada na lista de **Redirect URIs** permitidas da aplicação OCI Domain.

## ✅ Solução: Adicionar Redirect URI no OCI Domain

### Passo 1: Acessar a Configuração da Aplicação

1. Acesse o [OCI Console](https://cloud.oracle.com/)
2. Vá para **Identity & Security > Domains**
3. Selecione seu Domain: **Default** (OCID: `ocid1.domain.oc1..aaaaaaaab77apuidncb43h7tgvbhinpqzichb3a5l2yvenjfantfuscykbeq`)
4. Vá para **Applications**
5. Encontre a aplicação com **Client ID**: `99016db2a53c40a89ddf472380a84e63`
6. Clique na aplicação para abrir os detalhes

### Passo 2: Configurar Redirect URIs

Na página de configuração da aplicação, procure por uma das seguintes seções:

#### Opção A: Seção "Redirect URIs" ou "Allowed Redirect URIs"

1. Procure por **"Redirect URIs"**, **"Allowed Redirect URIs"**, ou **"Authorized Redirect URIs"**
2. Clique em **"Add"** ou **"Edit"**
3. Adicione a seguinte URL:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
4. **Salve** as alterações

#### Opção B: Seção "OAuth Settings" ou "OIDC Settings"

1. Procure por **"OAuth Settings"** ou **"OIDC Settings"**
2. Expanda a seção
3. Procure por **"Redirect URIs"** ou **"Authorized Redirect URIs"**
4. Adicione:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
5. **Salve** as alterações

#### Opção C: Seção "Configuration" > "General"

1. Vá para a aba **"Configuration"** ou **"General"**
2. Procure por campos relacionados a URLs de callback
3. Adicione a URL em **"Redirect URIs"** ou campo similar
4. **Salve** as alterações

### Passo 3: Verificar Outras Configurações

Certifique-se de que também estão configuradas:

- ✅ **Application URL**: `https://notes.dailybits.tech`
- ✅ **Custom Sign-In URL**: `https://notes.dailybits.tech/login` (ou `/api/auth/login`)
- ✅ **Custom Sign-Out URL**: `https://notes.dailybits.tech/logout` (ou `/api/auth/logout`)
- ✅ **Redirect URI / Callback URL**: `https://notes.dailybits.tech/callback`

### Passo 4: Verificar Grant Types e Scopes

Na mesma página de configuração, verifique:

- ✅ **Grant Types**: Deve incluir **"Authorization Code"**
- ✅ **Scopes**: Deve incluir `openid`, `profile`, `email`

## 🔄 Após Configurar

1. **Aguarde alguns segundos** para as alterações serem propagadas
2. **Teste novamente** acessando: `https://notes.dailybits.tech`
3. Clique em **"Entrar com SSO Corporativo"**
4. O erro não deve mais aparecer

## 📝 Notas Importantes

### Exatidão da URL

A URL deve ser **exatamente** como está configurada:

- ✅ `https://notes.dailybits.tech/callback` (correto)
- ❌ `https://notes.dailybits.tech/callback/` (com barra no final - pode causar erro)
- ❌ `http://notes.dailybits.tech/callback` (sem HTTPS - não funcionará)
- ❌ `notes.dailybits.tech/callback` (sem protocolo - inválido)

### Múltiplas URLs

Se você precisar testar localmente também, pode adicionar múltiplas URLs:

```
https://notes.dailybits.tech/callback
http://localhost:3000/callback
https://seu-ngrok-url.ngrok.io/callback
```

### Troubleshooting

Se ainda não funcionar após adicionar a URL:

1. **Verifique se salvou** as alterações na aplicação OCI
2. **Aguarde 1-2 minutos** para propagação
3. **Limpe o cache** do navegador
4. **Verifique** se a URL está escrita exatamente igual (case-sensitive em alguns casos)
5. **Verifique** se não há espaços extras antes/depois da URL

## 🆘 Ainda com Problemas?

Se você não encontrar a opção "Redirect URIs" na interface:

1. Tente procurar por **"OAuth Configuration"** ou **"OIDC Configuration"**
2. Verifique se a aplicação é do tipo **"OAuth/OIDC Application"** ou **"Integrated Application"**
3. Se necessário, recrie a aplicação e certifique-se de configurar as Redirect URIs durante a criação

---

**Após configurar, me avise para testarmos novamente!**
