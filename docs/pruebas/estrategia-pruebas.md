# Estrategia de pruebas

## Piramide

1. **Unitarias backend**: modelos, handler errores, utilidades.
2. **API**: autenticacion, permisos, validacion (DB SQLite en CI).
3. **Frontend**: lint + build; componentes criticos (fase siguiente: Vitest).
4. **Integracion**: scripts/validate-local.ps1, flujos manuales documentados.
5. **E2E** (pendiente Playwright): login, turno, factura.

## Gates obligatorios (CI)

- `manage.py check`
- `migrate --noinput`
- Tests en `apps.identity.tests.test_*`
- `npm run lint` (0 errores)
- `npm run build`

## Cobertura objetivo

- 100% reglas de seguridad del handler de errores y throttle login.
- 80% global backend: meta incremental (no declarada cumplida hasta medicion).

## Datos de prueba

- `seed_dev_users` para roles.
- Scripts en `docs/desarrollo/datos-ejemplo.md`.

## Regresion

Ver `matriz-regresion.md` por flujo de negocio.
