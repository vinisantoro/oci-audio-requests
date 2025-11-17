# Oracle Audio Requests

Aplicação web para validação de colaboradores Oracle e envio de áudios para um bucket no Oracle Cloud Infrastructure (OCI).

**🔒 Segurança:** A lista de emails permitidos e a URL do bucket OCI agora estão protegidas no backend (Serverless Functions), não sendo mais expostas no código do frontend.

## 🚀 Deploy na Vercel (Plano Gratuito)

**⚠️ IMPORTANTE:** Configure a variável de ambiente na Vercel ANTES de fazer o deploy!

### Passo 1: Configurar Variável de Ambiente (OBRIGATÓRIO)

**Faça isso PRIMEIRO, antes do push/commit:**

1. Acesse o painel da Vercel: [vercel.com](https://vercel.com)
2. Selecione seu projeto (ou crie um novo conectando ao repositório GitHub)
3. Vá em **Settings** > **Environment Variables**
4. Clique em **Add New** e preencha:
   - **Key:** `OCI_UPLOAD_URL`
   - **Value:** Seu endpoint completo do Pre-Authenticated Request (PAR) do OCI
     - Exemplo: `https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/`
   - ✅ Marque todos: **Production**, **Preview**, **Development**
5. Clique em **Save**

### Passo 2: Configurar Build Settings

1. No painel do projeto, vá em **Settings** > **General**
2. Verifique/Configure:
   - **Framework Preset:** `Other`
   - **Build Command:** (deixe vazio - **não precisa mais do script inject-config.js**)
   - **Output Directory:** `.`
   - **Install Command:** (deixe vazio)

**Nota:** Anteriormente era necessário usar o script `inject-config.js` para gerar o `config.js`, mas isso não é mais necessário. A configuração agora é feita apenas via variável de ambiente `OCI_UPLOAD_URL`.

### Passo 3: Fazer Deploy (Push/Commit)

1. Faça commit e push das alterações para o GitHub:

   ```bash
   git add .
   git commit -m "Implementar segurança com Serverless Functions"
   git push origin main
   ```

2. A Vercel detectará automaticamente e fará o deploy
3. As Serverless Functions serão criadas automaticamente na pasta `/api`
4. Aguarde o deploy completar (1-2 minutos)

### ✅ Verificação

Após o deploy, teste:

- Acesse sua URL da Vercel
- Tente validar um email da lista permitida
- Grave e envie um áudio de teste

## 📁 Estrutura do Projeto

```
/
├── api/                          # Serverless Functions (Backend)
│   ├── validate-email.js        # API de validação (lista embarcada no código)
│   ├── upload.js                # API de upload (lista embarcada no código)
│   └── upload.config.js         # Configuração da função de upload
├── app.js                        # Frontend (sem dados sensíveis)
├── index.html                    # Interface HTML
├── styles.css                    # Estilos
└── vercel.json                   # Configuração da Vercel
```

**Nota:**

- A lista de emails está embarcada diretamente nos arquivos `validate-email.js` e `upload.js`. Isso garante que não seja acessível como arquivo estático, mesmo em desenvolvimento local.
- **Não é mais necessário** o arquivo `config.js` nem o script `inject-config.js`. A configuração do OCI é feita apenas via variável de ambiente na Vercel.

## 🔐 Segurança Implementada

### Antes (❌ Inseguro)

- Lista de emails exposta no `app.js` (visível no navegador)
- URL do bucket OCI exposta no `config.js` (visível no navegador)
- Script `inject-config.js` gerava o `config.js` durante o build

**Arquivos removidos:** `config.js` e `scripts/inject-config.js` não são mais necessários.

### Agora (✅ Seguro)

- ✅ Lista de emails embarcada diretamente nas Serverless Functions (não acessível como arquivo estático)
- ✅ URL do bucket OCI protegida em variável de ambiente `OCI_UPLOAD_URL` (não exposta)
- ✅ Validação de email feita no backend
- ✅ Upload passa por proxy no backend
- ✅ **Não precisa mais de `config.js`** - configuração apenas via variável de ambiente
- ✅ **Não precisa mais de `inject-config.js`** - sem Build Command necessário

## 📝 Gerenciar Lista de Emails

Para adicionar ou remover emails autorizados:

1. Edite os arquivos `/api/validate-email.js` e `/api/upload.js`
2. Adicione ou remova emails do array `allowedEmails` em ambos os arquivos
3. Faça commit e push
4. A Vercel fará deploy automático

**Importante:**

- A lista está embarcada no código das Serverless Functions, não como arquivo separado
- Isso garante que não seja acessível como arquivo estático
- Você precisa atualizar a lista nos dois arquivos (`validate-email.js` e `upload.js`)

## 🛠️ Desenvolvimento Local

### Opção 1: Usando Vercel CLI (Recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer login
vercel login

# Configurar variáveis de ambiente localmente
vercel env pull .env.local

# Rodar localmente
vercel dev
```

### Opção 2: Simular APIs Localmente

Para testar sem a Vercel, você pode usar um servidor local simples:

```bash
# Instalar dependências (se necessário)
npm install

# Usar um servidor estático simples
npx serve .
```

**Nota:** As APIs serverless só funcionam completamente quando deployadas na Vercel ou usando `vercel dev`.

## 📊 Limites do Plano Gratuito da Vercel

- ✅ **100 GB de bandwidth** por mês
- ✅ **100 horas de execução** de funções por mês
- ✅ **Sem limite de invocações** (removido recentemente)
- ✅ **Timeout de 10 segundos** por função

**Estimativa de uso:** Para uso moderado (dezenas de uploads por dia), você ficará bem dentro do plano gratuito.

## 🔄 Fluxo da Aplicação

1. **Validação de Email:**

   - Usuário digita email no frontend
   - Frontend chama `/api/validate-email` (POST)
   - Backend verifica contra lista protegida
   - Retorna `valid: true/false` sem expor a lista

2. **Gravação de Áudio:**

   - Usuário grava áudio no navegador (MediaRecorder API)
   - Áudio fica disponível para pré-escuta

3. **Upload:**
   - Frontend envia blob para `/api/upload` (POST)
   - Backend valida email novamente
   - Backend faz upload para OCI usando `OCI_UPLOAD_URL` (variável de ambiente)
   - Retorna sucesso/erro

## 🐛 Troubleshooting

### Erro: "Email não autorizado"

- Verifique se o email está na lista em `/api/validate-email.js` e `/api/upload.js`
- Certifique-se de que o email está em minúsculas na lista
- Lembre-se de atualizar a lista nos DOIS arquivos

### Erro: "Configuração do servidor incompleta"

- Verifique se a variável `OCI_UPLOAD_URL` está configurada na Vercel
- Certifique-se de que a variável está disponível para todos os ambientes

### Erro: "Falha no upload"

- Verifique se o PAR do OCI está ativo e tem permissão de escrita
- Verifique os logs da Vercel em **Deployments** > **Functions** > **View Function Logs**

### APIs não funcionam localmente

- Use `vercel dev` para rodar as Serverless Functions localmente
- Ou faça deploy na Vercel para testar completamente

## 📚 Recursos

- [Documentação da Vercel](https://vercel.com/docs)
- [Serverless Functions da Vercel](https://vercel.com/docs/functions)
- [Oracle Cloud Infrastructure - Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm)
