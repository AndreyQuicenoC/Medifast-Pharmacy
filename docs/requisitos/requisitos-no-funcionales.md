# Requisitos no funcionales

ID | Categoria ISO 25010 | Requisito | Implementacion | Verificacion
---|---|---|---|---
RNF-001 | Mantenibilidad | Codigo modular backend/frontend | apps Django, modulos React | code-structure.md
RNF-002 | Fiabilidad | Migraciones reproducibles | Django migrations | CI migrate
RNF-003 | Seguridad | Secretos fuera del repo | .gitignore, .env.example | SECURITY.md, gitleaks CI
RNF-004 | Seguridad | Errores sin stack en cliente | DS1.exceptions | test_api_exception_handler
RNF-005 | Seguridad | Limite intentos login | Throttle authtoken | settings + test
RNF-006 | Usabilidad | Feedback carga/error UI | PageState components | lint/build
RNF-007 | Accesibilidad | WCAG 2.2 AA objetivo | design.md, wcag doc | revision manual
RNF-008 | Compatibilidad | Python 3.13, Node 20 | CI matrices | GitHub Actions
RNF-009 | Portabilidad | SQLite dev / PostgreSQL prod | USE_SQLITE | guia-inicio-rapido
RNF-010 | Mantenibilidad | Documentacion en espanol | docs/ | este indice

SLI local (objetivo orientativo, no contrato de produccion):

- CI verde en PR a `develop`.
- `validate-local.ps1` completado en menos de 15 min en maquina de desarrollo estandar.
