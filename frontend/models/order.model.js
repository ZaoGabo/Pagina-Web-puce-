/**
 * Order Model - Manejo de pedidos via API
 */
const OrderModel = {
    /**
     * Obtiene los pedidos del usuario actual
     */
    async getMine() {
        const response = await API.get('/pedidos/mis-pedidos');
        return response.pedidos || [];
    },

    /**
     * Obtiene todos los pedidos (admin)
     */
    async getAll() {
        const response = await API.get('/pedidos');
        return response.pedidos || [];
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OrderModel;
}
