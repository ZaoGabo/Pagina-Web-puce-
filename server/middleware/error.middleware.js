/**
 * Middleware centralizado para manejo de errores
 * No expone stack traces en produccion
 */
function errorHandler(err, req, res, next) {
    // Log del error en servidor
    console.error('Error:', err.message);
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    // Determinar codigo de estado
    const statusCode = err.statusCode || err.status || 500;

    // Respuesta al cliente
    const response = {
        error: err.name || 'Error',
        message: err.message || 'Ha ocurrido un error interno'
    };

    // Solo incluir detalles en desarrollo
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    // Errores especificos de Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflicto',
            message: 'Ya existe un registro con estos datos'
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'No encontrado',
            message: 'El registro solicitado no existe'
        });
    }

    // Errores de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON invalido',
            message: 'El cuerpo de la peticion no es JSON valido'
        });
    }

    res.status(statusCode).json(response);
}

module.exports = errorHandler;
