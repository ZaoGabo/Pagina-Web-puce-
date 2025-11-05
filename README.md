# 🛒 ZaoShop - Carrito accesible y persistente

Sitio web responsive que demuestra los fundamentos de un frontend moderno con carrito de compras funcional, datos dinámicos, accesibilidad ARIA y persistencia con las principales APIs del navegador.

## ✅ Requerimientos cubiertos

- **HTML5 semántico:** cabecera, navegación principal, contenido en `main`, formularios etiquetados y diálogos nativos.
- **CSS3 adaptable:** diseño mobile-first con Grid/Flex, tres puntos de quiebre y controles de foco visibles.
- **Componentes accesibles:** tarjetas reutilizables, modales (`<dialog>`), carrito operable por teclado y atributos ARIA.
- **Validaciones con regex:** formulario de contacto y newsletter con mensajes `aria-invalid`/`aria-describedby`.
- **Datos estáticos:** catálogo cargado desde `data/products.json` con fallback a IndexedDB.
- **Carrito completo:** añadir, incrementar/decrementar, eliminar, totales en tiempo real y control de stock restante.
- **Persistencia 4×:** `localStorage`, `sessionStorage`, `IndexedDB` y cookies (`lastVisit`).
- **Accesibilidad integral (POUR):** skip link, navegación por teclado, contrastes, mensajes en `role="status"` y soporte dark mode.
- **Modularidad JS:** `app.js` (vista/control), `storage.js` (persistencia), `db.js` (IndexedDB) y `cart.js` (estado del carrito).

## �️ Estructura del proyecto

```
index.html
assets/
  css/styles.css
data/
  products.json
js/
  app.js        # lógica de catálogo, carrito y temas
  cart.js       # gestor de estado del carrito con persistencia
  db.js         # capa IndexedDB (offline)
  main.js       # utilidades de UI, validaciones y menú responsive
```

## 🧠 Funcionalidades clave

- **Catálogo dinámico:** renderiza tarjetas accesibles, filtra por categoría y sincroniza fechas de actualización (`time#catalogUpdated`).
- **Detalle de producto:** modal con carrusel de miniaturas, botón de compra y control de stock restante.
- **Carrito persistente:** badge sincronizado, diálogo accesible, resumen con última actualización (`time#cartUpdated`) y guardado automático.
- **Formulario de contacto:** validaciones con expresiones regulares (nombre, correo, teléfono ECU, mensaje ≥ 20) y mensajes accesibles.
- **Newsletter:** validación de correo con regex y feedback en `aria-live`.
- **Preferencias del usuario:** tema claro/oscuro, tamaño de fuente y última categoría recordados en Web Storage.
- **Última visita:** cookie `lastVisit` + `sessionStorage` para mostrar la visita previa en el footer.

## 🧩 Tecnologías

- **HTML5** semántico con atributos ARIA.
- **CSS3** moderno (flexbox, grid, variables y dark mode).
- **JavaScript ES6+** con módulos nativos y `Intl.NumberFormat`.
- **APIs Web Storage:** `localStorage`, `sessionStorage`, `IndexedDB` y cookies.

## 🚀 Cómo ejecutar

1. Clona o descarga el repositorio.
2. Abre `index.html` directamente en tu navegador **o** lanza un servidor local:

```powershell
# Python
python -m http.server 8000

# Node.js
npx http-server
```

3. Visita `http://localhost:8000` y prueba la experiencia completa (añade productos, recarga la página y valida la persistencia).

## 🔍 Pruebas recomendadas

- Cambia el tema y tamaño de fuente, recarga y confirma que se conservan.
- Filtra por categoría, recarga y verifica que se restaure la selección (sessionStorage).
- Añade productos, ajusta cantidades y recarga: el carrito y totales deben mantenerse.
- Desactiva la red (tab DevTools) y recarga: el catálogo debe servirse desde IndexedDB.
- Envía el formulario de contacto con datos inválidos para revisar mensajes accesibles.
- Usa sólo teclado (Tab/Enter/Espacio) para navegar, abrir modales y modificar el carrito.

## 📌 Accesibilidad & buenas prácticas

- `role="status"`, `aria-live` y estados `aria-invalid` para feedback en tiempo real.
- Skip link `Saltar al contenido`, menú responsive con `aria-expanded`, modales con `aria-modal`.
- Controles con `focus-visible` y contraste AA.
- Formularios compatibles con lectores de pantalla (etiquetas, ayudas y errores relacionados).

## 📄 Notas

- Los datos se encuentran en `data/products.json`; las imágenes son placeholders.
- No se requiere backend: toda la lógica corre en el navegador.
- El plan de migración a React + TypeScript está documentado en `MIGRATION_PLAN.md`.
