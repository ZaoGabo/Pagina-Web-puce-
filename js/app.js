import { Storage } from "./storage.js";
import { openDB, saveProducts, readProducts } from "./db.js";

const $ = s => document.querySelector(s);
const grid = $("#grid");
const statusEl = $("#status");
const themeSel = $("#theme");
const fontSel = $("#fontSize");
const catSel = $("#category");
const toolbarCartBtn = $("#btnCart");
const navCartBtn = $("#cart-btn");
const cartCountToolbar = $("#cartCount");
const navCartBadge = navCartBtn ? navCartBtn.querySelector(".badge") : null;

const dlg = $("#detailDialog");
const dlgClose = $("#dlgClose");
const imgMain = $("#imgMain");
const dlgTitle = $("#dlgTitle");
const dlgDesc = $("#dlgDesc");
const dlgPrice = $("#dlgPrice");
const dlgStock = $("#dlgStock");
const buyBtn = $("#buyBtn");

const cartDlg = $("#cartDialog");
const cartClose = $("#cartClose");
const cartList = $("#cartList");
const cartTotal = $("#cartTotal");
const clearCart = $("#clearCart");
const checkout = $("#checkout");

let PRODUCTS = [];
let CURRENT = null;
let CART = [];

(async function init(){
  if(!grid) return;

  const theme = Storage.loadTheme();
  document.documentElement.setAttribute("data-theme", theme);
  if(themeSel) themeSel.value = theme;

  const font = Storage.loadFont();
  document.documentElement.style.fontSize = font;
  if(fontSel) fontSel.value = font;

  if(!Storage.getCookie("lastVisit")){
    Storage.setCookie("lastVisit", new Date().toISOString(), 30);
  }

  await openDB();
  await loadProducts();

  setupCategories();
  const lastCat = Storage.loadLastCategory();
  if(catSel) catSel.value = lastCat;
  render(PRODUCTS, lastCat);

  CART = Storage.loadCart();
  updateCartBadge();
})();

async function loadProducts(){
  setBusy(true, "Cargando productos...");
  try{
    const res = await fetch("./data/products.json", { cache: "reload" });
    if(!res.ok) throw new Error("HTTP "+res.status);
    const data = await res.json();
    PRODUCTS = data;
    saveProducts(PRODUCTS);
    statusEl.textContent = "Productos actualizados.";
  }catch{
    PRODUCTS = await readProducts();
    statusEl.textContent = PRODUCTS.length
      ? "Sin conexión. Mostrando catálogo guardado."
      : "No hay productos disponibles.";
  }finally{
    setBusy(false);
  }
}

function setBusy(busy, msg=""){
  grid.setAttribute("aria-busy", String(busy));
  if(statusEl) statusEl.textContent = msg;
}

function render(items, category="Todas"){
  if(!grid) return;
  const filtered = category==="Todas" ? items : items.filter(p => p.category===category);
  if(!filtered.length){
    grid.innerHTML = '<p class="grid-empty">No hay productos en esta categoría.</p>';
    return;
  }
  grid.innerHTML = filtered.map(productCard).join("");
  grid.querySelectorAll(".js-detail").forEach(btn=>{
    btn.addEventListener("click", () => openDetail(+btn.dataset.id));
  });
}

function productCard(p){
  const disabled = p.stock <= 0 ? "disabled aria-disabled=\"true\"" : "";
  return `
    <article class="shop-card" data-id="${p.id}">
      <img src="${p.images[0]}" alt="Imagen de ${escapeHTML(p.name)}" class="shop-card__img">
      <div class="shop-card__body">
        <h3 class="shop-card__title">${escapeHTML(p.name)}</h3>
        <div class="shop-card__meta">
          <span class="shop-card__badge" aria-label="Categoría">${escapeHTML(p.category)}</span>
          <span class="shop-card__stock">Stock: ${p.stock}</span>
        </div>
        <p class="shop-card__price">${formatPrice(p.price)}</p>
      </div>
      <footer class="shop-card__footer">
        <button class="btn btn-outline js-detail" data-id="${p.id}" aria-haspopup="dialog">Ver</button>
        <button class="btn btn-secondary js-buy" data-id="${p.id}" ${disabled}>Agregar</button>
      </footer>
    </article>
  `;
}

