# Configuração SAML SSO com OCI Identity Providers (Broker/Intermediário)

Este documento descreve como configurar a autenticação SAML SSO usando **OCI Identity Providers como broker/intermediário**.

## 🔄 Arquitetura

A aplicação usa o **OCI Identity Provider como intermediário** entre a aplicação e o Identity Provider SAML corporativo:

```
Aplicação → OCI Identity Provider → IdP SAML Corporativo
           (Broker/Intermediário)
```

**Fluxo:**

1. Usuário acessa a aplicação
2. Aplicação redireciona para **OCI Identity Provider**
3. OCI Identity Provider redireciona para o **IdP SAML Corporativo** (já configurado no OCI)
4. Usuário faz login no IdP Corporativo
5. IdP Corporativo retorna para OCI Identity Provider
6. OCI Identity Provider retorna para a aplicação com informações do usuário

## 📋 Pré-requisitos

1. ✅ **OCI Identity Provider já configurado** no seu tenancy OCI e federado com seu IdP SAML corporativo
2. ✅ Acesso ao console OCI para obter metadados/configurações do Identity Provider
3. ✅ Acesso para configurar variáveis de ambiente na plataforma de hospedagem (Vercel)

## 🔧 Configuração

### Passo 1: Obter informações do OCI Identity Provider

No console OCI, vá para **Identity & Security > Identity > Identity Providers** e selecione seu Identity Provider SAML (que já está federado com seu IdP corporativo).

Você precisará obter as informações do **OCI Identity Provider** (não do IdP corporativo diretamente):

#### Opção A: Usar Metadata URL (Recomendado)

1. No console OCI, vá para seu Identity Provider
2. Procure pela opção **"Metadata"** ou **"SAML Metadata"**
3. Copie a **Metadata URL** do OCI Identity Provider
   - Formato típico: `https://identity.oraclecloud.com/v1/identity/saml/metadata/<idp-ocid>`
   - Ou similar dependendo da sua região

#### Opção B: Configuração Manual

Se não houver Metadata URL disponível, você precisará de:

1. **SSO URL do OCI Identity Provider**

   - Formato típico: `https://identity.oraclecloud.com/v1/identity/saml/sso/<idp-ocid>`
   - Ou similar dependendo da sua região
   - Encontre em: Identity Provider > Details > SSO URL

2. **Certificado(s) do OCI Identity Provider**
   - Pode ser obtido dos metadados SAML ou da configuração do IdP
   - Encontre em: Identity Provider > Details > Certificates
   - Pode haver múltiplos certificados

### Passo 2: Configurar variáveis de ambiente

Configure as seguintes variáveis de ambiente na Vercel (ou sua plataforma):

#### Opção A: Usando Metadata URL (Recomendado - Mais Simples)

```bash
# Metadata URL do OCI Identity Provider
OCI_IDP_METADATA_URL=https://identity.oraclecloud.com/v1/identity/saml/metadata/<seu-idp-ocid>

# Ou use o nome genérico (mantido para compatibilidade)
SAML_IDP_METADATA_URL=https://identity.oraclecloud.com/v1/identity/saml/metadata/<seu-idp-ocid>
```

#### Opção B: Configuração Manual

```bash
# URL de SSO do OCI Identity Provider
OCI_IDP_SSO_URL=https://identity.oraclecloud.com/v1/identity/saml/sso/<seu-idp-ocid>

# Certificado(s) do OCI Identity Provider
# Para múltiplos certificados, separe com -----SPLIT-----
OCI_IDP_CERTIFICATES=-----BEGIN CERTIFICATE-----
SEU_CERTIFICADO_OCI_AQUI
-----END CERTIFICATE-----

# URL de Logout (opcional, se diferente da SSO URL)
OCI_IDP_SLO_URL=https://identity.oraclecloud.com/v1/identity/saml/slo/<seu-idp-ocid>
```

**Nota:** Você pode usar os nomes genéricos (`SAML_IDP_*`) ao invés de `OCI_IDP_*` para compatibilidade.

#### Variáveis Opcionais (Service Provider)

```bash
# Entity ID da aplicação (padrão: VERCEL_URL/api/saml/metadata)
SAML_SP_ENTITY_ID=https://sua-app.vercel.app/api/saml/metadata

# URL de callback (padrão: VERCEL_URL/api/saml/callback)
SAML_ACS_URL=https://sua-app.vercel.app/api/saml/callback

# URL de logout (padrão: VERCEL_URL/api/saml/logout)
SAML_SLO_URL=https://sua-app.vercel.app/api/saml/logout
```

### Passo 3: Registrar a aplicação no OCI Identity Provider

No console OCI, você precisa registrar sua aplicação como um **Service Provider confiável** no OCI Identity Provider:

