# Trazabilidad ISO/IEC 25010

Marco de evaluacion (no certificacion). Caracteristicas aplicables al producto Medifast Pharmacy.

| Caracteristica | Subcaracteristica | Requisito | Control / artefacto | Evidencia | Estado |
|----------------|-------------------|-----------|---------------------|-----------|--------|
| Adecuacion funcional | Completitud | RF-001..RF-012 | inventario-funcional.md | Codigo + docs | Parcial |
| Fiabilidad | Recuperabilidad | RNF-002 | migrate CI | GitHub Actions backend job | TESTED |
| Usabilidad | Reconocibilidad | design.md | tokens CSS, PageState | index.css, Vitest | TESTED |
| Seguridad | Confidencialidad | RNF-003 | gitleaks, permisos API | CI secrets + test_viewset_permissions | TESTED |
| Seguridad | Integridad | RNF-004 | throttle login | LoginRateThrottle + settings | TESTED |
| Mantenibilidad | Modularidad | RNF-001 | apps Django | SAD | IMPLEMENTED |
| Mantenibilidad | Analizabilidad | RNF-005 | apiError unificado | frontend utils + CI lint | TESTED |
| Compatibilidad | Coexistencia | RNF-009 | SQLite/PG | settings USE_SQLITE | TESTED |
| Portabilidad | Adaptabilidad | RNF-010 | Playwright smoke | frontend/e2e/smoke.spec.js | TESTED |

Actualizar filas al cerrar cada epica del backlog.
