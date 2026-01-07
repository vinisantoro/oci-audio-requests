# Desenvolvimento Local com SAML SSO

Este guia explica como rodar a aplicação localmente com autenticação SAML SSO usando o OCI Identity Provider (IDCS).

## 📋 Pré-requisitos

1. Node.js 18+ instalado
2. Vercel CLI instalado: `npm i -g vercel`
3. Arquivo `.env.local` configurado (já criado com suas configurações)

## 🚀 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente Locais

O arquivo `.env.local` já foi criado com as configurações do seu IDCS:
- **Provider ID**: `idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com`
- **Metadata URL**: Configurada automaticamente

**Importante:** Você precisa configurar:
- `OCI_UPLOAD_URL` - URL do seu bucket OCI para uploads

Edite o arquivo `.env.local` e adicione sua `OCI_UPLOAD_URL`.

### 3. Registrar Aplicação no OCI Identity Provider

Antes de testar, você precisa registrar sua aplicação local no OCI Identity Provider:

1. Acesse: **OCI Console > Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**

2. Vá para a seção **"Applications"** ou **"Service Providers"**

3. Clique em **"Add Application"** ou **"Register Service Provider"**

4. Configure:

   **Opção A: Usar Metadata URL (Recomendado)**
   - Metadata URL: `http://localhost:3000/api/saml/metadata`
   - **Nota:** Para desenvolvimento local, você pode precisar usar um túnel (veja abaixo)

   **Opção B: Configuração Manual**
   - **Entity ID**: `http://localhost:3000/api/saml/metadata`
   - **Assertion Consumer Service (ACS) URL**: `http://localhost:3000/api/saml/callback`
   - **Single Logout Service URL** (opcional): `http://localhost:3000/api/saml/logout`

## 🔧 Rodando Localmente

### Opção 1: Usando Vercel Dev (Recomendado)

```bash
# Login no Vercel (se ainda não fez)
vercel login

# Rodar servidor de desenvolvimento
vercel dev
```

A aplicação estará disponível em: `http://localhost:3000`

### Opção 2: Usando Node.js Diretamente (Limitado)

Para desenvolvimento básico do frontend (sem APIs funcionando):

```bash
# Instalar servidor HTTP simples
npx serve .

# Ou usar Python
python3 -m http.server 3000
```

**Nota:** As APIs SAML não funcionarão sem um servidor que suporte serverless functions. Use `vercel dev` para funcionalidade completa.

## 🌐 Expondo Localhost para OCI (Túnel)

O OCI Identity Provider precisa acessar sua aplicação local. Você tem duas opções:

### Opção A: Usar ngrok (Recomendado para testes)

1. Instale ngrok: https://ngrok.com/download
2. Execute:
   ```bash
   ngrok http 3000
   ```
3. Use a URL fornecida pelo ngrok (ex: `https://abc123.ngrok.io`)
4. Atualize `.env.local`:
   ```bash
   VERCEL_URL=https://abc123.ngrok.io
   SAML_SP_ENTITY_ID=https://abc123.ngrok.io/api/saml/metadata
   SAML_ACS_URL=https://abc123.ngrok.io/api/saml/callback
   SAML_SLO_URL=https://abc123.ngrok.io/api/saml/logout
   ```
5. Atualize o registro no OCI Identity Provider com as URLs do ngrok

### Opção B: Usar localtunnel

```bash
npm install -g localtunnel
lt --port 3000
```

## 🧪 Testando

1. Inicie o servidor local:
   ```bash
   vercel dev
   ```

2. Acesse: `http://localhost:3000` (ou URL do túnel se usando)

3. Você deve ser redirecionado para o OCI Identity Provider

4. O OCI Identity Provider redirecionará para seu IdP Corporativo

5. Faça login com suas credenciais corporativas

6. Você será redirecionado de volta para a aplicação local

7. Teste a gravação e upload de áudio

## 🐛 Troubleshooting

### Erro: "SAML configuration error"

- Verifique se `.env.local` está configurado corretamente
- Verifique se `OCI_IDP_METADATA_URL` está acessível
- Tente acessar a Metadata URL no navegador para verificar

### Erro: "Invalid SAML response"

- Verifique se a aplicação está registrada no OCI Identity Provider
- Verifique se as URLs no OCI estão corretas (usar túnel se necessário)
- Verifique os logs do servidor: `vercel dev` mostra logs no terminal

### Cookies não funcionam localmente

- Certifique-se de usar `http://localhost:3000` (não `127.0.0.1`)
- Se usando túnel, use HTTPS (ngrok fornece HTTPS automaticamente)
- Verifique se cookies não estão sendo bloqueados pelo navegador

### Metadata URL não acessível

- Se usando túnel, certifique-se de que o túnel está ativo
- Acesse `http://localhost:3000/api/saml/metadata` diretamente no navegador
- Verifique se o servidor está rodando

## 📝 Notas Importantes

1. **Cookies em Localhost:**
   - Cookies funcionam normalmente em `http://localhost`
   - Não funcionam em `http://127.0.0.1` (use `localhost`)

2. **HTTPS vs HTTP:**
   - OCI Identity Provider pode exigir HTTPS
   - Use ngrok ou similar para HTTPS em desenvolvimento local
   - Em produção (Vercel), HTTPS é automático

3. **Porta Padrão:**
   - Vercel dev usa porta 3000 por padrão
   - Se a porta estiver ocupada, Vercel perguntará se quer usar outra porta
   - Atualize `VERCEL_URL` no `.env.local` se mudar a porta

4. **Variáveis de Ambiente:**
   - `.env.local` é usado apenas localmente
   - Não é commitado no git (está no `.gitignore`)
   - Configure variáveis na Vercel para produção

## 🔄 Próximos Passos

Após testar localmente:

1. Configure as variáveis de ambiente na Vercel para produção
2. Faça deploy da aplicação
3. Atualize o registro no OCI Identity Provider com URLs de produção
4. Teste em produção

