# Fix: Erro "Failed to initiate SSO login"

## 🔴 Problema

Ao clicar em "Entrar com SSO Corporativo", você recebe:
```json
{
  "error": "Failed to initiate SSO login"
}
```

## 🔍 Causa

A biblioteca `saml2-js` **não busca metadados automaticamente** de uma URL. Quando você configura `OCI_IDP_METADATA_URL`, ela não consegue buscar e processar os metadados sozinha.

## ✅ Solução: Usar Certificados Diretamente

Você precisa fornecer os **certificados do IDCS diretamente** nas variáveis de ambiente, ao invés de apenas a Metadata URL.

### Passo 1: Obter Certificado do IDCS

1. **Acesse a Metadata URL do IDCS no navegador:**
   ```
   https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata
   ```

2. **Procure pelo elemento `<X509Certificate>`** no XML retornado

3. **Copie o conteúdo do certificado** (é um texto longo sem quebras de linha)

4. **Formate como certificado:**
   ```bash
   -----BEGIN CERTIFICATE-----
   [conteúdo do certificado aqui]
   -----END CERTIFICATE-----
   ```

### Passo 2: Configurar Variáveis de Ambiente na Vercel

No **Vercel Dashboard > Settings > Environment Variables**, configure para **Preview**:

#### Opção A: Usar Metadata URL + Certificados (Recomendado)

```bash
# Metadata URL (para referência, mas não é usada automaticamente)
OCI_IDP_METADATA_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata

# SSO URL do IDCS
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso

# Certificado do IDCS (OBRIGATÓRIO)
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
[cole o certificado completo aqui]
-----END CERTIFICATE-----

# Service Provider URLs
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

#### Opção B: Apenas SSO URL + Certificados (Mais Simples)

```bash
# SSO URL do IDCS
OCI_IDP_SSO_URL=https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso

# Certificado do IDCS (OBRIGATÓRIO)
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
[cole o certificado completo aqui]
-----END CERTIFICATE-----

# Service Provider URLs
SAML_SP_BASE_URL=https://notes.dailybits.tech
SAML_SP_ENTITY_ID=https://notes.dailybits.tech/api/saml/metadata
SAML_ACS_URL=https://notes.dailybits.tech/api/saml/callback
SAML_SLO_URL=https://notes.dailybits.tech/api/saml/logout

# OCI Object Storage
OCI_UPLOAD_URL=https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/
```

### Passo 3: Verificar URLs do IDCS

As URLs corretas do seu IDCS são:
- **SSO URL**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/sso`
- **SLO URL**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/saml/slo`
- **Metadata URL**: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`

### Passo 4: Redeploy

Após configurar as variáveis:

1. **Faça um novo deploy** ou aguarde o redeploy automático
2. **Teste novamente** o botão "Entrar com SSO Corporativo"

## 🔍 Como Obter o Certificado do Metadata XML

1. Acesse a Metadata URL no navegador
2. Você verá um XML como este:
   ```xml
   <EntityDescriptor>
     <IDPSSODescriptor>
       <KeyDescriptor use="signing">
         <KeyInfo>
           <X509Data>
             <X509Certificate>MIIDXTCCAkWgAwIBAgIJAK...</X509Certificate>
           </X509Data>
         </KeyInfo>
       </KeyDescriptor>
       <SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://idcs-.../fed/v1/saml/sso"/>
     </IDPSSODescriptor>
   </EntityDescriptor>
   ```

3. Copie o conteúdo dentro de `<X509Certificate>` e `<X509Certificate>`

4. Formate como:
   ```
   -----BEGIN CERTIFICATE-----
   MIIDXTCCAkWgAwIBAgIJAK...
   [resto do certificado]
   -----END CERTIFICATE-----
   ```

## 🐛 Troubleshooting

### Erro persiste após configurar certificados

1. **Verifique se o certificado está completo:**
   - Deve começar com `-----BEGIN CERTIFICATE-----`
   - Deve terminar com `-----END CERTIFICATE-----`
   - Não deve ter quebras de linha no meio do conteúdo

2. **Verifique os logs do Vercel:**
   - Vercel Dashboard > Deployments > [Seu Deployment] > Logs
   - Procure por erros relacionados a SAML ou certificados

3. **Teste a Metadata URL:**
   - Acesse: `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/fed/v1/metadata`
   - Deve retornar XML válido

4. **Verifique se as variáveis estão configuradas para Preview:**
   - Certifique-se de que as variáveis estão no ambiente **Preview**, não apenas Production

## 📝 Nota Importante

A biblioteca `saml2-js` requer que você forneça os certificados diretamente. A Metadata URL é útil para obter as informações, mas você precisa extrair o certificado manualmente e configurá-lo como variável de ambiente.