function formatPrice(val){
  return new Intl.NumberFormat("es-EC", { style: "currency", currency: "USD" }).format(val);
}

function setupCategories(){
  if(!catSel) return;
  const cats = Array.from(new Set(PRODUCTS.map(p => p.category))).sort();
  catSel.innerHTML = `<option>Todas</option>` + cats.map(c=>`<option>${escapeHTML(c)}</option>`).join("");
}

if(themeSel){
  themeSel.addEventListener("change", e=>{
    const val = e.target.value;
    document.documentElement.setAttribute("data-theme", val);
    Storage.saveTheme(val);
  });
}

if(fontSel){
  fontSel.addEventListener("change", e=>{
    const val = e.target.value;
    document.documentElement.style.fontSize = val;
    Storage.saveFont(val);
  });
}

if(catSel){
  catSel.addEventListener("change", e=>{
    const val = e.target.value;
    Storage.saveLastCategory(val);
    render(PRODUCTS, val);
  });
}

if(grid){
  grid.addEventListener("click", e=>{
    const target = e.target.closest(".js-buy");
    if(target){
      buyProduct(+target.dataset.id);
    }
  });
}

function openDetail(id){
  if(!dlg) return;
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  CURRENT = p;
  dlgTitle.textContent = p.name;
  dlgDesc.textContent = p.description;
  dlgPrice.textContent = formatPrice(p.price);
  dlgStock.textContent = p.stock;
  imgMain.src = p.images[0];
  imgMain.alt = `Imagen del producto ${p.name}`;

  dlg.showModal();

  dlg.querySelectorAll(".thumb").forEach(b=>{
    b.onclick = () => { imgMain.src = p.images[+b.dataset.idx]; };
  });

  buyBtn.disabled = p.stock<=0;
  buyBtn.onclick = () => { buyProduct(p.id); dlg.close(); };
}

if(dlgClose && dlg){
  dlgClose.addEventListener("click", ()=> dlg.close());
  dlg.addEventListener("cancel", e=>{ e.preventDefault(); dlg.close(); });
  dlg.addEventListener("keydown", e=>{ if(e.key==="Escape") dlg.close(); });
}

if(toolbarCartBtn && cartDlg){
  toolbarCartBtn.addEventListener("click", ()=>{ renderCart(); cartDlg.showModal(); });
}
if(navCartBtn && cartDlg){
  navCartBtn.addEventListener("click", ()=>{ renderCart(); cartDlg.showModal(); });
}
if(cartClose && cartDlg){
  cartClose.addEventListener("click", ()=> cartDlg.close());
  cartDlg.addEventListener("cancel", e=>{ e.preventDefault(); cartDlg.close(); });
}
if(clearCart){
  clearCart.addEventListener("click", ()=>{ CART=[]; persistCart(); renderCart(); });
}
if(checkout){
  checkout.addEventListener("click", ()=>{
    if(!CART.length){ alert("El carrito está vacío"); return; }
    alert("✅ ¡Compra realizada!");
    CART=[];
    persistCart();
    renderCart();
  });
}

function buyProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  if(p.stock<=0){ alert("Sin stock"); return; }
  p.stock -= 1;
  const item = CART.find(i=>i.id===id);
  if(item) item.qty += 1;
  else CART.push({ id, name: p.name, price: p.price, qty: 1 });
  persistCart();
  updateCartBadge();
  render(PRODUCTS, catSel ? catSel.value : "Todas");
  if(statusEl) statusEl.textContent = `Añadido: ${p.name}`;
}

function renderCart(){
  if(!cartList) return;
  cartList.innerHTML = CART.map(i=>`
    <li>
      <span>${escapeHTML(i.name)} × ${i.qty}</span>
      <strong>${formatPrice(i.price*i.qty)}</strong>
    </li>
  `).join("");
  const total = CART.reduce((s,i)=> s + i.price*i.qty, 0);
  if(cartTotal) cartTotal.textContent = formatPrice(total);
  updateCartBadge();
}

function updateCartBadge(){
  const count = CART.reduce((s,i)=> s+i.qty, 0);
  if(cartCountToolbar) cartCountToolbar.textContent = String(count);
  if(navCartBadge) navCartBadge.textContent = String(count);
}

function persistCart(){ Storage.saveCart(CART); }

function escapeHTML(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}
