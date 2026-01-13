# Configurar SAML Federation com OIDC no OCI Domain

## Problema

Você tem um Identity Provider SAML federado (CORP-IDCS) no OCI Domain, mas quando tenta fazer login OIDC, o sistema não está redirecionando para o provedor SAML para autenticação. O usuário nunca vê a tela de login do domínio corporativo.

## Solução

O OCI Domain precisa estar configurado para usar o Identity Provider SAML como parte do fluxo de autenticação OIDC. Isso é feito através das **Sign-On Policies** (Políticas de Sign-On).

## Passo a Passo

### 1. Verificar Identity Provider SAML

1. Acesse **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Security** > **Identity Providers**
3. Verifique se o Identity Provider **CORP-IDCS** está configurado e **ativo**
4. Anote o **OCID** do Identity Provider (você precisará dele)

### 2. Configurar Sign-On Policy

O OCI Domain usa **Sign-On Policies** para determinar como autenticar usuários. Você precisa criar ou modificar uma política para usar o Identity Provider SAML.

#### Opção A: Modificar Policy Existente

1. No OCI Console, vá para **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Security** > **Sign-On Policies**
3. Clique na política existente (geralmente há uma padrão)
4. Verifique se há uma regra que usa o Identity Provider SAML
5. Se não houver, você precisará criar uma nova regra

#### Opção B: Criar Nova Sign-On Policy

1. No OCI Console, vá para **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Security** > **Sign-On Policies**
3. Clique em **Create Sign-On Policy**
4. Configure:
   - **Name:** `SAML Federation Policy` (ou nome de sua escolha)
   - **Description:** Política para usar Identity Provider SAML federado
   - **Status:** **Active**

### 3. Criar Regra de Autenticação

Dentro da Sign-On Policy, você precisa criar uma **Authentication Rule**:

1. Na Sign-On Policy, vá para a seção **Authentication Rules**
2. Clique em **Add Rule** ou **Create Rule**
3. Configure a regra:

   **Rule Name:** `SAML Federation Rule`
   
   **Condition:**
   - Selecione **"All Users"** ou crie uma condição específica
   - Exemplo: `User.UserType == "Federated"` (se aplicável)
   
   **Authentication Methods:**
   - ✅ **Identity Provider:** Selecione seu Identity Provider SAML (CORP-IDCS)
   - ❌ Desmarque outras opções se não quiser permitir login direto no OCI Domain
   
   **Priority:** Defina uma prioridade (ex: 1 para alta prioridade)

4. Salve a regra

### 4. Associar Policy à Aplicação OIDC

Agora você precisa garantir que sua aplicação OIDC use essa Sign-On Policy:

1. Vá para **Identity & Security** > **Domains** > **[Seu Domain]** > **Applications**
2. Selecione sua aplicação OIDC (a que você criou com Client ID `99016db2a53c40a89ddf472380a84e63`)
3. Vá em **Configuration** ou **Settings**
4. Procure por **Sign-On Policy** ou **Authentication Policy**
5. Selecione a Sign-On Policy que você criou/modificou
6. Salve as alterações

### 5. Verificar Configuração do Identity Provider

Certifique-se de que o Identity Provider SAML está configurado corretamente:

1. Vá para **Security** > **Identity Providers** > **[CORP-IDCS]**
2. Verifique:
   - ✅ Status está **Active**
   - ✅ **SSO URL** está configurada corretamente
   - ✅ **Certificates** estão configurados
   - ✅ **Attribute Mapping** está configurado (especialmente para email)

### 6. Configurar Attribute Mapping

O Identity Provider SAML precisa enviar o email do usuário:

1. No Identity Provider SAML, vá em **Attribute Mapping**
2. Configure o mapeamento para enviar o email:
   - **User Attribute:** `Email` ou `mail`
   - **SAML Attribute:** `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`
   - Ou use o atributo que seu IdP corporativo envia

### 7. Testar o Fluxo

Após configurar:

1. Limpe os cookies do navegador
2. Acesse `https://notes.dailybits.tech`
3. Clique em "Entrar com SSO Corporativo"
4. **Você deve ser redirecionado para:**
   - OCI Domain primeiro
   - Depois para o Identity Provider SAML (CORP-IDCS)
   - Depois para o IdP corporativo (onde você faz login)
   - De volta para o OCI Domain com o código OIDC
   - Finalmente para sua aplicação autenticado

## Configuração Alternativa: Usar "Custom Sign-In URL"

Se a configuração de Sign-On Policy não funcionar, você pode tentar usar uma **Custom Sign-In URL** que força o uso do Identity Provider SAML:

1. No OCI Console, vá para sua aplicação OIDC
2. Vá em **General Settings**
3. Configure **Custom Sign-In URL** como:
   ```
   https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/ui/v1/signin?redirect_uri=https://notes.dailybits.tech/api/auth/callback&idp=OCID_DO_IDENTITY_PROVIDER
   ```
   (Substitua `OCID_DO_IDENTITY_PROVIDER` pelo OCID do seu Identity Provider SAML)

**Nota:** Esta abordagem pode não funcionar perfeitamente com OIDC, então prefira usar Sign-On Policies.

## Verificar Logs

Se ainda não funcionar:

1. No OCI Console, vá para **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Audit** > **Sign-On Events**
3. Veja os eventos de login para entender o que está acontecendo
4. Procure por erros ou redirecionamentos inesperados

## Configuração Recomendada Final

### Sign-On Policy:
- **Name:** `SAML Federation Policy`
- **Status:** Active
- **Authentication Rule:**
  - **Condition:** All Users (ou condição específica)
  - **Method:** Identity Provider (CORP-IDCS)
  - **Priority:** 1

### Application OIDC:
- **Sign-On Policy:** `SAML Federation Policy` (ou a que você criou)
- **Redirect URI:** `https://notes.dailybits.tech/api/auth/callback`
- **Custom Sign-In URL:** (deixe vazio ou configure conforme acima)

### Identity Provider SAML:
- **Status:** Active
- **SSO URL:** Configurada corretamente
- **Attribute Mapping:** Email mapeado corretamente

## Troubleshooting

### Problema: Ainda não redireciona para SAML

1. Verifique se a Sign-On Policy está **ativa**
2. Verifique se a aplicação está usando a Sign-On Policy correta
3. Verifique se o Identity Provider SAML está **ativo**
4. Verifique os logs de **Sign-On Events** no OCI Console

### Problema: Redireciona mas não volta com code

1. Verifique se o **Redirect URI** está correto na aplicação OIDC
2. Verifique se o **Custom Social Linking Callback URL** está configurado
3. Verifique os logs do Vercel para ver o que está sendo recebido

### Problema: Erro de autenticação no IdP corporativo

1. Verifique se o Identity Provider SAML está configurado corretamente
2. Verifique se os certificados estão corretos
3. Verifique se o SSO URL está correto

## Referências

- [OCI Identity Domains Documentation](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/overview.htm)
- [Sign-On Policies](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/managing-signon-policies.htm)
- [SAML Federation](https://docs.oracle.com/en-us/iaas/Content/Identity/domains/federating-with-saml.htm)
