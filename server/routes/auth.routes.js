const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin } = require('../middleware/validate.middleware');

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 * Body: { email, password }
 */
router.post('/register', validateRegister, authController.register);

/**
 * POST /api/auth/login
 * Inicia sesion y devuelve token JWT
 * Body: { email, password }
 */
router.post('/login', validateLogin, authController.login);

/**
 * GET /api/auth/me
 * Obtiene informacion del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get('/me', verifyToken, authController.me);

module.exports = router;
