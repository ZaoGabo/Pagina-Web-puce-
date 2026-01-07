/**
 * Cart Controller - Logica del carrito en el frontend
 */
const CartController = {
    elements: {
        dialog: null,
        list: null,
        total: null,
        badges: [],
        clearBtn: null,
        checkoutBtn: null,
        closeBtn: null,
        openBtns: [],
        loginMessage: null,
        messageContainer: null
    },

    /**
     * Inicializa el controlador
     */
    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateUI();

        // Suscribirse a cambios del carrito
        CartModel.subscribe((data) => this.onCartChange(data));

        // Escuchar cambios de autenticacion
        window.addEventListener('auth:logout', () => this.updateCheckoutState());
        window.addEventListener('auth:expired', () => this.updateCheckoutState());
    },

    /**
     * Cachea los elementos del DOM
     */
    cacheElements() {
        this.elements.dialog = document.getElementById('cartDialog');
        this.elements.list = document.getElementById('cartList');
        this.elements.total = document.getElementById('cartTotal');
        this.elements.clearBtn = document.getElementById('clearCart');
        this.elements.checkoutBtn = document.getElementById('checkout');
        this.elements.closeBtn = document.getElementById('cartClose');
        this.elements.loginMessage = document.getElementById('loginRequired');
        this.elements.messageContainer = document.getElementById('cartMessage');

        // Multiples badges
        const toolbarBadge = document.getElementById('cartCount');
        const navBadge = document.querySelector('#cart-btn .badge');
        this.elements.badges = [toolbarBadge, navBadge].filter(Boolean);

        // Multiples botones para abrir
        const toolbarBtn = document.getElementById('btnCart');
        const navBtn = document.getElementById('cart-btn');
        this.elements.openBtns = [toolbarBtn, navBtn].filter(Boolean);
    },

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Botones para abrir el carrito
        this.elements.openBtns.forEach(btn => {
            btn.addEventListener('click', () => this.open());
        });

        // Cerrar carrito
        if (this.elements.closeBtn) {
            this.elements.closeBtn.addEventListener('click', () => this.close());
        }

        if (this.elements.dialog) {
            this.elements.dialog.addEventListener('cancel', (e) => {
                e.preventDefault();
                this.close();
            });
        }

        // Vaciar carrito
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clear());
        }

        // Checkout
        if (this.elements.checkoutBtn) {
            this.elements.checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // Eventos en la lista del carrito
        if (this.elements.list) {
            this.elements.list.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-action]');
                if (!btn) return;

                const item = btn.closest('[data-id]');
                if (!item) return;

                const id = parseInt(item.dataset.id);
                const action = btn.dataset.action;

                this.handleItemAction(id, action);
            });

            this.elements.list.addEventListener('change', (e) => {
                if (e.target.dataset.action !== 'input') return;

                const item = e.target.closest('[data-id]');
                if (!item) return;

                const id = parseInt(item.dataset.id);
                const quantity = parseInt(e.target.value);

                if (quantity > 0) {
                    CartModel.updateQuantity(id, quantity);
                }
            });
        }
    },

    /**
     * Maneja acciones en items del carrito
     */
    handleItemAction(productId, action) {
        const items = CartModel.getItems();
        const item = items.find(i => i.id === productId);
        if (!item) return;

        switch (action) {
            case 'increment':
                CartModel.updateQuantity(productId, item.cantidad + 1);
                break;
            case 'decrement':
                CartModel.updateQuantity(productId, item.cantidad - 1);
                break;
            case 'remove':
                CartModel.remove(productId);
                break;
        }
    },

    /**
     * Abre el dialogo del carrito
     */
    open() {
        this.updateCheckoutState();
        if (this.elements.dialog) {
            this.elements.dialog.showModal();
        }
    },

    /**
     * Cierra el dialogo del carrito
     */
    close() {
        if (this.elements.dialog) {
            this.elements.dialog.close();
        }
    },

    /**
     * Vacia el carrito
     */
    clear() {
        CartModel.clear();
    },

    /**
     * Realiza el checkout
     */
    async checkout() {
        if (!AuthModel.isAuthenticated()) {
            AuthView.redirectToLogin();
            return;
        }

        const count = CartModel.getCount();
        if (count === 0) {
            this.showMessage('El carrito esta vacio', 'error');
            return;
        }

        try {
            this.elements.checkoutBtn.disabled = true;
            this.elements.checkoutBtn.textContent = 'Procesando...';

            const response = await CartModel.checkout();

            this.showMessage('Pedido creado exitosamente', 'success');
            this.close();

            // Mostrar confirmacion
            alert(`Pedido #${response.pedido.id} creado exitosamente.\nTotal: $${response.pedido.total.toFixed(2)}`);

        } catch (error) {
            this.showMessage(error.message || 'Error al procesar el pedido', 'error');
        } finally {
            this.elements.checkoutBtn.disabled = false;
            this.elements.checkoutBtn.textContent = 'Pagar';
        }
    },

    /**
     * Callback cuando cambia el carrito
     */
    onCartChange(data) {
        CartView.renderList(data.items, this.elements.list);
        CartView.updateTotal(data.total, this.elements.total);
        CartView.updateBadges(data.count, ...this.elements.badges);
    },

    /**
     * Actualiza la UI inicial
     */
    updateUI() {
        const items = CartModel.getItems();
        const total = CartModel.getTotal();
        const count = CartModel.getCount();

        CartView.renderList(items, this.elements.list);
        CartView.updateTotal(total, this.elements.total);
        CartView.updateBadges(count, ...this.elements.badges);
        this.updateCheckoutState();
    },

    /**
     * Actualiza el estado del boton de checkout
     */
    updateCheckoutState() {
        const isAuth = AuthModel.isAuthenticated();
        CartView.updateCheckoutButton(isAuth, this.elements.checkoutBtn, this.elements.loginMessage);
    },

    /**
     * Muestra un mensaje temporal
     */
    showMessage(message, type) {
        if (this.elements.messageContainer) {
            this.elements.messageContainer.innerHTML = `
        <p class="cart-message cart-message--${type}" role="alert">${message}</p>
      `;
            setTimeout(() => {
                this.elements.messageContainer.innerHTML = '';
            }, 4000);
        }
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartController;
}
