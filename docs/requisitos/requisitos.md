# Requisitos — modernizacion Medifast

## Funcionales (preservar)

- RF-001 Autenticacion por token y roles (cliente, empleado, administrador)
- RF-002 Gestion de usuarios y clientes
- RF-003 Turnos, cajas y servicios
- RF-004 Productos e inventario
- RF-005 Facturacion y estadisticas

## No funcionales

- RNF-001 Ejecucion local reproducible (SQLite / Docker PG)
- RNF-002 Secretos fuera del repositorio
- RNF-003 CI en PR hacia `develop` / `main`
- RNF-004 Accesibilidad objetivo WCAG 2.2 AA (iterativo)
- RNF-005 Documentacion en espanol
- RNF-006 Usuarios de prueba via `seed_dev_users` (solo dev)

## Trazabilidad

| ID | Evidencia |
|----|-----------|
| RNF-001 | `scripts/validate-local.ps1`, README |
| RNF-003 | `.github/workflows/ci.yml` |
| RNF-006 | `docs/desarrollo/usuarios-prueba.md` |
