# Cómo contribuir

¡Gracias por querer ayudar! Esta plantilla existe para que cualquier negocio pueda tener su tienda en línea, así que **todas las contribuciones son bienvenidas**, incluso si es tu primera vez en GitHub.

*English speakers: contributions are welcome too. Issues and pull requests can be written in English.*

## Formas de ayudar

- 🐛 **Reportar errores**: [abre un issue](https://github.com/AlejandroMayorca/Proyecto_Pagina_Web/issues/new?template=bug_report.yml) con los pasos, el navegador y una captura si puedes.
- 💡 **Proponer ideas**: [cuéntanos aquí](https://github.com/AlejandroMayorca/Proyecto_Pagina_Web/issues/new?template=feature_request.yml).
- 📝 **Mejorar la guía**: aclarar pasos, corregir errores o traducir.
- 🎨 **Compartir tu tienda**: si la usaste para un negocio real, abre un issue y la mostramos como ejemplo.
- 🔧 **Programar**: arreglar errores o implementar una de las [ideas para ampliarla](docs/05-ampliar.md).

## Tu primer pull request

1. Pulsa **Fork** en la [página del proyecto](https://github.com/AlejandroMayorca/Proyecto_Pagina_Web).
2. Clona tu fork y crea una rama:

   ```bash
   git clone https://github.com/TU_USUARIO/Proyecto_Pagina_Web.git
   cd Proyecto_Pagina_Web
   git checkout -b boton-whatsapp-flotante
   ```

3. Haz tus cambios y pruébalos abriendo `index.html` o con `npm start`.
4. Si tienes Node.js, ejecuta las pruebas:

   ```bash
   npm test
   ```

5. Sube tu rama y abre el pull request:

   ```bash
   git add .
   git commit -m "Agregar botón flotante de WhatsApp"
   git push origin boton-whatsapp-flotante
   ```

¿Primera vez con Git? Mira [First Contributions en español](https://github.com/firstcontributions/first-contributions/blob/main/docs/translations/README.es.md).

## Reglas del proyecto

- **Sin dependencias ni paso de compilación.** La tienda debe seguir funcionando al abrir `index.html` con doble clic.
- La configuración va en `js/config.js` y el catálogo en `js/productos.js`. Nada de datos de la tienda dentro de `app.js`.
- La lógica que no toca la página va en `js/tienda.js` y lleva prueba en `tests/tienda.test.js`.
- Textos en español claro, en segunda persona y con verbos concretos: "Agregar al carrito", no "Enviar".
- Accesibilidad: todo se debe poder usar con teclado y tener buen contraste en modo claro y oscuro.
- Código limpio y legible, sin comentarios innecesarios: las explicaciones van en `docs/`.
- Formato según [`.editorconfig`](.editorconfig): 2 espacios, comillas simples y punto y coma.
- Nunca agregues claves de API ni datos privados: todo lo que está en este proyecto es público.

## Código de conducta

Al participar aceptas el [código de conducta](CODE_OF_CONDUCT.md).
