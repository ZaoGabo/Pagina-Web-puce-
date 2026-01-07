# ZaoShop - Plataforma E-Commerce Full Stack MVC

## Descripcion del Sistema

ZaoShop es una plataforma web tipo e-commerce desarrollada con arquitectura MVC completa tanto en frontend como backend. El sistema permite:

- **Catalogo de productos** cargado dinamicamente desde API
- **Carrito de compras** con persistencia en localStorage
- **Autenticacion JWT** con roles (admin/user)
- **Panel de administracion** para gestion de productos y pedidos
- **Checkout** que registra pedidos en base de datos

---

## Arquitectura MVC

### Frontend MVC (`/frontend`)

```
frontend/
|-- index.html              # Pagina principal (semantico y accesible)
|-- login.html              # Inicio de sesion
|-- register.html           # Registro de usuarios
|-- admin.html              # Panel de administracion
|
|-- models/                 # Capa de datos (consumo API, estado)
|   |-- api.js              # Cliente HTTP con JWT automatico
|   |-- auth.model.js       # Logica de autenticacion
|   |-- cart.model.js       # Estado del carrito
|   |-- product.model.js    # Operaciones de productos
|   +-- order.model.js      # Consulta de pedidos
|
|-- views/                  # Capa de renderizado UI
|   |-- product.view.js     # Tarjetas de productos
|   |-- cart.view.js        # Vista del carrito
|   |-- auth.view.js        # Formularios de auth
|   +-- admin.view.js       # Tablas del panel admin
|
|-- controllers/            # Capa de control de eventos
|   |-- product.controller.js
|   |-- cart.controller.js
|   |-- auth.controller.js
|   +-- admin.controller.js
|
+-- assets/css/             # Estilos CSS
    +-- styles.css
```

### Backend MVC (`/server`)

```
server/
|-- server.js               # Punto de entrada Express
|-- package.json            # Dependencias
|-- .env.example            # Variables de entorno
|
|-- routes/                 # Definicion de rutas API
|   |-- auth.routes.js
|   |-- productos.routes.js
|   +-- pedidos.routes.js
|
|-- controllers/            # Logica de negocio HTTP
|   |-- auth.controller.js
|   |-- productos.controller.js
|   +-- pedidos.controller.js
|
|-- middleware/             # Middlewares de seguridad
|   |-- auth.middleware.js      # JWT y roles
|   |-- validate.middleware.js  # Validacion de entradas
|   +-- error.middleware.js     # Manejo centralizado de errores
|
+-- prisma/                 # ORM y base de datos
    |-- schema.prisma       # Modelo de datos
    +-- seed.js             # Datos iniciales
```

---

## Endpoints de la API

### Autenticacion

| Metodo | Ruta               | Acceso  | Descripcion          |
|--------|--------------------|---------|----------------------|
| POST   | /api/auth/register | Publico | Registrar usuario    |
| POST   | /api/auth/login    | Publico | Login, devuelve JWT  |
| GET    | /api/auth/me       | JWT     | Info usuario actual  |

### Productos

| Metodo | Ruta                 | Acceso  | Descripcion         |
|--------|----------------------|---------|---------------------|
| GET    | /api/productos       | Publico | Listar productos    |
| GET    | /api/productos/:id   | Publico | Detalle producto    |
| POST   | /api/productos       | Admin   | Crear producto      |
| PUT    | /api/productos/:id   | Admin   | Actualizar producto |
| DELETE | /api/productos/:id   | Admin   | Eliminar producto   |

### Pedidos

| Metodo | Ruta                     | Acceso | Descripcion              |
|--------|--------------------------|--------|--------------------------|
| POST   | /api/pedidos             | JWT    | Crear pedido             |
| GET    | /api/pedidos/mis-pedidos | JWT    | Pedidos del usuario      |
| GET    | /api/pedidos             | Admin  | Todos los pedidos        |

---

## Como Ejecutar

### 1. Backend

```powershell
cd server
npm install
$env:DATABASE_URL = "file:./dev.db"
npx prisma generate
npx prisma db push
node prisma/seed.js
npm run dev
```

