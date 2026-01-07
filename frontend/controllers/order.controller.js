/**
 * Order Controller - Logica de historial de pedidos
 */
const OrderController = {
    init() {
        OrderView.init();

        // Asignar evento al boton "Mis Pedidos" (si existe)
        const myOrdersBtn = document.getElementById('my-orders-btn');
        if (myOrdersBtn) {
            myOrdersBtn.addEventListener('click', () => this.showMyOrders());
        }
    },

    async showMyOrders() {
        try {
            OrderView.open();
            // Mostrar carga si fuera necesario
            const orders = await OrderModel.getMine();
            OrderView.renderList(orders);
        } catch (error) {
            console.error('Error al cargar pedidos:', error);
            // Mostrar error en la vista
        }
    }
};
