const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 3000;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function resolve(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const file = path.normalize(path.join(ROOT, pathname.endsWith('/') ? `${pathname}index.html` : pathname));
  return file.startsWith(ROOT) ? file : null;
}

const server = http.createServer((request, response) => {
  let file;
  try {
    file = resolve(request.url);
  } catch {
    file = null;
  }
  if (!file) {
    response.writeHead(400).end('Ruta no válida');
    return;
  }
  fs.readFile(file, (error, content) => {
    if (error) {
      response.writeHead(error.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(error.code === 'ENOENT' ? `No existe: ${request.url}` : 'Error al leer el archivo');
      return;
    }
    response.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(content);
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`Tienda lista en http://localhost:${PORT}`);
    console.log('Pulsa Ctrl + C para detenerla.');
  });
}

module.exports = { server, resolve };
