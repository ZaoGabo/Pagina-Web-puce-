/**
 * API Client - Modulo para comunicacion con el backend
 * Maneja tokens JWT automaticamente
 */
const API = {
    baseURL: 'http://localhost:3000/api',

    /**
     * Obtiene el token almacenado
     */
    getToken() {
        return localStorage.getItem('authToken');
    },

    /**
     * Guarda el token
     */
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    /**
     * Elimina el token
     */
    removeToken() {
        localStorage.removeItem('authToken');
    },

    /**
     * Obtiene los headers con autorizacion
     */
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = this.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    },

    /**
     * Realiza una peticion HTTP
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: this.getHeaders(options.auth !== false)
        };

        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                // Manejar errores de autenticacion
                if (response.status === 401) {
                    this.removeToken();
                    window.dispatchEvent(new CustomEvent('auth:expired'));
                }

                throw {
                    status: response.status,
                    ...data
                };
            }

            return data;

        } catch (error) {
            if (error.status) {
                throw error;
            }
            throw {
                status: 0,
                error: 'Error de red',
                message: 'No se pudo conectar con el servidor'
            };
        }
    },

    // Metodos HTTP
    get(endpoint, auth = true) {
        return this.request(endpoint, { method: 'GET', auth });
    },

    post(endpoint, body, auth = true) {
        return this.request(endpoint, { method: 'POST', body, auth });
    },

    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body });
    },

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
