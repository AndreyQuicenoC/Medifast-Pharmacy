# 📋 Scripts de Datos de Prueba - Farmacia Django React

Este directorio contiene scripts para gestionar y recrear los datos de la base de datos del sistema.

## 📁 Archivos Incluidos

### `script_datosdeprueba.py`

Script principal que contiene todos los datos actuales de la base de datos en formato ejecutable.

- **Generado automáticamente** desde la base de datos actual
- Contiene **todos los datos** (usuarios, productos, servicios, etc.)
- **Transaccional**: Si falla, no se aplican cambios parciales

### `test_script_datos.py`

Script de prueba que permite ejecutar `script_datosdeprueba.py` de forma segura.

- Hace **backup automático** de la BD actual
- Permite **restaurar** si algo sale mal
- **Modo interactivo** para confirmar cambios

## 🚀 Uso de los Scripts

### Opción 1: Ejecución Directa

```bash
# Ejecutar directamente el script de datos
python script_datosdeprueba.py
```

### Opción 2: Ejecución Segura (Recomendada)

```bash
# Ejecutar con backup automático y opción de rollback
python test_script_datos.py
```

### Opción 3: Limpiar y Recrear

```bash
# Limpiar base de datos y recrear con datos de prueba
python clean_database.py
python script_datosdeprueba.py
```

## 📊 Datos Incluidos

El script `script_datosdeprueba.py` recrea:

- **3 Roles** (cliente, empleado, administrador)
- **35 Usuarios** con diferentes roles y permisos
- **26 Clientes** con datos completos
- **22 Productos** con precios, stock y detalles
- **14 Servicios** de farmacia disponibles
- **5 Cajas** registradoras configuradas
- **16 Tokens** de autenticación activos

## 🔧 Regenerar Script de Datos

Si necesitas actualizar el script con nuevos datos de la BD actual:

```bash
# Ejecutar el generador (crear script actualizado)
python generar_script_datos.py
```

Este comando:

1. Lee todos los datos actuales de la BD
2. Genera un nuevo `script_datosdeprueba.py`
3. Mantiene la estructura y formato correcto

## ⚠️ Consideraciones Importantes

### Antes de Ejecutar

- **Hacer backup manual** de `db.sqlite3` si contiene datos importantes
- Verificar que las **migraciones estén actualizadas**
- Comprobar que el **entorno virtual esté activo**

### Durante la Ejecución

- El script usa **transacciones**, por lo que es seguro
- Si hay errores, **no se aplicarán cambios parciales**
- Los **passwords por defecto** son `123456`

### Después de Ejecutar

- Verificar que todos los datos se hayan creado correctamente
- Probar el **login con usuarios creados**
- Revisar que los **tokens de autenticación** funcionen

## 🏥 Usuarios de Prueba Incluidos

El script crea usuarios con diferentes roles:

### Administradores

- Email: `admin@test.com`
- Password: `123456`
- Rol: `administrador`

### Empleados

- Varios empleados con diferentes especialidades
- Password: `123456`
- Rol: `empleado`

### Clientes

- Clientes con datos de ejemplo
- Algunos marcados como prioritarios
- Rol: `cliente`

## 🔐 Tokens de Autenticación

El script incluye tokens pre-generados para:

- **API testing** inmediato
- **Desarrollo frontend** sin necesidad de login
- **Testing automatizado** de endpoints

## 📝 Logs y Debugging

### Verificar Datos Creados

```bash
# Ver resumen de datos en la BD
python manage.py shell -c "
from apps.users.models import User, Cliente, Rol
from apps.products.models import Producto
from apps.tickets.models import Servicio, Caja
print(f'Usuarios: {User.objects.count()}')
print(f'Clientes: {Cliente.objects.count()}')
print(f'Productos: {Producto.objects.count()}')
print(f'Servicios: {Servicio.objects.count()}')
print(f'Cajas: {Caja.objects.count()}')
"
```

### Testing API con Datos

```bash
# Probar endpoint con usuario creado
curl -H "Authorization: Token [token_from_script]" http://localhost:8000/api/products/
```

## 🔄 Workflow Recomendado

1. **Desarrollo**: Usar `script_datosdeprueba.py` para datos consistentes
2. **Testing**: Ejecutar con `test_script_datos.py` para seguridad
3. **Production**: **NUNCA** ejecutar estos scripts en producción
4. **Backup**: Siempre hacer backup antes de cambios importantes

---

**💡 Tip**: Estos scripts son ideales para **desarrollo** y **testing**. Para producción, usar fixtures o migraciones de datos apropiadas.
