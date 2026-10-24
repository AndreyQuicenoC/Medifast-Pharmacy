# Despliegue en Render - Farmacia Django React

Este proyecto está configurado para desplegarse automáticamente en Render.

## 🚀 Pasos para Desplegar

### 1. Preparar el Repositorio
```bash
# Asegúrate de estar en la rama production
git checkout production
git push origin production
```

### 2. Configurar Render

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Selecciona la rama `production`

### 3. Crear la Base de Datos PostgreSQL

1. En Render Dashboard, clic en "New +"
2. Selecciona "PostgreSQL"
3. Configuración:
   - **Name**: `farmacia-db`
   - **Database**: `farmacia`
   - **User**: `farmacia_user`
   - **Plan**: Free
4. Clic en "Create Database"
5. **Importante**: Guarda las credenciales que se generan

### 4. Crear el Web Service

1. En Render Dashboard, clic en "New +"
2. Selecciona "Web Service"
3. Conecta el repositorio: `Farmacia-Django-React`
4. Configuración:
   - **Name**: `farmacia-backend`
   - **Branch**: `production`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `build.sh` (o dejar vacío para autodetección)
   - **Start Command**: `gunicorn config.wsgi:application`

### 5. Variables de Entorno

En la sección "Environment Variables" del Web Service, agrega:

```
SECRET_KEY=azdk+78ol5)b1ty4ypgu35ura2zy*1=-%2o%kv^26v7qnu2z^p
DEBUG=False
DB_NAME=medifastdb
DB_USER=jonmeister
DB_PASSWORD=3kuuBq2Hi09OnP8vSr4oDzY0fhabvgNk
DB_HOST=dpg-d23e16idbo4c7384log0-a.oregon-postgres.render.com
DB_PORT=5432
RENDER_EXTERNAL_HOSTNAME=farmacia-medifast.onrender.com
```

**Importante**: 
- Usa las credenciales exactas de tu base de datos PostgreSQL de Render
- El `RENDER_EXTERNAL_HOSTNAME` será la URL que Render te asigne

### 6. Desplegar

1. Clic en "Create Web Service"
2. Render automáticamente:
   - Clonará el repositorio
   - Ejecutará `build.sh`
   - Instalará dependencias
   - Ejecutará migraciones
   - Iniciará el servidor con Gunicorn

### 7. Crear Superusuario (Después del primer despliegue)

Una vez que la aplicación esté funcionando:

1. Ve a la consola de Render (Shell tab)
2. Ejecuta:
```bash
python create_superuser.py
```

O manualmente:
```bash
python manage.py createsuperuser
```

### 8. Configurar CORS para el Frontend

Cuando tengas la URL del frontend, actualiza `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://tu-frontend-url.com',  # Agregar la URL real del frontend
]
```

## 🔗 URLs Importantes

- **API Base**: `https://farmacia-medifast.onrender.com/`
- **Admin Panel**: `https://farmacia-medifast.onrender.com/admin/`
- **API Docs**: `https://farmacia-medifast.onrender.com/api/`

## 🛠️ Comandos Útiles

### Ejecutar migraciones en producción:
```bash
python manage.py migrate
```

### Ver logs:
```bash
python manage.py check --deploy
```

### Recolectar archivos estáticos:
```bash
python manage.py collectstatic --noinput
```

## ⚠️ Notas Importantes

1. **Base de Datos**: Usar PostgreSQL (incluido en el plan gratuito de Render)
2. **Archivos Estáticos**: Servidos por WhiteNoise
3. **HTTPS**: Automático en Render
4. **Sleeping**: El plan gratuito "duerme" después de 15 minutos de inactividad
5. **Límites**: 750 horas/mes en plan gratuito

## 🐛 Troubleshooting

### Error de Base de Datos
- Verifica que las credenciales de PostgreSQL sean correctas
- Asegúrate que la base de datos esté creada y disponible

### Error 500
- Revisa los logs en Render Dashboard
- Verifica que `DEBUG=False` en producción
- Asegúrate que `ALLOWED_HOSTS` incluya tu dominio

### Error de CORS
- Verifica que la URL del frontend esté en `CORS_ALLOWED_ORIGINS`
- Asegúrate que las configuraciones de CORS sean correctas

## 📝 Próximos Pasos

1. Configurar el frontend para conectarse a esta API
2. Configurar dominio personalizado (opcional)
3. Configurar backup de base de datos
4. Implementar monitoreo y alertas
