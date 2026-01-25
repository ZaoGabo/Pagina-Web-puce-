const express = require('express');
const router = express.Router();

const pedidosController = require('../controllers/pedidos.controller');
const { verifyToken, requireRole } = require('../middleware/auth.middleware');
const { validatePedido } = require('../middleware/validate.middleware');

/**
 * POST /api/pedidos
 * Crea un nuevo pedido (requiere autenticacion)
 * Headers: Authorization: Bearer <token>
 * Body: { items: [{ productoId, cantidad }] }
 */
router.post('/',
    verifyToken,
    validatePedido,
    pedidosController.create
);

/**
 * GET /api/pedidos/mis-pedidos
 * Obtiene los pedidos del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get('/mis-pedidos',
    verifyToken,
    pedidosController.getMine
);

/**
 * GET /api/pedidos
 * Obtiene todos los pedidos (solo admin)
 * Headers: Authorization: Bearer <token>
 */
router.get('/',
    verifyToken,
    requireRole('admin'),
    pedidosController.getAll
);

module.exports = router;
