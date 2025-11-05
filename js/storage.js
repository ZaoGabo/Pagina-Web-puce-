// Persistencia básica con Web Storage + cookie lastVisit
export const Storage = {
  saveTheme(val){ localStorage.setItem("theme", val); },
  loadTheme(){ return localStorage.getItem("theme") || "light"; },

  saveFont(val){ localStorage.setItem("fontSize", val); },
  loadFont(){ return localStorage.getItem("fontSize") || "100%"; },

  saveCart(cart, updatedAt = new Date().toISOString()){
    const payload = { items: cart, updatedAt };
    localStorage.setItem("cart", JSON.stringify(payload));
  },
  loadCart(){
    const raw = localStorage.getItem("cart");
    if(!raw) return [];
    try{
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) return parsed;
      return Array.isArray(parsed.items) ? parsed.items : [];
    }catch{
      return [];
    }
  },
  loadCartUpdatedAt(){
    const raw = localStorage.getItem("cart");
    if(!raw) return "";
    try{
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) return "";
      return parsed.updatedAt || "";
    }catch{
      return "";
    }
  },

  saveLastCategory(cat){ sessionStorage.setItem("lastCategory", cat); },
  loadLastCategory(){ return sessionStorage.getItem("lastCategory") || "Todas"; },

  saveCatalogSync(timestamp = new Date().toISOString()){
    localStorage.setItem("catalogSync", timestamp);
  },
  loadCatalogSync(){
    return localStorage.getItem("catalogSync") || "";
  },

  setCookie(name, value, days=7){
    const exp = new Date(Date.now()+days*864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${days*86400}; SameSite=Lax`;
  },
  getCookie(name){
    return document.cookie.split("; ").reduce((acc, c)=>{
      const [k,v] = c.split("=");
      return k===name ? decodeURIComponent(v) : acc;
    }, "");
  }
};
