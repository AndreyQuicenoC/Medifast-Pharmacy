# Informe pre-demo (repositorio original)

Fecha de corte: 2026-10-23. Rama objetivo: `feat/modernizacion-integral-farmacia` → PR a `develop`.

## Alcance completado (bloques C–F)

| Bloque | Entregable | Evidencia |
|--------|------------|-----------|
| C | Permisos ViewSets + estadísticas autenticadas | `test_viewset_permissions.py`, CI backend |
| D | PageState / PageShell en páginas CRUD | `PageState.jsx`, páginas admin/cajas/producto/etc. |
| E | pip-audit + npm audit en CI | `.github/workflows/ci.yml` |
| F | E2E Playwright smoke + matriz ISO | `frontend/e2e/smoke.spec.js`, `trazabilidad-calidad-iso25010.md` |

## Calidad y CI

- Gitleaks `--no-git` sin secretos en árbol.
- Backend: `manage.py check`, migraciones, tests unitarios permisos + handler de errores.
- Frontend: ESLint, Vitest (PageState), build Vite, npm audit (high), Playwright (login).

## Demo externa

La demo académica **no** vive en este repositorio. Tras merge a `develop`, crear réplica dedicada (Fase 15) con datos ficticios y credenciales fuera de Git.

## Riesgos conocidos

- Token en `localStorage` (deuda XSS documentada en política de seguridad).
- Scripts legacy de datos (`script_datosdeprueba.py`) requieren `MEDIFAST_DEV_PASSWORD`.

## Autorización Fase 15

Pendiente aprobación explícita del equipo antes de publicar réplica de demo.
