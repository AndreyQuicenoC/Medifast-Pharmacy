# Plan de implementacion (modernizacion integral)

Orden de ejecucion en rama `feat/modernizacion-integral-farmacia`. Cada bloque termina con CI verde.

## Bloque A — Documentacion y gobernanza (actual)

- [x] Reorganizar docs raiz → `docs/`
- [x] Indice maestro docs/README.md
- [x] RF/RNF, contratos, modelo datos, estrategia pruebas
- [ ] Completar design.md secciones 1-18
- [ ] Matriz ISO 25010 poblada con evidencias

## Bloque B — Plataforma

- [x] CI GitHub Actions
- [ ] Gitleaks en CI
- [ ] Docker backend + frontend
- [ ] docker-compose integrado

## Bloque C — Backend

- [x] Exception handler
- [x] seed_dev_users
- [ ] Throttle login
- [ ] Tests permisos ViewSets criticos
- [ ] Refactor incremental views (sin cambiar contratos)

## Bloque D — Frontend

- [x] 404, atajos, tokens
- [x] apiError helper
- [ ] PageState en paginas principales
- [ ] Adaptar mensajes error API unificada
- [ ] Vitest smoke componentes

## Bloque E — Seguridad y dependencias

- [ ] Auditoria OWASP documentada con hallazgos
- [ ] pip-audit / npm audit en CI (informativo)
- [ ] Actualizacion parches seguridad

## Bloque F — Cierre repositorio original

- [ ] README y docs alineados al estado real
- [ ] Informe final pre-demo
- [ ] Autorizacion explicita Fase 15 demo

Merge a `develop` solo via PR con reglas de rama del usuario.
