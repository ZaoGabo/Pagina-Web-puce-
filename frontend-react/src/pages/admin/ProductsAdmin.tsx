import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import productsService from '../../services/products.service';
import type { Producto, ProductoFormData } from '../../types';
import toast from 'react-hot-toast';
import './Admin.css';

// Esquema de validacion para producto
const productSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido').max(100),
    descripcion: z.string().optional(),
    precio: z.number().min(0.01, 'El precio debe ser mayor a 0'),
    stock: z.number().int().min(0, 'El stock no puede ser negativo'),
    categoria: z.string().optional(),
    imagen: z.string().url('URL invalida').optional().or(z.literal('')),
});

export function ProductsAdmin() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductoFormData>({
        resolver: zodResolver(productSchema),
    });

    // Cargar productos
    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        try {
            setLoading(true);
            const data = await productsService.getAll();
            setProductos(data.productos);
        } catch (error) {
            console.error('[ProductsAdmin] Error:', error);
            toast.error('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    // Abrir modal para nuevo producto
    const handleAdd = () => {
        setEditingProduct(null);
        reset({
            nombre: '',
            descripcion: '',
            precio: 0,
            stock: 0,
            categoria: '',
            imagen: '',
        });
        setModalOpen(true);
    };

    // Abrir modal para editar
    const handleEdit = (producto: Producto) => {
        setEditingProduct(producto);
        reset({
            nombre: producto.nombre,
            descripcion: producto.descripcion || '',
            precio: producto.precio,
            stock: producto.stock,
            categoria: producto.categoria || '',
            imagen: producto.imagen || '',
        });
        setModalOpen(true);
    };

    // Eliminar producto
    const handleDelete = async (producto: Producto) => {
        if (!confirm(`Eliminar "${producto.nombre}"?`)) return;

        try {
            await productsService.delete(producto.id);
            setProductos(productos.filter(p => p.id !== producto.id));
            toast.success('Producto eliminado');
        } catch (error) {
            console.error('[ProductsAdmin] Error:', error);
            toast.error('Error al eliminar producto');
        }
    };

    // Guardar producto
    const onSubmit = async (data: ProductoFormData) => {
        try {
            setSaving(true);

            if (editingProduct) {
                // Actualizar
                const result = await productsService.update(editingProduct.id, data);
                setProductos(productos.map(p =>
                    p.id === editingProduct.id ? result.producto : p
                ));
                toast.success('Producto actualizado');
            } else {
                // Crear
                const result = await productsService.create(data);
                setProductos([result.producto, ...productos]);
                toast.success('Producto creado');
            }

            setModalOpen(false);
        } catch (error) {
            console.error('[ProductsAdmin] Error:', error);
            toast.error('Error al guardar producto');
        } finally {
            setSaving(false);
        }
    };

    // Formatear precio
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD',
        }).format(price);
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1>Gestion de Productos</h1>
                        <p>{productos.length} productos en el catalogo</p>
                    </div>
                </div>

                <div className="admin-toolbar">
                    <button className="btn-add" onClick={handleAdd}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Nuevo Producto
                    </button>
                </div>

                {loading && (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando productos...</p>
                    </div>
                )}

                {!loading && (
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Nombre</th>
                                    <th>Categoria</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>
                                            {producto.imagen ? (
                                                <img
                                                    src={producto.imagen}
                                                    alt={producto.nombre}
                                                    className="table-image"
                                                />
                                            ) : (
                                                <div className="table-image-placeholder">
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                                        <polyline points="21 15 16 10 5 21" />
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td>{producto.nombre}</td>
                                        <td>{producto.categoria || '-'}</td>
                                        <td className="table-price">{formatPrice(producto.precio)}</td>
                                        <td className={producto.stock <= 0 ? 'stock-out' : producto.stock <= 5 ? 'stock-low' : ''}>
                                            {producto.stock}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(producto)}
                                                    title="Editar"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(producto)}
                                                    title="Eliminar"
                                                >
                                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6" />
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {productos.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="table-empty">No hay productos</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Modal */}
                {modalOpen && (
                    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                                <button className="modal-close" onClick={() => setModalOpen(false)}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="modal-body">
                                    <div className="modal-form">
                                        <div className="form-group">
                                            <label>Nombre *</label>
                                            <input
                                                type="text"
                                                {...register('nombre')}
                                                placeholder="Nombre del producto"
                                            />
                                            {errors.nombre && <span className="error-message">{errors.nombre.message}</span>}
                                        </div>

                                        <div className="form-group">
                                            <label>Descripcion</label>
                                            <textarea
                                                {...register('descripcion')}
                                                placeholder="Descripcion del producto"
                                            />
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label>Precio *</label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    {...register('precio', { valueAsNumber: true })}
                                                    placeholder="0.00"
                                                />
                                                {errors.precio && <span className="error-message">{errors.precio.message}</span>}
                                            </div>
                                            <div className="form-group">
                                                <label>Stock *</label>
                                                <input
                                                    type="number"
                                                    {...register('stock', { valueAsNumber: true })}
                                                    placeholder="0"
                                                />
                                                {errors.stock && <span className="error-message">{errors.stock.message}</span>}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label>Categoria</label>
                                            <input
                                                type="text"
                                                {...register('categoria')}
                                                placeholder="Electronica, Ropa, etc."
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label>URL de Imagen</label>
                                            <input
                                                type="url"
                                                {...register('imagen')}
                                                placeholder="https://ejemplo.com/imagen.jpg"
                                            />
                                            {errors.imagen && <span className="error-message">{errors.imagen.message}</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn-save" disabled={saving}>
                                        {saving ? 'Guardando...' : 'Guardar'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsAdmin;
