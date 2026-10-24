# Modelo de datos

## users

| Modelo | Tabla | Descripcion |
|--------|-------|-------------|
| User | USER | AUTH_USER_MODEL, login por `cc` |
| Rol | ROL | Catalogo de roles |
| Cliente | (FK USER) | `prioritario` cola |
| Empleado | EMPLEADO | `Fecha_contratacion` |
| Administrador | - | OneToOne User |

Campos transversales: `created_at`, `updated_at`, `deleted_at` (soft delete parcial).

## tickets

| Modelo | Tabla | Reglas de negocio |
|--------|-------|-------------------|
| Caja | CAJA | Nombre unico, cajero opcional, Estado boolean |
| Servicio | - | No borrado fisico; deshabilitar con Estado |
| Horario | - | Tiempos llegada/atencion/salida |
| Turno | TURNO | Estados: esperando, en_atencion, finalizado, cancelado; cola prioritario |
| Factura | - | JSON productos_vendidos, enlace turno |

## products

| Modelo | Campos clave |
|--------|--------------|
| Producto | Precio, Stock, Activo, requiere_orden_medica, Codigo |

## Integridad

- Turnos referencian Cliente, Caja, Servicio, Horario.
- Facturas ligadas a Turno.
- Productos en ventas serializados en factura (texto JSON).

Ver migraciones en `backend/apps/*/migrations/`.
