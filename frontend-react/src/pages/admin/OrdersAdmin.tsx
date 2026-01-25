import { useState, useEffect } from 'react';
import ordersService from '../../services/orders.service';
import type { Pedido } from '../../types';
import './Admin.css';

export function OrdersAdmin() {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await ordersService.getAll();
                setPedidos(data.pedidos);
            } catch (error) {
                console.error('[OrdersAdmin] Error:', error);
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
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>Gestion de Pedidos</h1>
                        <p>{pedidos.length} pedidos en total</p>
                    </div>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando pedidos...</p>
                    </div>
                )}

                {!loading && (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Productos</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>#{pedido.id}</td>
                                        <td>{pedido.usuario?.email || 'N/A'}</td>
                                        <td>{pedido.detalles?.length || 0} items</td>
                                        <td className="table-price">{formatPrice(pedido.total)}</td>
                                        <td>{formatDate(pedido.createdAt)}</td>
                                        <td>
                                            <button
                                                className="btn-edit"
                                                onClick={() => setSelectedOrder(pedido)}
                                                title="Ver detalles"
                                            >
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {pedidos.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="table-empty">No hay pedidos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal de detalles */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>Pedido #{selectedOrder.id}</h3>
                                <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="order-detail-info">
                                    <div className="order-detail-row">
                                        <span className="detail-label">Cliente:</span>
                                        <span>{selectedOrder.usuario?.email || 'N/A'}</span>
                                    </div>
                                    <div className="order-detail-row">
                                        <span className="detail-label">Fecha:</span>
                                        <span>{formatDate(selectedOrder.createdAt)}</span>
                                    </div>
                                </div>

                                <h4 style={{ color: 'white', margin: '1.5rem 0 1rem' }}>Productos</h4>
                                <div className="order-items-list">
                                    {selectedOrder.detalles?.map((detalle, idx) => (
                                        <div key={idx} className="order-detail-item">
                                            <span className="item-name">
                                                {detalle.producto?.nombre || '[Producto eliminado]'}
                                            </span>
                                            <span className="item-qty">x{detalle.cantidad}</span>
                                            <span className="item-price">
                                                {formatPrice(detalle.precioUnitario * detalle.cantidad)}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-detail-total">
                                    <span>Total:</span>
                                    <span className="total-price">{formatPrice(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
        .order-detail-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .order-detail-row {
          display: flex;
          justify-content: space-between;
          color: rgba(255, 255, 255, 0.8);
        }
        .detail-label {
          color: rgba(255, 255, 255, 0.5);
        }
        .order-items-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .order-detail-item {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }
        .order-detail-item .item-name {
          flex: 1;
          color: white;
        }
        .order-detail-item .item-qty {
          color: rgba(255, 255, 255, 0.5);
          margin-right: 1rem;
        }
        .order-detail-item .item-price {
          color: #2ecc71;
          font-weight: 600;
        }
        .order-detail-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          margin-top: 1rem;
          background: rgba(102, 126, 234, 0.1);
          border-radius: 8px;
          color: white;
          font-weight: 600;
        }
        .total-price {
          font-size: 1.25rem;
          color: #667eea;
        }
      `}</style>
        </div>
    );
}

export default OrdersAdmin;
