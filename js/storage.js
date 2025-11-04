// Persistencia básica con Web Storage + cookie lastVisit
export const Storage = {
  saveTheme(val){ localStorage.setItem("theme", val); },
  loadTheme(){ return localStorage.getItem("theme") || "light"; },

  saveFont(val){ localStorage.setItem("fontSize", val); },
  loadFont(){ return localStorage.getItem("fontSize") || "100%"; },

  saveCart(cart){ localStorage.setItem("cart", JSON.stringify(cart)); },
  loadCart(){ return JSON.parse(localStorage.getItem("cart") || "[]"); },

  saveLastCategory(cat){ sessionStorage.setItem("lastCategory", cat); },
  loadLastCategory(){ return sessionStorage.getItem("lastCategory") || "Todas"; },

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
