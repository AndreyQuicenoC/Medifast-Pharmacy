# Despliegue en Render

Guía para publicar el backend Django en Render. **No incluya credenciales reales en Git**; configúrelas solo en el panel de Render.

## Pasos resumidos

1. Crear **Web Service** conectado al repositorio.
2. Crear base **PostgreSQL** en Render y vincular variables.
3. **Build command:** `cd backend && pip install -r requirements.txt && python manage.py collectstatic --noinput`
4. **Start command:** `cd backend && gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`

## Variables de entorno (panel Render)

Copie los nombres desde `backend/.env.example` y asigne valores generados en el panel (nunca en el repositorio):

| Variable | Descripción |
|----------|-------------|
| `SECRET_KEY` | Clave Django (generar valor aleatorio largo) |
| `DEBUG` | `False` en producción |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Credenciales de la instancia PostgreSQL de Render |
| `RENDER_EXTERNAL_HOSTNAME` | Host asignado por Render |
| `FRONTEND_URL` | URL del frontend (CORS) |

Ejemplo **solo ilustrativo** (sustituir cada valor):

```env
SECRET_KEY=<generar-en-panel-render>
DEBUG=False
DB_NAME=<desde-postgres-render>
DB_USER=<desde-postgres-render>
DB_PASSWORD=<desde-postgres-render>
DB_HOST=<desde-postgres-render>
DB_PORT=5432
RENDER_EXTERNAL_HOSTNAME=<su-app>.onrender.com
```

## Post-despliegue

```bash
cd backend
python scripts/deploy/create_superuser.py
```

Requiere variables `ADMIN_CC`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_PHONE`.

## Rotación de credenciales

Si alguna clave estuvo alguna vez en el historial de Git, **rótela** en Render y PostgreSQL aunque ya no aparezca en el árbol actual. Ver [SECURITY.md](../../SECURITY.md).
