# 3 · Agregar productos

[← Personalizar tu marca](02-personalizar.md) · [Índice](README.md) · [Siguiente: publicar gratis →](04-publicar.md)

Tu catálogo está en [`js/productos.js`](../js/productos.js). Es una lista: cada producto va entre `{ }` y se separa del siguiente con una coma.

## Un producto sencillo

```js
{
  id: 'gorra-negra',
  nombre: 'Gorra negra',
  categoria: 'gorras',
  precio: 45000,
  imagen: 'img/productos/gorra-negra.jpg',
  resumen: 'Bordada, ajustable y 100 % algodón.',
  descripcion: 'Gorra de seis paneles con bordado frontal y cierre metálico. Talla única ajustable.',
},
```

## Todos los campos

| Campo | Obligatorio | Ejemplo | Qué hace |
|---|---|---|---|
| `id` | Sí | `'gorra-negra'` | Identificador único, en minúsculas y con guiones. **No lo cambies** después de publicar o se borrará de los carritos guardados |
| `nombre` | Sí | `'Gorra negra'` | Nombre visible |
| `categoria` | Sí | `'gorras'` | Debe ser un `id` de `categorias` en [`config.js`](../js/config.js) |
| `precio` | Sí | `45000` | Número **sin puntos, comas ni símbolo** |
| `imagen` | Sí | `'img/productos/gorra.jpg'` | Ruta de la foto |
| `resumen` | Sí | `'Bordada y ajustable.'` | Una frase corta para la tarjeta |
| `descripcion` | Sí | `'Gorra de seis…'` | Texto completo en la ficha |
| `precioAntes` | No | `55000` | Precio tachado. Muestra el porcentaje de descuento |
| `etiqueta` | No | `'Oferta'`, `'Nuevo'` | Etiqueta en la esquina de la foto |
| `destacado` | No | `true` | Aparece primero en la tienda |
| `detalles` | No | `{ Material: 'Algodón', Talla: 'Única' }` | Cuadros con datos en la ficha |
| `notas` | No | `['Chocolate', 'Panela']` | Lista corta en cursiva (en la demo, las notas del café) |
| `opciones` | No | ver abajo | Tallas, colores, sabores… |

## Opciones: tallas, colores, sabores

```js
opciones: { nombre: 'Talla', valores: ['S', 'M', 'L', 'XL'] },
```

Cuando un producto tiene opciones, el botón **Agregar** abre la ficha para que el cliente elija. Cada opción se guarda como una línea distinta en el carrito y aparece en el mensaje de WhatsApp: `2 × Camiseta (M)`.

## Fotos

- Guárdalas en `img/productos/`.
- Usa **fotos cuadradas** (por ejemplo 800 × 800 px) con fondo liso o transparente. Las de la demo son ilustraciones `.svg`, pero `.jpg`, `.png` y `.webp` funcionan igual.
- Pésalas poco para que la página cargue rápido: [Squoosh](https://squoosh.app/) las comprime gratis desde el navegador. Menos de 150 KB por foto es ideal.
- Si tus fotos tienen fondo blanco, cambia `--tint` de la categoría a `#ffffff` (ver [colores por categoría](02-personalizar.md#colores-por-categoría)).

## Categorías

1. Agrégala en `categorias` dentro de [`js/config.js`](../js/config.js):

   ```js
   { id: 'accesorios', nombre: 'Accesorios' },
   ```

2. Úsala en tus productos: `categoria: 'accesorios'`.
3. (Opcional) Dale un color de fondo en `css/styles.css`.

El orden de los botones de filtro es el orden de esta lista.

## Revisa que todo esté bien

Si tienes Node.js, ejecuta:

```bash
npm test
```

La prueba "el catálogo es válido" te avisa si hay un `id` repetido, un precio mal escrito, una categoría que no existe o una foto que no está en la carpeta.

Sin Node.js: abre la página, presiona `F12` y mira la pestaña **Console**. Si hay una coma o una comilla de más, ahí aparece el error con el número de línea.

> **Errores típicos:** olvidar la coma entre productos, usar comillas `"` y `'` mezcladas en el mismo texto, o escribir el precio como `45.000` (eso es 45 para JavaScript). Escribe `45000`.

---

[Siguiente: publicar gratis →](04-publicar.md)
