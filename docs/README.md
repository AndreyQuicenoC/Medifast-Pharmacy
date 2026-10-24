# Documentacion Medifast Pharmacy

Indice maestro del ciclo de vida del proyecto. La raiz del repositorio conserva solo artefactos de entrada (`README.md`, `CHANGELOG.md`, `SECURITY.md`, `LICENSE`, `CONTRIBUTING.md`).

## Arquitectura y contratos

| Documento | Descripcion |
|-----------|-------------|
| [arquitectura/SAD.md](arquitectura/SAD.md) | Vista de contenedores, modulos, flujos |
| [arquitectura/modelo-datos.md](arquitectura/modelo-datos.md) | Entidades, relaciones, tablas |
| [arquitectura/contratos-api.md](arquitectura/contratos-api.md) | Endpoints, auth, paginacion, errores |
| [arquitectura/decisiones-registro.md](arquitectura/decisiones-registro.md) | Indice ADR |

## Requisitos y calidad

| Documento | Descripcion |
|-----------|-------------|
| [requisitos/requisitos-funcionales.md](requisitos/requisitos-funcionales.md) | RF trazables |
| [requisitos/requisitos-no-funcionales.md](requisitos/requisitos-no-funcionales.md) | RNF, SLI/SLO locales |
| [requisitos/trazabilidad-calidad-iso25010.md](requisitos/trazabilidad-calidad-iso25010.md) | Matriz ISO/IEC 25010 |
| [requisitos/trazabilidad-vexarq.md](requisitos/trazabilidad-vexarq.md) | Criterio, prueba, evidencia |

## Diseno y experiencia

| Documento | Descripcion |
|-----------|-------------|
| [design.md](design.md) | Sistema de diseno completo |
| [accesibilidad/wcag-22-aa.md](accesibilidad/wcag-22-aa.md) | Criterios WCAG aplicables |

## Desarrollo y operaciones

| Documento | Descripcion |
|-----------|-------------|
| [desarrollo/guia-inicio-rapido.md](desarrollo/guia-inicio-rapido.md) | Entorno local reproducible |
| [desarrollo/backend-instalacion.md](desarrollo/backend-instalacion.md) | Backend Django |
| [desarrollo/frontend-instalacion.md](desarrollo/frontend-instalacion.md) | Frontend React |
| [desarrollo/usuarios-prueba.md](desarrollo/usuarios-prueba.md) | Seed de roles |
| [desarrollo/datos-ejemplo.md](desarrollo/datos-ejemplo.md) | Scripts de datos |
| [desarrollo/scripts-backend.md](desarrollo/scripts-backend.md) | Utilidades backend |
| [operaciones/runbook-local.md](operaciones/runbook-local.md) | Diagnostico y arranque |
| [code-structure.md](code-structure.md) | Mapa de codigo vivo |

## Pruebas y seguridad

| Documento | Descripcion |
|-----------|-------------|
| [pruebas/estrategia-pruebas.md](pruebas/estrategia-pruebas.md) | Piramide, tipos, gates |
| [pruebas/matriz-regresion.md](pruebas/matriz-regresion.md) | Flujos criticos |
| [seguridad/politica-seguridad-aplicacion.md](seguridad/politica-seguridad-aplicacion.md) | Controles Django/React |
| [seguridad/auditoria-owasp.md](seguridad/auditoria-owasp.md) | Hallazgos y tratamiento |

## Despliegue y funcionalidad

| Documento | Descripcion |
|-----------|-------------|
| [despliegue/render.md](despliegue/render.md) | Backend en Render |
| [despliegue/vercel.md](despliegue/vercel.md) | Frontend en Vercel |
| [despliegue/variables-entorno.md](despliegue/variables-entorno.md) | Catalogo de variables |
| [funcionalidades/inventario-funcional.md](funcionalidades/inventario-funcional.md) | Comportamiento verificado |

## Planificacion

| Documento | Descripcion |
|-----------|-------------|
| [backlog/modernizacion-backlog.md](backlog/modernizacion-backlog.md) | Epicas y estado |
| [backlog/plan-implementacion.md](backlog/plan-implementacion.md) | Orden de ejecucion |

## Ingenieria asistida (VEXARQ)

| Documento | Descripcion |
|-----------|-------------|
| [user-stories.md](user-stories.md) | Solicitudes recibidas |
| [implementation-report.md](implementation-report.md) | Evidencia por fase |
| [integration-report.md](integration-report.md) | Validacion E2E |
