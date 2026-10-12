# 2 · Personalizar tu marca

[← Empezar](01-empezar.md) · [Índice](README.md) · [Siguiente: agregar productos →](03-productos.md)

## Datos de la tienda

Todo está en [`js/config.js`](../js/config.js):

```js
window.TIENDA_CONFIG = {
  nombre: 'Mi Tienda',
  eslogan: 'Ropa urbana · Neiva',
  whatsapp: '573001234567',
  moneda: 'COP',
  idioma: 'es-CO',
  envio: {
    costo: 12000,
    gratisDesde: 150000,
    texto: 'Envíos a toda Colombia en 2 a 4 días hábiles.',
  },
  contacto: {
    correo: 'ventas@mitienda.com',
    ciudad: 'Neiva, Huila',
    instagram: 'mitienda',
  },
  categorias: [
    { id: 'camisetas', nombre: 'Camisetas' },
    { id: 'gorras', nombre: 'Gorras' },
  ],
};
```

| Campo | Para qué sirve |
|---|---|
| `nombre`, `eslogan` | Aparecen en el encabezado, el pie de página y el mensaje de WhatsApp |
| `whatsapp` | Tu número **con código de país y sin `+`, espacios ni guiones**. Colombia: `57` + número → `573001234567`. Si lo dejas vacío, WhatsApp le pedirá al cliente que elija el contacto |
| `moneda`, `idioma` | Formato de precios. México: `'MXN'` y `'es-MX'`. Perú: `'PEN'` y `'es-PE'`. Dólares: `'USD'` y `'es-US'` |
| `envio.costo` | Lo que cobras por envío. Pon `0` si siempre es gratis |
| `envio.gratisDesde` | Desde qué subtotal el envío es gratis. Pon `null` si nunca es gratis |
| `envio.texto` | Frase que aparece en "Cómo pedir" |
| `contacto` | Se muestra en el pie de página. Deja vacío lo que no uses |
| `categorias` | Los botones para filtrar. El `id` es el que usarás en cada producto |

## Colores

Abre [`css/styles.css`](../css/styles.css). Al principio están los colores como variables:

```css
:root {
  --bg: #f1f5f0;       /* fondo de la página */
  --surface: #ffffff;  /* fondo de las tarjetas */
  --ink: #13201b;      /* texto principal */
  --muted: #53625a;    /* texto secundario */
  --brand: #173a2e;    /* color de tu marca: barra superior, títulos */
  --accent: #b3202c;   /* botones principales y ofertas */
  --flower: #e9b949;   /* detalles: etiqueta "Nuevo" y números */
  --tint-cafe: #dfeadf; /* fondo de las fotos de cada categoría */
}
```

Cambia los valores por los de tu marca. Herramientas útiles: [Coolors](https://coolors.co/) para elegir una paleta y el [verificador de contraste de WebAIM](https://webaim.org/resources/contrastchecker/) para que el texto se lea bien.

Hay un bloque igual más abajo para el **modo oscuro** (`:root[data-theme='dark']` y `@media (prefers-color-scheme: dark)`). Ajusta los dos con los mismos valores.

### Colores por categoría

Cada categoría tiene un color de fondo para sus fotos. Si creas una categoría `camisetas`, agrega en `css/styles.css`:

```css
[data-categoria='camisetas'] {
  --tint: #e8e1f5;
}
```

Si no lo agregas, se usa el fondo de `--tint-cafe`.

## Letras

La plantilla usa [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque), incluida en la carpeta `fonts/` para que funcione sin internet. Para usar otra:

1. Descárgala en formato `.woff2` (por ejemplo desde [Fontsource](https://fontsource.org/) o [google-webfonts-helper](https://gwfh.mranftl.com/fonts)) y ponla en `fonts/`.
2. Cambia el `src` del `@font-face` al inicio de `css/styles.css`.
3. Cambia `--font-display` y `--font-body`.

## Logo e ícono

- El logo del encabezado y el ícono de la pestaña es [`img/favicon.svg`](../img/favicon.svg). Reemplázalo por tu logo (cuadrado, en `.svg` o `.png`). Si usas `.png`, cambia también las rutas en `index.html`.
- La imagen que aparece al compartir el enlace en WhatsApp o redes es `img/og.png` (1200 × 630 px). Reemplázala y cambia la URL de `og:image` en `index.html` por la de tu sitio.

## Textos de la página

Los textos de la portada, "Cómo pedir" y el pie de página están en [`index.html`](../index.html). Búscalos con `Ctrl + F`:

- **Título principal:** busca `<h1>`.
- **Descripción de la portada:** busca `hero__lead`.
- **Beneficios** (envío, tueste, pago): busca `class="perks"`.
- **Pasos para pedir:** busca `steps__list`.
- **Imagen de la portada:** busca `hero__art`.
- **Aviso de tienda de demostración:** busca `demo-bar` y **borra ese bloque** cuando tu tienda sea real.
- **Título y descripción para Google:** `<title>` y `<meta name="description">` al inicio del archivo.

El sello rojo "Tostado el…" calcula el lunes de esta semana. Si tu tienda no es de café, cambia el texto en `index.html` (busca `sello-tueste`) o borra ese párrafo.

---

[Siguiente: agregar productos →](03-productos.md)
