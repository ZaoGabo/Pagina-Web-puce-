import type { Producto } from '../../types';
import { useCart } from '../../context/CartContext';
import { Link } from 'react-router-dom';
import './ProductCard.css';

interface ProductCardProps {
    producto: Producto;
}

export function ProductCard({ producto }: ProductCardProps) {
    const { addItem, isInCart, getItemQuantity } = useCart();
    const inCart = isInCart(producto.id);
    const quantity = getItemQuantity(producto.id);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(producto);
    };

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <article className="product-card">
            <Link to={`/productos/${producto.id}`} className="product-link">
                {/* Imagen */}
                <div className="product-image-container">
                    {producto.imagen ? (
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="product-image"
                            loading="lazy"
                        />
                    ) : (
                        <div className="product-image-placeholder">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                    )}
                    {producto.stock <= 0 && (
                        <div className="product-badge product-badge-soldout">Agotado</div>
                    )}
                    {producto.stock > 0 && producto.stock <= 5 && (
                        <div className="product-badge product-badge-low">Ultimas {producto.stock}</div>
                    )}
                    {producto.categoria && (
                        <span className="product-category">{producto.categoria}</span>
                    )}
                </div>

                {/* Info */}
                <div className="product-info">
                    <h3 className="product-name">{producto.nombre}</h3>
                    {producto.descripcion && (
                        <p className="product-description">{producto.descripcion}</p>
                    )}
                    <div className="product-footer">
                        <span className="product-price">{formatPrice(producto.precio)}</span>
                        <button
                            className={`product-add-btn ${inCart ? 'in-cart' : ''}`}
                            onClick={handleAddToCart}
                            disabled={producto.stock <= 0}
                            aria-label={inCart ? `En carrito (${quantity})` : 'Agregar al carrito'}
                        >
                            {inCart ? (
                                <>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    <span>{quantity}</span>
                                </>
                            ) : (
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </Link>
        </article>
    );
}

export default ProductCard;
