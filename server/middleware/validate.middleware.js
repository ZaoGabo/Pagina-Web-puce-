const { body, param, validationResult } = require('express-validator');

/**
 * Middleware para procesar resultados de validacion
 */
function handleValidation(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Datos invalidos',
            details: errors.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
}

/**
 * Validaciones para registro de usuario
 */
const validateRegister = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('El email no es valido')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('La contraseña debe tener al menos 6 caracteres')
        .matches(/[A-Z]/)
        .withMessage('La contraseña debe contener al menos una mayuscula')
        .matches(/[0-9]/)
        .withMessage('La contraseña debe contener al menos un numero'),
    handleValidation
];

/**
 * Validaciones para login
 */
const validateLogin = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('El email no es valido')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es obligatoria'),
    handleValidation
];

/**
 * Validaciones para crear/actualizar producto
 */
const validateProducto = [
    body('nombre')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ max: 200 })
        .withMessage('El nombre no puede superar 200 caracteres')
        .escape(),
    body('descripcion')
        .optional()
        .trim()
        .isLength({ max: 1000 })
        .withMessage('La descripcion no puede superar 1000 caracteres')
        .escape(),
    body('precio')
        .isFloat({ min: 0.01 })
        .withMessage('El precio debe ser mayor a 0'),
    body('stock')
        .isInt({ min: 0 })
        .withMessage('El stock debe ser un numero entero positivo'),
    body('categoria')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('La categoria no puede superar 100 caracteres')
        .escape(),
    body('imagen')
        .optional()
        .trim()
        .isURL()
        .withMessage('La imagen debe ser una URL valida'),
    handleValidation
];

/**
 * Validacion de ID en parametros
 */
const validateId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('El ID debe ser un numero entero positivo'),
    handleValidation
];

/**
 * Validaciones para crear pedido
 */
const validatePedido = [
    body('items')
        .isArray({ min: 1 })
        .withMessage('El pedido debe contener al menos un producto'),
    body('items.*.productoId')
        .isInt({ min: 1 })
        .withMessage('ID de producto invalido'),
    body('items.*.cantidad')
        .isInt({ min: 1 })
        .withMessage('La cantidad debe ser al menos 1'),
    handleValidation
];

module.exports = {
    handleValidation,
    validateRegister,
    validateLogin,
    validateProducto,
    validateId,
    validatePedido
};
