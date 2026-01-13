# Requisitos para Configuração OCI Domains SSO

Este documento lista **todos os requisitos necessários** para configurar o SSO SAML usando OCI Domains (Identity Domains) com configuração manual (método mais rápido).

## 📋 Checklist de Requisitos

Marque cada item conforme você obtém as informações:

### 1. OCIDs Necessários

- [ ] **OCID do Identity Domain**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Details
  - **Formato:** `ocid1.domain.oc1..<unique-id>`
  - **Exemplo:** `ocid1.domain.oc1..aaaaaaaabcdefghijklmnopqrstuvwxyz123456`
  - **Uso:** Identificação do domínio de identidade no OCI

- [ ] **OCID do Identity Provider SAML**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Security > Identity Providers > [Seu IdP] > Details
  - **Formato:** `ocid1.samlidp.oc1..<unique-id>`
  - **Exemplo:** `ocid1.samlidp.oc1..aaaaaaaabcdefghijklmnopqrstuvwxyz123456`
  - **Uso:** Identificação do Identity Provider SAML configurado no OCI Domain

- [ ] **OCID da Aplicação (se já registrada)**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Applications > [Sua App] > Details
  - **Formato:** `ocid1.app.oc1..<unique-id>`
  - **Nota:** Este OCID será gerado após registrar a aplicação no OCI Domain
  - **Uso:** Identificação da aplicação registrada no OCI Domain

### 2. URLs Necessárias

- [ ] **SSO URL do OCI Identity Provider**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Security > Identity Providers > [Seu IdP] > Details > SSO URL
  - **Formato típico:** `https://<domain-id>.identity.oraclecloud.com/v1/saml/sso/<idp-ocid>`
  - **Ou:** `https://identity.oraclecloud.com/v1/identity/saml/sso/<idp-ocid>`
  - **Exemplo:** `https://idcs-abc123.identity.oraclecloud.com/v1/saml/sso/ocid1.samlidp.oc1..aaaaaaa`
  - **Uso:** URL para redirecionar usuários para autenticação SAML
  - **Variável de ambiente:** `OCI_IDP_SSO_URL`

- [ ] **SLO URL (Single Logout URL)**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Security > Identity Providers > [Seu IdP] > Details > SLO URL
  - **Formato típico:** `https://<domain-id>.identity.oraclecloud.com/v1/saml/slo/<idp-ocid>`
  - **Ou:** `https://identity.oraclecloud.com/v1/identity/saml/slo/<idp-ocid>`
  - **Exemplo:** `https://idcs-abc123.identity.oraclecloud.com/v1/saml/slo/ocid1.samlidp.oc1..aaaaaaa`
  - **Nota:** Se não disponível, pode ser derivado da SSO URL substituindo `/sso` por `/slo`
  - **Uso:** URL para logout SAML
  - **Variável de ambiente:** `OCI_IDP_SLO_URL` (opcional)

- [ ] **Metadata URL (opcional, para referência)**
  - **Onde obter:** Console OCI > Identity & Security > Domains > [Seu Domain] > Security > Identity Providers > [Seu IdP] > Metadata
  - **Formato típico:** `https://<domain-id>.identity.oraclecloud.com/v1/saml/metadata/<idp-ocid>`
  - **Ou:** `https://identity.oraclecloud.com/v1/identity/saml/metadata/<idp-ocid>`
  - **Uso:** Para referência e validação (não usado diretamente na configuração manual)
  - **Variável de ambiente:** `OCI_IDP_METADATA_URL` (opcional)

### 3. Certificados

