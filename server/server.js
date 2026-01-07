require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth.routes');
const productosRoutes = require('./routes/productos.routes');
const pedidosRoutes = require('./routes/pedidos.routes');

// Importar middleware de errores
const errorHandler = require('./middleware/error.middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuracion CORS segura
const corsOptions = {
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple para desarrollo
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path}`);
        next();
    });
}

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Ruta de estado/health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta 404 para endpoints no encontrados
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint no encontrado',
        path: req.originalUrl
    });
});

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
    console.log('');
    console.log('======================================');
    console.log('   ZaoShop API - Servidor iniciado');
    console.log('======================================');
    console.log(`Puerto: ${PORT}`);
    console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS: ${process.env.CORS_ORIGIN || 'http://localhost:8080'}`);
    console.log('');
    console.log('Endpoints disponibles:');
    console.log('  POST   /api/auth/register');
    console.log('  POST   /api/auth/login');
    console.log('  GET    /api/productos');
    console.log('  GET    /api/productos/:id');
    console.log('  POST   /api/productos (admin)');
    console.log('  PUT    /api/productos/:id (admin)');
    console.log('  DELETE /api/productos/:id (admin)');
    console.log('  POST   /api/pedidos (user/admin)');
    console.log('  GET    /api/pedidos/mis-pedidos (user/admin)');
    console.log('  GET    /api/pedidos (admin)');
    console.log('======================================');
});

module.exports = app;
