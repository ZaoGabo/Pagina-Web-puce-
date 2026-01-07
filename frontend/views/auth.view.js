/**
 * Auth View - Renderizado de formularios de autenticacion
 */
const AuthView = {
    /**
     * Muestra un error en el formulario
     */
    showError(message, errorElement) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.hidden = false;
            errorElement.classList.add('visible');
        }
    },

    /**
     * Oculta el error
     */
    hideError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.hidden = true;
            errorElement.classList.remove('visible');
        }
    },

    /**
     * Muestra estado de carga en un boton
     */
    setLoading(button, isLoading, originalText = 'Enviar') {
        if (!button) return;

        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            button.textContent = 'Cargando...';
        } else {
            button.disabled = false;
            button.textContent = button.dataset.originalText || originalText;
        }
    },

    /**
     * Actualiza la UI segun el estado de autenticacion
     */
    updateAuthUI(isAuthenticated, user) {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userInfo = document.getElementById('user-info');
        const adminLink = document.getElementById('admin-link');
        const myOrdersBtn = document.getElementById('my-orders-btn');

        if (loginBtn) loginBtn.hidden = isAuthenticated;
        if (logoutBtn) logoutBtn.hidden = !isAuthenticated;

        // Mostrar boton de pedidos solo si esta autenticado
        if (myOrdersBtn) myOrdersBtn.hidden = !isAuthenticated;

        if (userInfo && user) {
            userInfo.textContent = user.email;
            userInfo.hidden = !isAuthenticated;
        }

        if (adminLink) {
            adminLink.hidden = !user || user.role !== 'admin';
        }
    },

    /**
     * Redirige a la pagina de login
     */
    redirectToLogin() {
        window.location.href = 'login.html';
    },

    /**
     * Redirige a la pagina principal
     */
    redirectToHome() {
        window.location.href = 'index.html';
    },

    /**
     * Valida el formato del email
     */
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    /**
     * Valida la contrasenya
     */
    isValidPassword(password) {
        return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password);
    },

    /**
     * Renderiza mensaje de error de validacion
     */
    getPasswordRequirements() {
        return 'Minimo 6 caracteres, una mayuscula y un numero';
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthView;
}
