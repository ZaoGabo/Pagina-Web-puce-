/**
 * Cart View - Renderizado del carrito
 */
const CartView = {
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
     * Escapa HTML
     */
    escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Renderiza un item del carrito
     */
    renderItem(item) {
        const subtotal = item.precio * item.cantidad;

        return `
      <li class="cart-item" data-id="${item.id}">
        <div class="cart-item__header">
          <span class="cart-item__name">${this.escapeHTML(item.nombre)}</span>
          <button type="button" class="btn-link cart-remove" data-action="remove" aria-label="Eliminar ${this.escapeHTML(item.nombre)} del carrito">
            Eliminar
          </button>
        </div>
        <div class="cart-item__controls">
          <div class="cart-qty" role="group" aria-label="Cantidad de ${this.escapeHTML(item.nombre)}">
            <button type="button" class="qty-btn" data-action="decrement" aria-label="Reducir cantidad">-</button>
            <input 
              type="number" 
              inputmode="numeric" 
              min="1" 
              value="${item.cantidad}" 
              data-action="input" 
              aria-label="Cantidad"
            >
            <button type="button" class="qty-btn" data-action="increment" aria-label="Aumentar cantidad">+</button>
          </div>
          <span class="cart-item__price">${this.formatPrice(subtotal)}</span>
        </div>
        <p class="cart-item__unit">Precio unitario: ${this.formatPrice(item.precio)}</p>
      </li>
    `;
    },

    /**
     * Renderiza la lista completa del carrito
     */
    renderList(items, listElement) {
        if (!listElement) return;

        if (!items.length) {
            listElement.innerHTML = '<li class="cart-empty">Tu carrito esta vacio.</li>';
            return;
        }

        listElement.innerHTML = items.map(item => this.renderItem(item)).join('');
    },

    /**
     * Actualiza el total del carrito
     */
    updateTotal(total, totalElement) {
        if (totalElement) {
            totalElement.textContent = this.formatPrice(total);
        }
    },

    /**
     * Actualiza los badges del carrito
     */
    updateBadges(count, ...badgeElements) {
        badgeElements.forEach(el => {
            if (el) el.textContent = String(count);
        });
    },

    /**
     * Muestra/oculta el boton de checkout segun autenticacion
     */
    updateCheckoutButton(isAuthenticated, checkoutBtn, loginMessage) {
        if (checkoutBtn) {
            checkoutBtn.disabled = !isAuthenticated;
        }
        if (loginMessage) {
            loginMessage.hidden = isAuthenticated;
        }
    },

    /**
     * Muestra mensaje de confirmacion de pedido
     */
    showOrderConfirmation(order) {
        return `
      <div class="order-confirmation" role="alert">
        <h3>Pedido confirmado</h3>
        <p>Tu pedido #${order.pedido.id} ha sido registrado exitosamente.</p>
        <p><strong>Total:</strong> ${this.formatPrice(order.pedido.total)}</p>
      </div>
    `;
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartView;
}
