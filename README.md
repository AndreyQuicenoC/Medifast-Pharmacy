# Medifast Pharmacy

[![CI](https://github.com/AndreyQuicenoC/Medifast-Pharmacy/actions/workflows/ci.yml/badge.svg)](https://github.com/AndreyQuicenoC/Medifast-Pharmacy/actions/workflows/ci.yml)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
![Python 3.13](https://img.shields.io/badge/Python-3.13-blue.svg)
![Node 20](https://img.shields.io/badge/Node-20-green.svg)
![Django 5.2](https://img.shields.io/badge/Django-5.2-darkgreen.svg)
![React 19](https://img.shields.io/badge/React-19-61dafb.svg)

Sistema de gestion para farmacia (turnos, cajas, productos, facturas, estadisticas) con backend **Django REST** y frontend **React**.

**Version actual:** [2.0.0](CHANGELOG.md) — modernizacion individual por [@AndreyQuicenoC](https://github.com/AndreyQuicenoC).

## Origen del proyecto

Proyecto academico original (Desarrollo de Software I). La version 2.x es una modernizacion individual orientada a calidad, seguridad, pruebas, accesibilidad y DevOps; los autores originales no participaron en esta oleada.

## Requisitos

- Python **3.13**
- Node.js **20+**
- PostgreSQL (produccion) o SQLite (`USE_SQLITE=True` en `backend/.env`)

## Instalacion rapida (local)

### Backend

```powershell
cd backend
copy .env.example .env
py -3.13 -m venv .venv
.\.venv\Scripts\pip install -r requirements-dev.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_dev_users --password "<local-only>"
.\.venv\Scripts\python manage.py runserver
```

Calidad backend: `make quality` (Linux/macOS) o `.\scripts\quality.ps1` (Windows).

### Frontend (Vite)

Desde la carpeta `frontend`: copie `.env.example` a `.env`, ejecute `npm ci` y `npm run dev`.

API por defecto: `http://localhost:8000/api` (`VITE_API_BASE_URL`).

### Validacion integrada

```powershell
.\scripts\validate-local.ps1
```

## Demo academica (externa)

La demo con datos ficticios no vive en este repo. Use el directorio hermano `Medifast-Pharmacy-Demo` (plantilla) o [docs/operaciones/demo-externa.md](docs/operaciones/demo-externa.md).

## Documentacion

- Indice: **[docs/README.md](docs/README.md)**
- Backend: [backend/docs/STRUCTURE.md](backend/docs/STRUCTURE.md)
- Frontend: [frontend/docs/STRUCTURE.md](frontend/docs/STRUCTURE.md)
- Usuarios dev: [docs/desarrollo/usuarios-prueba.md](docs/desarrollo/usuarios-prueba.md)

## CI/CD

GitHub Actions (`.github/workflows/ci.yml`): gitleaks, backend (lint, tests, cobertura, bandit, audits), frontend (lint, vitest, build, npm audit, Playwright).

## PostgreSQL opcional (Docker)

```powershell
copy .env.example .env   # raiz: POSTGRES_PASSWORD
docker compose up -d db
```

Configure `USE_SQLITE=False` y `DB_*` en `backend/.env`.

## Licencia

Ver [LICENSE](LICENSE). Uso restringido; no redistribucion sin autorizacion.
