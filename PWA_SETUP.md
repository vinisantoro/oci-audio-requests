# 📱 Configuração PWA (Progressive Web App)

Esta aplicação pode ser instalada na tela inicial do celular, funcionando como um aplicativo nativo.

## ✅ O que já está configurado

- ✅ `manifest.json` - Define como o app aparece quando instalado
- ✅ Service Worker (`sw.js`) - Permite funcionamento offline e cache
- ✅ Meta tags no HTML - Configuração para iOS e Android
- ✅ Prompt de instalação customizado
- ✅ Detecção automática de instalação

## 🎨 Gerar Ícones

Você precisa criar dois ícones PNG:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

### Opção 1: Usar ferramenta online (Recomendado)

1. Acesse: https://realfavicongenerator.net/ ou https://www.pwabuilder.com/imageGenerator
2. Faça upload de uma imagem quadrada (mínimo 512x512px)
3. Baixe os ícones gerados
4. Renomeie e coloque na raiz do projeto:
   - `icon-192.png`
   - `icon-512.png`

### Opção 2: Usar o template SVG

1. Use o arquivo `icon-template.svg` como base
2. Converta para PNG usando:
   - **Online:** https://cloudconvert.com/svg-to-png
   - **ImageMagick:** `convert -resize 192x192 icon-template.svg icon-192.png`
3. Gere ambos os tamanhos (192x192 e 512x512)

### Opção 3: Criar manualmente

Use qualquer editor de imagem (Photoshop, GIMP, Figma) para criar:

- Fundo: `#c74634` (vermelho Oracle)
- Logo Oracle em branco centralizado
- Bordas arredondadas (80px de raio para 512x512)

## 🚀 Como funciona

### Android

1. O usuário acessa o site
2. Aparece um prompt na parte inferior da tela: "Instale este app na sua tela inicial"
3. Usuário clica em "Instalar"
4. O app é adicionado à tela inicial
5. Funciona como um app nativo (abre em tela cheia, sem barra do navegador)

### iOS (Safari)

1. O usuário acessa o site no Safari
2. Clica no botão de compartilhar (quadrado com seta)
3. Seleciona "Adicionar à Tela de Início"
4. O app é adicionado à tela inicial
5. Funciona como um app nativo

## 🔧 Personalização

### Alterar cores do tema

Edite `manifest.json`:

```json
{
  "theme_color": "#c74634", // Cor da barra de status
  "background_color": "#f4f2f0" // Cor de fundo ao abrir
}
```

### Alterar nome do app

Edite `manifest.json`:

```json
{
  "name": "Oracle Audio Requests", // Nome completo
  "short_name": "Audio Requests" // Nome curto (tela inicial)
}
```

### Personalizar prompt de instalação

Edite `index.html` (linha ~179):

```html
<p>Instale este app na sua tela inicial para acesso rápido!</p>
```

## 📋 Checklist de Deploy

- [ ] Ícones `icon-192.png` e `icon-512.png` criados e na raiz
- [ ] `manifest.json` configurado
- [ ] `sw.js` funcionando (verificar console do navegador)
- [ ] Testar instalação no Android
- [ ] Testar instalação no iOS
- [ ] Verificar funcionamento offline (após primeira visita)

## 🐛 Troubleshooting

**Prompt não aparece:**

- Verifique se está acessando via HTTPS (obrigatório para PWA)
- Verifique o console do navegador para erros
- Alguns navegadores só mostram após várias visitas

**Ícones não aparecem:**

- Verifique se os arquivos estão na raiz do projeto
- Verifique se os caminhos no `manifest.json` estão corretos
- Limpe o cache do navegador

**Service Worker não funciona:**

- Verifique se está em HTTPS
- Verifique o console para erros
- Certifique-se de que `sw.js` está acessível em `/sw.js`

## 📚 Recursos

- [MDN - Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA](https://web.dev/progressive-web-apps/)
- [PWA Builder](https://www.pwabuilder.com/)
