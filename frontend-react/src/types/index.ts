// Interfaces y tipos para la aplicacion ZaoShop

// Usuario autenticado
export interface Usuario {
    id: number;
    email: string;
    role: 'admin' | 'user';
    createdAt?: string;
}

// Producto del catalogo
export interface Producto {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number;
    stock: number;
    imagen: string | null;
    categoria: string | null;
    createdAt?: string;
}

// Item en el carrito
export interface CartItem extends Producto {
    cantidad: number;
}

// Pedido
export interface Pedido {
    id: number;
    usuarioId: number;
    total: number;
    createdAt: string;
    detalles: PedidoDetalle[];
    usuario?: { email: string };
}

// Detalle de un pedido
export interface PedidoDetalle {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnitario: number;
    producto?: { nombre: string; imagen?: string };
}

// Respuesta de autenticacion
export interface AuthResponse {
    message: string;
    user: Usuario;
    token: string;
}

// Respuesta de listado de productos
export interface ProductosResponse {
    count: number;
    productos: Producto[];
}

// Respuesta de listado de pedidos
export interface PedidosResponse {
    count: number;
    pedidos: Pedido[];
}

// Datos para crear un pedido
export interface CreatePedidoData {
    items: { productoId: number; cantidad: number }[];
}

// Datos de login
export interface LoginData {
    email: string;
    password: string;
}

// Datos de registro
export interface RegisterData {
    email: string;
    password: string;
}

// Datos para crear/editar producto
export interface ProductoFormData {
    nombre: string;
    descripcion?: string;
    precio: number;
    stock: number;
    categoria?: string;
    imagen?: string;
}

// Error de API
export interface ApiError {
    error: string;
    message: string;
}
