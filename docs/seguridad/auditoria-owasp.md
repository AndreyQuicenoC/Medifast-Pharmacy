# Auditoria de seguridad (OWASP)

Referencia: OWASP Top 10 (edicion publicada consultada en 2026; verificar en [owasp.org](https://owasp.org/www-project-top-ten/) antes de auditorias formales).

## Metodologia

Revision estatica de codigo, configuracion Django/React, dependencias y CI. Sin pruebas de penetracion externas.

## Inventario (resumen)

| ID | Categoria | Hallazgo | Severidad | Tratamiento | Evidencia |
|----|-----------|----------|-----------|-------------|-----------|
| SEC-001 | A02 Cryptographic failures | Historial Git pudo contener secretos | Alta | Rotacion + gitleaks + eliminacion SuperUser.txt | backup tag, .gitleaks.toml |
| SEC-002 | A07 Auth failures | Login sin limite previo | Media | LoginRateThrottle 10/min | throttles.py |
| SEC-003 | A05 Misconfiguration | DEBUG/SECRET en prod via env | Media | fail-fast SECRET_KEY, checklist deploy | settings.py |
| SEC-004 | A03 Injection | ORM Django | Baja | Mantener ORM, no SQL raw | code review |
| SEC-005 | A01 Broken access | Permisos DRF default autenticado | Media | Tests permisos pendientes | backlog |

Estado: **parcial**; no certifica ausencia total de vulnerabilidades.

## Controles implementados

- Handler errores sin stack al cliente.
- CORS restringido + FRONTEND_URL.
- Cookies seguras cuando `DEBUG=False`.
- Escaneo gitleaks en CI (workflow).

## Pendiente

- Tests autorizacion por ViewSet.
- pip-audit/npm audit gates.
- Rate limit adicional en register si es publico en prod.
