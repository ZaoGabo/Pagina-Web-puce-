/**
 * Order View - Renderizado de pedidos del usuario
 */
const OrderView = {
    dialog: null,
    listElement: null,

    init() {
        this.dialog = document.getElementById('ordersDialog');
        this.listElement = document.getElementById('ordersList');

        if (this.dialog) {
            const closeBtn = this.dialog.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.close());
            }
        }
    },

    open() {
        if (this.dialog) {
            this.dialog.showModal();
        }
    },

    close() {
        if (this.dialog) {
            this.dialog.close();
        }
    },

    renderList(orders) {
        if (!this.listElement) return;

        if (orders.length === 0) {
            this.listElement.innerHTML = '<li class="empty-state">No tienes pedidos registrados.</li>';
            return;
        }

        this.listElement.innerHTML = orders.map(order => `
            <li class="order-item">
                <div class="order-header">
                    <span class="order-id">Pedido #${order.id}</span>
                    <span class="order-date">${new Date(order.createdAt).toLocaleDateString()}</span>
                    <span class="order-total">$${parseFloat(order.total).toFixed(2)}</span>
                </div>
                <div class="order-details">
                    <p><strong>Productos:</strong></p>
                    <ul class="order-products-list">
                        ${order.detalles.map(d => `
                            <li>${d.cantidad}x ${d.producto} - $${parseFloat(d.precioUnitario).toFixed(2)}</li>
                        `).join('')}
                    </ul>
                </div>
            </li>
        `).join('');
    }
};
