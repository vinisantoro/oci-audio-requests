const fs = require('fs');
const path = require('path');

const { OCI_UPLOAD_URL } = process.env;

if (!OCI_UPLOAD_URL) {
  console.error('Missing OCI_UPLOAD_URL environment variable.');
  process.exit(1);
}

const outputPath = path.join(__dirname, '..', 'config.js');
const sanitized = OCI_UPLOAD_URL.replace(/'/g, "\\'");
const contents = `window.__OCI_CONFIG = {\n  OCI_UPLOAD_URL: '${sanitized}',\n};\n`;

fs.writeFileSync(outputPath, contents);
console.log('config.js generated successfully.');
