const DB_NAME = "ShopDB";
const STORE = "products";
let db;

export function openDB(){
  return new Promise((resolve, reject)=>{
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = e => { db = e.target.result; resolve(); };
    req.onerror = e => reject(e.target.error);
  });
}

export function saveProducts(arr){
  if(!db) return;
  const tx = db.transaction(STORE, "readwrite");
  const st = tx.objectStore(STORE);
  arr.forEach(p => st.put(p));
}

export function readProducts(){
  return new Promise((resolve)=>{
    if(!db){ resolve([]); return; }
    const tx = db.transaction(STORE, "readonly");
    const st = tx.objectStore(STORE);
    const req = st.getAll();
    req.onsuccess = ()=> resolve(req.result || []);
    req.onerror = ()=> resolve([]);
  });
}
