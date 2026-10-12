# 📚 Guía paso a paso

| Paso | Qué aprendes | Tiempo |
|---|---|---|
| [1 · Empezar](01-empezar.md) | Descargar la plantilla, abrirla y editarla | 5 min |
| [2 · Personalizar tu marca](02-personalizar.md) | Nombre, WhatsApp, colores, letras, logo y textos | 20 min |
| [3 · Agregar productos](03-productos.md) | Fotos, precios, ofertas, opciones y categorías | A tu ritmo |
| [4 · Publicar gratis](04-publicar.md) | GitHub Pages, dominio propio y lista final | 10 min |
| [5 · Ideas para ampliarla](05-ampliar.md) | Botón flotante, Google Sheets, pagos en línea y más | — |

## ¿Dónde cambio…?

| Quiero cambiar… | Archivo |
|---|---|
| Nombre, WhatsApp, moneda o envío | [`js/config.js`](../js/config.js) |
| Productos, precios y fotos | [`js/productos.js`](../js/productos.js) y [`img/productos/`](../img/productos) |
| Categorías | `categorias` en [`js/config.js`](../js/config.js) |
| Colores | Variables al inicio de [`css/styles.css`](../css/styles.css) |
| Textos de la portada y "Cómo pedir" | [`index.html`](../index.html) |
| Logo e ícono | [`img/favicon.svg`](../img/favicon.svg) |
| Imagen al compartir en redes | [`img/og.png`](../img/og.png) y `og:image` en [`index.html`](../index.html) |
| El mensaje de WhatsApp | `mensajePedido` en [`js/tienda.js`](../js/tienda.js) |
| Cómo se ve cada producto | `tarjeta` en [`js/app.js`](../js/app.js) |
| La ficha del producto | `abrirDetalle` en [`js/app.js`](../js/app.js) |
| El carrito | `renderCarrito` en [`js/app.js`](../js/app.js) |
| Reglas de envío gratis | `totales` en [`js/tienda.js`](../js/tienda.js) |

## Para aprender más

- [HTML, CSS y JavaScript en MDN (español)](https://developer.mozilla.org/es/docs/Learn)
- [Documentación de GitHub Pages](https://docs.github.com/es/pages)
