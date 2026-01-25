import { useState, useEffect } from 'react';
import { ProductCard } from '../components/products/ProductCard';
import productsService from '../services/products.service';
import type { Producto } from '../types';
import './Products.css';

export function Products() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('newest');

    // Obtener categorias unicas
    const categories = [...new Set(productos.map(p => p.categoria).filter(Boolean))] as string[];

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await productsService.getAll();
                setProductos(data.productos);
                setFilteredProductos(data.productos);
            } catch (err) {
                setError('Error al cargar los productos');
                console.error('[Products] Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductos();
    }, []);

    // Filtrar y ordenar productos
    useEffect(() => {
        let result = [...productos];

        // Filtrar por busqueda
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                p =>
                    p.nombre.toLowerCase().includes(query) ||
                    p.descripcion?.toLowerCase().includes(query)
            );
        }

        // Filtrar por categoria
        if (selectedCategory) {
            result = result.filter(p => p.categoria === selectedCategory);
        }

        // Ordenar
        switch (sortBy) {
            case 'price-asc':
                result.sort((a, b) => a.precio - b.precio);
                break;
            case 'price-desc':
                result.sort((a, b) => b.precio - a.precio);
                break;
            case 'name':
                result.sort((a, b) => a.nombre.localeCompare(b.nombre));
                break;
            case 'newest':
            default:
                // Ya viene ordenado por fecha desde el backend
                break;
        }

        setFilteredProductos(result);
    }, [productos, searchQuery, selectedCategory, sortBy]);

    return (
        <div className="products-page">
            <div className="products-container">
                {/* Header */}
                <div className="products-header">
                    <div className="products-header-left">
                        <h1>Catalogo de Productos</h1>
                        <p>{filteredProductos.length} productos encontrados</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="products-filters">
                    {/* Busqueda */}
                    <div className="search-box">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Categoria */}
                    <div className="filter-select">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Todas las categorias</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ordenar */}
                    <div className="filter-select">
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="newest">Mas recientes</option>
                            <option value="price-asc">Precio: Menor a Mayor</option>
                            <option value="price-desc">Precio: Mayor a Menor</option>
                            <option value="name">Nombre A-Z</option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="error-container">
                        <p>{error}</p>
                        <button onClick={() => window.location.reload()}>Reintentar</button>
                    </div>
                )}

                {/* Grid de productos */}
                {!loading && !error && (
                    <div className="products-grid">
                        {filteredProductos.map((producto) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                )}

                {/* Sin resultados */}
                {!loading && !error && filteredProductos.length === 0 && (
                    <div className="empty-container">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <h3>No se encontraron productos</h3>
                        <p>Intenta con otros filtros o terminos de busqueda</p>
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedCategory('');
                            }}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
