const statusEl = document.getElementById('status');

const EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;
const PHONE_REGEX = /^(?:\+593|0)[2-9]\d{7,8}$/;
const MIN_MESSAGE_LENGTH = 20;

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    if (statusEl) {
        statusEl.textContent = message;
    }
}

function handleNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const emailInput = document.getElementById('newsletterEmail');
    const errorEl = document.getElementById('newsletterError');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!emailInput) return;

        const email = emailInput.value.trim();
        const isValid = EMAIL_REGEX.test(email);
        setFieldState(emailInput, errorEl, isValid, 'Ingresa un correo válido.');

        if (!isValid) {
            emailInput.focus();
            return;
        }

        showNotification('¡Gracias por suscribirte! Revisa tu bandeja de entrada.');
        emailInput.value = '';
        setFieldState(emailInput, errorEl, true);
    });
}

function handleContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const fields = {
        name: document.getElementById('contactName'),
        email: document.getElementById('contactEmail'),
        phone: document.getElementById('contactPhone'),
        message: document.getElementById('contactMessage'),
    };

    const errors = {
        name: document.getElementById('contactNameError'),
        email: document.getElementById('contactEmailError'),
        phone: document.getElementById('contactPhoneError'),
        message: document.getElementById('contactMessageError'),
    };

    const status = document.getElementById('contactStatus');

    function validateName() {
        const value = fields.name?.value.trim() ?? '';
        if (!value) {
            return setFieldState(fields.name, errors.name, false, 'Este campo es obligatorio.');
        }
        return setFieldState(fields.name, errors.name, NAME_REGEX.test(value), 'Ingresa al menos dos nombres válidos.');
    }

    function validateEmail() {
        const value = fields.email?.value.trim() ?? '';
        if (!value) {
            return setFieldState(fields.email, errors.email, false, 'Este campo es obligatorio.');
        }
        return setFieldState(fields.email, errors.email, EMAIL_REGEX.test(value), 'El formato del correo no es válido.');
    }

    function validatePhone() {
        const value = fields.phone?.value.trim() ?? '';
        if (!value) {
            return setFieldState(fields.phone, errors.phone, false, 'Este campo es obligatorio.');
        }
        return setFieldState(fields.phone, errors.phone, PHONE_REGEX.test(value), 'Usa un número ecuatoriano válido.');
    }

    function validateMessage() {
        const value = fields.message?.value.trim() ?? '';
        if (!value) {
            return setFieldState(fields.message, errors.message, false, 'Este campo es obligatorio.');
        }
        const isValid = value.length >= MIN_MESSAGE_LENGTH;
        return setFieldState(fields.message, errors.message, isValid, `El mensaje debe tener al menos ${MIN_MESSAGE_LENGTH} caracteres.`);
    }

    const validators = {
        name: validateName,
        email: validateEmail,
        phone: validatePhone,
        message: validateMessage,
    };

    Object.entries(fields).forEach(([key, field]) => {
        if (!field) return;
        field.addEventListener('input', () => validators[key]());
        field.addEventListener('blur', () => validators[key]());
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const results = Object.values(validators).map((validator) => validator());
        const isValid = results.every(Boolean);

        if (!isValid) {
            const firstInvalid = Object.values(fields).find((field) => field && field.getAttribute('aria-invalid') === 'true');
            if (firstInvalid) firstInvalid.focus();
            if (status) status.textContent = '';
            return;
        }

        if (status) {
            status.textContent = 'Mensaje enviado correctamente. Pronto te contactaremos.';
        }
        form.reset();
        Object.entries(fields).forEach(([key, field]) => {
            setFieldState(field, errors[key], true);
        });
    });
}

function handleNavbarActions() {
    const searchBtn = document.getElementById('search-btn');
    const userBtn = document.getElementById('user-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            showNotification('La búsqueda estará disponible pronto.', 'info');
        });
    }

    if (userBtn) {
        userBtn.addEventListener('click', () => {
            showNotification('La cuenta de usuario estará disponible pronto.', 'info');
        });
    }
}

function setupMenuToggle() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('primary-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.focus();
        }
    });
}

function updateLastVisitIndicator() {
    const output = document.getElementById('lastVisit');
    if (!output) return;
    const previous = sessionStorage.getItem('previousVisit');
    const value = previous || getCookie('lastVisit');
    if (!value) return;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return;

    output.textContent = date.toLocaleString('es-EC', { dateStyle: 'medium', timeStyle: 'short' });
    output.setAttribute('datetime', date.toISOString());
}

function getCookie(name) {
    return document.cookie.split('; ').reduce((acc, entry) => {
        const [key, val] = entry.split('=');
        if (key === name) {
            return decodeURIComponent(val);
        }
        return acc;
    }, '');
}

function setFieldState(field, errorEl, isValid, message = '') {
    if (!field) return isValid;
    field.setAttribute('aria-invalid', String(!isValid));
    if (errorEl) {
        if (isValid || !message) {
            errorEl.textContent = '';
            errorEl.hidden = true;
        } else {
            errorEl.textContent = message;
            errorEl.hidden = false;
        }
    }
    return isValid;
}

function init() {
    handleNewsletterForm();
    handleContactForm();
    handleNavbarActions();
    setupMenuToggle();
    updateLastVisitIndicator();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