- [ ] **Certificado(s) do OCI Identity Provider**
  - **Onde obter:** 
    1. Console OCI > Identity & Security > Domains > [Seu Domain] > Security > Identity Providers > [Seu IdP] > Details > Certificates
    2. Ou baixar do Metadata URL (acesse a URL e procure pelo elemento `<X509Certificate>`)
  - **Formato:** Certificado X.509 em formato PEM
  - **Exemplo:**
    ```
    -----BEGIN CERTIFICATE-----
    MIIDXTCCAkWgAwIBAgIJAKL7wQ8O3uX3MA0GCSqGSIb3DQEBCQUAMEUxCzAJBgNV
    BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
    aWRnaXRzIFB0eSBMdGQwHhcNMTcwODI3MjM1NTMyWhcNMjcwODI1MjM1NTMyWjBF
    ...
    -----END CERTIFICATE-----
    ```
  - **Nota:** Pode haver múltiplos certificados. Se houver mais de um, separe com `-----SPLIT-----`
  - **Uso:** Validação de assinaturas SAML do Identity Provider
  - **Variável de ambiente:** `OCI_IDP_CERTIFICATES`

### 4. Metadados XML

- [ ] **Metadados SAML do Service Provider (da aplicação)**
  - **Onde obter:** Após deploy da aplicação, acesse: `https://sua-app.vercel.app/api/saml/metadata`
  - **Formato:** Arquivo XML SAML 2.0
  - **Conteúdo esperado:**
    - Entity ID da aplicação
    - Assertion Consumer Service (ACS) URL
    - Single Logout Service (SLO) URL
    - Certificado do Service Provider (se aplicável)
  - **Uso:** Registrar a aplicação no OCI Domain como Service Provider confiável
  - **Quando obter:** Após fazer o deploy inicial da aplicação

- [ ] **Metadados do Identity Provider (opcional, para referência)**
  - **Onde obter:** Acesse a Metadata URL do Identity Provider no navegador
  - **Formato:** Arquivo XML SAML 2.0
  - **Uso:** Para referência e validação (não obrigatório para configuração manual)

### 5. Informações da Aplicação (Service Provider)

- [ ] **Entity ID da aplicação**
  - **Formato:** `https://sua-app.vercel.app/api/saml/metadata`
  - **Padrão:** Se não especificado, será `VERCEL_URL/api/saml/metadata`
  - **Uso:** Identificador único da aplicação no SAML
  - **Variável de ambiente:** `SAML_SP_ENTITY_ID` (opcional)

- [ ] **Assertion Consumer Service (ACS) URL**
  - **Formato:** `https://sua-app.vercel.app/api/saml/callback`
  - **Padrão:** Se não especificado, será `VERCEL_URL/api/saml/callback`
  - **Uso:** URL onde o Identity Provider envia a resposta SAML após autenticação
  - **Variável de ambiente:** `SAML_ACS_URL` (opcional)

- [ ] **Single Logout Service (SLO) URL**
  - **Formato:** `https://sua-app.vercel.app/api/saml/logout`
  - **Padrão:** Se não especificado, será `VERCEL_URL/api/saml/logout`
  - **Uso:** URL para logout SAML
  - **Variável de ambiente:** `SAML_SLO_URL` (opcional)

- [ ] **URL base da aplicação**
  - **Formato:** `https://sua-app.vercel.app`
  - **Uso:** Para construir as URLs acima se não especificadas
  - **Variável de ambiente:** `VERCEL_URL` (automático) ou `SAML_SP_BASE_URL` (manual)

### 6. Configurações Adicionais

- [ ] **Mapeamento de atributos SAML**
  - **Atributos esperados pela aplicação:**
    - `name_id` (NameID) - preferencialmente com formato de email
    - `email` ou `mail`
    - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
  - **Onde configurar:** Console OCI > Identity Providers > [Seu IdP] > Attribute Mapping
  - **Uso:** Garantir que o email do usuário seja enviado na resposta SAML

- [ ] **Lista de e-mails permitidos (opcional)**
  - **Formato:** JSON array: `["email1@example.com","email2@example.com"]`
  - **Uso:** Camada adicional de segurança para restringir acesso
  - **Variável de ambiente:** `ALLOWED_EMAILS` (opcional)

## 🚀 Processo Rápido de Configuração

