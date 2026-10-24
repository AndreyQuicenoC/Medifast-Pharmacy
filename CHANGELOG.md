# Changelog

Formato inspirado en Keep a Changelog. Versionado semantico cuando aplique.

## [Unreleased]

### Anadido

- Backend profesional VEXARQ: `config/`, dominios `identity`/`catalog`/`operations`, `tests/` modular, `scripts/`, Makefile y pipeline CI (ruff, pytest+cobertura, bandit, radon, interrogate)
- Documentacion transversal en `docs/` (indice, RF/RNF, pruebas, seguridad, accesibilidad, despliegue)
- Reorganizacion: despliegue y funcionalidades movidas desde raiz; eliminado SuperUser.txt del repo
- CONTRIBUTING.md, Dockerfiles, gitleaks CI, throttle login, PageState, apiError
- Matrices ISO 25010 y VEXARQ; plan de implementacion por bloques

### Anadido (oleada anterior)

- Modernizacion Fase 2+: CI, docker-compose PG, handler errores API, seed_dev_users
- Pagina 404, atajos de teclado, tokens de diseno, pagina /proyecto
- README raiz profesional

### Corregido

- Endurecimiento seguridad backend: DB_PASSWORD obligatorio, sin SQLite en prod, registro sin fuga de excepciones, ruta debug `test_auth` eliminada
- create_test_admin: campo `rol` en lugar de `rol_simple` inexistente

## [1.0.0-base] — 2026-10-23

### Anadido

- Commit base unificado post-estabilizacion Fase 1
