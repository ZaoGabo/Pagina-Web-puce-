import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { CartItem, Producto } from '../types';
import toast from 'react-hot-toast';

// Interfaz del contexto del carrito
interface CartContextType {
    items: CartItem[];
    itemCount: number;
    total: number;
    addItem: (producto: Producto, cantidad?: number) => void;
    removeItem: (productoId: number) => void;
    updateQuantity: (productoId: number, cantidad: number) => void;
    clearCart: () => void;
    isInCart: (productoId: number) => boolean;
    getItemQuantity: (productoId: number) => number;
}

// Crear contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Clave para localStorage
const CART_STORAGE_KEY = 'zaoshop_cart';

// Proveedor del contexto
export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        // Cargar carrito desde localStorage al iniciar
        try {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Sincronizar con localStorage cuando cambia el carrito
    useEffect(() => {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // Calcular cantidad total de items
    const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

    // Calcular total del carrito
    const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Agregar producto al carrito
    const addItem = useCallback((producto: Producto, cantidad: number = 1) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === producto.id);

            if (existingItem) {
                // Si ya existe, aumentar cantidad
                const newQuantity = existingItem.cantidad + cantidad;
                if (newQuantity > producto.stock) {
                    toast.error(`Solo hay ${producto.stock} unidades disponibles`);
                    return currentItems;
                }
                toast.success(`${producto.nombre} actualizado en el carrito`);
                return currentItems.map((item) =>
                    item.id === producto.id ? { ...item, cantidad: newQuantity } : item
                );
            }

            // Si no existe, agregar nuevo item
            if (cantidad > producto.stock) {
                toast.error(`Solo hay ${producto.stock} unidades disponibles`);
                return currentItems;
            }
            toast.success(`${producto.nombre} agregado al carrito`);
            return [...currentItems, { ...producto, cantidad }];
        });
    }, []);

    // Remover producto del carrito
    const removeItem = useCallback((productoId: number) => {
        setItems((currentItems) => {
            const item = currentItems.find((i) => i.id === productoId);
            if (item) {
                toast.success(`${item.nombre} eliminado del carrito`);
            }
            return currentItems.filter((i) => i.id !== productoId);
        });
    }, []);

    // Actualizar cantidad de un producto
    const updateQuantity = useCallback((productoId: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeItem(productoId);
            return;
        }

        setItems((currentItems) => {
            const item = currentItems.find((i) => i.id === productoId);
            if (item && cantidad > item.stock) {
                toast.error(`Solo hay ${item.stock} unidades disponibles`);
                return currentItems;
            }
            return currentItems.map((i) =>
                i.id === productoId ? { ...i, cantidad } : i
            );
        });
    }, [removeItem]);

    // Vaciar carrito
    const clearCart = useCallback(() => {
        setItems([]);
        toast.success('Carrito vaciado');
    }, []);

    // Verificar si un producto esta en el carrito
    const isInCart = useCallback(
        (productoId: number) => items.some((item) => item.id === productoId),
        [items]
    );

    // Obtener cantidad de un producto en el carrito
    const getItemQuantity = useCallback(
        (productoId: number) => {
            const item = items.find((i) => i.id === productoId);
            return item?.cantidad || 0;
        },
        [items]
    );

    const value: CartContextType = {
        items,
        itemCount,
        total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useCart(): CartContextType {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart debe usarse dentro de un CartProvider');
    }
    return context;
}

export default CartContext;
