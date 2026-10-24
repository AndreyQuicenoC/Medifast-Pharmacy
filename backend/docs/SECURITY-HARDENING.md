# Endurecimiento de seguridad (backend)

## Cambios aplicados

| ID | Riesgo | Mitigacion |
|----|--------|------------|
| SEC-B01 | App `admins` vacia / ruido | Eliminada de `INSTALLED_APPS` |
| SEC-B02 | Ruta debug `test_auth` | Eliminada de `config/urls.py` |
| SEC-B03 | Fuga de detalle en registro | 500 generico + log interno |
| SEC-B04 | PostgreSQL sin password | `DB_PASSWORD` obligatorio si `USE_SQLITE` false |
| SEC-B05 | SQLite en produccion | Error si `DEBUG=False` y `USE_SQLITE` |
| SEC-B06 | Estadisticas publicas | `@permission_classes([IsAuthenticated])` |
| SEC-B07 | Secretos en scripts | Variables de entorno documentadas en `scripts/` |

## Superficies publicas (explicitas)

- `POST /api/authtoken/` — login con throttle
- `POST /api/register/` — solo rol cliente; validacion servidor

## Deuda conocida

- Token DRF en header (frontend en localStorage) — ver politica de seguridad transversal.
- Endpoints legacy con nombres en espanol/ingles mezclados — contrato estable por compatibilidad.

## Verificacion

`make security` (bandit + pip-audit) y tests en `tests/*/test_api_permissions.py`.
