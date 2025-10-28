# E-Commerce Web Application

Proyecto de e-commerce desarrollado inicialmente con HTML, CSS y JavaScript vanilla, preparado para migración a TypeScript y React.

## 🚀 Estructura del Proyecto

```
pagina web/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos globales con variables CSS
├── js/
│   └── main.js         # Lógica de la aplicación
└── README.md           # Documentación
```

## 📋 Características Actuales

- ✅ Diseño responsive
- ✅ Sistema de grid para productos y categorías
- ✅ Carrito de compras funcional
- ✅ Lista de deseos
- ✅ Variables CSS para temas
- ✅ Estructura modular preparada para componentes

## 🎨 Tecnologías Actuales

- HTML5
- CSS3 (con variables CSS)
- JavaScript ES6+

## 🔄 Próximas Migraciones

### Fase 1: TypeScript
- [ ] Convertir `main.js` a TypeScript
- [ ] Definir interfaces y tipos
- [ ] Configurar tsconfig.json

### Fase 2: React + TypeScript
- [ ] Crear componentes React
  - Header
  - ProductCard
  - CategoryCard
  - Cart
  - Footer
- [ ] Implementar React Router
- [ ] State management (Context API o Redux)
- [ ] Hooks personalizados

### Fase 3: Bibliotecas adicionales
- [ ] Styled Components o Emotion para CSS-in-JS
- [ ] React Query para manejo de datos
- [ ] Formularios con React Hook Form
- [ ] Autenticación
- [ ] Integración con API backend

## 🛠️ Cómo empezar

### Versión Actual (HTML/CSS/JS)

1. Abre `index.html` en tu navegador
2. No requiere instalación ni servidor

### Para desarrollo local con servidor:

```powershell
# Con Python
python -m http.server 8000

# Con Node.js (http-server)
npx http-server
```

Luego visita `http://localhost:8000`

## 📝 Convenciones de Código

- **CSS**: Uso de variables CSS para fácil migración a CSS-in-JS
- **JavaScript**: Funciones modulares preparadas para convertir en hooks/componentes
- **Comentarios**: Secciones claramente delimitadas
- **Naming**: camelCase para JS, kebab-case para CSS

## 🎯 Arquitectura Preparada para React

El código actual está estructurado pensando en la migración:

- **Estado centralizado** (`appState`) → Fácil migración a Context/Redux
- **Funciones puras** → Convertibles a custom hooks
- **UI separada de lógica** → Base para componentes React
- **Variables CSS** → Compatible con CSS-in-JS

## 🔧 Variables CSS Principales

```css
--primary-color: #3b82f6
--secondary-color: #64748b
--spacing-md: 1rem
--border-radius-md: 0.5rem
--transition-base: 300ms
```

## 📱 Responsive Breakpoints

- Mobile: < 480px
- Tablet: < 768px
- Desktop: > 768px

## 🤝 Contribuciones

Este es un proyecto en desarrollo. Las contribuciones son bienvenidas.

## 📄 Licencia

MIT License

---

**Última actualización:** Octubre 2025
