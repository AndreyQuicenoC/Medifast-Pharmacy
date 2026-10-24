# Despliegue Frontend en Vercel

Esta guía explica cómo desplegar el frontend React (Vite) de la Farmacia Medifast en Vercel.

## Prerrequisitos

1. Backend desplegado en Render: `https://farmacia-medifast.onrender.com`
2. Cuenta en Vercel: https://vercel.com
3. Repositorio en GitHub con los cambios de producción

## Variables de Entorno

El frontend está configurado para usar las siguientes variables de entorno:

### Desarrollo (.env)
```
VITE_API_BASE_URL=http://localhost:8000/api
```

### Producción (.env.production)
```
VITE_API_BASE_URL=https://farmacia-medifast.onrender.com/api
```

## Pasos para Desplegar

### 1. Preparar el Código
Todos los archivos de la API han sido actualizados para usar `import.meta.env.VITE_API_BASE_URL` en lugar de URLs hardcodeadas.

### 2. Hacer Commit y Push
```bash
cd frontend
git add .
git commit -m "Configurar frontend para producción con variables de entorno"
git push origin production
```

### 3. Configurar en Vercel

1. **Conectar Repositorio:**
   - Ve a https://vercel.com/dashboard
   - Click en "New Project"
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio `Farmacia-Django-React`

2. **Configurar Proyecto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Variables de Entorno:**
   En el dashboard de Vercel, ve a Settings > Environment Variables y agrega:
   ```
   VITE_API_BASE_URL = https://farmacia-medifast.onrender.com/api
   ```

4. **Desplegar:**
   - Click en "Deploy"
   - Vercel automáticamente construirá y desplegará tu aplicación

### 4. Verificar Despliegue

Una vez desplegado, tu aplicación estará disponible en una URL como:
`https://farmacia-medifast-frontend.vercel.app`

## Estructura de Archivos Actualizada

```
frontend/
├── .env                    # Variables desarrollo
├── .env.production        # Variables producción
├── vercel.json            # Configuración Vercel
├── src/
│   ├── api/               # APIs actualizadas con variables de entorno
│   │   ├── caja.api.js
│   │   ├── cajero.api.js
│   │   ├── facturas.api.js
│   │   ├── producto.api.js
│   │   ├── servicio.api.js
│   │   ├── turno.api.js
│   │   └── user.api.js
│   └── pages/             # Páginas actualizadas
│       ├── Login.jsx
│       ├── Register.jsx
│       └── estadisticas.jsx
```

## Verificación CORS

Asegúrate de que el backend en Render tenga configurado CORS para permitir requests desde tu dominio de Vercel:

```python
# En settings.py
CORS_ALLOWED_ORIGINS = [
    "https://farmacia-medifast-frontend.vercel.app",  # Tu URL de Vercel
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

## Scripts Útiles

```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Solución de Problemas

### Error de CORS
Si obtienes errores de CORS, verifica que:
1. El backend tiene configurado CORS correctamente
2. La URL del backend es correcta en las variables de entorno
3. El backend está funcionando correctamente

### Variables de Entorno no Funcionan
- Asegúrate de que las variables empiecen con `VITE_`
- Reinicia el servidor de desarrollo después de cambiar variables
- Verifica que estén configuradas en el dashboard de Vercel

### Rutas no Funcionan (404)
- El archivo `vercel.json` configura SPA routing
- Todas las rutas se redirigen a `index.html`

## Comandos de Verificación

```bash
# Verificar build local
npm run build
npm run preview

# Verificar que las variables se están usando
grep -r "VITE_API_BASE_URL" src/
```

## Rollback

Si necesitas hacer rollback:
1. Ve al dashboard de Vercel
2. Click en "Deployments"
3. Selecciona un deployment anterior
4. Click en "Promote to Production"
