# Demo academica (fuera del repositorio principal)

La demo no se versiona dentro de `Medifast-Pharmacy`. Use un directorio hermano, por ejemplo:

`../Medifast-Pharmacy-Demo/`

Plantilla incluida alli con:

- Copia desplegable del frontend (`frontend/`) con botones de acceso demo
- `docker compose` (PostgreSQL + backend del repo principal + seed `seed_demo_showcase`)
- Credenciales ficticias documentadas solo en el README de demo

El repositorio principal mantiene CI, tests y documentacion de produccion; la demo solo consume releases o rama `develop` estabilizada.
