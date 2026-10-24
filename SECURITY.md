# Politica de seguridad

## Reporte

Contacte al mantenedor del repositorio privado con descripcion, pasos de reproduccion e impacto.

## Practicas del proyecto

- No commitear `.env`, credenciales ni volcados de BD.
- Rotar secretos si estuvieron en historial Git antiguo (etiqueta `backup/historial-pre-limpieza-2026-10-23`) o en documentacion de despliegue ya sanitizada (p. ej. claves Render/PostgreSQL): generar nuevas en el panel del proveedor y revocar las anteriores.
- `DEBUG=False` en produccion; `SECRET_KEY` obligatoria por entorno.
- Usuarios `seed_dev_users` solo para desarrollo local.

## Limitaciones

Las pruebas automatizadas y CI no garantizan ausencia total de vulnerabilidades.
