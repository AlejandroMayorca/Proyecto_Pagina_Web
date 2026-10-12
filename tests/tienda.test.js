const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const T = require('../js/tienda.js');

function cargarGlobal(archivo, nombre) {
  const contexto = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', archivo), 'utf8'), contexto);
  return JSON.parse(JSON.stringify(contexto.window[nombre]));
}

const config = cargarGlobal('js/config.js', 'TIENDA_CONFIG');
const productos = cargarGlobal('js/productos.js', 'TIENDA_PRODUCTOS');
const sinEspacios = (texto) => texto.replace(/[\u00a0\u202f]/g, ' ');

test('el catálogo es válido', () => {
  const ids = new Set();
  const categorias = new Set(config.categorias.map((categoria) => categoria.id));
  for (const producto of productos) {
    assert.match(producto.id, /^[a-z0-9-]+$/, producto.id);
    assert.ok(!ids.has(producto.id), `id repetido: ${producto.id}`);
    ids.add(producto.id);
    assert.ok(producto.nombre && producto.resumen && producto.descripcion, producto.id);
    assert.ok(Number.isInteger(producto.precio) && producto.precio > 0, producto.id);
    assert.ok(categorias.has(producto.categoria), `${producto.id}: categoría ${producto.categoria} no existe en config.js`);
    assert.ok(fs.existsSync(path.join(__dirname, '..', producto.imagen)), `${producto.id}: falta ${producto.imagen}`);
    if (producto.precioAntes) assert.ok(producto.precioAntes > producto.precio, producto.id);
    if (producto.opciones) assert.ok(producto.opciones.nombre && producto.opciones.valores.length > 0, producto.id);
  }
});

test('formatea precios en pesos colombianos', () => {
  assert.equal(sinEspacios(T.formatoPrecio(42000, config)), '$ 42.000');
  assert.equal(sinEspacios(T.formatoPrecio(1500000, config)), '$ 1.500.000');
});

test('formatea otras monedas con decimales', () => {
  assert.match(T.formatoPrecio(19.9, { idioma: 'en-US', moneda: 'USD' }), /\$19\.90/);
});

test('busca sin importar tildes ni mayúsculas', () => {
  const nombres = (lista) => lista.map((producto) => producto.id);
  const ceramica = nombres(T.filtrarProductos(productos, { busqueda: 'CERAMICA' }));
  assert.ok(ceramica.includes('gotero-ceramica') && ceramica.includes('taza-ceramica'));
  assert.ok(!ceramica.includes('molino-manual'));
  assert.deepEqual(nombres(T.filtrarProductos(productos, { busqueda: 'jazmín' })), ['cafe-geisha']);
  assert.deepEqual(nombres(T.filtrarProductos(productos, { busqueda: 'prensa vidrio' })), ['prensa-francesa']);
});

test('filtra por categoría y ordena por precio', () => {
  const metodos = T.filtrarProductos(productos, { categoria: 'metodos', orden: 'precio-asc' });
  assert.deepEqual(
    metodos.map((producto) => producto.precio),
    [89000, 95000, 160000],
  );
  const desc = T.filtrarProductos(productos, { orden: 'precio-desc' });
  assert.ok(desc.every((producto, i) => i === 0 || desc[i - 1].precio >= producto.precio));
});

test('los destacados van primero y mantienen el orden del catálogo', () => {
  const lista = T.filtrarProductos(productos);
  const destacados = productos.filter((producto) => producto.destacado).map((producto) => producto.id);
  assert.deepEqual(lista.slice(0, destacados.length).map((producto) => producto.id), destacados);
  assert.equal(lista.length, productos.length);
});

test('ordena por nombre en español', () => {
  const lista = T.filtrarProductos(productos, { orden: 'nombre' }).map((producto) => producto.nombre);
  assert.deepEqual(lista, [...lista].sort((a, b) => a.localeCompare(b, 'es')));
});

test('calcula el descuento', () => {
  assert.equal(T.descuento({ precio: 115000, precioAntes: 128000 }), 10);
  assert.equal(T.descuento({ precio: 100 }), 0);
  assert.equal(T.descuento({ precio: 100, precioAntes: 90 }), 0);
});

test('agrega, suma y separa las opciones en el carrito', () => {
  let carrito = [];
  carrito = T.agregarAlCarrito(carrito, 'cafe-pitalito', 'En grano');
  carrito = T.agregarAlCarrito(carrito, 'cafe-pitalito', 'En grano', 2);
  carrito = T.agregarAlCarrito(carrito, 'cafe-pitalito', 'Fina (espresso)');
  assert.equal(carrito.length, 2);
  assert.equal(carrito[0].cantidad, 3);
  assert.equal(carrito[1].opcion, 'Fina (espresso)');
});

