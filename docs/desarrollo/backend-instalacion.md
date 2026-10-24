# Backend - Farmacia Django React 🏥

Sistema de gestión para farmacia desarrollado con Django y Django REST Framework.

## 📋 Características

- **Gestión de Usuarios**: Autenticación, roles (Vendedor, Cajero, Administrador)
- **Gestión de Productos**: CRUD completo, control de stock
- **Sistema de Ventas**: Facturas, caja registradora, turnos
- **Estadísticas**: Dashboard con métricas de ventas y productos
- **API REST**: Endpoints completos para integración con frontend React

## 🚀 Instalación Rápida

### Opción 1: Script Automático

**Linux/Mac:**

```bash
chmod +x install-backend.sh
./install-backend.sh
```

**Windows:**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\install-backend.ps1
```

### Opción 2: Instalación Manual

1. **Crear entorno virtual:**

```bash
python -m venv env
```

2. **Activar entorno virtual:**

```bash
# Linux/Mac
source env/bin/activate

# Windows
env\Scripts\activate
```

3. **Instalar dependencias:**

```bash
pip install -r requirements.txt
```

4. **Ejecutar migraciones:**

```bash
python manage.py migrate
```

5. **Crear usuario administrador:**

```bash
# Opción 1: Interactivo
python manage.py createsuperuser

# Opción 2: Automático (para desarrollo)
python scripts/dev/create_test_admin.py
```

6. **Cargar datos de ejemplo (opcional):**

```bash
python crear_datos_estadisticas.py
```

7. **Iniciar servidor:**

```bash
python manage.py runserver
```

## 📁 Estructura del Proyecto

```
backend/
├── config/                 # Proyecto Django (settings, urls, wsgi)
├── apps/
│   ├── identity/           # Cuentas, roles, autenticación
│   ├── catalog/            # Productos
│   └── operations/         # Cajas, turnos, facturas, estadísticas
├── tests/                  # Suite modular (platform, identity, catalog, operations)
├── scripts/                # dev | deploy | setup
├── docs/                   # Documentación técnica del backend
├── requirements.txt
├── requirements-dev.txt
├── Makefile                # Pipeline de calidad (Linux/macOS)
└── manage.py
```

## 🔧 Dependencias Principales

- **Django 5.1.7**: Framework web principal
- **Django REST Framework**: API REST
- **django-cors-headers**: Comunicación con frontend React
- **Pillow**: Procesamiento de imágenes
- **psycopg2-binary**: Soporte para PostgreSQL

## 🛠️ Scripts Útiles

### Datos de Desarrollo

```bash
# Crear usuario admin de prueba
python scripts/dev/create_test_admin.py

# Generar datos de estadísticas de ejemplo
python crear_datos_estadisticas.py

# Verificar estado del stock
python verificar_stock.py
```

### Gestión de Base de Datos

```bash
# Crear migraciones
python manage.py makemigrations

# Aplicar migraciones
python manage.py migrate

# Shell de Django
python manage.py shell

# Interfaz administrativa
python manage.py runserver
# Visitar: http://127.0.0.1:8000/admin/
```

## 🌐 API Endpoints

### Autenticación

- `POST /api/login/` - Iniciar sesión
- `POST /api/register/` - Registrar usuario
- `POST /api/logout/` - Cerrar sesión

### Productos

- `GET /api/products/` - Listar productos
- `POST /api/products/` - Crear producto
- `PUT /api/products/{id}/` - Actualizar producto
- `DELETE /api/products/{id}/` - Eliminar producto

### Ventas/Facturas

- `GET /api/invoices/` - Listar facturas
- `POST /api/invoices/` - Crear factura
- `GET /api/invoices/{id}/` - Detalle de factura

### Estadísticas

- `GET /api/estadisticas/resumen/` - Resumen general
- `GET /api/estadisticas/ventas-mensuales/` - Ventas por mes
- `GET /api/estadisticas/productos-mas-vendidos/` - Top productos

## 🔒 Autenticación

El sistema utiliza **Token Authentication** de Django REST Framework.

**Headers requeridos:**

```
Authorization: Token <token-opaco-devuelto-por-authtoken>
Content-Type: application/json
```

## 👥 Roles de Usuario

1. **Vendedor**: Puede ver productos y crear ventas
2. **Cajero**: Vendedor + gestión de caja y turnos
3. **Administrador**: Acceso completo al sistema

## 📊 Base de Datos

Por defecto utiliza **SQLite** para desarrollo. Para producción se recomienda PostgreSQL.

**Cambiar a PostgreSQL:**

1. Instalar: `pip install psycopg2-binary`
2. Configurar `DATABASES` en `settings.py`
3. Ejecutar migraciones: `python manage.py migrate`

## 🚨 Solución de Problemas

### Error: "No module named 'apps'"

```bash
# Asegúrate de estar en el directorio backend/
cd backend/
python manage.py runserver
```

### Error de CORS

```python
# Verificar en settings.py:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Token de autenticación inválido

```bash
# Crear nuevo token para usuario
python manage.py shell
>>> from django.contrib.auth import get_user_model
>>> from rest_framework.authtoken.models import Token
>>> user = get_user_model().objects.get(username='admin')
>>> token, created = Token.objects.get_or_create(user=user)
>>> print("TOKEN_PLACEHOLDER")
```

## 📝 Desarrollo

### Agregar nueva funcionalidad

1. Crear modelos en `apps/app_name/models.py`
2. Crear serializers en `apps/app_name/serializers.py`
3. Crear vistas en `apps/app_name/views.py`
4. Configurar URLs en `apps/app_name/urls.py`
5. Agregar a `DS1/urls.py`

### Testing

```bash
# Ejecutar tests
python manage.py test

# Test específico
python manage.py test apps.identity.tests
```

## 📞 Soporte

Para problemas o dudas:

1. Revisar logs del servidor Django
2. Verificar configuración de CORS
3. Comprobar tokens de autenticación
4. Revisar permisos de usuario

---

**Desarrollado con ❤️ usando Django & Django REST Framework**
