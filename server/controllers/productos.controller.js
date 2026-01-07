const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * GET /api/productos
 * Lista todos los productos (publico)
 */
async function getAll(req, res, next) {
    try {
        const productos = await prisma.producto.findMany({
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            count: productos.length,
            productos
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/productos/:id
 * Obtiene un producto por ID (publico)
 */
async function getById(req, res, next) {
    try {
        const { id } = req.params;

        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });

        if (!producto) {
            return res.status(404).json({
                error: 'No encontrado',
                message: 'El producto no existe'
            });
        }

        res.json({ producto });

    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/productos
 * Crea un nuevo producto (solo admin)
 */
async function create(req, res, next) {
    try {
        const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

        const producto = await prisma.producto.create({
            data: {
                nombre,
                descripcion: descripcion || null,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria: categoria || null,
                imagen: imagen || null
            }
        });

        res.status(201).json({
            message: 'Producto creado exitosamente',
            producto
        });

    } catch (error) {
        next(error);
    }
}

/**
 * PUT /api/productos/:id
 * Actualiza un producto (solo admin)
 */
async function update(req, res, next) {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, stock, categoria, imagen } = req.body;

        // Verificar que existe
        const existing = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existing) {
            return res.status(404).json({
                error: 'No encontrado',
                message: 'El producto no existe'
            });
        }

        const producto = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: {
                nombre,
                descripcion: descripcion || null,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                categoria: categoria || null,
                imagen: imagen || null
            }
        });

        res.json({
            message: 'Producto actualizado exitosamente',
            producto
        });

    } catch (error) {
        next(error);
    }
}

/**
 * DELETE /api/productos/:id
 * Elimina un producto (solo admin)
 */
async function remove(req, res, next) {
    try {
        const { id } = req.params;

        // Verificar que existe
        const existing = await prisma.producto.findUnique({
            where: { id: parseInt(id) }
        });

        if (!existing) {
            return res.status(404).json({
                error: 'No encontrado',
                message: 'El producto no existe'
            });
        }

        await prisma.producto.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            message: 'Producto eliminado exitosamente',
            id: parseInt(id)
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    getById,
    create,
    update,
    remove
};
