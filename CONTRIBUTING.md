# Guia de contribucion

## Flujo Git

1. Rama base de integracion: `develop`.
2. Rama estable: `main` (solo via PR aprobado segun reglas del repositorio).
3. Trabajo en ramas `feat/*`, `fix/*`, `docs/*` desde `develop`.

## Calidad minima antes de PR

```powershell
.\scripts\validate-local.ps1
```

CI debe quedar en verde (backend + frontend).

## Commits

Mensajes en espanol, estilo convencional: `feat:`, `fix:`, `docs:`, `test:`, `ci:`, `security:`.

## Secretos

No commitear `.env`, `SuperUser.txt`, credenciales reales. Ejecutar gitleaks localmente si esta disponible.

## Documentacion

Toda documentacion de proceso vive en `docs/`. Actualizar el indice en `docs/README.md` cuando se anadan secciones.
