# Variables de entorno

## Backend (`backend/.env`)

| Variable | Obligatoria | Descripcion |
|----------|-------------|-------------|
| SECRET_KEY | Si | Clave Django |
| DEBUG | Si | True solo local |
| USE_SQLITE | No | True → SQLite local |
| DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT | Si (si PG) | PostgreSQL |
| FRONTEND_URL | No | Anade origen CORS |
| RENDER_EXTERNAL_HOSTNAME | No | Render hosts |
| LOGIN_THROTTLE | No | Default `10/min` |
| DJANGO_LOG_LEVEL | No | Logging |

Plantilla: `backend/.env.example`.

## Frontend (`frontend/.env`)

| Variable | Descripcion |
|----------|-------------|
| VITE_API_BASE_URL | URL API sin barra final duplicada en rutas |

Plantilla: `frontend/.env.example`.
