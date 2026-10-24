"""
URL configuration for DS1 project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from apps.users.views import ClienteViewSet, UserViewSet, RolViewSet, AdministradorViewSet, EmpleadoViewSet, CustomAuthToken
from apps.users.register_view import register_user
from apps.tickets.views import CajaViewSet, ServicioViewSet, TurnoViewSet, FacturaViewSet
from apps.tickets.estadisticas_views import (
    estadisticas_ventas_generales,
    estadisticas_ventas_por_producto,
    estadisticas_servicios,
    estadisticas_clientes,
    estadisticas_tiempos_atencion,
    estadisticas_resumen
)
from apps.products.views import ProductoViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'users',UserViewSet, basename="usuario")
router.register(r'clients', ClienteViewSet, basename="cliente")
router.register(r'rol', RolViewSet, basename="rol")
router.register(r'u_admin',AdministradorViewSet, basename = "user_admin")
router.register(r'employee', EmpleadoViewSet, basename = "empleado")
router.register(r'caja', CajaViewSet, basename='caja')
router.register(r'servicios', ServicioViewSet, basename='servicio')
router.register(r'turnos', TurnoViewSet, basename='turno')
router.register(r'producto', ProductoViewSet, basename='producto')
router.register(r'facturas', FacturaViewSet, basename='factura')
#router.register(r'usuarios-espera', UsuarioEsperaViewSet, basename="usuario-espera")
#router.register(r'cajas', CajaViewSet)
#router.register(r'servicios', ServicioViewSet)
#router.register(r'cajeros-usuarios-espera', CajeroUsuarioEsperaViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/authtoken/', CustomAuthToken.as_view(), name='api_token_auth'),
    # URL para registro público
    path('api/register/', register_user, name='register'),
    # URLs personalizadas para turnos
    path('api/turnos/crear_turno/', TurnoViewSet.as_view({'post': 'crear_turno'}), name='crear_turno'),
    path('api/turnos/test_auth/', TurnoViewSet.as_view({'get': 'test_auth'}), name='test_auth'),
    path('api/turnos/mi_caja_info/', TurnoViewSet.as_view({'get': 'mi_caja_info'}), name='mi_caja_info'),
    path('api/turnos/atender_siguiente/', TurnoViewSet.as_view({'post': 'atender_siguiente_turno'}), name='atender_siguiente'),
    path('api/turnos/finalizar_turno/', TurnoViewSet.as_view({'post': 'finalizar_turno'}), name='finalizar_turno'),
    path('api/turnos/cancelar_turno/', TurnoViewSet.as_view({'post': 'cancelar_turno_actual'}), name='cancelar_turno'),
    path('api/turnos/toggle_caja/', TurnoViewSet.as_view({'post': 'toggle_caja_estado'}), name='toggle_caja'),
    path('api/turnos/estado_cajas/', TurnoViewSet.as_view({'get': 'estado_cajas'}), name='estado_cajas'),
    # URLs personalizadas para facturas
    path('api/facturas/por_turno/', FacturaViewSet.as_view({'get': 'por_turno'}), name='facturas_por_turno'),
    path('api/facturas/por_caja/', FacturaViewSet.as_view({'get': 'por_caja'}), name='facturas_por_caja'),
    path('api/facturas/por_fecha/', FacturaViewSet.as_view({'get': 'por_fecha'}), name='facturas_por_fecha'),
    path('api/facturas/reporte_ventas/', FacturaViewSet.as_view({'get': 'reporte_ventas'}), name='reporte_ventas'),
    # URLs para estadísticas
    path('api/estadisticas/ventas-generales/', estadisticas_ventas_generales, name='estadisticas_ventas_generales'),
    path('api/estadisticas/ventas-por-producto/', estadisticas_ventas_por_producto, name='estadisticas_ventas_por_producto'),
    path('api/estadisticas/servicios/', estadisticas_servicios, name='estadisticas_servicios'),
    path('api/estadisticas/clientes/', estadisticas_clientes, name='estadisticas_clientes'),
    path('api/estadisticas/tiempos-atencion/', estadisticas_tiempos_atencion, name='estadisticas_tiempos_atencion'),
    path('api/estadisticas/resumen/', estadisticas_resumen, name='estadisticas_resumen'),
]
