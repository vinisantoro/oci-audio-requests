# Deploy Preview - notes.dailybits.tech

## 🚀 Configuração para Deploy Preview

Esta branch está configurada para fazer deploy em preview na Vercel usando o domínio `notes.dailybits.tech`.

## 📋 Pré-requisitos

1. Vercel CLI instalado: `npm i -g vercel`
2. Login na Vercel: `vercel login`
3. Projeto vinculado ao Vercel

## 🔧 Configuração

### 1. Configurar Variáveis de Ambiente na Vercel

Configure as seguintes variáveis de ambiente na Vercel para o ambiente **Preview**:

```bash
# OCI Identity Provider Configuration (IDCS - CORP-IDCS)
OCI_IDP_METADATA_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata

# Service Provider Configuration (usando domínio preview)
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

### 2. Configurar Domínio no Vercel

O domínio `notes.dailybits.tech` precisa estar configurado no Vercel:

1. Acesse: **Vercel Dashboard > Your Project > Settings > Domains**
2. Adicione o domínio: `notes.dailybits.tech`
3. Configure para apontar para **Preview Deployments** (não Production)

Ou via CLI:
```bash
vercel domains add notes.dailybits.tech
```

### 3. Registrar Aplicação no CORP-IDCS

Registre a aplicação no OCI Identity Provider usando o domínio preview:

1. Acesse: **OCI Console > Identity & Security > Domains > [Seu Domain] > Identity Providers > CORP-IDCS**
2. Vá para **"Applications"** ou **"Service Providers"**
3. Clique em **"Add Application"** ou **"Register Service Provider"**
4. Configure:

   **Opção A: Usar Metadata URL (Recomendado)**
   - Metadata URL: `https://notes.dailybits.tech/api/saml/metadata`
   - O IDCS importará automaticamente as configurações

   **Opção B: Configuração Manual**
   - **Entity ID**: `https://notes.dailybits.tech/api/saml/metadata`
   - **Assertion Consumer Service (ACS) URL**: `https://notes.dailybits.tech/api/saml/callback`
   - **Single Logout Service URL**: `https://notes.dailybits.tech/api/saml/logout`

### 4. Fazer Deploy Preview

```bash
# Fazer deploy desta branch em preview
vercel --preview

# Ou fazer push para trigger automático
git push origin feature/saml-sso-authentication
```

O Vercel criará automaticamente um deployment preview e usará o domínio `notes.dailybits.tech` se configurado.

### 5. Verificar Deploy

1. Acesse: `https://notes.dailybits.tech`
2. Você deve ser redirecionado para o CORP-IDCS
3. Teste o fluxo completo de autenticação

## 🔍 Verificações

### Verificar Metadata da Aplicação

Acesse no navegador:
```
https://notes.dailybits.tech/api/saml/metadata
```

Você deve ver o XML de metadados da aplicação.

### Verificar Variáveis de Ambiente

No Vercel Dashboard:
- **Settings > Environment Variables**
- Verifique se as variáveis estão configuradas para **Preview**
- Certifique-se de que `OCI_IDP_METADATA_URL` está configurada

## 🐛 Troubleshooting

### Domínio não está funcionando

- Verifique se o domínio está configurado no Vercel
- Verifique se está apontando para Preview Deployments
- Verifique os DNS records do domínio

### Erro: "SAML configuration error"

- Verifique se as variáveis de ambiente estão configuradas no Vercel
- Verifique se `OCI_IDP_METADATA_URL` está acessível
- Verifique os logs do deployment no Vercel Dashboard

### Erro: "Invalid SAML response"

- Verifique se a aplicação está registrada no CORP-IDCS
- Verifique se as URLs no IDCS estão corretas (`https://notes.dailybits.tech/...`)
- Verifique se está usando HTTPS

## 📝 Notas Importantes

1. **Preview vs Production:**
   - Este setup é para **Preview Deployments**
   - Para produção, configure variáveis separadas e use domínio de produção

2. **HTTPS:**
   - O Vercel fornece HTTPS automaticamente
   - Certifique-se de usar `https://` nas URLs

3. **Variáveis de Ambiente:**
   - Configure variáveis específicas para Preview no Vercel Dashboard
   - Não use `.env.local` para produção/preview (só para desenvolvimento local)

## ✅ Checklist

- [ ] Variáveis de ambiente configuradas no Vercel (Preview)
- [ ] Domínio `notes.dailybits.tech` configurado no Vercel
- [ ] Aplicação registrada no CORP-IDCS com URLs do domínio preview
- [ ] Deploy feito (`vercel --preview` ou push)
- [ ] Metadata URL acessível: `https://notes.dailybits.tech/api/saml/metadata`
- [ ] Testado fluxo completo de autenticação

