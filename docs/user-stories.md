# User stories

## FASE-0-1 — Inspección inicial y estabilización de `production`

**As** responsable del proyecto Farmacia Django + React  
**I want** auditar el repositorio y estabilizar la rama `production` sin iniciar la modernización integral  
**So that** la aplicación sea reproducible, ejecutable y segura para continuar en fases posteriores con aprobación humana

### Acceptance criteria

1. Inspección de Git: rama `production`, remoto, estado del árbol, relación con `main`, sin operaciones destructivas.
2. Inspección técnica documentada: Django 5.1.7, DRF, React 19 + Vite, PostgreSQL/SQLite, autenticación por token.
3. Correcciones acotadas de estabilización (configuración, dependencias, lint, secretos en índice, migraciones locales).
4. Instalación reproducible de dependencias backend (Python 3.13 recomendado) y frontend.
5. `manage.py check`, migraciones y prueba smoke backend en verde.
6. `npm run lint` (sin errores) y `npm run build` en verde.
7. Documentación VEXARQ actualizada en `docs/`.
8. Commit en `production` y push a `origin/production` tras puertas de calidad.
9. Detenerse tras el push; no iniciar modernización ni demo.

**Received:** 2026-10-23  
**Status:** COMPLETED

---

*(Epic completo: PROMPT MAESTRO — Modernización integral de Farmacia Django + React mediante VEXARQ, recibido íntegramente en la solicitud de implementación del workflow user-story-implementation. Alcance autorizado en esta ejecución: secciones 5, 6 y 25 — Fase 0 y Fase 1 únicamente.)*

---

## MOD-EPIC — Modernización integral (Fases 2+)

**As** responsable del portafolio Medifast  
**I want** continuar el PROMPT MAESTRO desde `develop` en rama `feat/modernizacion-integral-farmacia`  
**So that** el proyecto cumpla requisitos de arquitectura, calidad, seguridad, accesibilidad, pruebas, CI/CD y documentación profesional

### Acceptance criteria (oleada 1 — en progreso)

1. Rama de trabajo desde `develop` verificada.
2. Artefactos Fase 3: SAD, requisitos, backlog, ADR, design.md.
3. CI GitHub Actions backend + frontend.
4. Handler de errores API y prueba asociada.
5. Comando `seed_dev_users` documentado.
6. UX: 404, atajos, tokens CSS, página /proyecto.
7. README, CHANGELOG, SECURITY, LICENSE raíz.

**Received:** 2026-10-23  
**Status:** IN_PROGRESS
