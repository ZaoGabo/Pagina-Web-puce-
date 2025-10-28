# Plan de Migración a TypeScript + React

## 📍 Estado Actual
- HTML + CSS + JavaScript vanilla
- Estructura modular y preparada
- Variables CSS para temas

## 🎯 Objetivo Final
- TypeScript + React
- Componentes reutilizables
- State management robusto
- Type safety completo

---

## Fase 1: Configuración Base con TypeScript

### 1.1 Inicializar proyecto Node.js
```powershell
npm init -y
```

### 1.2 Instalar TypeScript y dependencias básicas
```powershell
npm install --save-dev typescript @types/node
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev ts-loader html-webpack-plugin
```

### 1.3 Crear `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 1.4 Migrar JavaScript a TypeScript
- Convertir `main.js` → `main.ts`
- Definir interfaces para Product, CartItem, AppState
- Añadir tipos a todas las funciones

---

## Fase 2: Migración a React

### 2.1 Instalar React y dependencias
```powershell
npm install react react-dom
npm install --save-dev @types/react @types/react-dom
npm install react-router-dom
npm install --save-dev @types/react-router-dom
```

### 2.2 Crear estructura de carpetas
```
src/
├── components/
│   ├── Header/
│   │   ├── Header.tsx
│   │   └── Header.module.css
│   ├── ProductCard/
│   ├── CategoryCard/
│   ├── Cart/
│   └── Footer/
├── pages/
│   ├── Home.tsx
│   ├── Products.tsx
│   └── Checkout.tsx
├── hooks/
│   ├── useCart.ts
│   └── useProducts.ts
├── context/
│   └── AppContext.tsx
├── types/
│   └── index.ts
├── utils/
│   └── formatters.ts
├── App.tsx
└── index.tsx
```

### 2.3 Definir tipos principales (`src/types/index.ts`)
```typescript
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AppState {
  cart: CartItem[];
  wishlist: Product[];
  products: Product[];
  user: User | null;
}
```

### 2.4 Crear componentes base
- **Header**: Navegación y acciones
- **ProductCard**: Tarjeta de producto
- **CategoryCard**: Tarjeta de categoría
- **Cart**: Carrito de compras
- **Footer**: Pie de página

---

## Fase 3: State Management

### 3.1 Opción A: Context API
```typescript
// src/context/AppContext.tsx
import { createContext, useContext, useReducer } from 'react';

interface AppContextType {
  state: AppState;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  // ... más acciones
}
```

### 3.2 Opción B: Redux Toolkit (recomendado para apps grandes)
```powershell
npm install @reduxjs/toolkit react-redux
```

---

## Fase 4: Estilos

### 4.1 Opción A: CSS Modules (más simple)
- Ya compatible con Webpack
- Mantener estructura similar a CSS actual

### 4.2 Opción B: Styled Components
```powershell
npm install styled-components
npm install --save-dev @types/styled-components
```

### 4.3 Opción C: Tailwind CSS
```powershell
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

---

## Fase 5: Bibliotecas Adicionales

### 5.1 Gestión de datos
```powershell
npm install @tanstack/react-query
npm install axios
```

### 5.2 Formularios
```powershell
npm install react-hook-form
npm install zod  # Para validación
```

### 5.3 UI Components (opcional)
```powershell
npm install @headlessui/react  # Componentes accesibles
npm install @heroicons/react   # Iconos
```

### 5.4 Notificaciones
```powershell
npm install react-hot-toast
```

---

## Fase 6: Testing

```powershell
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event
npm install --save-dev vitest
```

---

## Fase 7: Build y Deploy

### 7.1 Configurar Vite (alternativa moderna a Webpack)
```powershell
npm create vite@latest . -- --template react-ts
```

### 7.2 Scripts en package.json
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest"
  }
}
```

---

## 📝 Checklist de Migración

- [ ] Fase 1: Configurar TypeScript
- [ ] Fase 2: Estructura React
- [ ] Fase 3: State Management
- [ ] Fase 4: Sistema de estilos
- [ ] Fase 5: Bibliotecas adicionales
- [ ] Fase 6: Testing
- [ ] Fase 7: Build y Deploy

---

## 🎨 Ejemplos de Código

### Componente ProductCard en React + TypeScript
```typescript
import { FC } from 'react';
import { Product } from '../types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleWishlist
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.image}>
        <img src={product.image} alt={product.name} />
        <button
          className={styles.wishlist}
          onClick={() => onToggleWishlist(product)}
        >
          ♡
        </button>
      </div>
      <div className={styles.info}>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className={styles.footer}>
          <span className={styles.price}>
            ${product.price.toFixed(2)}
          </span>
          <button onClick={() => onAddToCart(product)}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};
```

### Custom Hook: useCart
```typescript
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Product } from '../types';

export const useCart = () => {
  const { state, dispatch } = useContext(AppContext);

  const addToCart = (product: Product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (productId: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const getTotal = () => {
    return state.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  return {
    cart: state.cart,
    addToCart,
    removeFromCart,
    getTotal
  };
};
```

---

## 🚀 Comando Rápido para Empezar con Vite + React + TS

```powershell
# Crear proyecto con Vite
npm create vite@latest . -- --template react-ts

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

---

**Nota:** Este plan es flexible. Puedes ajustar según las necesidades del proyecto.
