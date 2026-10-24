# Scripts de datos de prueba

Scripts en `backend/scripts/dev/` para poblar entornos **locales**. No usar en producción.

## Requisito de seguridad

Exporte una contraseña ficticia antes de ejecutar scripts que crean usuarios:

```powershell
$env:MEDIFAST_DEV_PASSWORD = "<definida-en-su-entorno-local>"
```

## Archivos

| Script | Uso |
|--------|-----|
| `script_datosdeprueba.py` | Carga masiva transaccional |
| `test_script_datos.py` | Backup SQLite + prueba del script anterior |
| `clean_database.py` | Limpieza local |
| `create_test_admin.py` | Admin único de prueba |
| `crear_clientes.py` | Clientes de ejemplo |

Ejecutar desde `backend/`:

```bash
python scripts/dev/script_datosdeprueba.py
```

## Usuarios de desarrollo recomendados

Preferir el comando oficial idempotente:

```bash
python manage.py seed_dev_users --password "<definida-en-su-entorno-local>"
```

Ver [usuarios-prueba.md](./usuarios-prueba.md).

## Tokens de autenticación

Los tokens se generan en runtime al crear usuarios; no se versionan claves opacas en el repositorio.
