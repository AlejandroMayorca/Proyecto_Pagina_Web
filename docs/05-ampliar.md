# 5 · Ideas para ampliarla

[← Publicar gratis](04-publicar.md) · [Índice](README.md)

Ideas ordenadas de más fácil a más avanzada, con dónde empezar en el código.

## 🟢 Fáciles

**Botón flotante de WhatsApp.** Agrega al final de `index.html`, antes de los `<script>`:

```html
<a class="whatsapp-float" href="https://wa.me/573001234567" aria-label="Escríbenos por WhatsApp">💬</a>
```

Y en `css/styles.css`:

```css
.whatsapp-float {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: #1f8f4e;
  font-size: 1.5rem;
  text-decoration: none;
}
```

**Agotado.** Agrega `agotado: true` a un producto y en [`js/app.js`](../js/app.js), dentro de la función `tarjeta`, cambia el botón por un texto "Agotado" cuando `producto.agotado` sea verdadero.

**Más métodos de pago en el mensaje.** En [`js/tienda.js`](../js/tienda.js), función `mensajePedido`, agrega una línea como `partes.push('Pago: Nequi o transferencia');`.

## 🟡 Intermedias

**Varias fotos por producto.** Cambia `imagen` por `imagenes: ['a.jpg', 'b.jpg']` y en la función `abrirDetalle` de [`js/app.js`](../js/app.js) muestra miniaturas que cambien la foto grande al hacer clic.

**Catálogo desde Google Sheets.** Así puedes cambiar precios sin tocar código:

1. Crea una hoja con columnas `id`, `nombre`, `categoria`, `precio`, `imagen`, `resumen`, `descripcion`.
2. **Archivo → Compartir → Publicar en la web → Valores separados por comas (.csv)**.
3. En `js/app.js` descarga ese enlace con `fetch`, convierte cada fila en un objeto y úsalo en lugar de `window.TIENDA_PRODUCTOS`.

Ojo: así la tienda necesita internet para mostrar productos y ya no funciona abriendo `index.html` con doble clic. Usa `npm start` o Live Server para probar.

**Estadísticas de visitas.** Servicios como [GoatCounter](https://www.goatcounter.com/) (gratis para uso personal) o [Plausible](https://plausible.io/) se agregan con una sola línea de `<script>` y respetan la privacidad.

## 🔴 Avanzadas

<a id="pagos-en-línea"></a>
**Pagos en línea.** Las pasarelas de pago como [Wompi](https://wompi.com/), [Mercado Pago](https://www.mercadopago.com.co/) o [Stripe](https://stripe.com/) ofrecen **links de pago** que se crean desde su panel. La forma más sencilla:

1. Crea un link de pago por producto (o uno de valor abierto).
2. Agrega el campo `linkPago` a cada producto y muestra un botón "Pagar en línea" en la ficha.

Para cobrar el total exacto del carrito necesitas un pequeño servidor o una función en la nube que cree el cobro con la API de la pasarela. **Nunca pongas claves secretas en los archivos de esta plantilla**: todo lo que está aquí lo puede ver cualquier visitante.

**Panel para administrar productos.** Puedes conectar un CMS sin servidor como [Decap CMS](https://decapcms.org/) para editar el catálogo desde una página con formulario.

**Migrar a un framework.** La lógica de [`js/tienda.js`](../js/tienda.js) no depende del navegador, así que puedes reutilizarla tal cual en React, Vue o Astro.

---

¿Hiciste una de estas mejoras? Compártela con un pull request. Lee [cómo contribuir](../CONTRIBUTING.md).
