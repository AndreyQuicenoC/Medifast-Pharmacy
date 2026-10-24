# Usuarios de prueba (solo desarrollo)

## Comando

```bash
python manage.py seed_dev_users
```

Opcional: `--password "SuClaveLocalFicticia"`

## Roles creados (cedulas ficticias)

| Rol | CC | Email |
|-----|-----|-------|
| Administrador | 900100001 | admin.dev@medifast.local |
| Empleado | 900100002 | empleado.dev@medifast.local |
| Cliente | 900100003 | cliente.dev@medifast.local |

Login en la aplicacion usa **cedula (cc)** y contrasena configurada en el comando.

## Reglas

- No ejecutar contra produccion con contrasenas publicas.
- El comando es idempotente por `cc`.
- Eliminar cuentas manualmente desde admin Django si es necesario.
