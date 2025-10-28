// Estado de la aplicación (preparado para migrar a Redux/Context)

const appState = {
    cart: [],
    wishlist: [],
    products: [],
    user: null
};


// Simulación de datos de productos
const mockProducts = [
    {
        id: 1,
        name: 'Smartphone XR Pro',
        description: 'Último modelo con cámara de 48MP',
        price: 599.99,
        image: 'https://via.placeholder.com/300/3b82f6/ffffff?text=Smartphone',
        category: 'Electrónica'
    },
    {
        id: 2,
        name: 'Laptop Gaming Ultra',
        description: 'Procesador i7, 16GB RAM, RTX 3060',
        price: 1299.99,
        image: 'https://via.placeholder.com/300/6366f1/ffffff?text=Laptop',
        category: 'Electrónica'
    },
    {
        id: 3,
        name: 'Auriculares Bluetooth',
        description: 'Cancelación de ruido activa',
        price: 149.99,
        image: 'https://via.placeholder.com/300/8b5cf6/ffffff?text=Auriculares',
        category: 'Electrónica'
    },
    {
        id: 4,
        name: 'Camiseta Premium',
        description: '100% algodón orgánico',
        price: 29.99,
        image: 'https://via.placeholder.com/300/10b981/ffffff?text=Camiseta',
        category: 'Ropa'
    },
    {
        id: 5,
        name: 'Zapatillas Deportivas',
        description: 'Máxima comodidad y estilo',
        price: 89.99,
        image: 'https://via.placeholder.com/300/f59e0b/ffffff?text=Zapatillas',
        category: 'Ropa'
    },
    {
        id: 6,
        name: 'Lámpara LED Inteligente',
        description: 'Control por voz y app',
        price: 45.99,
        image: 'https://via.placeholder.com/300/ef4444/ffffff?text=Lampara',
        category: 'Hogar'
    }
];

// ========================================
// Funciones de utilidad (preparadas para convertir en hooks)
// ========================================

/**
 * Formatea el precio a moneda local
 */
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

/**
 * Muestra notificaciones (toast)
 */
function showNotification(message, type = 'success') {
    // Implementación básica - se puede mejorar con una librería de toast
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}

// ========================================
// Funciones del carrito
// ========================================

/**
 * Agrega un producto al carrito
 */
function addToCart(product) {
    const existingItem = appState.cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        appState.cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    showNotification(`${product.name} agregado al carrito`);
}

/**
 * Elimina un producto del carrito
 */
function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Producto eliminado del carrito');
}

/**
 * Actualiza la UI del carrito
 */
function updateCartUI() {
    const cartBadge = document.querySelector('#cart-btn .badge');
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartBadge) {
        cartBadge.textContent = totalItems;
    }
}

/**
 * Calcula el total del carrito
 */
function getCartTotal() {
    return appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// ========================================
// Funciones de productos
// ========================================

/**
 * Renderiza un producto en el DOM
 */
function renderProduct(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="btn-wishlist" aria-label="Agregar a favoritos" data-action="wishlist">
                    ♡
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="btn btn-secondary" data-action="add-to-cart">
                        Agregar
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Carga y muestra los productos
 */
function loadProducts() {
    const container = document.getElementById('products-container');
    
    if (!container) return;
    
    // Simula una llamada a API - se reemplazará con fetch/axios
    appState.products = mockProducts;
    
    // Renderiza productos
    container.innerHTML = appState.products.map(product => renderProduct(product)).join('');
    
    // Agrega event listeners a los botones de productos
    attachProductEventListeners();
}

/**
 * Adjunta event listeners a los botones de productos
 */
function attachProductEventListeners() {
    const addToCartButtons = document.querySelectorAll('[data-action="add-to-cart"]');
    const wishlistButtons = document.querySelectorAll('[data-action="wishlist"]');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const product = appState.products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
            }
        });
    });
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productId = parseInt(productCard.dataset.productId);
            const product = appState.products.find(p => p.id === productId);
            
            if (product) {
                toggleWishlist(product);
                button.classList.toggle('active');
            }
        });
    });
}

/**
 * Alterna un producto en la lista de deseos
 */
function toggleWishlist(product) {
    const index = appState.wishlist.findIndex(item => item.id === product.id);
    
    if (index !== -1) {
        appState.wishlist.splice(index, 1);
        showNotification('Eliminado de favoritos');
    } else {
        appState.wishlist.push(product);
        showNotification('Agregado a favoritos');
    }
}

// ========================================
// Event Listeners principales
// ========================================

/**
 * Maneja el formulario de newsletter
 */
function handleNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        // Simula envío - se reemplazará con llamada a API
        console.log('Newsletter subscription:', email);
        showNotification('¡Gracias por suscribirte!');
        emailInput.value = '';
    });
}

/**
 * Maneja los botones del navbar
 */
function handleNavbarActions() {
    const searchBtn = document.getElementById('search-btn');
    const cartBtn = document.getElementById('cart-btn');
    const userBtn = document.getElementById('user-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            console.log('Abrir búsqueda');
            // Implementar modal de búsqueda
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            console.log('Abrir carrito');
            console.log('Carrito actual:', appState.cart);
            console.log('Total:', formatPrice(getCartTotal()));
            // Implementar modal/sidebar de carrito
        });
    }
    
    if (userBtn) {
        userBtn.addEventListener('click', () => {
            console.log('Abrir perfil de usuario');
            // Implementar modal de login/registro
        });
    }
}

// ========================================
// Inicialización de la aplicación
// ========================================

/**
 * Función principal de inicialización
 */
function init() {
    console.log('Inicializando E-commerce...');
    
    // Cargar productos
    loadProducts();
    
    // Configurar event listeners
    handleNewsletterForm();
    handleNavbarActions();
    
    // Inicializar UI del carrito
    updateCartUI();
    
    console.log('E-commerce inicializado correctamente');
}

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Exportar funciones para uso futuro con módulos ES6
// export { addToCart, removeFromCart, loadProducts, appState };
