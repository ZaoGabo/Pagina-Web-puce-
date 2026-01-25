import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ordersService from '../services/orders.service';
import toast from 'react-hot-toast';
import './Checkout.css';

export function Checkout() {
    const { items, total, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (items.length === 0) {
            toast.error('Tu carrito esta vacio');
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                items: items.map(item => ({
                    productoId: item.id,
                    cantidad: item.cantidad,
                })),
            };

            await ordersService.create(orderData);

            clearCart();
            toast.success('Pedido realizado con exito!');
            navigate('/mis-pedidos');
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al procesar el pedido';
            toast.error(message);
            console.error('[Checkout] Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-container">
                    <div className="checkout-empty">
                        <h2>No hay productos en tu carrito</h2>
                        <p>Agrega productos antes de proceder al checkout</p>
                        <Link to="/productos" className="btn-primary">
                            Ver Productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1>Finalizar Compra</h1>

                <div className="checkout-content">
                    {/* Resumen del pedido */}
                    <div className="checkout-order">
                        <h2>Tu Pedido</h2>

                        <div className="order-items">
                            {items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <div className="order-item-image">
                                        {item.imagen ? (
                                            <img src={item.imagen} alt={item.nombre} />
                                        ) : (
                                            <div className="order-item-placeholder">
                                                <span>{item.nombre.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-item-details">
                                        <h4>{item.nombre}</h4>
                                        <span className="order-item-qty">Cantidad: {item.cantidad}</span>
                                    </div>
                                    <span className="order-item-price">
                                        {formatPrice(item.precio * item.cantidad)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="order-summary">
                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Envio</span>
                                <span className="free">Gratis</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row summary-total">
                                <span>Total a Pagar</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de checkout */}
                    <div className="checkout-form-container">
                        <h2>Informacion de Envio</h2>

                        <form onSubmit={handleSubmit} className="checkout-form">
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="input-disabled"
                                />
                                <span className="input-hint">Usaremos este email para confirmacion</span>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Nombre</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        placeholder="Tu nombre"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Apellido</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        placeholder="Tu apellido"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="address">Direccion</label>
                                <input
                                    type="text"
                                    id="address"
                                    placeholder="Calle, numero, etc."
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="city">Ciudad</label>
                                    <input
                                        type="text"
                                        id="city"
                                        placeholder="Tu ciudad"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Telefono</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        placeholder="09X XXX XXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="checkout-actions">
                                <Link to="/carrito" className="btn-back">
                                    Volver al carrito
                                </Link>
                                <button type="submit" className="btn-submit" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className="btn-spinner"></span>
                                            Procesando...
                                        </>
                                    ) : (
                                        `Confirmar Pedido - ${formatPrice(total)}`
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
