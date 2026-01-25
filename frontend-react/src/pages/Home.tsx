import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/products/ProductCard';
import productsService from '../services/products.service';
import type { Producto } from '../types';
import './Home.css';

export function Home() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productsService.getAll();
                setProductos(data.productos.slice(0, 8)); // Solo mostrar 8 productos destacados
            } catch (err) {
                setError('Error al cargar los productos');
                console.error('[Home] Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Bienvenido a <span className="hero-brand">ZaoShop</span>
                    </h1>
                    <p className="hero-subtitle">
                        Tu tienda de tecnologia de confianza. Encuentra los mejores productos
                        con precios increibles y envio rapido.
                    </p>
                    <div className="hero-actions">
                        <Link to="/productos" className="btn-primary">
                            Ver Catalogo
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </Link>
                        <Link to="/register" className="btn-secondary">
                            Crear Cuenta
                        </Link>
                    </div>
                </div>
                <div className="hero-decoration">
                    <div className="hero-circle hero-circle-1"></div>
                    <div className="hero-circle hero-circle-2"></div>
                    <div className="hero-circle hero-circle-3"></div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features">
                <div className="features-container">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="1" y="3" width="15" height="13" />
                                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                                <circle cx="5.5" cy="18.5" r="2.5" />
                                <circle cx="18.5" cy="18.5" r="2.5" />
                            </svg>
                        </div>
                        <h3>Envio Rapido</h3>
                        <p>Entrega en 24-48 horas a nivel nacional</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            </svg>
                        </div>
                        <h3>Pago Seguro</h3>
                        <p>Tus transacciones protegidas al 100%</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <h3>Soporte 24/7</h3>
                        <p>Estamos aqui para ayudarte siempre</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="20 12 20 22 4 22 4 12" />
                                <rect x="2" y="7" width="20" height="5" />
                                <line x1="12" y1="22" x2="12" y2="7" />
                                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                            </svg>
                        </div>
                        <h3>Garantia</h3>
                        <p>30 dias de garantia en todos los productos</p>
                    </div>
                </div>
            </section>

            {/* Productos Destacados */}
            <section className="featured-products">
                <div className="section-header">
                    <h2 className="section-title">Productos Destacados</h2>
                    <Link to="/productos" className="section-link">
                        Ver todos
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <polyline points="12 5 19 12 12 19" />
                        </svg>
                    </Link>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                )}

                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Reintentar</button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="products-grid">
                        {productos.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}

                {!loading && !error && productos.length === 0 && (
                    <div className="empty-container">
                        <p>No hay productos disponibles en este momento.</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2>Listo para empezar?</h2>
                    <p>Crea tu cuenta gratis y accede a ofertas exclusivas</p>
                    <Link to="/register" className="btn-primary btn-large">
                        Registrate Ahora
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
