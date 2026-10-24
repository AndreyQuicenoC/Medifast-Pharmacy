# 🏥 Frontend - Sistema de Farmacia Django React

## 📋 Descripción

Frontend en React del sistema integral de gestión para farmacia, que incluye manejo de usuarios, turnos, productos, ventas, facturación y estadísticas.

## 🚀 Instalación

```bash
npm install
```

## 🔧 Comandos Disponibles

```bash
# Ejecutar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Verificar código con ESLint
npm run lint

# Preview de la build de producción
npm run preview
```

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000

## 📱 Páginas Principales

| Ruta            | Descripción                  | Rol Requerido  |
| --------------- | ---------------------------- | -------------- |
| `/login`        | Inicio de sesión             | Público        |
| `/register`     | Registro de clientes         | Público        |
| `/admin`        | Panel administrativo         | Administrador  |
| `/servicios`    | Gestión de servicios médicos | Administrador  |
| `/turnos`       | Gestión de turnos y citas    | Administrador  |
| `/facturas`     | Visualización de facturas    | Administrador  |
| `/estadisticas` | Dashboard con gráficos       | Administrador  |
| `/cajero`       | Punto de venta               | Empleado/Admin |
| `/cajas`        | Gestión de cajas             | Administrador  |
| `/producto`     | Gestión de productos         | Administrador  |
| `/pedir-turno`  | Solicitar cita               | Cliente        |

## 🔑 Usuarios de Prueba

Ver [usuarios-prueba.md](./usuarios-prueba.md) (`seed_dev_users --password` en backend local).

## 📦 Dependencias Principales

### Core React

- `react@^19.0.0` - Framework principal
- `react-dom@^19.0.0` - DOM rendering
- `react-router-dom@^7.3.0` - Navegación y rutas

### Comunicación API

- `axios@^1.8.3` - Cliente HTTP para API calls

### UI/UX

- `react-hot-toast@^2.5.2` - Notificaciones
- `tailwindcss@^4.0.14` - Framework CSS
- `@tailwindcss/vite@^4.0.14` - Plugin Vite para Tailwind

### Gráficos y Estadísticas

- `chart.js@^4.5.0` - Librería de gráficos
- `react-chartjs-2@^5.3.0` - Wrapper React para Chart.js

### Generación de PDFs

- `jspdf@^2.5.1` - Generación de PDFs
- `jspdf-autotable@^3.8.2` - Tablas para PDFs

### Formularios (Opcional)

- `react-hook-form@^7.54.2` - Manejo avanzado de formularios

## 🏗️ Arquitectura del Frontend

```
frontend/
├── src/
│   ├── api/                    # Servicios de API
│   │   ├── user.api.js
│   │   ├── servicio.api.js
│   │   ├── facturas.api.js
│   │   └── ...
│   ├── components/             # Componentes reutilizables
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   └── ...
│   ├── pages/                  # Páginas principales
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── admin.jsx
│   │   ├── Services.jsx
│   │   ├── facturas.jsx
│   │   ├── estadisticas.jsx
│   │   └── ...
│   ├── assets/                 # Recursos estáticos
│   ├── App.jsx                 # Componente principal
│   └── main.jsx               # Punto de entrada
├── public/                     # Archivos públicos
├── package.json               # Dependencias npm
├── requirements.txt           # Lista de dependencias
├── vite.config.js            # Configuración Vite
├── tailwind.config.js        # Configuración Tailwind
└── README.md                 # Esta documentación
```

## 🔐 Autenticación

El sistema utiliza autenticación por token:

- Los tokens se almacenan en `localStorage`
- Se incluyen en headers de todas las requests API
- Se verifica el rol del usuario para acceso a páginas

## 📊 Funcionalidades Implementadas

### ✅ Gestión de Usuarios

- Registro de clientes
- Login con CC y contraseña
- Roles: cliente, empleado, administrador
- Gestión de perfiles

### ✅ Sistema de Turnos

- Solicitud de turnos por clientes
- Gestión de turnos por empleados
- Estados: pendiente, en_proceso, finalizado, cancelado
- Filtrado y búsqueda

### ✅ Gestión de Productos

- CRUD completo de productos farmacéuticos
- Control de stock
- Categorización
- Precios y descuentos

### ✅ Facturación

- Generación de facturas
- Visualización de productos vendidos
- Cálculo de totales
- Impresión de facturas

### ✅ Dashboard de Estadísticas

- Gráficos de ventas por período
- Top productos más vendidos
- Estadísticas de servicios
- Métricas de clientes
- Tiempos de atención

### ✅ Punto de Venta

- Interface de cajero
- Selección de productos
- Aplicación de descuentos
- Generación de PDFs

## 🎨 Estilos y Diseño

- **Framework:** Tailwind CSS
- **Responsive:** Diseño adaptable a móviles y desktop
- **Colores:** Esquema profesional médico (verde, azul, blanco)
- **Componentes:** Interfaz moderna y limpia

## 🔧 Configuración de Desarrollo

### Vite

El proyecto usa Vite como build tool para desarrollo rápido:

- Hot Module Replacement (HMR)
- Build optimizada
- Plugin para React

### ESLint

Configuración de linting para calidad de código:

- Reglas para React Hooks
- Reglas para React Refresh
- Standards modernos de JavaScript

## 📡 Comunicación con Backend

### Endpoints Principales

- `POST /api/authtoken/` - Autenticación
- `GET /api/users/` - Gestión usuarios
- `GET /api/servicios/` - Servicios médicos
- `GET /api/turnos/` - Turnos y citas
- `GET /api/facturas/` - Facturas
- `GET /api/estadisticas/*` - Estadísticas
- `GET /api/productos/` - Productos

### Autenticación

```javascript
// Headers incluidos automáticamente
{
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json'
}
```

## 🐛 Debugging

### Console Logs

El sistema incluye logs detallados para debugging:

- 🔑 Logs de autenticación
- 📊 Logs de carga de datos
- 🔍 Logs de filtrado
- ❌ Logs de errores

### Herramientas

- React Developer Tools
- Redux DevTools (si se implementa Redux)
- Network tab para API calls

## 🚀 Deployment

### Build de Producción

```bash
npm run build
```

### Variables de Entorno

Crear archivo `.env` con:

```
VITE_API_BASE_URL=http://localhost:8000
VITE_APP_NAME=Sistema Farmacia
```

## 📄 Licencia

Este proyecto es parte del sistema integral de gestión para farmacia.

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork del repositorio
2. Crear rama para feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### 📁 Estructura Final del Frontend

```
frontend/
├── src/                 # Código fuente React
├── public/              # Archivos estáticos
├── node_modules/        # Dependencias (generado)
├── .gitignore          # Archivos ignorados por Git
├── eslint.config.js    # Configuración de ESLint
├── index.html          # Archivo HTML principal
├── package.json        # Dependencias y scripts npm
├── package-lock.json   # Lock de dependencias
├── README.md           # Documentación básica
├── README-FRONTEND.md  # Documentación detallada
└── vite.config.js      # Configuración de Vite
```

---

**⚡ ¡Sistema listo para usar! Para iniciar: `npm run dev`**
