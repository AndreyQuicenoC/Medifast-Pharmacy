# Estrategia de pruebas

## Piramide

1. **Unitarias backend**: handler de errores, settings de plataforma.
2. **API funcional**: login/registro, CRUD producto, listado servicios (`backend/tests/**`, SQLite en memoria por caso).
3. **API permisos**: endpoints sensibles sin token → 401 (`test_api_permissions.py` por dominio).
4. **Frontend**: Vitest (utilidades), lint, build, Playwright smoke en CI.
5. **Integracion local**: `scripts/validate-local.ps1`.

## Aislamiento

- Cada `TestCase` usa base de datos de prueba independiente (pytest-django).
- Credenciales generadas en runtime (`tests/support/factories.py`); nada versionado.

## Gates obligatorios (CI)

- Gitleaks sobre el arbol de trabajo (`.gitleaks.toml`)
- `manage.py check`, `migrate --noinput`, `pytest` (cobertura ≥ 55 %)
- `npm run lint`, `test`, `build`, `test:e2e`

## Cobertura objetivo

- 100% reglas de seguridad del handler de errores y throttle login.
- 80% global backend: meta incremental (no declarada cumplida hasta medicion).

## Datos de prueba

- `seed_dev_users` para roles.
- Scripts en `docs/desarrollo/datos-ejemplo.md`.

## Regresion

Ver `matriz-regresion.md` por flujo de negocio.
