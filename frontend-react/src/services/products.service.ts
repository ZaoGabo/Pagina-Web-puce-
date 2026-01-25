import api from './api';
import type { Producto, ProductosResponse, ProductoFormData } from '../types';

// Servicio de productos - Capa Modelo
export const productsService = {
    // Obtener todos los productos (publico)
    async getAll(): Promise<ProductosResponse> {
        const response = await api.get<ProductosResponse>('/productos');
        return response.data;
    },

    // Obtener un producto por ID (publico)
    async getById(id: number): Promise<{ producto: Producto }> {
        const response = await api.get<{ producto: Producto }>(`/productos/${id}`);
        return response.data;
    },

    // Crear un nuevo producto (solo admin)
    async create(data: ProductoFormData): Promise<{ message: string; producto: Producto }> {
        const response = await api.post<{ message: string; producto: Producto }>('/productos', data);
        return response.data;
    },

    // Actualizar un producto (solo admin)
    async update(id: number, data: ProductoFormData): Promise<{ message: string; producto: Producto }> {
        const response = await api.put<{ message: string; producto: Producto }>(`/productos/${id}`, data);
        return response.data;
    },

    // Eliminar un producto (solo admin)
    async delete(id: number): Promise<{ message: string; id: number }> {
        const response = await api.delete<{ message: string; id: number }>(`/productos/${id}`);
        return response.data;
    },

    // Obtener productos por categoria
    async getByCategory(categoria: string): Promise<ProductosResponse> {
        const response = await api.get<ProductosResponse>('/productos');
        const productos = response.data.productos.filter(p => p.categoria === categoria);
        return { count: productos.length, productos };
    },

    // Buscar productos por nombre
    async search(query: string): Promise<ProductosResponse> {
        const response = await api.get<ProductosResponse>('/productos');
        const productos = response.data.productos.filter(p =>
            p.nombre.toLowerCase().includes(query.toLowerCase()) ||
            p.descripcion?.toLowerCase().includes(query.toLowerCase())
        );
        return { count: productos.length, productos };
    },
};

export default productsService;
