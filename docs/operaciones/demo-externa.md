# Demo academica (fuera del repositorio principal)

La demo no se versiona dentro de `Medifast-Pharmacy`. Use un directorio hermano, por ejemplo:

`../Medifast-Pharmacy-Demo/`

Plantilla incluida alli con:

- SPA React en la raiz del directorio demo (sin subcarpeta `frontend/`) y botones de acceso rapido
- `docker compose` (PostgreSQL + backend del repo principal + seed `seed_demo_showcase`)
- Credenciales ficticias documentadas solo en el README de demo

El repositorio principal mantiene CI, tests y documentacion de produccion; la demo solo consume releases o rama `develop` estabilizada.