### Passo 1: Obter Informações do Console OCI

1. Acesse o **Console OCI**
2. Navegue até **Identity & Security > Domains**
3. Selecione seu **Identity Domain**
4. Vá para **Security > Identity Providers**
5. Selecione seu **Identity Provider SAML** (que já está federado com seu IdP corporativo)

### Passo 2: Coletar Dados Necessários

Preencha o checklist acima coletando:

1. **OCIDs:** Copie os OCIDs do Domain e do Identity Provider
2. **URLs:** Copie a SSO URL e SLO URL (ou derive do SSO URL)
3. **Certificados:** Baixe o certificado do Identity Provider
4. **Metadados:** Após deploy, obtenha os metadados da aplicação

### Passo 3: Configurar Variáveis de Ambiente

Configure na Vercel (ou sua plataforma):

```bash
# OBRIGATÓRIO: SSO URL do OCI Identity Provider
OCI_IDP_SSO_URL=https://<domain-id>.identity.oraclecloud.com/v1/saml/sso/<idp-ocid>

# OBRIGATÓRIO: Certificado(s) do OCI Identity Provider
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
SEU_CERTIFICADO_AQUI
-----END CERTIFICATE-----

# OPCIONAL: SLO URL (se diferente, ou deixe vazio para auto-derivar)
OCI_IDP_SLO_URL=https://<domain-id>.identity.oraclecloud.com/v1/saml/slo/<idp-ocid>

# OPCIONAL: URLs da aplicação (padrão usa VERCEL_URL automaticamente)
SAML_SP_ENTITY_ID=https://sua-app.vercel.app/api/saml/metadata
SAML_ACS_URL=https://sua-app.vercel.app/api/saml/callback
SAML_SLO_URL=https://sua-app.vercel.app/api/saml/logout
```

### Passo 4: Registrar Aplicação no OCI Domain

1. No Console OCI, vá para **Identity & Security > Domains > [Seu Domain] > Applications**
2. Clique em **"Add Application"** ou **"Create Application"**
3. Selecione **"SAML Application"** ou **"Custom Application"**
4. Configure:
   - **Name:** Nome da sua aplicação
   - **Assertion Consumer Service URL:** `https://sua-app.vercel.app/api/saml/callback`
   - **Entity ID:** `https://sua-app.vercel.app/api/saml/metadata`
   - **Single Logout URL:** `https://sua-app.vercel.app/api/saml/logout`
5. Configure o **Attribute Mapping** para enviar o email do usuário
6. Salve e ative a aplicação

### Passo 5: Testar

1. Acesse sua aplicação
2. Você deve ser redirecionado para o OCI Identity Provider
3. O OCI Identity Provider redirecionará para o IdP Corporativo
4. Faça login com credenciais corporativas
5. Você será redirecionado de volta para a aplicação autenticado

## 📝 Notas Importantes

- **Configuração Manual é mais rápida** que usar Metadata URL porque não requer processamento de XML
- **Certificados são obrigatórios** na configuração manual
- **SSO URL é obrigatória** - sem ela, a autenticação não funcionará
- **SLO URL pode ser derivada** automaticamente se não fornecida
- **Metadados da aplicação** só estarão disponíveis após o primeiro deploy
- **OCIDs são únicos** e específicos do seu tenancy OCI

## 🔗 Referências

- [README_SAML.md](README_SAML.md) - Documentação completa de configuração SAML
- [SAML_CONFIG.env.example](SAML_CONFIG.env.example) - Exemplo de arquivo de configuração
- [Documentação OCI Identity Domains](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/overview.htm)

## ❓ Dúvidas?

Se alguma informação não estiver disponível no console OCI:

1. Verifique se você tem as permissões necessárias no OCI
2. Confirme que o Identity Provider SAML está ativo e federado corretamente
3. Consulte a documentação oficial do OCI Identity Domains
4. Verifique os logs da aplicação após o deploy para identificar problemas
