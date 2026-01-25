import api from './api';
import type { AuthResponse, LoginData, RegisterData, Usuario } from '../types';

// Servicio de autenticacion - Capa Modelo
export const authService = {
    // Iniciar sesion
    async login(data: LoginData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    // Registrar nuevo usuario
    async register(data: RegisterData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        return response.data;
    },

    // Obtener informacion del usuario actual
    async getMe(): Promise<{ user: Usuario }> {
        const response = await api.get<{ user: Usuario }>('/auth/me');
        return response.data;
    },

    // Guardar token y usuario en localStorage
    saveAuth(token: string, user: Usuario): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    },

    // Obtener usuario guardado
    getStoredUser(): Usuario | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr) as Usuario;
            } catch {
                return null;
            }
        }
        return null;
    },

    // Obtener token guardado
    getStoredToken(): string | null {
        return localStorage.getItem('token');
    },

    // Cerrar sesion
    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Verificar si hay sesion activa
    isAuthenticated(): boolean {
        return !!this.getStoredToken();
    },
};

export default authService;
