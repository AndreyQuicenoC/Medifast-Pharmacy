# Requisitos funcionales

Identificador | Descripcion | Prioridad | Criterio de aceptacion | Evidencia
---|---|---|---|---
RF-001 | Login por cedula y contrasena con token | Alta | POST authtoken devuelve token y rol | Login.jsx, tests manuales
RF-002 | Registro publico de usuario | Media | POST register crea usuario valido | register_view
RF-003 | CRUD usuarios por rol | Alta | Endpoints users/clients/employee/u_admin | clienteManagement, user.api.js
RF-004 | Gestion de cajas y asignacion cajero | Alta | CRUD caja + estado_cajas | cajas.jsx, caja.api.js
RF-005 | Cola de turnos (crear, atender, finalizar, cancelar) | Alta | Flujo turnos API + UI | turnos.jsx, pedirTurno.jsx
RF-006 | Catalogo servicios activar/desactivar | Alta | servicios con Estado | Services.jsx
RF-007 | Productos e inventario | Alta | CRUD producto, stock | producto.jsx
RF-008 | Facturacion y reportes | Alta | facturas endpoints + UI | facturas.jsx
RF-009 | Estadisticas gerenciales | Media | 6 endpoints estadisticas | estadisticas.jsx
RF-010 | Resenas (modulo existente) | Baja | Pantalla resenas operativa | resenas.jsx
RF-011 | Pagina 404 y rutas invalidas | Media | Ruta * muestra PageNotFound | App.jsx
RF-012 | Informacion del proyecto en UI | Baja | /proyecto accesible | Proyecto.jsx

Estado: verificado en codigo; prueba E2E automatizada pendiente para RF-004 a RF-009 (matriz en `docs/pruebas/matriz-regresion.md`).
