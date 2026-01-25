import axios from 'axios';

// URL base de la API - usa variable de entorno o localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de Axios configurada
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

// Interceptor para agregar JWT automaticamente a cada request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar errores de respuesta globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Token expirado o invalido
        if (error.response?.status === 401) {
            // Solo limpiar token si no estamos en la pagina de login
            const isLoginPage = window.location.pathname === '/login';
            if (!isLoginPage) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
