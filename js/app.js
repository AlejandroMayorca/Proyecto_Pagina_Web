(function () {
  const config = window.TIENDA_CONFIG;
  const productos = window.TIENDA_PRODUCTOS;
  const T = window.Tienda;
  const CLAVE_CARRITO = 'tienda:carrito';
  const CLAVE_CLIENTE = 'tienda:cliente';
  const CLAVE_TEMA = 'tienda:tema';

  const $ = (selector) => document.querySelector(selector);
  const precio = (valor) => T.formatoPrecio(valor, config);
  const html = T.escaparHtml;
  const categorias = new Map(config.categorias.map((categoria) => [categoria.id, categoria.nombre]));

  const dom = {
    productos: $('#productos'),
    categorias: $('#categorias'),
    busqueda: $('#busqueda'),
    orden: $('#orden'),
    resultados: $('#resultados'),
    contador: $('#contador'),
    detalle: $('#detalle'),
    detalleContenido: $('#detalle-contenido'),
    carrito: $('#carrito'),
    carritoContenido: $('#carrito-contenido'),
    avisos: $('#avisos'),
  };

  const almacen = {
    leer(clave, defecto) {
      try {
        const valor = localStorage.getItem(clave);
        return valor ? JSON.parse(valor) : defecto;
      } catch (error) {
        return defecto;
      }
    },
    guardar(clave, valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
      } catch (error) {}
    },
  };

  const estado = {
    filtros: T.leerFiltrosUrl(location.search, [...categorias.keys()]),
    carrito: T.limpiarCarrito(almacen.leer(CLAVE_CARRITO, []), productos),
    cliente: almacen.leer(CLAVE_CLIENTE, { nombre: '', direccion: '', notas: '' }),
  };

  function aplicarMarca() {
    document.querySelectorAll('[data-tienda]').forEach((elemento) => {
      const valor = config[elemento.dataset.tienda];
      if (valor) elemento.textContent = valor;
    });
    const perkEnvio = $('#perk-envio');
    if (config.envio?.gratisDesde != null) {
      perkEnvio.textContent = 'Envío gratis';
      perkEnvio.nextElementSibling.textContent = `en compras desde ${precio(config.envio.gratisDesde)}`;
    } else if (!config.envio?.costo) {
      perkEnvio.textContent = 'Envío gratis';
      perkEnvio.nextElementSibling.textContent = 'en todos los pedidos';
    } else {
      perkEnvio.textContent = 'Envíos a todo el país';
      perkEnvio.nextElementSibling.textContent = `por ${precio(config.envio.costo)}`;
    }
    if (config.envio?.texto) $('#texto-envio').textContent = config.envio.texto;

    const lunes = new Date();
    lunes.setDate(lunes.getDate() - ((lunes.getDay() + 6) % 7));
    $('#sello-tueste strong').textContent = lunes.toLocaleDateString(config.idioma, { day: 'numeric', month: 'long' });

    const contacto = [
      config.contacto?.ciudad && `<li>${html(config.contacto.ciudad)}</li>`,
      config.contacto?.correo && `<li><a href="mailto:${html(config.contacto.correo)}">${html(config.contacto.correo)}</a></li>`,
      config.contacto?.instagram && `<li><a href="https://instagram.com/${html(config.contacto.instagram)}" rel="noopener">Instagram @${html(config.contacto.instagram)}</a></li>`,
      config.whatsapp && `<li><a href="${T.enlaceWhatsApp(config.whatsapp, 'Hola')}" rel="noopener">WhatsApp</a></li>`,
    ].filter(Boolean);
    $('#datos-contacto').innerHTML = contacto.join('');
  }

  function tarjeta(producto) {
    const rebaja = T.descuento(producto);
    const etiqueta = producto.etiqueta
      ? `<span class="tag tag--${T.normalizar(producto.etiqueta)}">${html(producto.etiqueta)}${rebaja ? ` −${rebaja}%` : ''}</span>`
      : '';
    const notas = producto.notas?.length ? `<p class="card__notes">${producto.notas.map(html).join(', ')}</p>` : '';
    const antes = producto.precioAntes ? `<s>${precio(producto.precioAntes)}</s>` : '';
    return `
      <article class="card" data-categoria="${html(producto.categoria)}">
        <div class="card__media">
          ${etiqueta}
          <img src="${html(producto.imagen)}" alt="" loading="lazy" width="300" height="300">
        </div>
        <div class="card__body">
          <h3 class="card__title"><button type="button" data-ver="${html(producto.id)}">${html(producto.nombre)}</button></h3>
          <p class="card__summary">${html(producto.resumen)}</p>
          ${notas}
          <div class="card__foot">
            <p class="price">${antes}<span>${precio(producto.precio)}</span></p>
            <button class="btn btn--small" type="button" data-agregar="${html(producto.id)}" aria-label="Agregar ${html(producto.nombre)} al carrito">Agregar</button>
          </div>
        </div>
      </article>`;
  }

  function renderCategorias() {
    const opciones = [['todos', 'Todo'], ...categorias];
    dom.categorias.innerHTML = opciones
      .map(
        ([id, nombre]) =>
          `<button type="button" class="chip" data-categoria="${html(id)}" aria-pressed="${estado.filtros.categoria === id}">${html(nombre)}</button>`,
      )
      .join('');
  }

  function renderProductos() {
    const lista = T.filtrarProductos(productos, estado.filtros);
    dom.resultados.textContent =
      lista.length === productos.length ? `${lista.length} productos` : `${lista.length} de ${productos.length} productos`;
    if (!lista.length) {
      dom.productos.innerHTML = `
        <div class="empty">
          <p><strong>No encontramos productos con esos filtros.</strong></p>
          <p>Prueba con otra palabra o mira todo el catálogo.</p>
          <button type="button" class="btn btn--quiet" data-limpiar>Ver todos los productos</button>
        </div>`;
      return;
    }
    dom.productos.innerHTML = lista.map(tarjeta).join('');
  }

  function sincronizarFiltros({ historial = true } = {}) {
    dom.busqueda.value = estado.filtros.busqueda;
    dom.orden.value = estado.filtros.orden;
    dom.categorias.querySelectorAll('.chip').forEach((chip) => {
      chip.setAttribute('aria-pressed', String(chip.dataset.categoria === estado.filtros.categoria));
    });
    if (historial) {
      const url = `${location.pathname}${T.escribirFiltrosUrl(estado.filtros)}${location.hash}`;
      history.replaceState(null, '', url);
    }
    renderProductos();
  }

  function guardarCarrito() {
    almacen.guardar(CLAVE_CARRITO, estado.carrito);
    const { unidades } = T.totales(estado.carrito, productos, config);
    dom.contador.textContent = unidades;
    dom.contador.hidden = unidades === 0;
    if (dom.carrito.open) renderCarrito();
  }

  function avisar(texto, accion) {
    const aviso = document.createElement('div');
    aviso.className = 'toast';
    aviso.innerHTML = `<span>${html(texto)}</span>`;
    if (accion) {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = accion.texto;
      boton.addEventListener('click', () => {
        accion.alPulsar();
        aviso.remove();
      });
      aviso.append(boton);
    }
    dom.avisos.append(aviso);
    if (typeof dom.avisos.showPopover === 'function') {
      if (dom.avisos.matches(':popover-open')) dom.avisos.hidePopover();
      dom.avisos.showPopover();
    }
    setTimeout(() => aviso.classList.add('toast--out'), 3200);
    setTimeout(() => aviso.remove(), 3600);
  }

  function agregar(id, opcion = '', cantidad = 1) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;
    const elegida = opcion || producto.opciones?.valores?.[0] || '';
    estado.carrito = T.agregarAlCarrito(estado.carrito, id, elegida, cantidad);
    guardarCarrito();
    avisar(`${producto.nombre}${elegida ? ` (${elegida})` : ''} está en tu carrito`, {
      texto: 'Ver carrito',
      alPulsar: abrirCarrito,
    });
  }

  function abrirDetalle(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;
    const rebaja = T.descuento(producto);
    const detalles = Object.entries(producto.detalles || {})
      .map(([clave, valor]) => `<div><dt>${html(clave)}</dt><dd>${html(valor)}</dd></div>`)
      .join('');
    const opciones = producto.opciones
      ? `<fieldset class="options">
          <legend>${html(producto.opciones.nombre)}</legend>
          ${producto.opciones.valores
            .map(
              (valor, indice) =>
                `<label><input type="radio" name="opcion" value="${html(valor)}" ${indice === 0 ? 'checked' : ''}><span>${html(valor)}</span></label>`,
            )
            .join('')}
        </fieldset>`
      : '';
    dom.detalleContenido.innerHTML = `
      <div class="detail" data-categoria="${html(producto.categoria)}">
        <div class="detail__media"><img src="${html(producto.imagen)}" alt="${html(producto.nombre)}" width="360" height="360"></div>
        <form class="detail__info" id="form-detalle">
          <p class="detail__category">${html(categorias.get(producto.categoria) || '')}</p>
          <h2 id="detalle-nombre">${html(producto.nombre)}</h2>
          <p class="price price--large">${producto.precioAntes ? `<s>${precio(producto.precioAntes)}</s>` : ''}<span>${precio(producto.precio)}</span>${rebaja ? `<em>Ahorras ${rebaja}%</em>` : ''}</p>
          <p>${html(producto.descripcion)}</p>
          ${producto.notas?.length ? `<p class="detail__notes">Notas de taza: ${producto.notas.map(html).join(', ')}</p>` : ''}
          ${detalles ? `<dl class="specs">${detalles}</dl>` : ''}
          ${opciones}
          <div class="detail__buy">
            <label class="qty">
              <span class="visually-hidden">Cantidad</span>
              <button type="button" data-paso="-1" aria-label="Quitar uno">−</button>
              <input type="number" name="cantidad" value="1" min="1" max="99" inputmode="numeric">
              <button type="button" data-paso="1" aria-label="Agregar uno">+</button>
            </label>
            <button class="btn btn--primary" type="submit">Agregar al carrito</button>
          </div>
        </form>
      </div>`;
    const form = dom.detalleContenido.querySelector('#form-detalle');
    const cantidad = form.elements.cantidad;
    form.addEventListener('click', (evento) => {
      const paso = evento.target.closest('[data-paso]');
      if (!paso) return;
      cantidad.value = Math.min(99, Math.max(1, (Number(cantidad.value) || 1) + Number(paso.dataset.paso)));
    });
    form.addEventListener('submit', (evento) => {
      evento.preventDefault();
      const elegida = form.elements.opcion?.value || '';
      agregar(producto.id, elegida, Math.min(99, Math.max(1, Number(cantidad.value) || 1)));
      dom.detalle.close();
    });
    dom.detalle.showModal();
  }

  function renderCarrito() {
    const resumen = T.totales(estado.carrito, productos, config);
    if (!resumen.lineas.length) {
      dom.carritoContenido.innerHTML = `
        <div class="empty empty--cart">
          <p><strong>Tu carrito está vacío.</strong></p>
          <p>Agrega un café o un accesorio para empezar tu pedido.</p>
          <button type="button" class="btn btn--primary" data-ir-tienda>Ver la tienda</button>
        </div>`;
      return;
    }
    const lineas = resumen.lineas
      .map(
        (linea) => `
        <li class="line" data-clave="${html(linea.clave)}" data-categoria="${html(linea.producto.categoria)}">
          <img src="${html(linea.producto.imagen)}" alt="" width="64" height="64">
          <div class="line__info">
            <p class="line__name">${html(linea.producto.nombre)}</p>
            ${linea.opcion ? `<p class="line__option">${html(linea.opcion)}</p>` : ''}
            <div class="qty qty--small">
              <button type="button" data-cambiar="-1" aria-label="Quitar uno de ${html(linea.producto.nombre)}">−</button>
              <span aria-label="Cantidad">${linea.cantidad}</span>
              <button type="button" data-cambiar="1" aria-label="Agregar uno de ${html(linea.producto.nombre)}">+</button>
            </div>
          </div>
          <div class="line__end">
            <p>${precio(linea.total)}</p>
            <button type="button" class="link" data-quitar>Quitar</button>
          </div>
        </li>`,
      )
      .join('');
    const progreso =
      resumen.faltaParaGratis > 0
        ? `<p class="shipping-note">Te faltan <strong>${precio(resumen.faltaParaGratis)}</strong> para el envío gratis.</p>`
        : resumen.faltaParaGratis === 0
          ? '<p class="shipping-note shipping-note--ok">Tu pedido tiene envío gratis.</p>'
          : '';
    const meta = config.envio?.gratisDesde || 1;
    const porcentaje = Math.min(100, Math.round((resumen.subtotal / meta) * 100));
    const sinNumero = !String(config.whatsapp || '').replace(/\D/g, '');
    dom.carritoContenido.innerHTML = `
      ${progreso}
      ${config.envio?.gratisDesde ? `<div class="progress" aria-hidden="true"><span style="width:${porcentaje}%"></span></div>` : ''}
      <ul class="lines">${lineas}</ul>
      <dl class="summary">
        <div><dt>Subtotal</dt><dd>${precio(resumen.subtotal)}</dd></div>
        <div><dt>Envío</dt><dd>${resumen.envio ? precio(resumen.envio) : 'Gratis'}</dd></div>
        <div class="summary__total"><dt>Total</dt><dd>${precio(resumen.total)}</dd></div>
      </dl>
      <form class="checkout" id="checkout">
        <label>Tu nombre<input name="nombre" autocomplete="name" required value="${html(estado.cliente.nombre)}"></label>
        <label>Ciudad y dirección<input name="direccion" autocomplete="street-address" required value="${html(estado.cliente.direccion)}"></label>
        <label><span>Notas para el pedido <span class="optional">(opcional)</span></span><textarea name="notas" rows="2">${html(estado.cliente.notas)}</textarea></label>
        <button class="btn btn--whatsapp" type="submit">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Zm4.3 12.4c-.2.5-1 1-1.5 1-.4.1-.9.1-1.5-.1a12 12 0 0 1-5.4-4.8c-.4-.6-.8-1.4-.8-2.2 0-.8.4-1.3.6-1.5.2-.2.4-.3.6-.3h.4c.1 0 .3 0 .5.4l.7 1.6c.1.2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2 1.1 1 2 1.2 2.3 1.4.3.1.4.1.6-.1l.7-.9c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.3v.7Z"/></svg>
          Enviar pedido por WhatsApp
        </button>
        ${sinNumero ? '<p class="hint">Esta demo no tiene número configurado: WhatsApp te dejará elegir a quién enviarlo.</p>' : ''}
      </form>
      <button type="button" class="link link--muted" data-vaciar>Vaciar carrito</button>`;
  }

  function abrirCarrito() {
    dom.avisos.replaceChildren();
    renderCarrito();
    if (dom.detalle.open) dom.detalle.close();
    if (!dom.carrito.open) dom.carrito.showModal();
  }

  function cerrarAlPulsarFondo(dialogo) {
    dialogo.addEventListener('click', (evento) => {
      if (evento.target === dialogo) dialogo.close();
    });
  }

  function iniciarTema() {
    const boton = $('#tema');
    boton.addEventListener('click', () => {
      const actual =
        document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const siguiente = actual === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = siguiente;
      try {
        localStorage.setItem(CLAVE_TEMA, siguiente);
      } catch (error) {}
    });
  }

  function iniciarEventos() {
    let espera;
    dom.busqueda.addEventListener('input', () => {
      clearTimeout(espera);
      espera = setTimeout(() => {
        estado.filtros.busqueda = dom.busqueda.value;
        sincronizarFiltros();
      }, 150);
    });
    dom.orden.addEventListener('change', () => {
      estado.filtros.orden = dom.orden.value;
      sincronizarFiltros();
    });
    dom.categorias.addEventListener('click', (evento) => {
      const chip = evento.target.closest('[data-categoria]');
      if (!chip) return;
      estado.filtros.categoria = chip.dataset.categoria;
      sincronizarFiltros();
    });
    dom.productos.addEventListener('click', (evento) => {
      const ver = evento.target.closest('[data-ver]');
      const boton = evento.target.closest('[data-agregar]');
      if (evento.target.closest('[data-limpiar]')) {
        estado.filtros = { categoria: 'todos', busqueda: '', orden: estado.filtros.orden };
        sincronizarFiltros();
      } else if (boton) {
        const producto = productos.find((item) => item.id === boton.dataset.agregar);
        if (producto?.opciones) abrirDetalle(producto.id);
        else agregar(boton.dataset.agregar);
      } else if (ver) {
        abrirDetalle(ver.dataset.ver);
      } else {
        const card = evento.target.closest('.card');
        if (card && evento.target.closest('.card__media')) card.querySelector('[data-ver]').click();
      }
    });
    $('#abrir-carrito').addEventListener('click', abrirCarrito);
    dom.carritoContenido.addEventListener('click', (evento) => {
      const linea = evento.target.closest('[data-clave]');
      const cambio = evento.target.closest('[data-cambiar]');
      if (evento.target.closest('[data-ir-tienda]')) {
        dom.carrito.close();
        document.querySelector('#tienda').scrollIntoView({ behavior: 'smooth' });
      } else if (evento.target.closest('[data-vaciar]')) {
        const respaldo = estado.carrito;
        estado.carrito = [];
        guardarCarrito();
        avisar('Vaciaste el carrito', {
          texto: 'Deshacer',
          alPulsar: () => {
            estado.carrito = respaldo;
            guardarCarrito();
          },
        });
      } else if (linea && cambio) {
        const actual = estado.carrito.find((item) => item.clave === linea.dataset.clave);
        estado.carrito = T.cambiarCantidad(estado.carrito, linea.dataset.clave, actual.cantidad + Number(cambio.dataset.cambiar));
        guardarCarrito();
      } else if (linea && evento.target.closest('[data-quitar]')) {
        estado.carrito = T.quitarDelCarrito(estado.carrito, linea.dataset.clave);
        guardarCarrito();
      }
    });
    dom.carritoContenido.addEventListener('input', (evento) => {
      const campo = evento.target;
      if (!campo.form || campo.form.id !== 'checkout') return;
      estado.cliente[campo.name] = campo.value;
      almacen.guardar(CLAVE_CLIENTE, estado.cliente);
    });
    dom.carritoContenido.addEventListener('submit', (evento) => {
      if (evento.target.id !== 'checkout') return;
      evento.preventDefault();
      const texto = T.mensajePedido(estado.carrito, productos, config, estado.cliente);
      window.open(T.enlaceWhatsApp(config.whatsapp, texto), '_blank', 'noopener');
    });
    cerrarAlPulsarFondo(dom.detalle);
    cerrarAlPulsarFondo(dom.carrito);
    window.addEventListener('popstate', () => {
      estado.filtros = T.leerFiltrosUrl(location.search, [...categorias.keys()]);
      sincronizarFiltros({ historial: false });
    });
  }

  aplicarMarca();
  renderCategorias();
  sincronizarFiltros({ historial: false });
  guardarCarrito();
  iniciarTema();
  iniciarEventos();
})();
