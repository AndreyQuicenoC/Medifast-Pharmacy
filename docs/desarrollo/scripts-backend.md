# 🧹 Scripts Esenciales - Farmacia Django React

Estos son los scripts esenciales que se mantienen en el backend:

## 📁 Scripts Disponibles

### 🔧 **Scripts de Desarrollo y Testing**

#### `create_test_admin.py`

- **Propósito**: Crear usuario administrador de prueba
- **Uso**: `python create_test_admin.py`
- **Descripción**: Crea un usuario admin con credenciales conocidas para desarrollo
- **Cuándo usar**: Configuración inicial o cuando necesites un admin de prueba

#### `clean_database.py`

- **Propósito**: Limpiar completamente la base de datos
- **Uso**: `python clean_database.py`
- **Descripción**: Elimina todos los datos de la BD manteniendo la estructura
- **⚠️ Precaución**: Elimina TODOS los datos, usar solo en desarrollo

### 📊 **Scripts de Datos de Ejemplo**

#### `crear_datos_estadisticas.py`

- **Propósito**: Generar datos de ejemplo para estadísticas
- **Uso**: `python crear_datos_estadisticas.py`
- **Descripción**: Crea facturas, turnos y datos ficticios para testing del dashboard
- **Incluye**: Facturas realistas, productos variados, fechas distribuidas

#### `crear_clientes.py`

- **Propósito**: Crear clientes de ejemplo
- **Uso**: `python crear_clientes.py`
- **Descripción**: Genera clientes con datos ficticios pero realistas
- **Datos**: Nombres, cédulas, teléfonos, direcciones

#### `agregar_datos.py`

- **Propósito**: Script general para agregar datos diversos
- **Uso**: `python agregar_datos.py`
- **Descripción**: Agrega productos, servicios y otros datos base al sistema

### 💾 **Scripts de Backup y Restauración**

#### `script_datosdeprueba.py` ⭐

- **Propósito**: Script completo con todos los datos actuales de la BD
- **Uso**: `python script_datosdeprueba.py`
- **Descripción**: Recrear exactamente todos los datos existentes
- **Contenido**:
  - 3 Roles
  - 35 Usuarios
  - 26 Clientes
  - 22 Productos
  - 14 Servicios
  - 5 Cajas
  - 16 Tokens de autenticación

#### `test_script_datos.py`

- **Propósito**: Tester seguro para script_datosdeprueba.py
- **Uso**: `python test_script_datos.py`
- **Descripción**: Ejecuta el script de datos con backup automático
- **Seguridad**: Permite rollback si algo sale mal

## 🚀 Workflows Recomendados

### Para Desarrollo Nuevo:

```bash
# 1. Limpiar BD
python clean_database.py

# 2. Crear admin
python create_test_admin.py

# 3. Agregar datos base
python agregar_datos.py

# 4. Crear datos de ejemplo para estadísticas
python crear_datos_estadisticas.py
```

### Para Restaurar Estado Actual:

```bash
# Usar script de datos completo (recomendado)
python test_script_datos.py
```

### Para Testing de Dashboard:

```bash
# Solo datos de estadísticas
python crear_datos_estadisticas.py
```

## 💡 Consejos

1. **Siempre hacer backup** antes de ejecutar scripts que modifiquen datos
2. **Usar test_script_datos.py** en lugar de script_datosdeprueba.py directamente
3. **clean_database.py** solo en desarrollo, nunca en producción
4. Los **datos de ejemplo** son ideales para demostrar funcionalidades
