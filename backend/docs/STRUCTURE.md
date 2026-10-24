# Estructura del backend (VEXARQ)

```
backend/
  config/                 # Proyecto Django (settings, urls, wsgi, excepciones API)
  apps/
    identity/             # Dominio: cuentas, roles, autenticacion (label DB: users)
    catalog/              # Dominio: productos (label DB: products)
    operations/           # Dominio: cajas, turnos, facturas, estadisticas (label: tickets)
  tests/                  # Pruebas modulares (espejo de dominios + platform)
    platform/
    identity/
    catalog/
    operations/
  scripts/                # Fuera del paquete de aplicacion
  docs/                   # Documentacion tecnica del backend
```

Los **labels** de migraciones Django (`users`, `products`, `tickets`) se conservan para no romper esquemas existentes.

Contrato API: `config/exceptions.py` (`success`, `error.code`, `error.message`, `error.details`).
