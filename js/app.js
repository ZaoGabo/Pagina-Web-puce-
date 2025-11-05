import { Storage } from "./storage.js";
import { openDB, saveProducts, readProducts } from "./db.js";
import { CartManager } from "./cart.js";

const $ = selector => document.querySelector(selector);
const grid = $("#grid");
const statusEl = $("#status");
const themeSel = $("#theme");
const fontSel = $("#fontSize");
const catSel = $("#category");
const toolbarCartBtn = $("#btnCart");
const navCartBtn = $("#cart-btn");
const cartCountToolbar = $("#cartCount");
const navCartBadge = navCartBtn ? navCartBtn.querySelector(".badge") : null;
const catalogUpdated = $("#catalogUpdated");
const cartUpdated = $("#cartUpdated");

const dlg = $("#detailDialog");
const dlgClose = $("#dlgClose");
const imgMain = $("#imgMain");
const dlgTitle = $("#dlgTitle");
const dlgDesc = $("#dlgDesc");
const dlgPrice = $("#dlgPrice");
const dlgStock = $("#dlgStock");
const buyBtn = $("#buyBtn");
const detailThumbs = $("#detailThumbs");

const cartDlg = $("#cartDialog");
const cartClose = $("#cartClose");
const cartList = $("#cartList");
const cartTotal = $("#cartTotal");
const clearCart = $("#clearCart");
const checkout = $("#checkout");

let PRODUCTS = [];

const cart = new CartManager(Storage);

(async function init(){
	if(!grid) return;

	applyInitialPreferences();
	ensureLastVisitCookie();

	await openDB();
	await loadProducts();

	setupCategories();
	
	const lastCat = Storage.loadLastCategory();
	if(catSel && lastCat) {
		catSel.value = lastCat;
	}
	
	const currentCategory = catSel ? catSel.value : "Todas";
	render(PRODUCTS, currentCategory);

	updateCatalogTimestamp(Storage.loadCatalogSync());
	updateCartBadge(cart.getCount());
	updateCartTotals(cart.getTotal());
	updateCartTimestamp(cart.getUpdatedAt());
	renderCart();

	cart.subscribe(handleCartChange);
})();

function applyInitialPreferences(){
	const theme = Storage.loadTheme();
	document.documentElement.setAttribute("data-theme", theme);
	if(themeSel) themeSel.value = theme;

	const font = Storage.loadFont();
	document.documentElement.style.fontSize = font;
	if(fontSel) fontSel.value = font;
}

function ensureLastVisitCookie(){
	const previous = Storage.getCookie("lastVisit");
	if(previous){
		sessionStorage.setItem("previousVisit", previous);
	}
	Storage.setCookie("lastVisit", new Date().toISOString(), 30);
}

async function loadProducts(){
	setBusy(true, "Cargando productos...");
	try{
		const res = await fetch("./data/products.json", { cache: "reload" });
		if(!res.ok) throw new Error(`HTTP ${res.status}`);
		const data = await res.json();
		PRODUCTS = data.map(item => ({ ...item }));
		saveProducts(PRODUCTS);
		Storage.saveCatalogSync(new Date().toISOString());
		setStatus("Productos actualizados.");
	}catch(error){
		console.warn("Fallo al cargar catálogo remoto", error);
		PRODUCTS = await readProducts();
		if(PRODUCTS.length){
			setStatus("Sin conexión. Mostrando catálogo guardado.");
		}else{
			setStatus("No hay productos disponibles.");
		}
	}finally{
		setBusy(false);
	}
}

function handleCartChange(items, meta){
	updateCartBadge(meta.count);
	updateCartTotals(meta.total);
	updateCartTimestamp(meta.updatedAt);
	renderCart(items, meta.total);

	if(PRODUCTS.length){
		const activeCategory = catSel ? catSel.value : "Todas";
		render(PRODUCTS, activeCategory);
	}
}

function setBusy(busy, msg=""){
	if(grid){
		grid.setAttribute("aria-busy", String(busy));
	}
	setStatus(msg);
}

