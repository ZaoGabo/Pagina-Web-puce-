import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Esquema de validacion con Zod (sanitizacion y validacion)
const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es requerido')
        .email('Email invalido')
        .transform((val) => val.trim().toLowerCase()), // Sanitizar
    password: z
        .string()
        .min(1, 'La contrasena es requerida')
        .min(6, 'La contrasena debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function Login() {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showPassword, setShowPassword] = useState(false);

    // Obtener la ruta de origen para redirigir despues del login
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        const success = await login(data);
        if (success) {
            navigate(from, { replace: true });
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Lado izquierdo - Decorativo */}
                <div className="auth-left">
                    <div className="auth-left-content">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">Z</span>
                            <span className="logo-text">ZaoShop</span>
                        </Link>
                        <h1>Bienvenido de vuelta</h1>
                        <p>Inicia sesion para acceder a tu cuenta y continuar comprando.</p>
                    </div>
                    <div className="auth-decoration">
                        <div className="auth-circle auth-circle-1"></div>
                        <div className="auth-circle auth-circle-2"></div>
                    </div>
                </div>

                {/* Lado derecho - Formulario */}
                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2>Iniciar Sesion</h2>
                        <p className="auth-subtitle">
                            No tienes cuenta? <Link to="/register">Registrate aqui</Link>
                        </p>

                        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
                            {/* Email */}
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="tu@email.com"
                                        autoComplete="email"
                                        {...register('email')}
                                        className={errors.email ? 'input-error' : ''}
                                    />
                                </div>
                                {errors.email && <span className="error-message">{errors.email.message}</span>}
                            </div>

                            {/* Password */}
                            <div className="form-group">
                                <label htmlFor="password">Contrasena</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        placeholder="Tu contrasena"
                                        autoComplete="current-password"
                                        {...register('password')}
                                        className={errors.password ? 'input-error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && <span className="error-message">{errors.password.message}</span>}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Iniciando sesion...
                                    </>
                                ) : (
                                    'Iniciar Sesion'
                                )}
                            </button>
                        </form>

                        {/* Credenciales de prueba */}
                        <div className="test-credentials">
                            <h4>Credenciales de prueba:</h4>
                            <p><strong>Admin:</strong> admin@zaoshop.com / Admin123!</p>
                            <p><strong>Usuario:</strong> user@zaoshop.com / User123!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
