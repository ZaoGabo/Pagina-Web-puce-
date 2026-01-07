/**
 * Admin View - Renderizado del panel de administracion
 */
const AdminView = {
    /**
     * Formatea un precio
     */
    formatPrice(value) {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    },

    /**
     * Formatea una fecha
     */
    formatDate(dateString) {
        return new Date(dateString).toLocaleString('es-EC', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });
    },

    /**
     * Escapa HTML
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Renderiza la tabla de productos
     */
    renderProductTable(products, container) {
        if (!container) return;

        if (!products.length) {
            container.innerHTML = '<p class="admin-empty">No hay productos registrados.</p>';
            return;
        }

        container.innerHTML = `
      <table class="admin-table" role="grid">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Nombre</th>
            <th scope="col">Categoria</th>
            <th scope="col">Precio</th>
            <th scope="col">Stock</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(p => `
            <tr data-id="${p.id}">
              <td>${p.id}</td>
              <td>${this.escapeHTML(p.nombre)}</td>
              <td>${this.escapeHTML(p.categoria || '-')}</td>
              <td>${this.formatPrice(p.precio)}</td>
              <td class="${p.stock <= 5 ? 'low-stock' : ''}">${p.stock}</td>
              <td>
                <button type="button" class="btn btn-sm btn-outline js-edit" data-id="${p.id}">Editar</button>
                <button type="button" class="btn btn-sm btn-danger js-delete" data-id="${p.id}">Eliminar</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    },

    /**
     * Renderiza la tabla de pedidos
     */
    renderOrderTable(orders, container) {
        if (!container) return;

        if (!orders.length) {
            container.innerHTML = '<p class="admin-empty">No hay pedidos registrados.</p>';
            return;
        }

        container.innerHTML = `
      <table class="admin-table" role="grid">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Usuario</th>
            <th scope="col">Total</th>
            <th scope="col">Productos</th>
            <th scope="col">Fecha</th>
          </tr>
        </thead>
        <tbody>
          ${orders.map(o => `
            <tr>
              <td>${o.id}</td>
              <td>${this.escapeHTML(o.usuario)}</td>
              <td>${this.formatPrice(o.total)}</td>
              <td>${o.detalles.map(d => `${d.cantidad}x ${this.escapeHTML(d.producto)}`).join(', ')}</td>
              <td>${this.formatDate(o.createdAt)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    },

    /**
     * Rellena el formulario de producto para edicion
     */
    fillProductForm(product, form) {
        if (!form) return;

        form.querySelector('[name="id"]').value = product.id || '';
        form.querySelector('[name="nombre"]').value = product.nombre || '';
        form.querySelector('[name="descripcion"]').value = product.descripcion || '';
        form.querySelector('[name="precio"]').value = product.precio || '';
        form.querySelector('[name="stock"]').value = product.stock || 0;
        form.querySelector('[name="categoria"]').value = product.categoria || '';
        form.querySelector('[name="imagen"]').value = product.imagen || '';
    },

    /**
     * Limpia el formulario de producto
     */
    clearProductForm(form) {
        if (!form) return;
        form.reset();
        form.querySelector('[name="id"]').value = '';
    },

    /**
     * Obtiene los datos del formulario de producto
     */
    getProductFormData(form) {
        if (!form) return null;

        return {
            nombre: form.querySelector('[name="nombre"]').value.trim(),
            descripcion: form.querySelector('[name="descripcion"]').value.trim(),
            precio: parseFloat(form.querySelector('[name="precio"]').value),
            stock: parseInt(form.querySelector('[name="stock"]').value),
            categoria: form.querySelector('[name="categoria"]').value.trim(),
            imagen: form.querySelector('[name="imagen"]').value.trim()
        };
    },

    /**
     * Muestra mensaje de exito/error
     */
    showMessage(message, type = 'success', container) {
        if (!container) return;

        container.innerHTML = `
      <div class="admin-message admin-message--${type}" role="alert">
        ${this.escapeHTML(message)}
      </div>
    `;

        setTimeout(() => {
            container.innerHTML = '';
        }, 5000);
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminView;
}
