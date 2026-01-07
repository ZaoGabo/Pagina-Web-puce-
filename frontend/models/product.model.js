/**
 * Product Model - Manejo de productos via API
 */
const ProductModel = {
    /**
     * Obtiene todos los productos
     */
    async getAll() {
        const response = await API.get('/productos', false);
        return response.productos || [];
    },

    /**
     * Obtiene un producto por ID
     */
    async getById(id) {
        const response = await API.get(`/productos/${id}`, false);
        return response.producto;
    },

    /**
     * Crea un nuevo producto (admin)
     */
    async create(producto) {
        const response = await API.post('/productos', producto);
        return response.producto;
    },

    /**
     * Actualiza un producto (admin)
     */
    async update(id, producto) {
        const response = await API.put(`/productos/${id}`, producto);
        return response.producto;
    },

    /**
     * Elimina un producto (admin)
     */
    async delete(id) {
        return await API.delete(`/productos/${id}`);
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductModel;
}
