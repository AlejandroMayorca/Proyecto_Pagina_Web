# Web Shop Starter – Base para tu tienda web

Proyecto base para aprender a construir una tienda online moderna usando solo HTML, CSS y JavaScript, con una estructura pensada para que sea fácil de leer, extender y publicar en GitHub.

## Objetivos del proyecto

- Tener una página de tienda sencilla pero con un aspecto profesional.
- Entender la estructura básica de un proyecto web sin frameworks.
- Servir como plantilla para que tú (o tus alumnos) podáis seguir añadiendo funcionalidades.
- Dejar el proyecto listo para subirlo a un repositorio en GitHub y publicarlo con GitHub Pages.

## Stack y estructura

Tecnologías utilizadas:

- HTML5 para la estructura.
- CSS3 (sin preprocesadores) para el diseño y el layout responsive.
- JavaScript plano para la lógica de productos y filtros.

Estructura de archivos principal:

- `index.html` – Página principal de la tienda: hero, listado de productos, guía y sección “Sobre”.
- `styles.css` – Estilos globales, layout responsive, tarjetas de producto y secciones.
- `main.js` – Datos de productos de ejemplo, filtros por categoría y precio, y pequeña interacción.

## Cómo ejecutar el proyecto en local

No necesitas ninguna herramienta especial: basta con un navegador moderno.

1. Clona este repositorio o descarga el código.
2. Abre el archivo `index.html` con tu navegador (doble clic o “Abrir con…”).
3. Verás la tienda funcionando con:
   - Hero de presentación.
   - Listado de productos de ejemplo.
   - Filtros por categoría y orden de precio.
   - Botones de scroll hacia secciones clave y un botón “Añadir al plan” con una interacción básica.

Opcionalmente, si utilizas VS Code, puedes abrir la carpeta y usar la extensión “Live Server” para tener recarga automática.

## Cómo seguir construyendo la tienda

Algunas ideas concretas para evolucionar este proyecto:

1. Extender el catálogo  
   - Añade nuevos objetos al array de `products` en `main.js`.  
   - Incluye nuevos tipos (por ejemplo, `plantilla`, `plugin`, etc.) y ajusta el filtro de categorías.  
   - Integra imágenes reales (añadiendo un campo `image` y mostrándolo en las tarjetas).

2. Implementar un carrito sencillo  
   - Cuando el usuario pulsa “Añadir al plan”, guarda el producto en `localStorage`.  
   - Muestra un pequeño resumen en el `header` (por ejemplo, “3 items en tu plan”).  
   - Crea una sección nueva para ver el detalle del carrito.

3. Mejorar accesibilidad y detalles de diseño  
   - Revisa el contraste de colores, tamaños de fuente y estados `:hover` / `:focus`.  
   - Añade `aria-label` o textos alternativos si más adelante incorporas iconos e imágenes.  
   - Ajusta el diseño en móviles pequeños para que todo siga siendo legible.

4. Conectar con un backend o servicio externo  
   - Sustituye el array local de `products` por datos que vengan de una API.  
   - Implementa carga inicial de productos con `fetch` y muestra estados de carga / error.  
   - Añade autenticación básica si quieres gestionar cuentas de usuario.

## Cómo subirlo a GitHub

1. Crea un nuevo repositorio en GitHub (público o privado).  
2. En tu máquina, dentro de la carpeta del proyecto, inicializa Git:

   ```bash
   git init
   git add .
   git commit -m "Proyecto base de tienda web"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

3. Verifica en GitHub que aparecen `index.html`, `styles.css`, `main.js` y este `README.md`.

## Cómo publicarlo con GitHub Pages

1. En el repositorio de GitHub, ve a **Settings → Pages**.  
2. En **Source**, elige la rama `main` y la carpeta `/root`.  
3. Guarda los cambios.  
4. Después de unos minutos, GitHub te dará una URL del tipo:

   ```
   https://tu_usuario.github.io/tu_repo/
   ```

5. Abre esa URL en el navegador para ver la tienda en producción.

## Buenas prácticas recomendadas

- Mantén nombres claros y consistentes en clases CSS, funciones y variables.  
- Agrupa cambios relacionados en commits pequeños con mensajes descriptivos.  
- Evita mezclar demasiadas responsabilidades en un solo archivo JavaScript si el proyecto crece.  
- Añade un archivo `LICENSE` si quieres que otras personas usen libremente tu plantilla.

Este proyecto está pensado como punto de partida profesional y legible, para que puedas seguir construyendo sin depender de herramientas automáticas.

