import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

export function Cart() {
    const { items, total, removeItem, updateQuantity, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: '/checkout' } } });
        } else {
            navigate('/checkout');
        }
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-container">
                    <div className="cart-empty">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Tu carrito esta vacio</h2>
                        <p>Agrega productos para comenzar tu compra</p>
                        <Link to="/productos" className="btn-primary">
                            Ver Productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Carrito de Compras</h1>
                    <button className="btn-clear" onClick={clearCart}>
                        Vaciar carrito
                    </button>
                </div>

                <div className="cart-content">
                    {/* Lista de items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <article key={item.id} className="cart-item">
                                <div className="item-image">
                                    {item.imagen ? (
                                        <img src={item.imagen} alt={item.nombre} />
                                    ) : (
                                        <div className="item-image-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <div className="item-details">
                                    <h3 className="item-name">{item.nombre}</h3>
                                    {item.categoria && (
                                        <span className="item-category">{item.categoria}</span>
                                    )}
                                    <span className="item-price">{formatPrice(item.precio)}</span>
                                </div>

                                <div className="item-quantity">
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                    <span className="qty-value">{item.cantidad}</span>
                                    <button
                                        className="qty-btn"
                                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                        disabled={item.cantidad >= item.stock}
                                    >
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="item-subtotal">
                                    {formatPrice(item.precio * item.cantidad)}
                                </div>

                                <button
                                    className="item-remove"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Eliminar producto"
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                    </svg>
                                </button>
                            </article>
                        ))}
                    </div>

                    {/* Resumen */}
                    <aside className="cart-summary">
                        <h2>Resumen del Pedido</h2>

                        <div className="summary-row">
                            <span>Subtotal ({items.length} productos)</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Envio</span>
                            <span className="free">Gratis</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Total</span>
                            <span>{formatPrice(total)}</span>
                        </div>

                        <button className="btn-checkout" onClick={handleCheckout}>
                            {isAuthenticated ? 'Proceder al Pago' : 'Iniciar sesion para comprar'}
                        </button>

                        <Link to="/productos" className="btn-continue">
                            Continuar comprando
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
}

export default Cart;
