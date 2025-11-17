# 🚀 Guia Rápido de Configuração - Vercel

## ⚠️ ATENÇÃO: Configure ANTES de fazer push!

Você precisa configurar a variável de ambiente na Vercel **ANTES** de fazer o deploy. Se fizer o push primeiro, o deploy vai falhar porque a API de upload precisa da variável `OCI_UPLOAD_URL`.

## Passo a Passo

### 1️⃣ Configurar Variável de Ambiente (FAÇA ISSO PRIMEIRO!)

1. Acesse: https://vercel.com
2. Selecione seu projeto (ou crie um novo conectando ao GitHub)
3. Vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Preencha:
   - **Key:** `OCI_UPLOAD_URL`
   - **Value:** `https://objectstorage.sa-saopaulo-1.oraclecloud.com/p/<par-id>/n/<namespace>/b/<bucket>/o/`
     - ⚠️ Substitua pelos valores reais do seu PAR do OCI
   - ✅ Marque: **Production**, **Preview**, **Development**
6. Clique em **Save**

### 2️⃣ Configurar Build Settings (Verificar)

1. No mesmo projeto, vá em **Settings** → **General**
2. Verifique:
   - **Framework Preset:** `Other`
   - **Build Command:** (vazio)
   - **Output Directory:** `.`
   - **Install Command:** (vazio)

### 3️⃣ Fazer Deploy (Agora sim, push/commit)

```bash
git add .
git commit -m "Implementar segurança com Serverless Functions"
git push origin main
```

A Vercel detectará automaticamente e fará o deploy.

### 4️⃣ Testar

1. Aguarde o deploy completar (1-2 minutos)
2. Acesse a URL do seu projeto na Vercel
3. Teste validar um email da lista permitida
4. Grave e envie um áudio de teste

## ✅ Checklist

- [ ] Variável `OCI_UPLOAD_URL` configurada na Vercel (ANTES do push)
- [ ] Build settings verificados (Framework: Other)
- [ ] Código commitado e pushado
- [ ] Deploy concluído com sucesso
- [ ] Teste de validação de email funcionando
- [ ] Teste de upload de áudio funcionando

## 🐛 Problemas Comuns

**Erro: "Configuração do servidor incompleta"**
→ Você esqueceu de configurar a variável `OCI_UPLOAD_URL` na Vercel. Configure agora e faça um novo deploy.

**Erro: "Email não autorizado"**
→ Verifique se o email está em `/api/allowed-emails.js`

**APIs não funcionam**
→ Certifique-se de que o deploy foi feito na Vercel (não funciona apenas com servidor estático local)

## 📝 Sobre o config.js

O arquivo `config.js` **NÃO é mais necessário** e foi removido. A URL do bucket agora está protegida na variável de ambiente da Vercel, não sendo mais exposta no frontend.

## 📞 Suporte

Consulte o `README.md` para mais detalhes e troubleshooting.
