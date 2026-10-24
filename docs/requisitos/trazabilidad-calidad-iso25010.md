# Trazabilidad ISO/IEC 25010

Marco de evaluacion (no certificacion). Caracteristicas aplicables al producto Medifast Pharmacy.

| Caracteristica | Subcaracteristica | Requisito | Control / artefacto | Evidencia | Estado |
|----------------|-------------------|-----------|---------------------|-----------|--------|
| Adecuacion funcional | Completitud | RF-001..RF-012 | inventario-funcional.md | Codigo + docs | Parcial |
| Fiabilidad | Recuperabilidad | RNF-002 | migrate CI | GitHub Actions | TESTED |
| Usabilidad | Reconocibilidad | design.md | tokens CSS | index.css | IMPLEMENTED |
| Seguridad | Confidencialidad | RNF-003 | gitleaks, .gitignore | CI | IMPLEMENTED |
| Mantenibilidad | Modularidad | RNF-001 | apps Django | SAD | IMPLEMENTED |
| Compatibilidad | Coexistencia | RNF-009 | SQLite/PG | settings | TESTED |

Actualizar filas al cerrar cada epica del backlog.
