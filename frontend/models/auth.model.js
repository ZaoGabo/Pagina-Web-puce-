/**
 * Auth Model - Manejo del estado de autenticacion
 */
const AuthModel = {
    USER_KEY: 'authUser',

    /**
     * Registra un nuevo usuario
     */
    async register(email, password) {
        const response = await API.post('/auth/register', { email, password }, false);
        this.saveSession(response);
        return response;
    },

    /**
     * Inicia sesion
     */
    async login(email, password) {
        const response = await API.post('/auth/login', { email, password }, false);
        this.saveSession(response);
        return response;
    },

    /**
     * Cierra sesion
     */
    logout() {
        API.removeToken();
        localStorage.removeItem(this.USER_KEY);
        window.dispatchEvent(new CustomEvent('auth:logout'));
    },

    /**
     * Guarda la sesion del usuario
     */
    saveSession(response) {
        if (response.token) {
            API.setToken(response.token);
        }
        if (response.user) {
            localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
        }
    },

    /**
     * Verifica si hay sesion activa
     */
    isAuthenticated() {
        return !!API.getToken();
    },

    /**
     * Obtiene el usuario actual
     */
    getUser() {
        const userData = localStorage.getItem(this.USER_KEY);
        if (!userData) return null;
        try {
            return JSON.parse(userData);
        } catch {
            return null;
        }
    },

    /**
     * Obtiene el rol del usuario
     */
    getRole() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    /**
     * Verifica si el usuario es admin
     */
    isAdmin() {
        return this.getRole() === 'admin';
    },

    /**
     * Obtiene informacion actualizada del usuario
     */
    async fetchCurrentUser() {
        if (!this.isAuthenticated()) return null;
        try {
            const response = await API.get('/auth/me');
            if (response.user) {
                localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
            }
            return response.user;
        } catch {
            return null;
        }
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthModel;
}
