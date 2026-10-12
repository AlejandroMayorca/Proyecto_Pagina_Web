# 1 · Empezar

[← Índice](README.md) · [Siguiente: personalizar tu marca →](02-personalizar.md)

## Consigue tu copia

**Con cuenta de GitHub (recomendado).** En la [página del proyecto](https://github.com/AlejandroMayorca/Proyecto_Pagina_Web) pulsa **Use this template → Create a new repository**. Ponle el nombre de tu tienda (por ejemplo `mi-tienda`) y pulsa **Create repository**. Ya tienes tu propia copia en la nube.

Para editarla en tu computador, pulsa **Code → Download ZIP** en tu repositorio y extráelo, o clónalo con Git:

```bash
git clone https://github.com/TU_USUARIO/mi-tienda.git
```

**Sin cuenta.** Pulsa **Code → Download ZIP** en la página del proyecto y extrae la carpeta.

## Ábrela

Haz doble clic en `index.html`. Se abre en tu navegador y todo funciona: búsqueda, filtros, carrito y WhatsApp.

## Edítala

Puedes usar cualquier editor de texto, pero te recomendamos [Visual Studio Code](https://code.visualstudio.com/) (gratis):

1. Abre VS Code → **File → Open Folder** y elige la carpeta de la tienda.
2. Cambia algo en `js/config.js`, por ejemplo el `nombre`, y guarda con `Ctrl + S`.
3. Recarga el navegador (`F5`) y verás el cambio.

> **Consejo:** instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code y pulsa **Go Live** abajo a la derecha. El navegador se recargará solo cada vez que guardes.

Si tienes [Node.js](https://nodejs.org/es) también puedes usar el servidor incluido:

```bash
npm start
```

Y abrir http://localhost:3000.

## ¿Qué archivo hace qué?

| Archivo | Qué contiene | ¿Lo editas? |
|---|---|---|
| [`js/config.js`](../js/config.js) | Nombre, WhatsApp, moneda, envío, contacto y categorías | ✏️ Sí |
| [`js/productos.js`](../js/productos.js) | Tu catálogo | ✏️ Sí |
| [`index.html`](../index.html) | Textos de la portada, "Cómo pedir" y pie de página | ✏️ Los textos |
| [`css/styles.css`](../css/styles.css) | Colores, letras y diseño | Los colores del inicio |
| [`img/`](../img) | Logo, fotos de productos e imagen para redes | ✏️ Sí |
| [`js/tienda.js`](../js/tienda.js) | Búsqueda, carrito, totales y mensaje de WhatsApp | Solo si quieres cambiar cómo funciona |
| [`js/app.js`](../js/app.js) | Muestra los productos y responde a los clics | Solo si quieres cambiar cómo funciona |

---

[Siguiente: personalizar tu marca →](02-personalizar.md)
