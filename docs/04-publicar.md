# 4 · Publicar gratis

[← Agregar productos](03-productos.md) · [Índice](README.md) · [Siguiente: ideas para ampliarla →](05-ampliar.md)

## GitHub Pages (gratis)

1. Sube tus cambios a tu repositorio de GitHub:
   - **Desde la web:** en tu repositorio pulsa **Add file → Upload files**, arrastra los archivos que cambiaste y pulsa **Commit changes**.
   - **Con Git:**

     ```bash
     git add .
     git commit -m "Agregar mis productos"
     git push
     ```

   - **Con [GitHub Desktop](https://desktop.github.com/):** escribe un resumen, pulsa **Commit to main** y luego **Push origin**.

2. En tu repositorio ve a **Settings → Pages**.
3. En **Build and deployment → Source** elige **Deploy from a branch**.
4. En **Branch** elige `main` y la carpeta `/ (root)`. Pulsa **Save**.
5. Espera uno o dos minutos y recarga. Arriba aparecerá tu enlace:

   ```text
   https://TU_USUARIO.github.io/NOMBRE_DEL_REPOSITORIO/
   ```

Cada vez que subas cambios, la página se actualiza sola en uno o dos minutos.

> **Importante:** cambia la URL de `og:image` en `index.html` por la de tu sitio para que la imagen se vea al compartir el enlace.

## Dominio propio (opcional)

Si compraste un dominio, como `mitienda.com`:

1. En **Settings → Pages → Custom domain** escribe tu dominio y pulsa **Save**.
2. En el panel de tu proveedor de dominio crea los registros DNS que indica la [documentación de GitHub](https://docs.github.com/es/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
3. Cuando funcione, marca **Enforce HTTPS**.

## Otras opciones

Como es una página estática, funciona en cualquier hosting:

- [Netlify](https://www.netlify.com/) o [Cloudflare Pages](https://pages.cloudflare.com/): conecta tu repositorio o arrastra la carpeta.
- Cualquier hosting con cPanel: sube los archivos a la carpeta `public_html`.

## Antes de compartir tu tienda

- [ ] Borraste el aviso de demostración (`demo-bar` en `index.html`).
- [ ] Pusiste tu número en `whatsapp` y probaste un pedido real desde tu celular.
- [ ] Cambiaste `<title>`, `description` y `og:image` en `index.html`.
- [ ] Reemplazaste el logo y las fotos.
- [ ] Revisaste la tienda en el celular.

---

[Siguiente: ideas para ampliarla →](05-ampliar.md)
