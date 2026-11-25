import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pluginRoot = path.resolve(__dirname, '..');

const jsResult = await esbuild.build({
  entryPoints: [path.join(__dirname, 'app.js')],
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['es2020'],
  write: false,
});

const bundledJs = jsResult.outputFiles[0].text;
const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Context Brain</title>
  <style>${css}</style>
</head>
<body>
  <div id="root"></div>
  <script>${bundledJs.replace(/<\/script>/gi, '<\\/script>')}</script>
</body>
</html>
`;

const outPath = path.join(pluginRoot, 'server', 'app.html');
fs.writeFileSync(outPath, html, 'utf8');
console.log(`Built ${outPath} (${(Buffer.byteLength(html, 'utf8') / 1024).toFixed(1)} KiB)`);
