/**
 * Cart Model - Manejo del carrito con localStorage
 */
const CartModel = {
    CART_KEY: 'cart',
    listeners: new Set(),

    /**
     * Obtiene los items del carrito
     */
    getItems() {
        const data = localStorage.getItem(this.CART_KEY);
        if (!data) return [];
        try {
            const parsed = JSON.parse(data);
            return Array.isArray(parsed.items) ? parsed.items : [];
        } catch {
            return [];
        }
    },

    /**
     * Guarda los items del carrito
     */
    saveItems(items) {
        const payload = {
            items,
            updatedAt: new Date().toISOString()
        };
        localStorage.setItem(this.CART_KEY, JSON.stringify(payload));
        this.notify();
    },

    /**
     * Agrega un producto al carrito
     */
    add(product, quantity = 1) {
        const items = this.getItems();
        const existing = items.find(item => item.id === product.id);

        if (existing) {
            existing.cantidad += quantity;
        } else {
            items.push({
                id: product.id,
                nombre: product.nombre,
                precio: product.precio,
                imagen: product.imagen,
                cantidad: quantity
            });
        }

        this.saveItems(items);
    },

    /**
     * Actualiza la cantidad de un item
     */
    updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            this.remove(productId);
            return;
        }

        const items = this.getItems();
        const item = items.find(i => i.id === productId);

        if (item) {
            item.cantidad = quantity;
            this.saveItems(items);
        }
    },

    /**
     * Elimina un item del carrito
     */
    remove(productId) {
        const items = this.getItems().filter(item => item.id !== productId);
        this.saveItems(items);
    },

    /**
     * Vacia el carrito
     */
    clear() {
        this.saveItems([]);
    },

    /**
     * Obtiene el total del carrito
     */
    getTotal() {
        return this.getItems().reduce((sum, item) => {
            return sum + (item.precio * item.cantidad);
        }, 0);
    },

    /**
     * Obtiene la cantidad total de items
     */
    getCount() {
        return this.getItems().reduce((sum, item) => sum + item.cantidad, 0);
    },

    /**
     * Formatea el carrito para enviar al backend
     */
    getItemsForCheckout() {
        return this.getItems().map(item => ({
            productoId: item.id,
            cantidad: item.cantidad
        }));
    },

    /**
     * Realiza el checkout (crea pedido en BD)
     */
    async checkout() {
        const items = this.getItemsForCheckout();
        if (!items.length) {
            throw { message: 'El carrito esta vacio' };
        }

        const response = await API.post('/pedidos', { items });
        this.clear();
        return response;
    },

    /**
     * Suscribe un listener a cambios del carrito
     */
    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    },

    /**
     * Notifica a los listeners
     */
    notify() {
        const data = {
            items: this.getItems(),
            total: this.getTotal(),
            count: this.getCount()
        };
        this.listeners.forEach(listener => listener(data));
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartModel;
}
