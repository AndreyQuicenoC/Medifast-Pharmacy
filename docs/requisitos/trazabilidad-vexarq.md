# Trazabilidad VEXARQ

Cadena: criterio → responsabilidad → implementacion → prueba → evidencia → estado.

| ID | Criterio | Capa | Implementacion | Prueba | Evidencia | Estado |
|----|----------|------|----------------|--------|-----------|--------|
| MOD-001 | Handler errores API | Backend | DS1/exceptions.py | test_api_exception_handler | CI | TESTED |
| MOD-002 | Usuarios dev por rol | Backend | seed_dev_users | comando manual | usuarios-prueba.md | TESTED |
| MOD-003 | CI reproducible | DevOps | ci.yml | GitHub Actions | workflow | TESTED |
| MOD-004 | Pagina 404 | Frontend | PageNotFound.jsx | build | lint/build | TESTED |
| MOD-005 | Throttle login | Backend | LoginRateThrottle | pendiente | throttles.py | IMPLEMENTED |
| MOD-006 | Docs transversales | Docs | docs/README.md | revision | este archivo | IN_PROGRESS |

Actualizar al cerrar cada bloque del plan-implementacion.md.
