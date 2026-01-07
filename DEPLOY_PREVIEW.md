# Deploy Preview - notes.dailybits.tech

## 🚀 Configuração Rápida

Esta branch está configurada para fazer deploy em preview usando o domínio `notes.dailybits.tech`.

## 📋 Passos para Deploy

### 1. Configurar Variáveis de Ambiente na Vercel

Acesse: **Vercel Dashboard > Your Project > Settings > Environment Variables**

Configure as seguintes variáveis para o ambiente **Preview**:

```bash
# OCI Identity Provider (IDCS - CORP-IDCS)
OCI_IDP_METADATA_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata

# Service Provider URLs (usando domínio preview)
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage (configure com seus valores reais)
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

**Importante:** 
- Configure essas variáveis para o ambiente **Preview** (não Production)
- Substitua `<par-id>`, `<namespace>` e `<bucket>` na `OCI_UPLOAD_URL`

### 2. Configurar Domínio no Vercel

O domínio `notes.dailybits.tech` precisa estar configurado:

**Via Dashboard:**
1. Vercel Dashboard > Your Project > Settings > Domains
2. Adicione: `notes.dailybits.tech`
3. Configure para apontar para **Preview Deployments**

**Via CLI:**
```bash
vercel domains add notes.dailybits.tech
```

### 3. Registrar Aplicação no CORP-IDCS

Registre a aplicação no OCI Identity Provider:

1. **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]** > **Identity Providers** > **CORP-IDCS**
2. Vá para **"Applications"** ou **"Service Providers"**
3. Clique em **"Add Application"** ou **"Register Service Provider"**
4. Configure:

   **Opção A: Usar Metadata URL (Recomendado)**
   ```
   Metadata URL: https://notes.dailybits.tech/api/saml/metadata
   ```

   **Opção B: Configuração Manual**
   ```
   Entity ID: https://notes.dailybits.tech/api/saml/metadata
   ACS URL: https://notes.dailybits.tech/api/saml/callback
   SLO URL: https://notes.dailybits.tech/api/saml/logout
   ```

### 4. Fazer Deploy

**Opção A: Via CLI (Recomendado)**
```bash
# Certifique-se de estar na branch correta
git checkout feature/saml-sso-authentication

# Fazer deploy em preview
vercel --preview
```

**Opção B: Via Git Push (Automático)**
```bash
# Push para trigger automático
git push origin feature/saml-sso-authentication
```

O Vercel criará automaticamente um deployment preview.

### 5. Verificar Deploy

1. Acesse: `https://notes.dailybits.tech`
2. Verifique se a Metadata está acessível: `https://notes.dailybits.tech/api/saml/metadata`
3. Teste o fluxo completo:
   - Acesso à aplicação
   - Redirecionamento para CORP-IDCS
   - Login no IdP corporativo
   - Retorno para aplicação
   - Gravação e upload de áudio

## 🔍 Verificações

### Verificar Metadata
```
https://notes.dailybits.tech/api/saml/metadata
```
Deve retornar XML com metadados SAML.

### Verificar Variáveis de Ambiente
- Vercel Dashboard > Settings > Environment Variables
- Verifique se estão configuradas para **Preview**
- Certifique-se de que `OCI_IDP_METADATA_URL` está configurada

### Verificar Logs
- Vercel Dashboard > Deployments > [Seu Deployment] > Logs
- Verifique se há erros de configuração SAML

## 🐛 Troubleshooting

### Domínio não funciona
- Verifique DNS: `dig notes.dailybits.tech`
- Verifique se está configurado no Vercel
- Verifique se está apontando para Preview

### Erro: "SAML configuration error"
- Verifique variáveis de ambiente no Vercel
- Verifique se `OCI_IDP_METADATA_URL` está acessível
- Verifique logs do deployment

### Erro: "Invalid SAML response"
- Verifique se aplicação está registrada no CORP-IDCS
- Verifique URLs no IDCS (devem ser `https://notes.dailybits.tech/...`)
- Verifique se está usando HTTPS

## ✅ Checklist

- [ ] Variáveis de ambiente configuradas no Vercel (Preview)
- [ ] Domínio `notes.dailybits.tech` configurado no Vercel
- [ ] Aplicação registrada no CORP-IDCS
- [ ] Deploy feito (`vercel --preview` ou push)
- [ ] Metadata acessível: `https://notes.dailybits.tech/api/saml/metadata`
- [ ] Testado fluxo completo de autenticação

## 📝 Notas

- **Preview vs Production:** Este setup é para Preview. Para produção, configure variáveis separadas.
- **HTTPS:** Vercel fornece HTTPS automaticamente. Use sempre `https://`.
- **Branch:** Este deploy é específico para a branch `feature/saml-sso-authentication`.

