// Script para gerar ícones PWA a partir de um SVG
// Requer: npm install sharp (ou usar uma ferramenta online)

const fs = require('fs');
const path = require('path');

// SVG do ícone Oracle (simplificado)
const iconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#c74634" rx="80"/>
  <path d="M256 150c-58.5 0-106 47.5-106 106s47.5 106 106 106 106-47.5 106-106-47.5-106-106-106zm0 180c-40.8 0-74-33.2-74-74s33.2-74 74-74 74 33.2 74 74-33.2 74-74 74z" fill="#ffffff"/>
  <circle cx="256" cy="256" r="40" fill="#ffffff"/>
</svg>`;

console.log('Para gerar os ícones PWA, você tem duas opções:');
console.log('');
console.log('OPÇÃO 1 - Usar ferramenta online:');
console.log('1. Acesse https://realfavicongenerator.net/ ou https://www.pwabuilder.com/imageGenerator');
console.log('2. Faça upload de um ícone 512x512px');
console.log('3. Baixe os ícones gerados');
console.log('4. Renomeie para icon-192.png e icon-512.png');
console.log('5. Coloque na raiz do projeto');
console.log('');
console.log('OPÇÃO 2 - Usar o SVG acima:');
console.log('1. Salve o SVG acima como icon.svg');
console.log('2. Use uma ferramenta como ImageMagick ou online converter');
console.log('3. Converta para PNG nos tamanhos 192x192 e 512x512');
console.log('');
console.log('Ícone SVG gerado e salvo como icon-template.svg');

// Salvar template SVG
fs.writeFileSync(path.join(__dirname, 'icon-template.svg'), iconSvg);
console.log('Template SVG salvo!');