test('cambia cantidades y quita líneas', () => {
  let carrito = T.agregarAlCarrito([], 'filtros-papel');
  const clave = carrito[0].clave;
  carrito = T.cambiarCantidad(carrito, clave, 5);
  assert.equal(carrito[0].cantidad, 5);
  carrito = T.cambiarCantidad(carrito, clave, 500);
  assert.equal(carrito[0].cantidad, 99);
  carrito = T.cambiarCantidad(carrito, clave, 0);
  assert.deepEqual(carrito, []);
});

test('limpia un carrito guardado con datos viejos o dañados', () => {
  const guardado = [
    { id: 'filtros-papel', opcion: '', cantidad: 2 },
    { id: 'producto-borrado', opcion: '', cantidad: 1 },
    { id: 'taza-ceramica', opcion: 'Arena', cantidad: -3 },
    null,
  ];
  const limpio = T.limpiarCarrito(guardado, productos);
  assert.deepEqual(limpio, [{ id: 'filtros-papel', opcion: '', cantidad: 2, clave: 'filtros-papel' }]);
  assert.deepEqual(T.limpiarCarrito('basura', productos), []);
});

test('calcula envío y envío gratis', () => {
  const poco = T.totales(T.agregarAlCarrito([], 'filtros-papel'), productos, config);
  assert.equal(poco.subtotal, 22000);
  assert.equal(poco.envio, 12000);
  assert.equal(poco.total, 34000);
  assert.equal(poco.faltaParaGratis, 128000);

  const mucho = T.totales(T.agregarAlCarrito([], 'molino-manual'), productos, config);
  assert.equal(mucho.envio, 0);
  assert.equal(mucho.total, 160000);
  assert.equal(mucho.faltaParaGratis, 0);

  const vacio = T.totales([], productos, config);
  assert.equal(vacio.total, 0);
  assert.equal(vacio.faltaParaGratis, null);
});

test('arma el mensaje de WhatsApp con el pedido', () => {
  let carrito = T.agregarAlCarrito([], 'cafe-geisha', 'En grano', 2);
  carrito = T.agregarAlCarrito(carrito, 'filtros-papel');
  const mensaje = sinEspacios(
    T.mensajePedido(carrito, productos, config, { nombre: ' Ana ', direccion: 'Neiva, Calle 10', notas: '' }),
  );
  assert.match(mensaje, /^Hola Cosecha, quiero hacer este pedido:/);
  assert.match(mensaje, /• 2 × Geisha de altura \(En grano\): \$ 156\.000/);
  assert.match(mensaje, /• 1 × Filtros de papel: \$ 22\.000/);
  assert.match(mensaje, /Envío: Gratis/);
  assert.match(mensaje, /Total: \$ 178\.000/);
  assert.match(mensaje, /Nombre: Ana\n/);
  assert.doesNotMatch(mensaje, /Notas:/);
});

test('crea el enlace de WhatsApp con o sin número', () => {
  assert.equal(T.enlaceWhatsApp('+57 300 123 4567', 'Hola & chao'), 'https://wa.me/573001234567?text=Hola%20%26%20chao');
  assert.equal(T.enlaceWhatsApp('', 'Hola'), 'https://wa.me/?text=Hola');
});

test('lee y escribe los filtros en la URL', () => {
  const categorias = ['cafe', 'metodos'];
  assert.deepEqual(T.leerFiltrosUrl('?categoria=cafe&q=miel&orden=precio-asc', categorias), {
    categoria: 'cafe',
    busqueda: 'miel',
    orden: 'precio-asc',
  });
  assert.deepEqual(T.leerFiltrosUrl('?categoria=<script>&orden=hack', categorias), {
    categoria: 'todos',
    busqueda: '',
    orden: 'destacados',
  });
  assert.equal(T.escribirFiltrosUrl({ categoria: 'todos', busqueda: '  ', orden: 'destacados' }), '');
  assert.equal(T.escribirFiltrosUrl({ categoria: 'cafe', busqueda: 'café miel', orden: 'nombre' }), '?categoria=cafe&q=caf%C3%A9+miel&orden=nombre');
});

test('escapa HTML', () => {
  assert.equal(T.escaparHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
});
