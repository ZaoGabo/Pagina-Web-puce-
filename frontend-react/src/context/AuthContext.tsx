import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Usuario, LoginData, RegisterData } from '../types';
import authService from '../services/auth.service';
import toast from 'react-hot-toast';

// Interfaz del contexto de autenticacion
interface AuthContextType {
    user: Usuario | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (data: LoginData) => Promise<boolean>;
    register: (data: RegisterData) => Promise<boolean>;
    logout: () => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Verificar sesion al cargar la app
    useEffect(() => {
        const initAuth = async () => {
            const storedUser = authService.getStoredUser();
            const token = authService.getStoredToken();

            if (storedUser && token) {
                try {
                    // Verificar que el token sigue siendo valido
                    const { user: freshUser } = await authService.getMe();
                    setUser(freshUser);
                } catch {
                    // Token invalido, limpiar sesion
                    authService.logout();
                    setUser(null);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    // Funcion de login
    const login = useCallback(async (data: LoginData): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await authService.login(data);
            authService.saveAuth(response.token, response.user);
            setUser(response.user);
            toast.success('Bienvenido a ZaoShop');
            return true;
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al iniciar sesion';
            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Funcion de registro
    const register = useCallback(async (data: RegisterData): Promise<boolean> => {
        try {
            setIsLoading(true);
            const response = await authService.register(data);
            authService.saveAuth(response.token, response.user);
            setUser(response.user);
            toast.success('Cuenta creada exitosamente');
            return true;
        } catch (error: unknown) {
            const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error al registrarse';
            toast.error(message);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Funcion de logout
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        toast.success('Sesion cerrada');
    }, []);

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook personalizado para usar el contexto
export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
}

export default AuthContext;
