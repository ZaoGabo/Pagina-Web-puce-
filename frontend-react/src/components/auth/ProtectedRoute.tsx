import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'admin' | 'user';
}

/**
 * Componente de ruta protegida
 * Redirige a login si el usuario no esta autenticado
 * Redirige a inicio si el usuario no tiene el rol requerido
 */
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
    const location = useLocation();

    // Mostrar loading mientras se verifica la autenticacion
    if (isLoading) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner"></div>
                <p>Verificando sesion...</p>
            </div>
        );
    }

    // Si no esta autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Si se requiere rol de admin y el usuario no es admin
    if (requiredRole === 'admin' && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    // Si se requiere rol espesifico y no coincide
    if (requiredRole && user?.role !== requiredRole && requiredRole !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
