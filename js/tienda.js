(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Tienda = api;
})(typeof self !== 'undefined' ? self : this, function () {
  const ORDENES = ['destacados', 'precio-asc', 'precio-desc', 'nombre'];

  function normalizar(texto) {
    return String(texto ?? '')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim();
  }

  function escaparHtml(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  }

  function formatoPrecio(valor, config = {}) {
    const moneda = config.moneda || 'COP';
    const decimales = ['COP', 'CLP', 'PYG'].includes(moneda) ? 0 : 2;
    return new Intl.NumberFormat(config.idioma || 'es-CO', {
      style: 'currency',
      currency: moneda,
      minimumFractionDigits: decimales,
      maximumFractionDigits: decimales,
    }).format(valor);
  }

  function textoBusqueda(producto) {
    return normalizar([producto.nombre, producto.resumen, producto.descripcion, ...(producto.notas || [])].join(' '));
  }

  function filtrarProductos(productos, { categoria = 'todos', busqueda = '', orden = 'destacados' } = {}) {
    const palabras = normalizar(busqueda).split(/\s+/).filter(Boolean);
    const resultado = productos
      .map((producto, indice) => ({ producto, indice }))
      .filter(({ producto }) => categoria === 'todos' || producto.categoria === categoria)
      .filter(({ producto }) => {
        if (!palabras.length) return true;
        const texto = textoBusqueda(producto);
        return palabras.every((palabra) => texto.includes(palabra));
      });

    const comparar = {
      destacados: (a, b) => Number(Boolean(b.producto.destacado)) - Number(Boolean(a.producto.destacado)) || a.indice - b.indice,
      'precio-asc': (a, b) => a.producto.precio - b.producto.precio || a.indice - b.indice,
      'precio-desc': (a, b) => b.producto.precio - a.producto.precio || a.indice - b.indice,
      nombre: (a, b) => a.producto.nombre.localeCompare(b.producto.nombre, 'es'),
    }[ORDENES.includes(orden) ? orden : 'destacados'];

    return resultado.sort(comparar).map(({ producto }) => producto);
  }

  function descuento(producto) {
    if (!producto.precioAntes || producto.precioAntes <= producto.precio) return 0;
    return Math.round((1 - producto.precio / producto.precioAntes) * 100);
  }

  function claveLinea(id, opcion) {
    return opcion ? `${id}::${opcion}` : id;
  }

  function agregarAlCarrito(carrito, id, opcion = '', cantidad = 1) {
    const clave = claveLinea(id, opcion);
    const existente = carrito.find((linea) => linea.clave === clave);
    if (existente) {
      return carrito.map((linea) => (linea.clave === clave ? { ...linea, cantidad: Math.min(99, linea.cantidad + cantidad) } : linea));
    }
    return [...carrito, { clave, id, opcion, cantidad: Math.min(99, Math.max(1, cantidad)) }];
  }

  function cambiarCantidad(carrito, clave, cantidad) {
    if (cantidad <= 0) return quitarDelCarrito(carrito, clave);
    return carrito.map((linea) => (linea.clave === clave ? { ...linea, cantidad: Math.min(99, cantidad) } : linea));
  }

  function quitarDelCarrito(carrito, clave) {
    return carrito.filter((linea) => linea.clave !== clave);
  }

  function limpiarCarrito(carrito, productos) {
    if (!Array.isArray(carrito)) return [];
    const ids = new Set(productos.map((producto) => producto.id));
    return carrito
      .filter((linea) => linea && ids.has(linea.id) && Number.isInteger(linea.cantidad) && linea.cantidad > 0)
      .map((linea) => ({ ...linea, opcion: linea.opcion || '', clave: claveLinea(linea.id, linea.opcion), cantidad: Math.min(99, linea.cantidad) }));
  }

  function lineasDetalladas(carrito, productos) {
    const porId = new Map(productos.map((producto) => [producto.id, producto]));
    return carrito
      .filter((linea) => porId.has(linea.id))
      .map((linea) => {
        const producto = porId.get(linea.id);
        return { ...linea, producto, total: producto.precio * linea.cantidad };
      });
  }

  function totales(carrito, productos, config = {}) {
    const lineas = lineasDetalladas(carrito, productos);
    const subtotal = lineas.reduce((suma, linea) => suma + linea.total, 0);
    const unidades = lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
    const envioConfig = config.envio || {};
    const gratis = envioConfig.gratisDesde != null && subtotal >= envioConfig.gratisDesde;
    const envio = subtotal === 0 || gratis ? 0 : envioConfig.costo || 0;
    const faltaParaGratis = envioConfig.gratisDesde != null && subtotal > 0 ? Math.max(0, envioConfig.gratisDesde - subtotal) : null;
    return { lineas, subtotal, envio, total: subtotal + envio, unidades, faltaParaGratis };
  }

  function mensajePedido(carrito, productos, config = {}, cliente = {}) {
    const { lineas, subtotal, envio, total } = totales(carrito, productos, config);
    const precio = (valor) => formatoPrecio(valor, config);
    const saludo = config.nombre ? `Hola ${config.nombre}, quiero hacer este pedido:` : 'Hola, quiero hacer este pedido:';
    const partes = [saludo, ''];
    for (const linea of lineas) {
      const opcion = linea.opcion ? ` (${linea.opcion})` : '';
      partes.push(`• ${linea.cantidad} × ${linea.producto.nombre}${opcion}: ${precio(linea.total)}`);
    }
    partes.push('', `Subtotal: ${precio(subtotal)}`, `Envío: ${envio ? precio(envio) : 'Gratis'}`, `Total: ${precio(total)}`);
    const datos = [
      ['Nombre', cliente.nombre],
      ['Ciudad y dirección', cliente.direccion],
      ['Notas', cliente.notas],
    ].filter(([, valor]) => valor && String(valor).trim());
    if (datos.length) {
      partes.push('');
      for (const [etiqueta, valor] of datos) partes.push(`${etiqueta}: ${String(valor).trim()}`);
    }
    return partes.join('\n');
  }

  function enlaceWhatsApp(numero, texto) {
    const limpio = String(numero || '').replace(/\D/g, '');
    return `https://wa.me/${limpio}?text=${encodeURIComponent(texto)}`;
  }

  function leerFiltrosUrl(busquedaUrl, categoriasValidas = []) {
    const params = new URLSearchParams(busquedaUrl);
    const categoria = params.get('categoria');
    const orden = params.get('orden');
    return {
      categoria: categoriasValidas.includes(categoria) ? categoria : 'todos',
      busqueda: (params.get('q') || '').slice(0, 80),
      orden: ORDENES.includes(orden) ? orden : 'destacados',
    };
  }

  function escribirFiltrosUrl({ categoria, busqueda, orden }) {
    const params = new URLSearchParams();
    if (categoria && categoria !== 'todos') params.set('categoria', categoria);
    if (busqueda && busqueda.trim()) params.set('q', busqueda.trim());
    if (orden && orden !== 'destacados') params.set('orden', orden);
    const texto = params.toString();
    return texto ? `?${texto}` : '';
  }

  return {
    ORDENES,
    normalizar,
    escaparHtml,
    formatoPrecio,
    filtrarProductos,
    descuento,
    claveLinea,
    agregarAlCarrito,
    cambiarCantidad,
    quitarDelCarrito,
    limpiarCarrito,
    totales,
    mensajePedido,
    enlaceWhatsApp,
    leerFiltrosUrl,
    escribirFiltrosUrl,
  };
});
