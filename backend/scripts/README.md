# Scripts backend

| Ruta | Uso |
|------|-----|
| `dev/` | Datos de prueba y utilidades locales (requieren `MEDIFAST_DEV_PASSWORD`) |
| `deploy/` | Post-despliegue (`create_superuser.py`, `check_deploy.py`, `build.sh`) |
| `setup/` | Instalacion de dependencias (`install-backend.*`) |

Ejecutar siempre desde `backend/`:

```bash
python scripts/dev/create_test_admin.py
```
