/**
 * Admin Controller - Logica del panel de administracion
 */
const AdminController = {
    products: [],
    orders: [],
    editingProductId: null,

    elements: {
        productTable: null,
        orderTable: null,
        productForm: null,
        messageContainer: null,
        tabBtns: [],
        tabPanels: []
    },

    /**
     * Inicializa el controlador
     */
    async init() {
        // Verificar que el usuario es admin
        if (!AuthModel.isAuthenticated()) {
            AuthView.redirectToLogin();
            return;
        }

        if (!AuthModel.isAdmin()) {
            alert('No tienes permisos de administrador');
            AuthView.redirectToHome();
            return;
        }

        this.cacheElements();
        this.bindEvents();
        await this.loadData();
    },

    /**
     * Cachea los elementos del DOM
     */
    cacheElements() {
        this.elements.productTable = document.getElementById('product-table');
        this.elements.orderTable = document.getElementById('order-table');
        this.elements.productForm = document.getElementById('product-form');
        this.elements.messageContainer = document.getElementById('admin-message');
        this.elements.tabBtns = document.querySelectorAll('.tab-btn');
        this.elements.tabPanels = document.querySelectorAll('.tab-panel');
    },

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Tabs
        this.elements.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Formulario de producto
        if (this.elements.productForm) {
            this.elements.productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));

            const cancelBtn = this.elements.productForm.querySelector('.js-cancel');
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.cancelEdit());
            }
        }

        // Clicks en tabla de productos
        if (this.elements.productTable) {
            this.elements.productTable.addEventListener('click', (e) => {
                const editBtn = e.target.closest('.js-edit');
                const deleteBtn = e.target.closest('.js-delete');

                if (editBtn) {
                    this.editProduct(parseInt(editBtn.dataset.id));
                }

                if (deleteBtn) {
                    this.deleteProduct(parseInt(deleteBtn.dataset.id));
                }
            });
        }
    },

    /**
     * Carga los datos iniciales
     */
    async loadData() {
        try {
            await Promise.all([
                this.loadProducts(),
                this.loadOrders()
            ]);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    },

    /**
     * Carga los productos
     */
    async loadProducts() {
        try {
            this.products = await ProductModel.getAll();
            AdminView.renderProductTable(this.products, this.elements.productTable);
        } catch (error) {
            AdminView.showMessage('Error al cargar productos', 'error', this.elements.messageContainer);
        }
    },

    /**
     * Carga los pedidos
     */
    async loadOrders() {
        try {
            this.orders = await OrderModel.getAll();
            AdminView.renderOrderTable(this.orders, this.elements.orderTable);
        } catch (error) {
            AdminView.showMessage('Error al cargar pedidos', 'error', this.elements.messageContainer);
        }
    },

    /**
     * Cambia de tab
     */
    switchTab(tabId) {
        this.elements.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
            btn.setAttribute('aria-selected', btn.dataset.tab === tabId);
        });

        this.elements.tabPanels.forEach(panel => {
            panel.hidden = panel.id !== tabId;
        });
    },

    /**
     * Maneja el submit del formulario de producto
     */
    async handleProductSubmit(e) {
        e.preventDefault();

        const data = AdminView.getProductFormData(this.elements.productForm);
        if (!data) return;

        // Validaciones mejoradas
        if (!data.nombre || !data.precio) {
            AdminView.showMessage('Nombre y precio son obligatorios', 'error', this.elements.messageContainer);
            return;
        }

        // Validar precio sea un número válido y positivo
        if (isNaN(data.precio) || data.precio <= 0) {
            AdminView.showMessage('El precio debe ser mayor a $0.00', 'error', this.elements.messageContainer);
            return;
        }

        // Validar stock sea un número válido y no negativo
        if (isNaN(data.stock) || data.stock < 0) {
            AdminView.showMessage('El stock no puede ser negativo', 'error', this.elements.messageContainer);
            return;
        }

        // Validar que el stock sea un número entero
        if (!Number.isInteger(data.stock)) {
            AdminView.showMessage('El stock debe ser un número entero (sin decimales)', 'error', this.elements.messageContainer);
            return;
        }

        try {
            if (this.editingProductId) {
                // Actualizar
                await ProductModel.update(this.editingProductId, data);
                AdminView.showMessage('Producto actualizado', 'success', this.elements.messageContainer);
            } else {
                // Crear
                await ProductModel.create(data);
                AdminView.showMessage('Producto creado', 'success', this.elements.messageContainer);
            }

            this.cancelEdit();
            await this.loadProducts();

        } catch (error) {
            AdminView.showMessage(error.message || 'Error al guardar producto', 'error', this.elements.messageContainer);
        }
    },

    /**
     * Prepara el formulario para editar un producto
     */
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        this.editingProductId = productId;
        AdminView.fillProductForm(product, this.elements.productForm);

        // Cambiar texto del boton
        const submitBtn = this.elements.productForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Actualizar producto';
        }

        // Scroll al formulario
        this.elements.productForm.scrollIntoView({ behavior: 'smooth' });
    },

    /**
     * Cancela la edicion
     */
    cancelEdit() {
        this.editingProductId = null;
        AdminView.clearProductForm(this.elements.productForm);

        const submitBtn = this.elements.productForm?.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.textContent = 'Crear producto';
        }
    },

    /**
     * Elimina un producto
     */
    async deleteProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const confirmed = confirm(`Deseas eliminar "${product.nombre}"?`);
        if (!confirmed) return;

        try {
            await ProductModel.delete(productId);
            AdminView.showMessage('Producto eliminado', 'success', this.elements.messageContainer);
            await this.loadProducts();

        } catch (error) {
            AdminView.showMessage(error.message || 'Error al eliminar producto', 'error', this.elements.messageContainer);
        }
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminController;
}
