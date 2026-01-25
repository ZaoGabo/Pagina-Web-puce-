const express = require('express');
const router = express.Router();

const productosController = require('../controllers/productos.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { validateProducto, validateId } = require('../middleware/validate.middleware');

/**
 * GET /api/productos
 * Lista todos los productos (publico)
 */
router.get('/', productosController.getAll);

/**
 * GET /api/productos/:id
 * Obtiene un producto por ID (publico)
 */
router.get('/:id', validateId, productosController.getById);

/**
 * POST /api/productos
 * Crea un nuevo producto (solo admin)
 * Headers: Authorization: Bearer <token>
 * Body: { nombre, descripcion?, precio, stock, categoria?, imagen? }
 */
router.post('/',
    verifyToken,
    requireRole('admin'),
    validateProducto,
    productosController.create
);

/**
 * PUT /api/productos/:id
 * Actualiza un producto (solo admin)
 * Headers: Authorization: Bearer <token>
 * Body: { nombre, descripcion?, precio, stock, categoria?, imagen? }
 */
router.put('/:id',
    verifyToken,
    requireRole('admin'),
    validateId,
    validateProducto,
    productosController.update
);

/**
 * DELETE /api/productos/:id
 * Elimina un producto (solo admin)
 * Headers: Authorization: Bearer <token>
 */
router.delete('/:id',
    verifyToken,
    requireRole('admin'),
    validateId,
    productosController.remove
);

module.exports = router;
