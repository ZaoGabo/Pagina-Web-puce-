const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * POST /api/auth/register
 * Registra un nuevo usuario
 */
async function register(req, res, next) {
    try {
        const { email, password } = req.body;

        // Verificar si el email ya existe
        const existingUser = await prisma.usuario.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Email en uso',
                message: 'Ya existe una cuenta con este email'
            });
        }

        // Hash de la contraseña (salt rounds = 10)
        const passwordHash = await bcrypt.hash(password, 10);

        // Crear usuario
        const user = await prisma.usuario.create({
            data: {
                email,
                passwordHash,
                role: 'user'
            }
        });

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        next(error);
    }
}

/**
 * POST /api/auth/login
 * Inicia sesion y devuelve token JWT
 */
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const user = await prisma.usuario.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Credenciales invalidas',
                message: 'Email o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales invalidas',
                message: 'Email o contraseña incorrectos'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Inicio de sesion exitoso',
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        next(error);
    }
}

/**
 * GET /api/auth/me
 * Obtiene informacion del usuario autenticado
 */
async function me(req, res, next) {
    try {
        const user = await prisma.usuario.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario ya no existe'
            });
        }

        res.json({ user });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    me
};
