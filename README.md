# Oracle Audio Requests

Aplicação web estática (HTML + CSS + JS puro) para validação de colaboradores Oracle e envio de áudios via POST para um bucket com requisição pre-assinada no Oracle Cloud Infrastructure (OCI).

## Como configurar o `OCI_UPLOAD_URL`

1. Copie o arquivo de exemplo:
   ```bash
   cp config.example.js config.js
   ```
2. Abra `config.js` e substitua o valor por seu endpoint de requisição autenticada (PAR) de **POST** do Object Storage.
3. Mantenha `config.js` fora do versionamento (já está listado no `.gitignore`).
4. O valor deve ser o **endpoint completo** do Pre-Authenticated Request (PAR) configurado com permissão _Object Write_ para o bucket desejado, finalizando em `/o/`. O aplicativo anexa o nome do arquivo diretamente ao caminho (ex.: `.../b/audio/o/oci-audio-request-123.webm`), portanto basta informar o link base do PAR até `/o/`. O upload é feito com método **PUT**, seguindo o mesmo padrão de um `curl --data-binary` direto para o PAR.

### Variável de ambiente (para Vercel ou pipelines)

1. Defina `OCI_UPLOAD_URL` no ambiente (ex.: painel da Vercel > Settings > Environment Variables).
2. Ajuste o **Build Command** para `node scripts/inject-config.js` e deixe o **Output Directory** como `.`.
3. O script `scripts/inject-config.js` irá gerar `config.js` durante o build com base no valor da variável.

## Desenvolvimento local

```bash
cp config.example.js config.js   # edite com seu endpoint real
# Sirva os arquivos estáticos (exemplo com npx serve)
npx serve .
```

Abra `http://localhost:3000` (ou a porta exibida) e valide um email `@oracle.com` para liberar a gravação e upload.

## Lista de colaboradores autorizados

A tela de login verifica o endereço informado contra uma lista fixa de e-mails em `app.js`. Se precisar permitir novos colaboradores, basta adicionar o email (em minúsculo) ao array `allowedEmails` e fazer um novo deploy.

## Fluxo da Aplicação

- Validação do email corporativo (@oracle.com).
- Conferência contra lista de colaboradores autorizados (whitelist em `app.js`).
- Habilitação dinâmica do gravador apenas após validação.
- Pré-escuta do áudio gravado diretamente no navegador.
- Captura de áudio via API de MediaRecorder.
- Envio exclusivo via POST para o bucket OCI informado, sem operações de GET/List.
- Nome do arquivo final segue o padrão `email-timestamp.webm`, garantindo rastreabilidade de quem enviou.

## Deploy na Vercel

- Framework preset: `Other` (Static HTML).
- Install Command: deixar em branco.
- Build Command: `node scripts/inject-config.js` (gera `config.js`).
- Output Directory: `.`

Cada push na branch principal dispara um novo deploy estático com o endpoint protegido via variável de ambiente.
