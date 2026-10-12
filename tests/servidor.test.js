const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { server, resolve } = require('../dev-server.js');

const ROOT = path.join(__dirname, '..');

test('resuelve archivos dentro del proyecto', () => {
  assert.equal(resolve('/'), path.join(ROOT, 'index.html'));
  assert.equal(resolve('/css/styles.css?v=2'), path.join(ROOT, 'css', 'styles.css'));
});

test('no deja salir de la carpeta del proyecto', () => {
  assert.equal(resolve('/..%2f..%2fetc/passwd'), null);
});

test('sirve la tienda', async (t) => {
  await new Promise((done) => server.listen(0, done));
  t.after(() => server.close());
  const { port } = server.address();
  const pagina = await fetch(`http://localhost:${port}/`);
  assert.equal(pagina.status, 200);
  assert.match(pagina.headers.get('content-type'), /text\/html/);
  assert.match(await pagina.text(), /js\/app\.js/);
  const faltante = await fetch(`http://localhost:${port}/no-existe.js`);
  assert.equal(faltante.status, 404);
});
