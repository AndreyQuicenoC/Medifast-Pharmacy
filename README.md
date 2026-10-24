# Medifast Pharmacy

Sistema de gestion para farmacia (turnos, cajas, productos, facturas, estadisticas) con backend **Django REST** y frontend **React**.

## Origen y evolucion del proyecto

Esta aplicacion fue desarrollada originalmente como proyecto academico en equipo para el curso Desarrollo de Software I. Sus integrantes originales fueron Francesco Garcia Vargas, Jonathan Aristizabal, Diego Espinosa, Adolfo Andrey Quiceno, Miguel Casanova, Diego Armado Espinosa y Jose Daniel Trujillo Suarez.

La version actual corresponde a una modernizacion individual realizada por Andrey Quiceno ([@AndreyQuicenoC](https://github.com/AndreyQuicenoC)), orientada a calidad, arquitectura, seguridad, accesibilidad, pruebas, documentacion y DevOps. La modernizacion no implica que los integrantes originales hayan participado en los cambios posteriores.

## Requisitos

- Python **3.13** (recomendado)
- Node.js **20+**
- PostgreSQL (produccion) o SQLite (local con `USE_SQLITE=True`)

## Instalacion rapida (local)

### Backend

```powershell
cd backend
copy .env.example .env
py -3.13 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_dev_users
.\.venv\Scripts\python manage.py runserver
```

### Frontend

```powershell
cd frontend
copy .env.example .env
npm ci
npm run dev
```

API por defecto: `http://localhost:8000/api` (variable `VITE_API_BASE_URL`).

### Validacion integrada

```powershell
.\scripts\validate-local.ps1
```

## Usuarios de desarrollo

Comando: `python manage.py seed_dev_users` (solo entorno local). Documentacion detallada en `docs/desarrollo/usuarios-prueba.md`. **No** publique contrasenas de desarrollo en produccion.

## Documentacion

| Documento | Contenido |
|-----------|-----------|
| [docs/design.md](docs/design.md) | Sistema visual |
| [docs/arquitectura/SAD.md](docs/arquitectura/SAD.md) | Arquitectura |
| [docs/requisitos/requisitos.md](docs/requisitos/requisitos.md) | Requisitos |
| [docs/backlog/modernizacion-backlog.md](docs/backlog/modernizacion-backlog.md) | Backlog |
| [CHANGELOG.md](CHANGELOG.md) | Cambios |
| [SECURITY.md](SECURITY.md) | Seguridad |

## CI/CD

GitHub Actions: `.github/workflows/ci.yml` (lint, build frontend; check, migrate, tests backend).

## PostgreSQL opcional (Docker)

```powershell
docker compose up -d db
```

Configure `USE_SQLITE=False` y variables `DB_*` en `backend/.env`.

## Licencia

Ver [LICENSE](LICENSE). Uso restringido; no redistribucion sin autorizacion.
