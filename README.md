# ZaoShop - Plataforma E-Commerce Full Stack

## Descripcion del Sistema

ZaoShop es una plataforma web tipo e-commerce desarrollada con arquitectura **MVC completa** tanto en frontend como backend.

### Tecnologias

| Capa | Tecnologia |
|------|------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Backend** | Node.js + Express |
| **Base de datos** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Autenticacion** | JWT + bcrypt |
| **Validacion** | Zod (frontend) + express-validator (backend) |

---

## Arquitectura MVC

### Frontend (`/frontend-react`)

```
src/
|-- components/          # Vista - Componentes UI
|   |-- layout/          # Header, Footer, Layout
|   |-- products/        # ProductCard
|   +-- auth/            # ProtectedRoute
|
|-- pages/               # Controlador - Paginas/Rutas
|   |-- Home.tsx, Products.tsx, Cart.tsx...
|   +-- admin/           # Dashboard, ProductsAdmin, OrdersAdmin
|
|-- services/            # Modelo - Consumo de API
|   |-- api.ts, auth.service.ts
|   +-- products.service.ts, orders.service.ts
|
|-- context/             # Estado global
|   |-- AuthContext.tsx
|   +-- CartContext.tsx
|
+-- types/               # Tipos TypeScript
    +-- index.ts
```

### Backend (`/server`)

```
server/
|-- routes/              # Definicion de rutas
|-- controllers/         # Logica de negocio
|-- middleware/          # Auth, validacion, errores
+-- prisma/              # ORM y esquema BD
```

---

## Endpoints de la API

### Autenticacion
| Metodo | Ruta | Acceso | Descripcion |
|--------|------|--------|-------------|
| POST | /api/auth/register | Publico | Registrar usuario |
| POST | /api/auth/login | Publico | Login, devuelve JWT |
| GET | /api/auth/me | JWT | Info usuario actual |

### Productos
| Metodo | Ruta | Acceso | Descripcion |
|--------|------|--------|-------------|
| GET | /api/productos | Publico | Listar productos |
| GET | /api/productos/:id | Publico | Detalle producto |
| POST | /api/productos | Admin | Crear producto |
| PUT | /api/productos/:id | Admin | Actualizar producto |
| DELETE | /api/productos/:id | Admin | Eliminar producto |

### Pedidos
| Metodo | Ruta | Acceso | Descripcion |
|--------|------|--------|-------------|
| POST | /api/pedidos | JWT | Crear pedido |
| GET | /api/pedidos/mis-pedidos | JWT | Pedidos del usuario |
| GET | /api/pedidos | Admin | Todos los pedidos |

---

## Como Ejecutar

### 1. Backend

```powershell
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
copy .env.example .env
# Editar .env con tus credenciales de Supabase

# Generar cliente Prisma
npx prisma generate

# Sincronizar base de datos
npx prisma db push

# Poblar datos iniciales
node prisma/seed.js

# Iniciar servidor
npm run dev
```

El servidor estara en: `http://localhost:3000`

### 2. Frontend

```powershell
cd frontend-react

# Instalar dependencias
npm install

# Configurar variables de entorno (opcional)
copy .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estara en: `http://localhost:5173`

### Credenciales de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@zaoshop.com | Admin123! |
| User | user@zaoshop.com | User123! |

---

## Seguridad OWASP Aplicada

### 1. A01:2021 - Broken Access Control
**Riesgo:** Usuarios no autorizados acceden a funciones de administrador.

**Mitigacion:**
- Middleware `verifyToken` valida JWT en cada peticion protegida
- Middleware `requireRole('admin')` bloquea acceso a usuarios sin rol admin
- Componente `ProtectedRoute` en frontend verifica autenticacion y roles
- Frontend oculta menu Admin para usuarios normales

**Archivos:** `auth.middleware.js`, `ProtectedRoute.tsx`

### 2. A02:2021 - Cryptographic Failures
**Riesgo:** Contrasenas almacenadas en texto plano.

**Mitigacion:**
- Hash de contrasenas con **bcrypt** (10 salt rounds)
- JWT firmado con secreto configurable (`JWT_SECRET`)
- Campo `passwordHash` nunca se retorna en respuestas de API
- Token almacenado en localStorage con expiracion

**Archivo:** `auth.controller.js`

### 3. A03:2021 - Injection
**Riesgo:** SQL Injection y Cross-Site Scripting (XSS).

**Mitigacion:**
- **Prisma ORM** parametriza todas las consultas SQL automaticamente
- **Zod** valida y sanitiza entradas en frontend
- **express-validator** sanitiza entradas con `escape()` y `trim()` en backend
- React escapa automaticamente el contenido renderizado

**Archivos:** `validate.middleware.js`, `Login.tsx`, `Register.tsx`

---

## Pruebas Realizadas

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Login admin obtiene token JWT | OK |
| 2 | Login usuario normal obtiene token JWT | OK |
| 3 | Admin puede crear/editar/eliminar productos | OK |
| 4 | Usuario NO puede acceder a panel admin | OK |
| 5 | Catalogo muestra productos desde API | OK |
| 6 | Carrito persiste en localStorage | OK |
| 7 | Checkout crea pedido en BD | OK |
| 8 | Usuario ve historial de sus pedidos | OK |
| 9 | Admin ve todos los pedidos | OK |
| 10 | Validacion de formularios funciona | OK |

---

## Despliegue en Vercel

### Backend
1. Crear nuevo proyecto en Vercel
2. Importar carpeta `/server`
3. Configurar variables de entorno:
   - `DATABASE_URL` - URL de Supabase
   - `DIRECT_URL` - URL directa de Supabase
   - `JWT_SECRET` - Secreto para JWT
   - `CORS_ORIGIN` - URL del frontend desplegado
   - `NODE_ENV` - production

### Frontend
1. Crear nuevo proyecto en Vercel
2. Importar carpeta `/frontend-react`
3. Configurar variable de entorno:
   - `VITE_API_URL` - URL del backend desplegado

---

## Autor

**ZaoShop** - RDA 3 Full Stack con React  
PUCE - Desarrollo Web

## Licencia

MIT
