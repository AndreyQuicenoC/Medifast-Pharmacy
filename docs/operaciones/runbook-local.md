# Runbook — entorno local

## Sintomas: backend no arranca

1. Verificar `SECRET_KEY` en `backend/.env`.
2. `python manage.py check`
3. Si PostgreSQL: `docker compose ps` y variables `DB_*`.

## Sintomas: frontend no conecta

1. Backend en `http://127.0.0.1:8000`
2. `VITE_API_BASE_URL=http://localhost:8000/api` en `frontend/.env`
3. CORS: origen `http://localhost:5173` permitido en settings.

## Sintomas: login falla

1. Ejecutar `seed_dev_users`
2. Usar cedula ficticia documentada en usuarios-prueba.md
3. Revisar throttle (429) — esperar 1 minuto.

## Reset datos locales SQLite

Eliminar `backend/db.sqlite3` y volver a `migrate` + `seed_dev_users`.
