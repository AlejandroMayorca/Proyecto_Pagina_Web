const products = [
  {
    id: "curso-frontend",
    name: "Curso Frontend Esencial",
    type: "curso",
    description: "Fundamentos sólidos de HTML, CSS y JavaScript aplicados a proyectos reales.",
    price: 59,
    level: "Nivel inicial",
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: "curso-tienda",
    name: "Crea tu Tienda Web Desde Cero",
    type: "curso",
    description: "Guía paso a paso para levantar una tienda moderna sin frameworks.",
    price: 79,
    level: "Nivel intermedio",
    tags: ["UI", "Arquitectura", "Buenas prácticas"]
  },
  {
    id: "kit-componentes",
    name: "Kit de Componentes UI",
    type: "recurso",
    description: "Colección de componentes reutilizables para formularios, tarjetas y navbars.",
    price: 29,
    level: "Reusable",
    tags: ["Diseño", "Componentes", "CSS"]
  },
  {
    id: "pack-assets",
    name: "Pack de Assets para Ecommerce",
    type: "recurso",
    description: "Iconos, ilustraciones y mockups para prototipar tiendas online.",
    price: 19,
    level: "Lista rápida",
    tags: ["Assets", "Branding"]
  },
  {
    id: "revision-codigo",
    name: "Revisión de Código de Tu Tienda",
    type: "servicio",
    description: "Feedback estructurado sobre accesibilidad, rendimiento y organización.",
    price: 95,
    level: "Servicio puntual",
    tags: ["Mentoría", "Code review"]
  },
  {
    id: "mentoria-mes",
    name: "Mentoría Web 1:1 (1 mes)",
    type: "servicio",
    description: "Acompañamiento semanal para llevar tu tienda a producción.",
    price: 240,
    level: "Avanzado",
    tags: ["Mentoría", "Estrategia"]
  }
]

const categoryFilter = document.querySelector("#filter-category")
const sortFilter = document.querySelector("#filter-sort")
const productGrid = document.querySelector("#product-grid")

const heroButtons = document.querySelectorAll("[data-action]")

heroButtons.forEach((button) => {
  const action = button.getAttribute("data-action")
  if (action === "scroll-productos") {
    button.addEventListener("click", () => {
      const target = document.querySelector("#productos")
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  }
  if (action === "scroll-guia") {
    button.addEventListener("click", () => {
      const target = document.querySelector("#guia")
      if (target) {
        target.scrollIntoView({ behavior: "smooth" })
      }
    })
  }
})

function getFilteredProducts() {
  const selectedCategory = categoryFilter.value
  const selectedSort = sortFilter.value

  let result = [...products]

  if (selectedCategory !== "todos") {
    result = result.filter((product) => product.type === selectedCategory)
  }

  if (selectedSort === "precio-asc") {
    result.sort((a, b) => a.price - b.price)
  } else if (selectedSort === "precio-desc") {
    result.sort((a, b) => b.price - a.price)
  }

  return result
}

function renderProducts() {
  if (!productGrid) return

  const items = getFilteredProducts()

  if (!items.length) {
    productGrid.innerHTML = `
      <div class="product-empty">
        No hay productos para esta combinación de filtros. Prueba otra categoría u orden.
      </div>
    `
    return
  }

  const fragment = document.createDocumentFragment()

  items.forEach((product) => {
    const card = document.createElement("article")
    card.className = "product-card"
    card.innerHTML = `
      <div class="product-badge">
        <span>●</span>
        <span>${product.type}</span>
      </div>
      <h3 class="product-title">${product.name}</h3>
      <p class="product-description">${product.description}</p>
      <div class="product-meta">
        <span class="product-price">${product.price} €</span>
        <span class="product-level">${product.level}</span>
      </div>
      <div class="product-footer">
        <div class="product-tags">
          ${product.tags.map((tag) => `<span class="product-tag">${tag}</span>`).join("")}
        </div>
        <div class="product-action">
          <button type="button" class="btn ghost" data-product-id="${product.id}">
            Añadir al plan
          </button>
        </div>
      </div>
    `

    fragment.appendChild(card)
  })

  productGrid.innerHTML = ""
  productGrid.appendChild(fragment)
}

categoryFilter.addEventListener("change", () => {
  renderProducts()
})

sortFilter.addEventListener("change", () => {
  renderProducts()
})

productGrid.addEventListener("click", (event) => {
  const target = event.target
  if (!(target instanceof HTMLButtonElement)) return

  const productId = target.getAttribute("data-product-id")
  if (!productId) return

  const product = products.find((item) => item.id === productId)
  if (!product) return

  const message = `Has añadido "${product.name}" a tu plan de aprendizaje.

Esta acción ahora mismo solo muestra este aviso.
En el siguiente paso puedes:
• Guardar esta selección en localStorage
• Mostrar un resumen en el encabezado
• Conectar con un backend real`

  alert(message)
})

renderProducts()
