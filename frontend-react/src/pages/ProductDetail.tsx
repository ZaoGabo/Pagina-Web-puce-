import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import productsService from '../services/products.service';
import { useCart } from '../context/CartContext';
import type { Producto } from '../types';
import toast from 'react-hot-toast';
import './ProductDetail.css';

export function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();

    useEffect(() => {
        const fetchProducto = async () => {
            if (!id) return;

            try {
                const data = await productsService.getById(parseInt(id));
                setProducto(data.producto);
            } catch (error) {
                console.error('[ProductDetail] Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducto();
    }, [id]);

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    const handleAddToCart = () => {
        if (!producto) return;

        addItem({
            id: producto.id,
            nombre: producto.nombre,
            descripcion: producto.descripcion ?? null,
            precio: producto.precio,
            imagen: producto.imagen ?? null,
            categoria: producto.categoria ?? null,
            stock: producto.stock,
        }, quantity);

        toast.success(`${producto.nombre} agregado al carrito`);
    };

    if (loading) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando producto...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="product-detail-page">
                <div className="product-detail-container">
                    <div className="product-not-found">
                        <h2>Producto no encontrado</h2>
                        <p>El producto que buscas no existe o fue eliminado</p>
                        <Link to="/productos" className="btn-primary">
                            Ver todos los productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-detail-page">
            <div className="product-detail-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Inicio</Link>
                    <span>/</span>
                    <Link to="/productos">Productos</Link>
                    <span>/</span>
                    <span>{producto.nombre}</span>
                </nav>

                <div className="product-detail-content">
                    {/* Imagen */}
                    <div className="product-image-section">
                        {producto.imagen ? (
                            <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                className="product-main-image"
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
                    </div>

                    {/* Info */}
                    <div className="product-info-section">
                        {producto.categoria && (
                            <span className="product-category">{producto.categoria}</span>
                        )}

                        <h1 className="product-title">{producto.nombre}</h1>

                        <p className="product-price">{formatPrice(producto.precio)}</p>

                        {producto.descripcion && (
                            <div className="product-description">
                                <h3>Descripcion</h3>
                                <p>{producto.descripcion}</p>
                            </div>
                        )}

                        <div className="product-stock">
                            {producto.stock > 0 ? (
                                <span className="in-stock">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    {producto.stock} en stock
                                </span>
                            ) : (
                                <span className="out-of-stock">Agotado</span>
                            )}
                        </div>

                        {producto.stock > 0 && (
                            <div className="product-actions">
                                <div className="quantity-selector">
                                    <button
                                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                        disabled={quantity <= 1}
                                    >
                                        -
                                    </button>
                                    <span>{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(q => Math.min(producto.stock, q + 1))}
                                        disabled={quantity >= producto.stock}
                                    >
                                        +
                                    </button>
                                </div>

                                <button className="btn-add-cart" onClick={handleAddToCart}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="9" cy="21" r="1" />
                                        <circle cx="20" cy="21" r="1" />
                                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                    </svg>
                                    Agregar al Carrito
                                </button>
                            </div>
                        )}

                        <div className="product-meta">
                            <div className="meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="1" y="3" width="15" height="13" />
                                    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                    <circle cx="5.5" cy="18.5" r="2.5" />
                                    <circle cx="18.5" cy="18.5" r="2.5" />
                                </svg>
                                <span>Envio gratis</span>
                            </div>
                            <div className="meta-item">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>Garantia incluida</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
