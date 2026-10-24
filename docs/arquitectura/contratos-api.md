# Contratos API REST

Base URL: `{HOST}/api/` (frontend: `VITE_API_BASE_URL`).

## Autenticacion

| Metodo | Ruta | Auth | Cuerpo | Respuesta exitosa |
|--------|------|------|--------|-------------------|
| POST | `authtoken/` | No | `{ "cc": number, "password": string }` | `{ token, rol, is_client, is_cajero, user_data? }` |
| POST | `register/` | No | Datos registro publico | Usuario creado segun `register_view` |

Header autenticado: `Authorization: Token <token>`.

## ViewSets (CRUD + acciones DRF)

| Recurso | Prefijo | Notas |
|---------|---------|-------|
| Usuarios base | `users/` | CRUD, cambio de rol |
| Clientes | `clients/` | Perfil cliente, prioridad |
| Empleados | `employee/` | Fecha contratacion |
| Administradores | `u_admin/` | Perfil admin |
| Roles catalogo | `rol/` | Referencia |
| Cajas | `caja/` | Asignacion cajero, estado |
| Servicios | `servicios/` | activar/desactivar |
| Turnos | `turnos/` | Cola, estados |
| Productos | `producto/` | Stock, imagenes |
| Facturas | `facturas/` | Ventas, reportes |

Paginacion por defecto: 20 (`PageNumberPagination`).

## Rutas personalizadas turnos

- `POST turnos/crear_turno/`
- `GET turnos/test_auth/`
- `GET turnos/mi_caja_info/`
- `POST turnos/atender_siguiente/`
- `POST turnos/finalizar_turno/`
- `POST turnos/cancelar_turno/`
- `POST turnos/toggle_caja/`
- `GET turnos/estado_cajas/`

## Rutas personalizadas facturas

- `GET facturas/por_turno/`, `por_caja/`, `por_fecha/`, `reporte_ventas/`

## Estadisticas

- `GET estadisticas/resumen/`
- `GET estadisticas/ventas-generales/`
- `GET estadisticas/ventas-por-producto/`
- `GET estadisticas/servicios/`
- `GET estadisticas/clientes/`
- `GET estadisticas/tiempos-atencion/`

## Formato de error (desde modernizacion)

```json
{
  "success": false,
  "error": {
    "code": 400,
    "message": "Mensaje publico",
    "details": { }
  }
}
```

El frontend debe leer `error.details` y formatos legacy DRF durante la transicion (`frontend/src/utils/apiError.js`).

## Permisos

Por defecto `IsAuthenticated`. Endpoints publicos: `authtoken/`, `register/` (verificar despliegue).
