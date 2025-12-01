# Oracle Audio Requests

Aplicação web para validação de colaboradores Oracle e envio de áudios para um bucket no Oracle Cloud Infrastructure (OCI).

**🔒 Segurança:** A lista de emails permitidos e a URL do bucket OCI estão protegidas no backend (Serverless Functions), não sendo mais expostas no código do frontend.

**📱 PWA:** Aplicação pode ser instalada na tela inicial do celular, funcionando como um app nativo (Android e iOS).

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
├── lib/                          # Bibliotecas do backend
│   └── allowed-emails.js        # Lista de emails (não servida como estático)
├── app.js                        # Frontend (sem dados sensíveis)
├── pwa.js                        # Código PWA (instalação e service worker)
├── sw.js                         # Service Worker (cache e offline)
├── manifest.json                 # Manifest PWA (configuração do app)
├── icon-192.png                  # Ícone PWA 192x192
├── icon-512.png                  # Ícone PWA 512x512
├── icon-oracle.svg               # SVG fonte dos ícones
├── index.html                    # Interface HTML
├── styles.css                    # Estilos
└── vercel.json                   # Configuração da Vercel
```

**Nota:**

- A lista de emails está embarcada diretamente nos arquivos `validate-email.js` e `upload.js`. Isso garante que não seja acessível como arquivo estático, mesmo em desenvolvimento local.
- **Não é mais necessário** o arquivo `config.js` nem o script `inject-config.js`. A configuração do OCI é feita apenas via variável de ambiente na Vercel.
- **PWA:** Os ícones já estão incluídos no projeto. A aplicação pode ser instalada na tela inicial.

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

1. Edite os arquivos `/api/validate-email.js` e `/api/get-upload-url.js`
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

A aplicação estará disponível em `http://localhost:3000`

### Opção 2: Simular APIs Localmente

Para testar sem a Vercel, você pode usar um servidor local simples:

```bash
# Usar um servidor estático simples
npx serve .
```

**Nota:** As APIs serverless só funcionam completamente quando deployadas na Vercel ou usando `vercel dev`.

## 📱 PWA (Progressive Web App)

A aplicação pode ser instalada na tela inicial do celular (Android e iOS), funcionando como um aplicativo nativo.

### Funcionalidades PWA

- ✅ Instalação na tela inicial
- ✅ Funciona offline (após primeira visita)
- ✅ Abre em tela cheia (sem barra do navegador)
- ✅ Ícone personalizado na tela inicial
- ✅ Prompt de instalação customizado

### Como Testar no Telefone

#### Android (Chrome/Edge)

1. Abra o **Chrome** ou **Edge** no celular
2. Acesse: `http://myrequest.dailybits.tech/` (ou sua URL da Vercel)
3. Aguarde alguns segundos - um banner aparecerá na parte inferior:
   ```
   Instale este app na sua tela inicial para acesso rápido!
   [Instalar] [Agora não]
   ```
4. Toque em **"Instalar"**
5. Confirme quando o sistema perguntar
6. O ícone aparecerá na tela inicial

**Se o prompt não aparecer:**
- Toque nos **3 pontos** (menu) → **"Instalar app"** ou **"Adicionar à tela inicial"**

#### iOS (iPhone/iPad) - Apenas Safari

**⚠️ IMPORTANTE:** No iOS, PWA só funciona no Safari. Chrome/Firefox/Edge não suportam.

1. Abra o **Safari** (não funciona no Chrome/Firefox no iOS)
2. Acesse: `http://myrequest.dailybits.tech/` (ou sua URL da Vercel)
3. Toque no **botão de compartilhar** (quadrado com seta para cima)
4. Role para baixo e toque em **"Adicionar à Tela de Início"**
5. Confirme
6. O ícone aparecerá na tela inicial

### Ícones PWA

Os ícones já estão incluídos no projeto:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)
- `icon-oracle.svg` (fonte SVG)

Se precisar regenerar os ícones, use o arquivo `icon-oracle.svg` como base e converta para PNG nos tamanhos necessários.

