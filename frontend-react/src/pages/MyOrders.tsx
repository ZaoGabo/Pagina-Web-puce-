import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ordersService from '../services/orders.service';
import type { Pedido } from '../types';
import './MyOrders.css';

export function MyOrders() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await ordersService.getMyOrders();
                setPedidos(data.pedidos);
            } catch (error) {
                console.error('[MyOrders] Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPedidos();
    }, []);

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    // Formatear fecha
    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('es-EC', {
            dateStyle: 'long',
            timeStyle: 'short',
        });
    };

    if (loading) {
        return (
            <div className="my-orders-page">
                <div className="my-orders-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando pedidos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="my-orders-container">
                <h1>Mis Pedidos</h1>

                {pedidos.length === 0 ? (
                    <div className="orders-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        <h3>No tienes pedidos</h3>
                        <p>Cuando realices una compra, aparecera aqui</p>
                        <Link to="/productos" className="btn-primary">
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <div className="orders-list">
                        {pedidos.map((pedido) => (
                            <article key={pedido.id} className="order-card">
                                <div className="order-header">
                                    <div className="order-id">
                                        <span className="label">Pedido</span>
                                        <span className="value">#{pedido.id}</span>
                                    </div>
                                    <div className="order-date">
                                        {formatDate(pedido.createdAt)}
                                    </div>
                                </div>

                                <div className="order-items">
                                    {pedido.detalles?.map((detalle, idx) => (
                                        <div key={idx} className="order-item">
                                            <div className="item-image">
                                                {detalle.producto?.imagen ? (
                                                    <img src={detalle.producto.imagen} alt="" />
                                                ) : (
                                                    <div className="item-placeholder">
                                                        {detalle.producto?.nombre?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="item-info">
                                                <span className="item-name">
                                                    {detalle.producto?.nombre || '[Producto eliminado]'}
                                                </span>
                                                <span className="item-qty">Cantidad: {detalle.cantidad}</span>
                                            </div>
                                            <span className="item-price">
                                                {formatPrice(detalle.precioUnitario * detalle.cantidad)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-footer">
                                    <div className="order-status">
                                        <span className="status-badge status-completed">Completado</span>
                                    </div>
                                    <div className="order-total">
                                        <span className="label">Total</span>
                                        <span className="value">{formatPrice(pedido.total)}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default MyOrders;