El servidor estara en: `http://localhost:3000`

### 2. Frontend

```powershell
cd frontend
npx http-server -p 8080 --cors
```

El frontend estara en: `http://localhost:8080`

### Credenciales de Prueba

| Rol   | Email              | Password  |
|-------|--------------------|-----------|
| Admin | admin@zaoshop.com  | Admin123! |
| User  | user@zaoshop.com   | User123!  |

---

## Medidas de Seguridad OWASP Aplicadas

### 1. A01:2021 - Broken Access Control
**Riesgo:** Usuarios no autorizados acceden a funciones de administrador.

**Mitigacion implementada:**
- Middleware `verifyToken` valida JWT en cada peticion protegida
- Middleware `requireRole('admin')` bloquea acceso a usuarios sin rol admin
- Frontend oculta menu Admin para usuarios normales y redirige si intentan acceder directamente

**Archivo:** `/server/middleware/auth.middleware.js`

### 2. A02:2021 - Cryptographic Failures
**Riesgo:** Contrasenas almacenadas en texto plano.

**Mitigacion implementada:**
- Hash de contrasenas con **bcrypt** (10 salt rounds)
- JWT firmado con secreto configurable (`JWT_SECRET`)
- Campo `passwordHash` nunca se retorna en respuestas de API

**Archivo:** `/server/controllers/auth.controller.js`

### 3. A03:2021 - Injection
**Riesgo:** SQL Injection y Cross-Site Scripting (XSS).

**Mitigacion implementada:**
- **Prisma ORM** parametriza todas las consultas SQL automaticamente
- **express-validator** sanitiza entradas con `escape()` y `trim()`
- Frontend usa `textContent` en lugar de `innerHTML` para datos dinamicos
- Funcion `escapeHTML()` en las vistas para prevenir XSS

**Archivos:**
- `/server/middleware/validate.middleware.js`
- `/frontend/views/product.view.js`

### Otras Medidas de Seguridad

| Medida | Implementacion |
|--------|----------------|
| **CORS Seguro** | Solo permite `CORS_ORIGIN` configurado |
| **JWT con Expiracion** | Tokens expiran segun `JWT_EXPIRES_IN` |
| **Error Handler** | No expone stack traces en produccion |
| **Validacion de Entrada** | Todos los endpoints validan body/params |

---

## Pruebas Realizadas

| # | Prueba | Resultado |
|---|--------|-----------|
| 1 | Login admin obtiene token JWT | OK |
| 2 | Admin crea producto | OK |
| 3 | User NO puede crear producto (redirigido) | OK |
| 4 | Catalogo muestra productos desde API | OK |
| 5 | Carrito funciona y persiste | OK |
| 6 | Checkout crea pedido en BD | OK |
| 7 | Admin ve todos los pedidos | OK |

---

## Modelo de Base de Datos

```
+-------------+       +---------------+
|   Usuario   |       |   Producto    |
+-------------+       +---------------+
| id          |       | id            |
| email       |       | nombre        |
| passwordHash|       | descripcion   |
| role        |       | precio        |
| createdAt   |       | stock         |
+------+------+       | imagen        |
       |              | categoria     |
       |              | createdAt     |
       |              +-------+-------+
       |                      |
+------v------+       +-------v-------+
|   Pedido    |       | PedidoDetalle |
+-------------+       +---------------+
| id          |<------| id            |
| usuarioId   |       | pedidoId      |
| total       |       | productoId    |
| createdAt   |       | cantidad      |
+-------------+       | precioUnitario|
                      +---------------+
```

---

## Tecnologias Utilizadas

### Backend
- Node.js + Express
- Prisma ORM + SQLite
- bcrypt (hash de contrasenas)
- jsonwebtoken (JWT)
- express-validator (validacion)
- cors (politica CORS)

### Frontend
- HTML5 semantico
- CSS3 (variables, flexbox, grid, responsive)
- JavaScript ES6+ (MVC pattern)
- Fetch API + async/await

---

## Autor

**ZaoShop** - Reto 2 Full Stack MVC

## Licencia

MIT