1. Vá para **Identity & Security > Identity > Identity Providers**
2. Selecione seu **OCI Identity Provider** (o que está federado com seu IdP corporativo)
3. Vá para a aba **"Applications"** ou **"Service Providers"**
4. Clique em **"Add Application"** ou **"Register Service Provider"**

5. Configure as seguintes informações:

   **Método 1: Usar Metadata URL (Recomendado)**

   - Forneça a Metadata URL da sua aplicação: `https://sua-app.vercel.app/api/saml/metadata`
   - O OCI irá importar automaticamente as configurações

   **Método 2: Configuração Manual**

   - **Assertion Consumer Service (ACS) URL**: `https://sua-app.vercel.app/api/saml/callback`
   - **Entity ID**: `https://sua-app.vercel.app/api/saml/metadata`
   - **Single Logout Service URL** (opcional): `https://sua-app.vercel.app/api/saml/logout`

6. Configure os atributos SAML que o OCI Identity Provider enviará:
   - Certifique-se de que o **email do usuário** está sendo enviado
   - O OCI Identity Provider deve estar configurado para passar os atributos do IdP corporativo
   - Atributos esperados pela aplicação:
     - `name_id` (NameID) - preferencialmente com formato de email
     - `email` ou `mail`
     - `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

**Importante:** O OCI Identity Provider já está federado com seu IdP corporativo. Você só precisa registrar sua aplicação no OCI Identity Provider, não precisa configurar nada diretamente no IdP corporativo.

### Passo 4: Testar a integração

1. Acesse sua aplicação: `https://sua-app.vercel.app`
2. Você deve ser redirecionado para o **OCI Identity Provider**
3. O OCI Identity Provider redirecionará para o **IdP SAML Corporativo**
4. Faça login com suas credenciais corporativas no IdP Corporativo
5. Você será redirecionado de volta através do OCI Identity Provider para a aplicação
6. Verifique se consegue gravar e enviar áudios

**Fluxo completo:**

```
Aplicação → OCI Identity Provider → IdP Corporativo → OCI Identity Provider → Aplicação
```

## 🔐 Segurança Adicional (Opcional)

Se você quiser restringir o acesso mesmo para usuários autenticados via SAML, pode configurar a variável `ALLOWED_EMAILS`:

```bash
ALLOWED_EMAILS=["user1@example.com","user2@example.com"]
```

Isso adiciona uma camada extra de validação após a autenticação SAML.

## 🐛 Troubleshooting

### Erro: "SAML configuration error"

- Verifique se `OCI_IDP_SSO_URL` ou `OCI_IDP_METADATA_URL` está configurado corretamente
- Se usando certificados, verifique se `OCI_IDP_CERTIFICATES` está no formato correto
- Certifique-se de que os certificados estão completos (incluindo BEGIN e END)
- **Importante:** Use as configurações do **OCI Identity Provider**, não do IdP corporativo diretamente

### Erro: "Invalid SAML response"

- Verifique se o certificado do **OCI Identity Provider** está correto (não do IdP corporativo)
- Verifique se a URL de callback (`/api/saml/callback`) está configurada corretamente no **OCI Identity Provider**
- Verifique se a aplicação está registrada como Service Provider no OCI Identity Provider
- Verifique os logs do servidor para mais detalhes

### Erro: "User email not found in SAML assertion"

- Verifique se o **OCI Identity Provider** está configurado para passar o email do usuário
- Verifique se o OCI Identity Provider está mapeando corretamente os atributos do IdP corporativo
- Verifique a configuração de atributos SAML no **OCI Identity Provider** (não no IdP corporativo)
- Consulte os logs do servidor para ver quais atributos estão sendo recebidos
- O OCI Identity Provider deve estar configurado para passar o email em um dos atributos esperados

### Usuário não é redirecionado para login

- Verifique se a URL `/api/saml/login` está acessível
- Verifique se há erros no console do navegador
- Verifique se os cookies estão sendo bloqueados (pode ser necessário ajustar SameSite)

### Sessão expira muito rápido

- Por padrão, a sessão expira em 8 horas
- Isso pode ser ajustado em `api/saml/callback.js` (linha com `Max-Age`)

## 📚 Recursos

- [OCI Identity Providers Documentation](https://docs.oracle.com/en-us/iaas/Content/Identity/Tasks/managingidps.htm)
- [SAML 2.0 Specification](https://docs.oasis-open.org/security/saml/v2.0/)
- [saml2-js Library](https://github.com/Clever/saml2)

## 🔄 Migração da Validação de Email para SAML

Esta branch implementa autenticação SAML SSO substituindo a validação de email anterior. As principais mudanças:

1. **Autenticação**: Agora usa SAML SSO ao invés de validação de email manual
2. **Sessões**: Usa cookies HTTP-only para manter sessões seguras
3. **Segurança**: Autenticação gerenciada pelo Identity Provider corporativo

Para voltar à validação de email, basta fazer checkout da branch `main`.
