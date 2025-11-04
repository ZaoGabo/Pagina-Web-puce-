const statusEl = document.getElementById('status');

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    if (statusEl) {
        statusEl.textContent = message;
    } else {
        alert(message);
    }
}

function handleNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();

        if (!email) {
            showNotification('Ingresa un correo válido', 'warn');
            return;
        }

        console.log('Newsletter subscription:', email);
        showNotification('¡Gracias por suscribirte!');
        emailInput.value = '';
    });
}

function handleNavbarActions() {
    const searchBtn = document.getElementById('search-btn');
    const userBtn = document.getElementById('user-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('Abrir búsqueda');
            showNotification('La búsqueda estará disponible pronto.');
        });
    }

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            console.log('Abrir perfil de usuario');
            showNotification('La cuenta de usuario estará disponible pronto.');
        });
    }
}

function init() {
    console.log('Inicializando utilidades generales...');
    handleNewsletterForm();
    handleNavbarActions();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
