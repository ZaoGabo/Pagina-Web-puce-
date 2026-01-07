/**
 * Product Controller - Logica de productos en el frontend
 */
const ProductController = {
    products: [],
    selectedCategory: 'Todas',

    // Elementos del DOM
    elements: {
        grid: null,
        categorySelect: null,
        statusEl: null,
        detailDialog: null,
        detailElements: {}
    },

    /**
     * Inicializa el controlador
     */
    async init() {
        this.cacheElements();
        this.bindEvents();
        await this.loadProducts();
    },

    /**
     * Cachea los elementos del DOM
     */
    cacheElements() {
        this.elements.grid = document.getElementById('grid');
        this.elements.categorySelect = document.getElementById('category');
        this.elements.statusEl = document.getElementById('status');
        this.elements.detailDialog = document.getElementById('detailDialog');

        if (this.elements.detailDialog) {
            this.elements.detailElements = {
                title: document.getElementById('dlgTitle'),
                desc: document.getElementById('dlgDesc'),
                price: document.getElementById('dlgPrice'),
                stock: document.getElementById('dlgStock'),
                img: document.getElementById('imgMain'),
                buyBtn: document.getElementById('buyBtn'),
                closeBtn: document.getElementById('dlgClose')
            };
        }
    },

    /**
     * Vincula los eventos
     */
    bindEvents() {
        // Filtro de categoria
        if (this.elements.categorySelect) {
            this.elements.categorySelect.addEventListener('change', (e) => {
                this.selectedCategory = e.target.value;
                this.renderProducts();
            });
        }

        // Clicks en la grilla
        if (this.elements.grid) {
            this.elements.grid.addEventListener('click', (e) => {
                const detailBtn = e.target.closest('.js-detail');
                const addBtn = e.target.closest('.js-add-cart');

                if (detailBtn) {
                    this.openDetail(parseInt(detailBtn.dataset.id));
                }

                if (addBtn && !addBtn.disabled) {
                    this.addToCart(parseInt(addBtn.dataset.id));
                }
            });
        }

        // Modal de detalle
        const { closeBtn, buyBtn } = this.elements.detailElements;

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeDetail());
        }

        if (this.elements.detailDialog) {
            this.elements.detailDialog.addEventListener('cancel', (e) => {
                e.preventDefault();
                this.closeDetail();
            });
        }
    },

    /**
     * Carga los productos desde la API
     */
    async loadProducts() {
        ProductView.showStatus('Cargando productos...', this.elements.statusEl);

        try {
            this.products = await ProductModel.getAll();
            ProductView.renderCategoryOptions(this.products, this.elements.categorySelect);
            this.renderProducts();
            ProductView.showStatus(`${this.products.length} productos cargados`, this.elements.statusEl);
        } catch (error) {
            ProductView.showStatus('Error al cargar productos. Intenta de nuevo.', this.elements.statusEl);
            console.error('Error cargando productos:', error);
        }
    },

    /**
     * Renderiza los productos filtrados
     */
    renderProducts() {
        let filtered = this.products;

        if (this.selectedCategory !== 'Todas') {
            filtered = this.products.filter(p => p.categoria === this.selectedCategory);
        }

        ProductView.renderGrid(filtered, this.elements.grid);
        ProductView.showStatus(
            `Mostrando ${filtered.length} producto(s) de "${this.selectedCategory}"`,
            this.elements.statusEl
        );
    },

    /**
     * Abre el modal de detalle
     */
    openDetail(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || !this.elements.detailDialog) return;

        ProductView.renderDetail(product, this.elements.detailElements);

        // Configurar boton de compra
        const { buyBtn } = this.elements.detailElements;
        if (buyBtn) {
            buyBtn.onclick = () => {
                this.addToCart(productId);
                this.closeDetail();
            };
        }

        this.elements.detailDialog.showModal();
    },

    /**
     * Cierra el modal de detalle
     */
    closeDetail() {
        if (this.elements.detailDialog) {
            this.elements.detailDialog.close();
        }
    },

    /**
     * Agrega un producto al carrito
     */
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        CartModel.add(product);
        ProductView.showStatus(`"${product.nombre}" agregado al carrito`, this.elements.statusEl);
    },

    /**
     * Obtiene un producto por ID
     */
    getProduct(productId) {
        return this.products.find(p => p.id === productId);
    }
};

// Exportar para uso como modulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductController;
}
