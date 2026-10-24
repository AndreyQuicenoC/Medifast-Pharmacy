# ADR-001 — Formato de errores API

## Estado

Aceptado (modernizacion Fase 4)

## Contexto

DRF devolvia errores heterogeneos. Se requiere contrato estable sin filtrar trazas en produccion.

## Decision

`EXCEPTION_HANDLER` en `config.exceptions.api_exception_handler` envuelve respuestas en `{ success, error: { code, message, details } }`.

## Consecuencias

- Clientes deben leer `error.details` para validaciones de campo.
- Errores 500 no exponen stack al cliente.
- Posible adaptacion gradual en modulos frontend que esperen formato legacy.
