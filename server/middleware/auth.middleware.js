const jwt = require('jsonwebtoken');

/**
 * Middleware para verificar token JWT
 * Extrae el token del header Authorization: Bearer <token>
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: 'Acceso denegado',
            message: 'No se proporciono token de autenticacion'
        });
    }

    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            error: 'Token invalido',
            message: 'Formato de token incorrecto. Use: Bearer <token>'
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado',
                message: 'El token ha expirado. Inicie sesion nuevamente'
            });
        }
        return res.status(401).json({
            error: 'Token invalido',
            message: 'El token no es valido'
        });
    }
}

/**
 * Middleware factory para verificar roles
 * @param {...string} roles - Roles permitidos (ej: 'admin', 'user')
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                error: 'No autenticado',
                message: 'Debe iniciar sesion primero'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                error: 'Acceso prohibido',
                message: `Se requiere rol: ${roles.join(' o ')}`
            });
        }

        next();
    };
}

/**
 * Middleware opcional: verifica token si existe, pero no falla si no hay
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return next();
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return next();
    }

    try {
        const decoded = jwt.verify(parts[1], process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Token invalido, pero continuamos sin usuario
    }

    next();
}

module.exports = {
    verifyToken,
    requireRole,
    optionalAuth
};
