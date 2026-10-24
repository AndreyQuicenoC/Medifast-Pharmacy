# Documento de arquitectura de software (SAD)

## Contexto

Monorepo Medifast Pharmacy: API Django REST + SPA React (Vite). Despliegue historico en Render (backend) y Vercel (frontend).

## Vista C4 — Contenedor

- **Browser**: React SPA
- **API**: Django + DRF (`/api/`)
- **BD**: PostgreSQL (prod) / SQLite (dev)

## Modulos backend

| App | Responsabilidad |
|-----|-----------------|
| users | Usuario (cc), roles, cliente/empleado/admin |
| tickets | Turnos, cajas, servicios, facturas, estadisticas |
| products | Catalogo productos |
| admins | Perfil administrador |

## Autenticacion

Token DRF en header `Authorization: Token <key>`. Permisos por defecto `IsAuthenticated`.

## Errores API

Handler central: `DS1.exceptions.api_exception_handler` (envoltura `success` / `error`).

## Configuracion

Variables en `backend/.env` (plantilla `.env.example`). Frontend: `VITE_API_BASE_URL`.

## Decisiones

Ver `docs/decisiones/ADR-001-api-errors.md`.
