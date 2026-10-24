# Estructura frontend

```
frontend/src/
  api/           # Clientes HTTP por dominio (producto, facturas, turno, …)
  components/    # UI reutilizable (PageState, Button, Header, …)
  hooks/         # Atajos de teclado y utilidades React
  pages/         # Rutas / pantallas por rol
  utils/         # apiError (contrato unificado con backend)
```

Estados de pagina: usar `PageShell` + `getApiErrorMessage` para alinear UX y errores API.

Pruebas: Vitest (`src/components/*.test.jsx`), Playwright (`e2e/`).
