# Code structure

## Backend

### Stack
- Python 3.13 (recomendado; 3.15 no compatible con wheels actuales de Pillow/psycopg2)
- Django 5.1.7, DRF 3.16, PostgreSQL (producción) / SQLite (`USE_SQLITE=True`, FASE-1)

### API endpoints (prefijo `/api/`)
- POST `/api/authtoken/` — login token (FASE-0-1)
- POST `/api/register/` — registro público
- ViewSets: `users`, `clients`, `rol`, `u_admin`, `employee`, `caja`, `servicios`, `turnos`, `producto`, `facturas`
- Estadísticas: `/api/estadisticas/*`

### Models
- `users.User` (AUTH_USER_MODEL), roles cliente/empleado/administrador
- `tickets.*`, `products.Producto`, `admins.*`

### Configuración crítica
- `backend/DS1/settings.py` — SECRET_KEY obligatoria, `load_dotenv(BASE_DIR/.env)`, `USE_SQLITE` (FASE-1)
- `backend/.env.example` — plantilla local

## Frontend

### Stack
- React 19, Vite 6, Tailwind 4, axios, react-router-dom 7

### Pages
- `/`, `/register`, `/admin`, `/clienteManagement`, `/servicios`, `/schedules`, `/shift`, `/cajeros`, `/resenas`, `/estadisticas`, facturas/turnos/productos (FASE-0-1)

### Configuración
- `VITE_API_BASE_URL` — `frontend/.env.example` (FASE-1)

## Critical structures
- `backend/DS1/settings.py` — solo cambios mínimos de estabilización en Fase 1
- `backend/DS1/urls.py` — contrato API publicado; no modificado en Fase 1 salvo rutas existentes
- Autenticación Token DRF — no rediseñada en Fase 1

## Scripts
- `scripts/validate-local.ps1` — validación local Fase 1 (FASE-1)
