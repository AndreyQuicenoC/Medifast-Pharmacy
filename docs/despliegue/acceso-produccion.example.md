# Acceso a producción (plantilla)

No almacene contraseñas, tokens ni credenciales de base de datos en el repositorio.

Configure los valores reales únicamente en:

- Variables de entorno del proveedor (Render, Vercel, etc.)
- Archivos `.env` locales excluidos por `.gitignore`

Documente aquí, fuera del repositorio, las URLs públicas verificadas y el procedimiento para rotar credenciales si hubo exposición en el historial de Git.
