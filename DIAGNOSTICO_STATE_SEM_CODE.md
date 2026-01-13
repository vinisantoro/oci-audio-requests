# Diagnóstico: State recebido mas Code não recebido

## 🔴 Problema Atual

Você está recebendo:
```
Autenticação não completada. OCI Domain retornou state mas não retornou code.
```

Isso significa que:
- ✅ O OCI Domain reconheceu sua requisição (por isso enviou o `state`)
- ❌ Mas a autenticação não foi completada (por isso não enviou o `code`)

## 🔍 Checklist de Diagnóstico

Siga este checklist na ordem:

### 1. Verificar se o fluxo SAML está funcionando

**O que verificar:**
Quando você clica em "Entrar com SSO Corporativo", você deve ser redirecionado nesta ordem:

1. `https://notes.dailybits.tech` → 
2. `https://idcs-1beedd4f72ff4293a5339e0437f00ac0.identity.oraclecloud.com/oauth2/v1/authorize?...` →
3. **AQUI DEVE APARECER:** Tela de login do OCI Domain OU redirecionamento para CORP-IDCS →
4. **AQUI DEVE APARECER:** Tela de login do IdP corporativo (CORP-IDCS) →
5. Após login, redirecionamento de volta →
6. `https://notes.dailybits.tech/api/auth/callback?code=...&state=...`

**❓ Pergunta:** Você está vendo a tela de login do IdP corporativo (CORP-IDCS)?

- ✅ **SIM:** Continue para o passo 2
- ❌ **NÃO:** O problema é que o OCI Domain não está redirecionando para o SAML. Veja "Problema: Não redireciona para SAML" abaixo

### 2. Verificar se você completou TODO o processo

**O que verificar:**
- Você inseriu seu email corporativo?
- Você inseriu sua senha corporativa?
- Você clicou em "Login" ou "Entrar"?
- Você foi redirecionado de volta automaticamente?

**❓ Pergunta:** Você completou TODO o processo de login?

- ✅ **SIM:** Continue para o passo 3
- ❌ **NÃO:** Complete o login completamente e tente novamente

### 3. Verificar Sign-On Policy

**O que verificar:**

1. Acesse **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Security** > **Sign-On Policies** > **Default Sign-On Policy**
3. Verifique:

   **a) Aplicação está listada?**
   - Vá na seção **Applications** (ou "Assigned Applications")
   - Verifique se sua aplicação OIDC está listada
   - Se não estiver, adicione-a

   **b) Authentication Rule está configurada?**
   - Vá na seção **Authentication Rules**
   - Verifique se há uma regra que usa **Identity Provider: CORP-IDCS**
   - Verifique se a regra está **ativa**
   - Verifique a **prioridade** (deve ser alta, ex: 1)

**❓ Pergunta:** A aplicação está na Sign-On Policy E há uma regra usando Identity Provider SAML?

- ✅ **SIM:** Continue para o passo 4
- ❌ **NÃO:** Configure conforme necessário

### 4. Verificar Identity Provider SAML

**O que verificar:**

1. Acesse **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Security** > **Identity Providers** > **CORP-IDCS**
3. Verifique:

   - ✅ **Status:** Active
   - ✅ **SSO URL:** Configurada corretamente
   - ✅ **Certificates:** Configurados
   - ✅ **Attribute Mapping:** Email está mapeado

**❓ Pergunta:** O Identity Provider SAML está configurado corretamente?

- ✅ **SIM:** Continue para o passo 5
- ❌ **NÃO:** Corrija a configuração

### 5. Verificar Logs no OCI Console

**O que verificar:**

1. Acesse **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Audit** > **Sign-On Events**
3. Tente fazer login novamente
4. Veja os eventos mais recentes
5. Procure por:
   - Erros
   - Redirecionamentos inesperados
   - Falhas de autenticação

**❓ Pergunta:** Há erros nos logs?

- ✅ **NÃO:** Continue para o passo 6
- ❌ **SIM:** Anote os erros e veja "Problemas Comuns" abaixo

### 6. Verificar Permissões do Usuário

**O que verificar:**

1. Acesse **OCI Console** > **Identity & Security** > **Domains** > **[Seu Domain]**
2. Vá em **Applications** > **[Sua Aplicação OIDC]**
3. Vá em **Users** ou **Groups**
4. Verifique se seu usuário (ou grupo do usuário) tem acesso à aplicação

**❓ Pergunta:** O usuário tem permissão para acessar a aplicação?

- ✅ **SIM:** Continue para o passo 7
- ❌ **NÃO:** Adicione o usuário ou grupo à aplicação

### 7. Verificar Logs do Vercel

**O que verificar:**

1. Acesse **Vercel Dashboard** > Seu projeto > **Functions** > `api/auth/callback`
2. Veja os logs após tentar fazer login
3. Procure por:
   ```
   Callback received: { fullUrl: '...', query: {...} }
   Missing parameters - detailed info: { ... }
   ```

