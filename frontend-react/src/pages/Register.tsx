import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// Esquema de validacion con Zod (sanitizacion y validacion)
const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es requerido')
        .email('Email invalido')
        .transform((val) => val.trim().toLowerCase()), // Sanitizar
    password: z
        .string()
        .min(1, 'La contrasena es requerida')
        .min(8, 'La contrasena debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayuscula')
        .regex(/[a-z]/, 'Debe contener al menos una minuscula')
        .regex(/[0-9]/, 'Debe contener al menos un numero'),
    confirmPassword: z.string().min(1, 'Confirma tu contrasena'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contrasenas no coinciden',
    path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function Register() {
    const { register: registerUser, isLoading } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    });

    const password = watch('password', '');

    // Validar requisitos de contrasena en tiempo real
    const passwordRequirements = [
        { met: password.length >= 8, text: 'Al menos 8 caracteres' },
        { met: /[A-Z]/.test(password), text: 'Una letra mayuscula' },
        { met: /[a-z]/.test(password), text: 'Una letra minuscula' },
        { met: /[0-9]/.test(password), text: 'Un numero' },
    ];

    const onSubmit = async (data: RegisterFormData) => {
        const success = await registerUser({
            email: data.email,
            password: data.password,
        });
        if (success) {
            navigate('/');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                {/* Lado izquierdo - Decorativo */}
                <div className="auth-left auth-left-register">
                    <div className="auth-left-content">
                        <Link to="/" className="auth-logo">
                            <span className="logo-icon">Z</span>
                            <span className="logo-text">ZaoShop</span>
                        </Link>
                        <h1>Crea tu cuenta</h1>
                        <p>Unete a ZaoShop y accede a ofertas exclusivas, historial de pedidos y mas.</p>
                    </div>
                    <div className="auth-decoration">
                        <div className="auth-circle auth-circle-1"></div>
                        <div className="auth-circle auth-circle-2"></div>
                    </div>
                </div>

                {/* Lado derecho - Formulario */}
                <div className="auth-right">
                    <div className="auth-form-container">
                        <h2>Registrarse</h2>
                        <p className="auth-subtitle">
                            Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
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
                                        placeholder="Crea una contrasena segura"
                                        autoComplete="new-password"
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

                                {/* Requisitos de contrasena */}
                                <div className="password-requirements">
                                    {passwordRequirements.map((req, index) => (
                                        <span key={index} className={`requirement ${req.met ? 'met' : ''}`}>
                                            {req.met ? (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="12" cy="12" r="10" />
                                                </svg>
                                            )}
                                            {req.text}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirmar Contrasena</label>
                                <div className="input-wrapper">
                                    <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        placeholder="Repite tu contrasena"
                                        autoComplete="new-password"
                                        {...register('confirmPassword')}
                                        className={errors.confirmPassword ? 'input-error' : ''}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
                                    >
                                        {showConfirmPassword ? (
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
                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}
                            </div>

                            {/* Submit */}
                            <button type="submit" className="btn-submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        Creando cuenta...
                                    </>
                                ) : (
                                    'Crear Cuenta'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
