const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * POST /api/pedidos
 * Crea un nuevo pedido con sus detalles (requiere autenticacion)
 */
async function create(req, res, next) {
    try {
        const { items } = req.body;
        const usuarioId = req.user.id;

        // Validar que los productos existen y tienen stock
        const productIds = items.map(item => item.productoId);
        const productos = await prisma.producto.findMany({
            where: { id: { in: productIds } }
        });

        if (productos.length !== productIds.length) {
            return res.status(400).json({
                error: 'Productos invalidos',
                message: 'Uno o mas productos no existen'
            });
        }

        // Crear mapa de productos para acceso rapido
        const productoMap = new Map(productos.map(p => [p.id, p]));

        // Verificar stock y calcular total
        let total = 0;
        const detalles = [];

        for (const item of items) {
            const producto = productoMap.get(item.productoId);

            if (producto.stock < item.cantidad) {
                return res.status(400).json({
                    error: 'Stock insuficiente',
                    message: `No hay suficiente stock de "${producto.nombre}". Disponible: ${producto.stock}`
                });
            }

            const precioUnitario = producto.precio;
            total += precioUnitario * item.cantidad;

            detalles.push({
                productoId: item.productoId,
                cantidad: item.cantidad,
                precioUnitario
            });
        }

        // Crear pedido con transaccion (atomico)
        const pedido = await prisma.$transaction(async (tx) => {
            // Crear pedido
            const newPedido = await tx.pedido.create({
                data: {
                    usuarioId,
                    total,
                    detalles: {
                        create: detalles
                    }
                },
                include: {
                    detalles: {
                        include: {
                            producto: {
                                select: { nombre: true }
                            }
                        }
                    }
                }
            });

            // Actualizar stock de productos
            for (const item of items) {
                await tx.producto.update({
                    where: { id: item.productoId },
                    data: {
                        stock: {
                            decrement: item.cantidad
                        }
                    }
                });
            }

            return newPedido;
        });

        res.status(201).json({
            message: 'Pedido creado exitosamente',
            pedido: {
                id: pedido.id,
                total: pedido.total,
                createdAt: pedido.createdAt,
                detalles: pedido.detalles.map(d => ({
                    producto: d.producto.nombre,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario,
                    subtotal: d.cantidad * d.precioUnitario
                }))
            }
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/pedidos/mis-pedidos
 * Obtiene los pedidos del usuario autenticado
 */
async function getMine(req, res, next) {
    try {
        const usuarioId = req.user.id;

        const pedidos = await prisma.pedido.findMany({
            where: { usuarioId },
            orderBy: { createdAt: 'desc' },
            include: {
                detalles: {
                    include: {
                        producto: {
                            select: { nombre: true, imagen: true }
                        }
                    }
                }
            }
        });

        res.json({
            count: pedidos.length,
            pedidos: pedidos.map(p => ({
                id: p.id,
                total: p.total,
                createdAt: p.createdAt,
                detalles: p.detalles.map(d => ({
                    producto: d.producto ? d.producto.nombre : '[Producto eliminado]',
                    imagen: d.producto ? d.producto.imagen : null,
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario
                }))
            }))
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/pedidos
 * Obtiene todos los pedidos (solo admin)
 */
async function getAll(req, res, next) {
    try {
        const pedidos = await prisma.pedido.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                usuario: {
                    select: { email: true }
                },
                detalles: {
                    include: {
                        producto: {
                            select: { nombre: true }
                        }
                    }
                }
            }
        });

        res.json({
            count: pedidos.length,
            pedidos: pedidos.map(p => ({
                id: p.id,
                usuario: p.usuario.email,
                total: p.total,
                createdAt: p.createdAt,
                detalles: p.detalles.map(d => ({
                    producto: d.producto ? d.producto.nombre : '[Producto eliminado]',
                    cantidad: d.cantidad,
                    precioUnitario: d.precioUnitario
                }))
            }))
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    getMine,
    getAll
};
