import { Storage } from "./storage.js";

export class CartManager {
  constructor(storage = Storage){
    this.storage = storage;
    this.items = storage.loadCart();
    this.updatedAt = storage.loadCartUpdatedAt();
    this.listeners = new Set();
  }

  subscribe(listener, options = {}){
    if(typeof listener !== "function") return () => {};
    this.listeners.add(listener);
    if(options.immediate !== false){
      listener(this.getItems(), this._getMeta());
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  add(product, qty = 1){
    if(!product) return;
    const amount = Number.isFinite(qty) ? Math.max(1, Math.floor(qty)) : 1;
    const existing = this.items.find(item => item.id === product.id);
    if(existing){
      existing.qty += amount;
    }else{
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        qty: amount
      });
    }
    this._commit();
  }

  updateQuantity(id, qty){
    if(!Number.isFinite(qty)) return;
    const amount = Math.floor(qty);
    if(amount <= 0){
      this.remove(id);
      return;
    }
    const item = this.items.find(entry => entry.id === id);
    if(!item) return;
    item.qty = amount;
    this._commit();
  }

  remove(id){
    const originalLength = this.items.length;
    this.items = this.items.filter(entry => entry.id !== id);
    if(this.items.length === originalLength) return;
    this._commit();
  }

  clear(){
    if(!this.items.length) return;
    this.items = [];
    this._commit();
  }

  getItems(){
    return this.items.map(entry => ({ ...entry }));
  }

  getTotal(){
    return this.items.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
  }

  getCount(){
    return this.items.reduce((sum, entry) => sum + entry.qty, 0);
  }

  getQuantity(id){
    const item = this.items.find(entry => entry.id === id);
    return item ? item.qty : 0;
  }

  getUpdatedAt(){
    return this.updatedAt;
  }

  _commit(){
    this.updatedAt = new Date().toISOString();
    this.storage.saveCart(this.getItems(), this.updatedAt);
    this._notify();
  }

  _notify(){
    const snapshot = this.getItems();
    const meta = this._getMeta();
    this.listeners.forEach(listener => listener(snapshot, meta));
  }

  _getMeta(){
    return {
      updatedAt: this.updatedAt,
      count: this.getCount(),
      total: this.getTotal()
    };
  }
}
