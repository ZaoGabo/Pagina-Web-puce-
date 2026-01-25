import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import productsService from '../../services/products.service';
import ordersService from '../../services/orders.service';
import type { Producto, Pedido } from '../../types';
import './Admin.css';

export function Dashboard() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodData, ordData] = await Promise.all([
                    productsService.getAll(),
                    ordersService.getAll(),
                ]);
                setProductos(prodData.productos);
                setPedidos(ordData.pedidos);
            } catch (error) {
                console.error('[Dashboard] Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Estadisticas
    const totalProductos = productos.length;
    const totalPedidos = pedidos.length;
    const totalVentas = pedidos.reduce((sum, p) => sum + p.total, 0);
    const productosAgotados = productos.filter(p => p.stock <= 0).length;

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando dashboard...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <div>
                        <h1>Panel de Administracion</h1>
                        <p>Bienvenido al dashboard de ZaoShop</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon stat-icon-products">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{totalProductos}</span>
                            <span className="stat-label">Productos</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon-orders">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{totalPedidos}</span>
                            <span className="stat-label">Pedidos</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon-sales">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{formatPrice(totalVentas)}</span>
                            <span className="stat-label">Ventas Totales</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon stat-icon-alert">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                <line x1="12" y1="9" x2="12" y2="13" />
                                <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{productosAgotados}</span>
                            <span className="stat-label">Sin Stock</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="admin-section">
                    <h2>Acciones Rapidas</h2>
                    <div className="quick-actions">
                        <Link to="/admin/productos" className="action-card">
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </div>
                            <span>Gestionar Productos</span>
                        </Link>
                        <Link to="/admin/pedidos" className="action-card">
                            <div className="action-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                </svg>
                            </div>
                            <span>Ver Pedidos</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="admin-section">
                    <div className="section-header">
                        <h2>Ultimos Pedidos</h2>
                        <Link to="/admin/pedidos" className="section-link">Ver todos</Link>
                    </div>

                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Total</th>
                                    <th>Fecha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.slice(0, 5).map((pedido) => (
                                    <tr key={pedido.id}>
                                        <td>#{pedido.id}</td>
                                        <td>{pedido.usuario?.email || 'N/A'}</td>
                                        <td className="table-price">{formatPrice(pedido.total)}</td>
                                        <td>{new Date(pedido.createdAt).toLocaleDateString('es-EC')}</td>
                                    </tr>
                                ))}
                                {pedidos.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="table-empty">No hay pedidos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
