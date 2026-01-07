# Changelog - Implementação SAML SSO

## Resumo das Mudanças

Esta branch implementa autenticação SAML SSO usando **OCI Identity Providers como broker/intermediário**, substituindo a validação manual de email.

## 🔄 Arquitetura

A aplicação usa o **OCI Identity Provider como intermediário** entre a aplicação e o Identity Provider SAML corporativo:

```
Aplicação → OCI Identity Provider → IdP SAML Corporativo
           (Broker/Intermediário)
```

**Por que usar OCI como broker?**

- Você não precisa de acesso direto ao IdP SAML corporativo
- O OCI Identity Provider já está configurado e federado com seu IdP corporativo
- A aplicação se conecta apenas ao OCI Identity Provider
- O OCI gerencia a comunicação com o IdP corporativo

## Arquivos Criados

### Novos Arquivos

1. **`package.json`**

   - Adiciona dependências: `saml2-js`, `cookie-parser`, `express-session`
   - Configuração para Node.js 18+

2. **`lib/saml-config.js`**

   - Configuração do Service Provider (SP) e Identity Provider (IdP)
   - Lê configurações de variáveis de ambiente
   - Cria instâncias SAML2

3. **`api/saml/login.js`**

   - Endpoint para iniciar fluxo SSO
   - Redireciona usuário para Identity Provider
   - Gera AuthnRequest SAML

4. **`api/saml/callback.js`**

   - Processa resposta SAML do Identity Provider
   - Valida asserção SAML
   - Extrai informações do usuário (email, nome)
   - Cria sessão via cookie HTTP-only

5. **`api/saml/logout.js`**

   - Endpoint para logout
   - Limpa cookies de sessão
   - Suporta Single Logout (SLO) se configurado

6. **`api/auth/status.js`**

   - Verifica status de autenticação
   - Retorna informações do usuário autenticado
   - Usado pelo frontend para verificar sessão

7. **`SAML_CONFIG.env.example`**

   - Arquivo de exemplo com todas as variáveis de ambiente necessárias
   - Documentação inline de cada variável

8. **`README_SAML.md`**
   - Documentação completa da configuração SAML
   - Guia de troubleshooting
   - Instruções passo a passo

## Arquivos Modificados

### `app.js`

- **Removido**: Lógica de validação de email manual
- **Adicionado**:
  - Verificação de status de autenticação via `/api/auth/status`
  - Redirecionamento para SSO quando não autenticado
  - Gerenciamento de sessão baseado em cookies
  - Handler de logout
- **Modificado**:
  - `uploadAudio()` agora usa sessão SAML ao invés de email
  - Inicialização verifica autenticação antes de mostrar interface

### `index.html`

- **Modificado**:
  - Formulário de email substituído por botão de login SSO (dinâmico)
  - Adicionado botão de logout na seção de resumo
  - Textos atualizados para refletir autenticação SSO

### `api/get-upload-url.js`

- **Modificado**:
  - Agora extrai email da sessão SAML (cookie) ao invés de receber no body
  - Mantém validação opcional contra `ALLOWED_EMAILS` para camada extra de segurança
  - Retorna erro 401 se não autenticado

## Arquivos Não Modificados (Mantidos)

- `api/validate-email.js` - Mantido para compatibilidade, mas não é mais usado pelo frontend
- `styles.css` - Sem mudanças
- `pwa.js` - Sem mudanças
- `sw.js` - Sem mudanças
- `manifest.json` - Sem mudanças
- Outros arquivos estáticos

## Variáveis de Ambiente Necessárias

### Obrigatórias (Escolha uma opção)

**Opção A: Usando Metadata URL (Recomendado)**

- `OCI_IDP_METADATA_URL` - Metadata URL do OCI Identity Provider
  - Exemplo: `https://identity.oraclecloud.com/v1/identity/saml/metadata/<idp-ocid>`
  - Ou use `SAML_IDP_METADATA_URL` para compatibilidade

**Opção B: Configuração Manual**

- `OCI_IDP_SSO_URL` - URL de SSO do OCI Identity Provider
  - Exemplo: `https://identity.oraclecloud.com/v1/identity/saml/sso/<idp-ocid>`
  - Ou use `SAML_IDP_SSO_URL` para compatibilidade
- `OCI_IDP_CERTIFICATES` - Certificado(s) do OCI Identity Provider
  - Ou use `SAML_IDP_CERTIFICATES` para compatibilidade

**Sempre necessário:**

- `OCI_UPLOAD_URL` - URL do bucket OCI (mantida da versão anterior)

### Opcionais

- `OCI_IDP_SLO_URL` - URL de logout do OCI Identity Provider
- `SAML_SP_ENTITY_ID` - Entity ID do Service Provider
- `SAML_ACS_URL` - URL de callback
- `SAML_SLO_URL` - URL de logout do SP
- `ALLOWED_EMAILS` - Lista de emails permitidos (camada extra de segurança)

**Importante:** Use as configurações do **OCI Identity Provider**, não do IdP corporativo diretamente.

## Fluxo de Autenticação

1. Usuário acessa aplicação
2. Frontend verifica status de autenticação via `/api/auth/status`
3. Se não autenticado, mostra botão "Entrar com SSO Corporativo"
4. Ao clicar, redireciona para `/api/saml/login`
5. Backend gera AuthnRequest SAML e redireciona para Identity Provider
6. Usuário faz login no IdP
7. IdP redireciona para `/api/saml/callback` com SAML Response
8. Backend valida resposta, extrai email/nome, cria sessão
9. Usuário é redirecionado de volta para aplicação
10. Frontend detecta autenticação e mostra interface de gravação

## Segurança

- ✅ Cookies HTTP-only (não acessíveis via JavaScript)
- ✅ Cookies Secure em produção (HTTPS)
- ✅ Sessões expiram após 8 horas
- ✅ Validação de asserções SAML
- ✅ Validação opcional contra lista de emails permitidos
- ✅ Sem dados sensíveis no frontend

## Compatibilidade

- ✅ Funciona com Vercel Serverless Functions
- ✅ Suporta desenvolvimento local (cookies ajustados automaticamente)
- ✅ Compatível com qualquer Identity Provider SAML 2.0
- ✅ Mantém funcionalidade PWA existente

## Próximos Passos

1. **Obter configurações do OCI Identity Provider:**

   - Acesse OCI Console > Identity & Security > Identity > Identity Providers
   - Selecione seu Identity Provider (já federado com IdP corporativo)
   - Obtenha Metadata URL ou SSO URL + Certificados

2. **Configurar variáveis de ambiente na Vercel:**

   - Configure `OCI_IDP_METADATA_URL` (recomendado) ou `OCI_IDP_SSO_URL` + `OCI_IDP_CERTIFICATES`
   - Mantenha `OCI_UPLOAD_URL` configurada

3. **Registrar aplicação no OCI Identity Provider:**

   - No OCI Console, registre sua aplicação como Service Provider
   - Use Metadata URL: `https://sua-app.vercel.app/api/saml/metadata`
   - Ou configure manualmente: ACS URL = `/api/saml/callback`, Entity ID = `/api/saml/metadata`

4. **Testar fluxo completo:**

   - Aplicação → OCI Identity Provider → IdP Corporativo → OCI Identity Provider → Aplicação
   - Verificar se emails estão sendo extraídos corretamente do SAML assertion
   - Ajustar atributos SAML no OCI Identity Provider se necessário (não no IdP corporativo)

5. **Fazer merge para produção após testes bem-sucedidos**

## Rollback

Para voltar à validação de email:

```bash
git checkout main
```

A branch `main` mantém a implementação original com validação de email.