function setStatus(message=""){
	if(statusEl){
		statusEl.textContent = message;
	}
}

function render(items, category="Todas"){
	if(!grid) return;
	
	console.log("Renderizando:", { totalItems: items.length, category });
	
	const normalizedCategory = String(category).trim();
	const filtered = normalizedCategory === "Todas"
		? items
		: items.filter(product => {
			const productCategory = String(product.category || "").trim();
			return productCategory === normalizedCategory;
		});

	console.log("Productos filtrados:", filtered.length);

	if(!filtered.length){
		grid.innerHTML = '<p class="grid-empty">No hay productos en esta categoría.</p>';
		setStatus(`Filtrando por: ${normalizedCategory} - 0 productos encontrados`);
		return;
	}

	grid.innerHTML = filtered.map(productCard).join("");
	setStatus(`Mostrando ${filtered.length} producto(s) de ${normalizedCategory}`);

	grid.querySelectorAll(".js-detail").forEach(btn => {
		btn.addEventListener("click", () => openDetail(Number(btn.dataset.id)));
	});
}

function productCard(product){
	const remaining = getRemainingStock(product);
	const disabled = remaining <= 0 ? 'disabled aria-disabled="true"' : "";
	return `
		<article class="shop-card" data-id="${product.id}" role="listitem">
			<img src="${product.images[0]}" alt="Imagen de ${escapeHTML(product.name)}" class="shop-card__img">
			<div class="shop-card__body">
				<h3 class="shop-card__title">${escapeHTML(product.name)}</h3>
				<div class="shop-card__meta">
					<span class="shop-card__badge" aria-label="Categoría">${escapeHTML(product.category)}</span>
					<span class="shop-card__stock">Stock disponible: ${remaining}</span>
				</div>
				<p class="shop-card__price">${formatPrice(product.price)}</p>
			</div>
			<footer class="shop-card__footer">
				<button type="button" class="btn btn-outline js-detail" data-id="${product.id}" aria-haspopup="dialog">Ver</button>
				<button type="button" class="btn btn-secondary js-buy" data-id="${product.id}" ${disabled}>Agregar</button>
			</footer>
		</article>
	`;
}

function formatPrice(value){
	return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(value);
}

