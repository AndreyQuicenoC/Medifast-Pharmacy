# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/). Versionado [SemVer](https://semver.org/lang/es/).

## [2.0.0] — 2026-10-24

Modernizacion integral VEXARQ: arquitectura por dominios, calidad en CI, seguridad y documentacion transversal.

### Anadido

- Backend: `config/`, apps `identity` / `catalog` / `operations`, `tests/` modular, `scripts/`, `Makefile`, pipeline CI (ruff, pytest+cobertura, bandit, radon, interrogate, pip-audit)
- Frontend: `PageShell`, `apiError`, Vitest, Playwright smoke, dependencias de build corregidas (jspdf)
- Documentacion en `docs/` (RF/RNF, ISO 25010, VEXARQ, diseno, operaciones, informe pre-demo)
- CI: gitleaks, Docker, docker-compose, CONTRIBUTING, pagina `/proyecto`, 404, atajos de teclado
- Matrices de trazabilidad y plan de implementacion por bloques

### Cambiado

- Renombrado proyecto Django `DS1` → `config`; rutas de scripts y despliegue (`render.yaml`, Gunicorn)
- Usuarios de desarrollo: `seed_dev_users --password` obligatorio; scripts con `MEDIFAST_DEV_PASSWORD`
- Documentacion de despliegue Render sin credenciales embebidas

### Corregido

- Gitleaks: secretos en docs, regla custom defectuosa, plantillas `.env` vacias, allowlist tests/docs, `package.json` raiz legacy
- Pruebas backend funcionales (auth, producto, servicios) con fabricas aisladas; permisos por dominio
- Demo academica documentada fuera del repositorio principal
- Seguridad: permisos API, estadisticas autenticadas, registro sin fuga de excepciones, `DB_PASSWORD` obligatorio fuera de SQLite
- Build frontend en CI; npm audit en dependencias criticas

### Seguridad

- Rotar credenciales si estuvieron expuestas en documentacion historica (ver [SECURITY.md](SECURITY.md))

## [1.0.0-base] — 2026-10-23

### Anadido

- Commit base unificado post-estabilizacion Fase 1 del proyecto academico original
