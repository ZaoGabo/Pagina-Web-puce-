/**
 * Auth Controller - Logica de autenticacion en el frontend
 */
const AuthController = {
    elements: {
        loginForm: null,
        registerForm: null,
        errorEl: null,
        submitBtn: null
    },

    /**
     * Inicializa el controlador para la pagina de login
     */
    initLogin() {
        this.elements.loginForm = document.getElementById('login-form');
        this.elements.errorEl = document.getElementById('login-error');
        this.elements.submitBtn = this.elements.loginForm?.querySelector('button[type="submit"]');

        if (this.elements.loginForm) {
            this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Si ya esta autenticado, redirigir
        if (AuthModel.isAuthenticated()) {
            AuthView.redirectToHome();
        }
    },

    /**
     * Inicializa el controlador para la pagina de registro
     */
    initRegister() {
        this.elements.registerForm = document.getElementById('register-form');
        this.elements.errorEl = document.getElementById('register-error');
        this.elements.submitBtn = this.elements.registerForm?.querySelector('button[type="submit"]');

        if (this.elements.registerForm) {
            this.elements.registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Si ya esta autenticado, redirigir
        if (AuthModel.isAuthenticated()) {
            AuthView.redirectToHome();
        }
    },

    /**
     * Inicializa los elementos de auth en paginas generales
     */
    initGlobal() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Actualizar UI segun estado de auth
        this.updateGlobalUI();

        // Escuchar eventos de auth
        window.addEventListener('auth:logout', () => this.updateGlobalUI());
        window.addEventListener('auth:expired', () => {
            alert('Tu sesion ha expirado. Por favor, inicia sesion nuevamente.');
            AuthView.redirectToLogin();
        });
    },

    /**
     * Maneja el submit del formulario de login
     */
    async handleLogin(e) {
        e.preventDefault();

        const email = this.elements.loginForm.querySelector('[name="email"]').value.trim();
        const password = this.elements.loginForm.querySelector('[name="password"]').value;

        // Validaciones basicas
        AuthView.hideError(this.elements.errorEl);

        if (!AuthView.isValidEmail(email)) {
            AuthView.showError('Ingresa un email valido', this.elements.errorEl);
            return;
        }

        if (!password) {
            AuthView.showError('Ingresa tu clave', this.elements.errorEl);
            return;
        }

        try {
            AuthView.setLoading(this.elements.submitBtn, true, 'Iniciar sesion');
            await AuthModel.login(email, password);
            AuthView.redirectToHome();

        } catch (error) {
            AuthView.showError(error.message || 'Credenciales incorrectas', this.elements.errorEl);
        } finally {
            AuthView.setLoading(this.elements.submitBtn, false);
        }
    },

    /**
     * Maneja el submit del formulario de registro
     */
    async handleRegister(e) {
        e.preventDefault();

        const email = this.elements.registerForm.querySelector('[name="email"]').value.trim();
        const password = this.elements.registerForm.querySelector('[name="password"]').value;
        const confirmPassword = this.elements.registerForm.querySelector('[name="confirmPassword"]').value;

        // Validaciones
        AuthView.hideError(this.elements.errorEl);

        if (!AuthView.isValidEmail(email)) {
            AuthView.showError('Ingresa un email valido', this.elements.errorEl);
            return;
        }

        if (!AuthView.isValidPassword(password)) {
            AuthView.showError(AuthView.getPasswordRequirements(), this.elements.errorEl);
            return;
        }

        if (password !== confirmPassword) {
            AuthView.showError('Las claves no coinciden', this.elements.errorEl);
            return;
        }

        try {
            AuthView.setLoading(this.elements.submitBtn, true, 'Crear cuenta');
            await AuthModel.register(email, password);
            AuthView.redirectToHome();

        } catch (error) {
            AuthView.showError(error.message || 'Error al crear la cuenta', this.elements.errorEl);
        } finally {
            AuthView.setLoading(this.elements.submitBtn, false);
        }
    },

    /**
     * Maneja el logout
     */
    handleLogout() {
        AuthModel.logout();
        AuthView.redirectToHome();
    },

    /**
     * Actualiza la UI global segun el estado de autenticacion
     */
    updateGlobalUI() {
        const isAuth = AuthModel.isAuthenticated();
        const user = AuthModel.getUser();
        AuthView.updateAuthUI(isAuth, user);
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthController;
}