**❓ Pergunta:** O que os logs mostram?

- Veja a `fullUrl` para entender exatamente o que o OCI Domain está enviando
- Veja os `queryKeys` para ver quais parâmetros estão presentes

## 🐛 Problemas Comuns e Soluções

### Problema: Não redireciona para SAML

**Sintomas:**
- Você clica em "Entrar com SSO Corporativo"
- Você é redirecionado para o OCI Domain
- Mas você NÃO vê a tela de login do IdP corporativo (CORP-IDCS)
- Você vê apenas uma tela do OCI Domain ou é redirecionado de volta sem código

**Solução:**
1. Verifique se a aplicação está na Sign-On Policy (passo 3 acima)
2. Verifique se há uma Authentication Rule usando Identity Provider SAML
3. Verifique se a regra tem prioridade alta
4. Verifique se o Identity Provider SAML está ativo

### Problema: Redireciona para SAML mas não volta

**Sintomas:**
- Você vê a tela de login do IdP corporativo
- Você faz login com sucesso
- Mas você não é redirecionado de volta para a aplicação
- Ou você é redirecionado mas sem o código

**Solução:**
1. Verifique se o **Redirect URI** na aplicação OIDC está correto:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
2. Verifique se o **Custom Social Linking Callback URL** está configurado:
   ```
   https://notes.dailybits.tech/api/auth/callback
   ```
3. Verifique se há erros nos logs do OCI Console (Sign-On Events)

### Problema: Erro de autenticação no IdP corporativo

**Sintomas:**
- Você vê a tela de login do IdP corporativo
- Mas recebe um erro ao tentar fazer login

**Solução:**
1. Verifique se as credenciais estão corretas
2. Verifique se o usuário existe no IdP corporativo
3. Verifique se o Identity Provider SAML está configurado corretamente no OCI Domain
4. Verifique se os certificados estão corretos

### Problema: Usuário não tem permissão

**Sintomas:**
- Você completa o login com sucesso
- Mas recebe um erro de "não autorizado" ou "sem permissão"

**Solução:**
1. Verifique se o usuário está atribuído à aplicação OIDC
2. Verifique se o usuário está em um grupo que tem acesso à aplicação
3. Adicione o usuário ou grupo à aplicação se necessário

## 📋 Configuração Final Recomendada

### Sign-On Policy (Default Sign-On Policy):
- ✅ **Status:** Active
- ✅ **Applications:** Sua aplicação OIDC está listada
- ✅ **Authentication Rule:**
  - **Name:** `SAML Federation Rule`
  - **Condition:** All Users (ou condição específica)
  - **Method:** Identity Provider (CORP-IDCS)
  - **Priority:** 1 (alta prioridade)
  - **Status:** Active

### Application OIDC:
- ✅ **Redirect URI:** `https://notes.dailybits.tech/api/auth/callback`
- ✅ **Custom Social Linking Callback URL:** `https://notes.dailybits.tech/api/auth/callback`
- ✅ **Custom Sign-In URL:** (vazio ou não configurado)
- ✅ **Users/Groups:** Seu usuário ou grupo está atribuído

### Identity Provider SAML (CORP-IDCS):
- ✅ **Status:** Active
- ✅ **SSO URL:** Configurada corretamente
- ✅ **Certificates:** Configurados
- ✅ **Attribute Mapping:** Email mapeado corretamente

## 🧪 Teste Passo a Passo

1. **Limpe os cookies do navegador** (ou use modo anônimo)
2. **Abra o Console do Desenvolvedor** (F12) para ver erros
3. **Acesse:** `https://notes.dailybits.tech`
4. **Clique em:** "Entrar com SSO Corporativo"
5. **Observe a sequência de redirecionamentos:**
   - Deve ir para OCI Domain
   - Deve ir para IdP corporativo (CORP-IDCS)
   - Deve fazer login
   - Deve voltar para OCI Domain
   - Deve voltar para `https://notes.dailybits.tech/api/auth/callback?code=...&state=...`
6. **Se em algum ponto parar ou der erro:** Anote onde parou e veja a seção "Problemas Comuns" acima

## 📞 Próximos Passos

Após seguir este checklist:

1. **Se encontrou o problema:** Corrija conforme as instruções acima
2. **Se não encontrou o problema:** 
   - Capture screenshots da configuração do OCI Domain (sem mostrar secrets)
   - Capture os logs do Vercel
   - Capture os logs do OCI Console (Sign-On Events)
   - Compartilhe para análise mais detalhada

## 🔗 Referências

- [CONFIGURAR_SAML_FEDERATION_OIDC.md](CONFIGURAR_SAML_FEDERATION_OIDC.md) - Como configurar SAML Federation
- [TROUBLESHOOTING_STATE_SEM_CODE.md](TROUBLESHOOTING_STATE_SEM_CODE.md) - Troubleshooting detalhado
- [README_OIDC.md](README_OIDC.md) - Documentação completa OIDC
