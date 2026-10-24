# Plan de implementacion (modernizacion integral)

Orden de ejecucion en rama `feat/modernizacion-integral-farmacia`. Cada bloque termina con CI verde.

## Bloque A — Documentacion y gobernanza (actual)

- [x] Reorganizar docs raiz → `docs/`
- [x] Indice maestro docs/README.md
- [x] RF/RNF, contratos, modelo datos, estrategia pruebas
- [x] design.md secciones 1-18 (referencia en docs/arquitectura/)
- [x] Matriz ISO 25010 poblada con evidencias TESTED

## Bloque B — Plataforma

- [x] CI GitHub Actions
- [x] Gitleaks en CI
- [x] Docker backend + frontend
- [x] docker-compose integrado

## Bloque C — Backend

- [x] Exception handler
- [x] seed_dev_users
- [x] Throttle login
- [x] Tests permisos ViewSets criticos
- [x] Refactor incremental views (permisos explicitos en ViewSets clave)

## Bloque D — Frontend

- [x] 404, atajos, tokens
- [x] apiError helper
- [x] PageState en paginas principales
- [x] Adaptar mensajes error API unificada (capa producto.api + patron PageShell)
- [x] Vitest smoke componentes

## Bloque E — Seguridad y dependencias

- [x] Auditoria OWASP documentada con hallazgos (docs/seguridad/)
- [x] pip-audit / npm audit en CI
- [x] Actualizacion parches seguridad (jspdf en frontend, limpieza secretos)

## Bloque F — Cierre repositorio original

- [x] README y docs alineados al estado real
- [x] Informe final pre-demo (`docs/operaciones/informe-pre-demo.md`)
- [ ] Autorizacion explicita Fase 15 demo (fuera de este repo)

Merge a `develop` solo via PR con reglas de rama del usuario.
