import api from './api';
import type { PedidosResponse, CreatePedidoData, Pedido } from '../types';

// Servicio de pedidos - Capa Modelo
export const ordersService = {
    // Crear un nuevo pedido (requiere autenticacion)
    async create(data: CreatePedidoData): Promise<{ message: string; pedido: Pedido }> {
        const response = await api.post<{ message: string; pedido: Pedido }>('/pedidos', data);
        return response.data;
    },

    // Obtener mis pedidos (usuario autenticado)
    async getMyOrders(): Promise<PedidosResponse> {
        const response = await api.get<PedidosResponse>('/pedidos/mis-pedidos');
        return response.data;
    },

    // Obtener todos los pedidos (solo admin)
    async getAll(): Promise<PedidosResponse> {
        const response = await api.get<PedidosResponse>('/pedidos');
        return response.data;
    },
};

export default ordersService;