function setupCategories(){
	if(!catSel) return;
	const cats = Array.from(new Set(PRODUCTS.map(product => product.category))).sort();
	console.log("Categorías encontradas:", cats);
	catSel.innerHTML = `<option value="Todas">Todas</option>` + cats
		.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`)
		.join("");
}

if(themeSel){
	themeSel.addEventListener("change", event => {
		const value = event.target.value;
		document.documentElement.setAttribute("data-theme", value);
		Storage.saveTheme(value);
	});
}

if(fontSel){
	fontSel.addEventListener("change", event => {
		const value = event.target.value;
		document.documentElement.style.fontSize = value;
		Storage.saveFont(value);
	});
}

if(catSel){
	catSel.addEventListener("change", event => {
		const value = event.target.value;
		Storage.saveLastCategory(value);
		render(PRODUCTS, value);
	});
}

if(grid){
	grid.addEventListener("click", event => {
		const target = event.target.closest(".js-buy");
		if(!target) return;
		buyProduct(Number(target.dataset.id));
	});
}

function openDetail(id){
	if(!dlg) return;
		const product = findProduct(id);
		if(!product) return;
	dlgTitle.textContent = product.name;
	dlgDesc.textContent = product.description;
	dlgPrice.textContent = formatPrice(product.price);
	dlgStock.textContent = getRemainingStock(product);
	imgMain.src = product.images[0];
	imgMain.alt = `Imagen del producto ${product.name}`;

	if(detailThumbs){
		detailThumbs.innerHTML = product.images.map((_, index) => `
			<button type="button" class="thumb" data-idx="${index}" aria-label="Ver imagen ${index + 1} de ${escapeHTML(product.name)}">${index + 1}</button>
		`).join("");

		detailThumbs.querySelectorAll(".thumb").forEach(button => {
			button.addEventListener("click", () => {
				const idx = Number(button.dataset.idx);
				const img = product.images[idx];
				if(!img) return;
				imgMain.src = img;
				imgMain.alt = `Imagen ${idx + 1} del producto ${product.name}`;
			});
		});
	}

	buyBtn.disabled = getRemainingStock(product) <= 0;
	buyBtn.onclick = () => {
		buyProduct(product.id);
		dlg.close();
	};

	dlg.showModal();
}

if(dlg){
	dlg.addEventListener("cancel", event => {
		event.preventDefault();
		dlg.close();
	});
}

if(dlgClose){
	dlgClose.addEventListener("click", () => dlg.close());
}

if(toolbarCartBtn && cartDlg){
	toolbarCartBtn.addEventListener("click", () => {
		openCartDialog();
	});
}

if(navCartBtn && cartDlg){
	navCartBtn.addEventListener("click", () => {
		openCartDialog();
	});
}

function openCartDialog(){
	renderCart();
	setCartExpanded(true);
	cartDlg.showModal();
}

function closeCartDialog(){
	cartDlg.close();
	setCartExpanded(false);
}

if(cartDlg){
	cartDlg.addEventListener("cancel", event => {
		event.preventDefault();
		closeCartDialog();
	});

	cartDlg.addEventListener("close", () => {
		setCartExpanded(false);
	});
}

if(cartClose){
	cartClose.addEventListener("click", () => closeCartDialog());
}

if(clearCart){
	clearCart.addEventListener("click", () => {
		cart.clear();
		setStatus("Carrito vacío.");
	});
}

if(checkout){
	checkout.addEventListener("click", () => {
		if(cart.getCount() === 0){
			alert("El carrito está vacío");
			return;
		}
		alert("✅ ¡Compra realizada!");
		cart.clear();
		setStatus("Compra realizada con éxito.");
	});
}

if(cartList){
	cartList.addEventListener("click", event => {
		const button = event.target.closest("[data-action]");
		if(!button) return;
		const itemEl = button.closest("li[data-id]");
		if(!itemEl) return;
		const id = Number(itemEl.dataset.id);
		const product = findProduct(id);
		if(!product) return;

		const action = button.dataset.action;
		const currentQty = cart.getQuantity(id);

		if(action === "increment"){
			if(currentQty >= product.stock){
				setStatus(`Solo hay ${product.stock} unidades disponibles de ${product.name}.`);
				return;
			}
			cart.updateQuantity(id, currentQty + 1);
		}else if(action === "decrement"){
			if(currentQty <= 1){
				cart.remove(id);
			}else{
				cart.updateQuantity(id, currentQty - 1);
			}
		}else if(action === "remove"){
			cart.remove(id);
			setStatus(`${product.name} eliminado del carrito.`);
		}
	});

	cartList.addEventListener("change", event => {
		const input = event.target;
		if(!(input instanceof HTMLInputElement)) return;
		if(input.dataset.action !== "input") return;
		const itemEl = input.closest("li[data-id]");
		if(!itemEl) return;
		const id = Number(itemEl.dataset.id);
		const product = findProduct(id);
		if(!product) return;

		const value = Number(input.value);
		if(!Number.isFinite(value) || value < 1){
			input.value = String(cart.getQuantity(id) || 1);
			return;
		}
		if(value > product.stock){
			input.value = String(product.stock);
			cart.updateQuantity(id, product.stock);
			setStatus(`Cantidad ajustada al stock disponible (${product.stock}).`);
			return;
		}
		cart.updateQuantity(id, value);
	});
}

function buyProduct(id){
	const product = findProduct(id);
	if(!product) return;
	const remaining = getRemainingStock(product);
	if(remaining <= 0){
		setStatus(`No hay más unidades de ${product.name}.`);
		return;
	}
	cart.add(product, 1);
	setStatus(`Añadido: ${product.name}`);
}

function renderCart(items = cart.getItems(), total = cart.getTotal()){
	if(!cartList) return;

	if(!items.length){
		cartList.innerHTML = '<li class="cart-empty">Tu carrito está vacío.</li>';
	}else{
		cartList.innerHTML = items.map(item => {
			const product = findProduct(item.id);
			const max = product ? product.stock : item.qty;
			const remaining = product ? Math.max(product.stock - item.qty, 0) : 0;
			return `
				<li class="cart-item" data-id="${item.id}">
					<div class="cart-item__header">
						<span class="cart-item__name">${escapeHTML(item.name)}</span>
						<button type="button" class="btn-link cart-remove" data-action="remove" aria-label="Eliminar ${escapeHTML(item.name)} del carrito">Eliminar</button>
					</div>
					<div class="cart-item__controls">
						<div class="cart-qty" role="group" aria-label="Cantidad de ${escapeHTML(item.name)}">
							<button type="button" class="qty-btn" data-action="decrement" aria-label="Reducir cantidad de ${escapeHTML(item.name)}">-</button>
							  <input type="number" inputmode="numeric" pattern="\\d*" min="1" max="${max}" value="${item.qty}" data-action="input" aria-label="Cantidad de ${escapeHTML(item.name)}">
							  <button type="button" class="qty-btn" data-action="increment" aria-label="Aumentar cantidad de ${escapeHTML(item.name)}">+</button>
						</div>
						<span class="cart-item__price">${formatPrice(item.price * item.qty)}</span>
					</div>
					${product ? `<p class="cart-item__stock" aria-live="polite">Unidades disponibles: ${remaining}</p>` : ""}
				</li>
			`;
		}).join("");
	}

	updateCartTotals(total);
}

function updateCartTotals(total){
	if(cartTotal){
		cartTotal.textContent = formatPrice(total);
	}
}

function updateCartBadge(count = cart.getCount()){
	if(cartCountToolbar) cartCountToolbar.textContent = String(count);
	if(navCartBadge) navCartBadge.textContent = String(count);
}

function updateCartTimestamp(timestamp){
	if(!cartUpdated) return;
	if(!timestamp){
		cartUpdated.textContent = "sin datos";
		cartUpdated.removeAttribute("datetime");
		return;
	}
	const date = new Date(timestamp);
	if(Number.isNaN(date.getTime())){
		cartUpdated.textContent = timestamp;
		cartUpdated.removeAttribute("datetime");
		return;
	}
	cartUpdated.textContent = date.toLocaleString("es-EC", { dateStyle: "medium", timeStyle: "short" });
	cartUpdated.setAttribute("datetime", date.toISOString());
}

function updateCatalogTimestamp(timestamp){
	if(!catalogUpdated) return;
	if(!timestamp){
		catalogUpdated.textContent = "sin datos";
		catalogUpdated.removeAttribute("datetime");
		return;
	}
	const date = new Date(timestamp);
	if(Number.isNaN(date.getTime())){
		catalogUpdated.textContent = timestamp;
		catalogUpdated.removeAttribute("datetime");
		return;
	}
	catalogUpdated.textContent = date.toLocaleString("es-EC", { dateStyle: "medium", timeStyle: "short" });
	catalogUpdated.setAttribute("datetime", date.toISOString());
}

function setCartExpanded(expanded){
	const value = String(expanded);
	if(toolbarCartBtn) toolbarCartBtn.setAttribute("aria-expanded", value);
	if(navCartBtn) navCartBtn.setAttribute("aria-expanded", value);
}

function findProduct(id){
	return PRODUCTS.find(product => product.id === id);
}

function getRemainingStock(product){
	const qtyInCart = cart.getQuantity(product.id);
	return Math.max(product.stock - qtyInCart, 0);
}

function escapeHTML(value){
	return String(value).replace(/[&<>"']/g, match => ({
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#039;"
	}[match]));
}