### Personalização PWA

Para alterar cores do tema, edite `manifest.json`:

```json
{
  "theme_color": "#c74634",      // Cor da barra de status
  "background_color": "#f4f2f0"   // Cor de fundo ao abrir
}
```

Para alterar o nome do app, edite `manifest.json`:

```json
{
  "name": "Oracle Audio Requests",  // Nome completo
  "short_name": "Audio Requests"   // Nome curto (tela inicial)
}
```

## 📊 Limites do Plano Gratuito da Vercel

- ✅ **100 GB de bandwidth** por mês
- ✅ **100 horas de execução** de funções por mês
- ✅ **Sem limite de invocações** (removido recentemente)
- ✅ **Timeout de 10 segundos** por função

**Estimativa de uso:** Para uso moderado (dezenas de uploads por dia), você ficará bem dentro do plano gratuito.

**Nota sobre uploads grandes:** A aplicação usa upload direto para OCI (sem passar pelo servidor Vercel), permitindo uploads de qualquer tamanho sem problemas de timeout. Apenas a validação de email passa pelo servidor, que é uma operação rápida.

## 🔄 Fluxo da Aplicação

1. **Validação de Email:**
   - Usuário digita email no frontend
   - Frontend chama `/api/validate-email` (POST)
   - Backend verifica contra lista protegida
   - Retorna `valid: true/false` sem expor a lista
   - Toast de erro aparece se email inválido

2. **Gravação de Áudio:**
   - Usuário grava áudio no navegador (MediaRecorder API)
   - Áudio fica disponível para pré-escuta

3. **Upload:**
   - Frontend chama `/api/get-upload-url` (POST) com o email
   - Backend valida email e retorna URL do PAR para upload
   - Frontend faz upload **direto** para OCI usando a URL do PAR (PUT)
   - O upload não passa pelo servidor Vercel, evitando timeout para arquivos grandes
   - Toast de sucesso/erro aparece conforme resultado

## 🐛 Troubleshooting

### Erro: "Email não autorizado"

- Verifique se o email está na lista em `/api/validate-email.js` e `/api/get-upload-url.js`
- Certifique-se de que o email está em minúsculas na lista
- Lembre-se de atualizar a lista nos DOIS arquivos

### Erro: "Configuração do servidor incompleta"

- Verifique se a variável `OCI_UPLOAD_URL` está configurada na Vercel
- Certifique-se de que a variável está disponível para todos os ambientes

### Erro: "Falha no upload"

- Verifique se o PAR do OCI está ativo e tem permissão de escrita
- Verifique os logs da Vercel em **Deployments** > **Functions** > **View Function Logs**
- O upload é feito diretamente do navegador para OCI, então verifique também o console do navegador para erros de CORS ou rede

### APIs não funcionam localmente

- Use `vercel dev` para rodar as Serverless Functions localmente
- Ou faça deploy na Vercel para testar completamente

### PWA não funciona no iOS

- **Use apenas o Safari** - Chrome/Firefox/Edge no iOS não suportam PWA
- Verifique se está acessando via HTTPS (obrigatório para PWA)
- Limpe o cache do Safari se necessário

### Prompt de instalação não aparece

- Verifique se está em HTTPS (obrigatório)
- Verifique o console do navegador para erros
- Alguns navegadores só mostram após várias visitas
- No Android, use o menu do navegador (3 pontos → Instalar app)

### Ícones não aparecem

- Verifique se os arquivos `icon-192.png` e `icon-512.png` estão na raiz do projeto
- Verifique se os caminhos no `manifest.json` estão corretos
- Limpe o cache do navegador

## 📚 Recursos

- [Documentação da Vercel](https://vercel.com/docs)
- [Serverless Functions da Vercel](https://vercel.com/docs/functions)
- [Oracle Cloud Infrastructure - Object Storage](https://docs.oracle.com/en-us/iaas/Content/Object/Concepts/objectstorageoverview.htm)
- [Progressive Web Apps - MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [PWA Builder](https://www.pwabuilder.com/)
