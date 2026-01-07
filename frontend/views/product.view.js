/**
 * Product View - Renderizado de productos
 */
const ProductView = {
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
     * Escapa HTML para prevenir XSS
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Renderiza una tarjeta de producto
     */
    renderCard(product) {
        const stockClass = product.stock <= 5 ? 'low-stock' : '';
        const disabled = product.stock <= 0 ? 'disabled' : '';

        return `
      <article class="shop-card" data-id="${product.id}" role="listitem">
        <img 
          src="${product.imagen || 'https://via.placeholder.com/300x200?text=Sin+imagen'}" 
          alt="Imagen de ${this.escapeHTML(product.nombre)}" 
          class="shop-card__img"
          loading="lazy"
        >
        <div class="shop-card__body">
          <h3 class="shop-card__title">${this.escapeHTML(product.nombre)}</h3>
          <div class="shop-card__meta">
            <span class="shop-card__badge" aria-label="Categoria">${this.escapeHTML(product.categoria || 'General')}</span>
            <span class="shop-card__stock ${stockClass}">Stock: ${product.stock}</span>
          </div>
          <p class="shop-card__desc">${this.escapeHTML(product.descripcion || '')}</p>
          <p class="shop-card__price">${this.formatPrice(product.precio)}</p>
        </div>
        <footer class="shop-card__footer">
          <button type="button" class="btn btn-outline js-detail" data-id="${product.id}" aria-haspopup="dialog">Ver detalle</button>
          <button type="button" class="btn btn-secondary js-add-cart" data-id="${product.id}" ${disabled}>
            ${product.stock > 0 ? 'Agregar' : 'Sin stock'}
          </button>
        </footer>
      </article>
    `;
    },

    /**
     * Renderiza la grilla de productos
     */
    renderGrid(products, container) {
        if (!container) return;

        if (!products.length) {
            container.innerHTML = '<p class="grid-empty">No hay productos disponibles.</p>';
            return;
        }

        container.innerHTML = products.map(p => this.renderCard(p)).join('');
    },

    /**
     * Renderiza las opciones del selector de categorias
     */
    renderCategoryOptions(products, selectElement) {
        if (!selectElement) return;

        const categories = [...new Set(products.map(p => p.categoria).filter(Boolean))].sort();

        selectElement.innerHTML = '<option value="Todas">Todas</option>' +
            categories.map(cat => `<option value="${this.escapeHTML(cat)}">${this.escapeHTML(cat)}</option>`).join('');
    },

    /**
     * Renderiza el detalle de un producto en el modal
     */
    renderDetail(product, elements) {
        const { title, desc, price, stock, img, buyBtn } = elements;

        if (title) title.textContent = product.nombre;
        if (desc) desc.textContent = product.descripcion || '';
        if (price) price.textContent = this.formatPrice(product.precio);
        if (stock) stock.textContent = product.stock;
        if (img) {
            img.src = product.imagen || 'https://via.placeholder.com/400x300?text=Sin+imagen';
            img.alt = `Imagen del producto ${product.nombre}`;
        }
        if (buyBtn) {
            buyBtn.disabled = product.stock <= 0;
            buyBtn.textContent = product.stock > 0 ? 'Agregar al carrito' : 'Sin stock';
        }
    },

    /**
     * Muestra mensaje de estado
     */
    showStatus(message, statusElement) {
        if (statusElement) {
            statusElement.textContent = message;
        }
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductView;
}
