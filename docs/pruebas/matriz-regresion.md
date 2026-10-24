# Matriz de regresion (flujos criticos)

| ID | Flujo | Pasos | Resultado esperado | Automatizado |
|----|-------|-------|-------------------|--------------|
| REG-001 | Login admin | seed user → login → /admin | Dashboard carga | No |
| REG-002 | Login cajero | empleado dev → /cajero | Vista cajero | No |
| REG-003 | Cliente turno | cliente dev → pedir turno | Turno creado | No |
| REG-004 | API health | check + migrate CI | 0 issues | Si (CI) |
| REG-005 | Build frontend | npm run build | exit 0 | Si (CI) |

Prioridad automatizacion E2E: REG-001..003 (Playwright, backlog).
