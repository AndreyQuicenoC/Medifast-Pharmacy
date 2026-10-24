from django.http import JsonResponse
from django.db.models import Count, Sum, Avg, F, Q
from django.db.models.functions import TruncDate, TruncWeek, TruncMonth, TruncYear
from django.utils import timezone
from datetime import datetime, timedelta
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
import json

from .models import Factura, Turno, Servicio, Caja, Horario
from apps.users.models import Cliente, User
from apps.products.models import Producto

@api_view(['GET'])
@permission_classes([AllowAny])  # Allow any user for testing
def estadisticas_ventas_generales(request):
    """Estadísticas de ventas generales por período"""
    periodo = request.GET.get('periodo', 'diario')  # diario, semanal, mensual, anual
    
    # Configurar el truncate según el período
    trunc_map = {
        'diario': TruncDate,
        'semanal': TruncWeek,
        'mensual': TruncMonth,
        'anual': TruncYear
    }
    
    if periodo not in trunc_map:
        return Response({'error': 'Período no válido'}, status=status.HTTP_400_BAD_REQUEST)
    
    trunc_func = trunc_map[periodo]
    
    # Obtener facturas agrupadas por período
    facturas_periodo = (Factura.objects
                       .filter(fecha_factura__isnull=False)
                       .annotate(periodo=trunc_func('fecha_factura'))
                       .values('periodo')
                       .annotate(
                           total_ventas=Sum('Total'),
                           cantidad_ventas=Count('id'),
                           promedio_venta=Avg('Total')
                       )
                       .order_by('periodo'))
    
    # Formatear datos para el gráfico
    labels = []
    ventas_totales = []
    cantidad_ventas = []
    promedios = []
    
    for item in facturas_periodo:
        if item['periodo']:
            if periodo == 'diario':
                labels.append(item['periodo'].strftime('%Y-%m-%d'))
            elif periodo == 'semanal':
                labels.append(f"Semana {item['periodo'].strftime('%Y-%W')}")
            elif periodo == 'mensual':
                labels.append(item['periodo'].strftime('%Y-%m'))
            else:  # anual
                labels.append(str(item['periodo'].year))
            
            ventas_totales.append(float(item['total_ventas'] or 0))
            cantidad_ventas.append(item['cantidad_ventas'])
            promedios.append(float(item['promedio_venta'] or 0))
    
    return Response({
        'labels': labels,
        'ventas_totales': ventas_totales,
        'cantidad_ventas': cantidad_ventas,
        'promedios': promedios,
        'periodo': periodo
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_ventas_por_producto(request):
    """Estadísticas de ventas por producto"""
    periodo = request.GET.get('periodo', 'diario')
    
    # Configurar rango de fechas según período
    now = timezone.now()
    if periodo == 'diario':
        fecha_inicio = now.date()
    elif periodo == 'semanal':
        fecha_inicio = now.date() - timedelta(days=7)
    elif periodo == 'mensual':
        fecha_inicio = now.date() - timedelta(days=30)
    else:  # anual
        fecha_inicio = now.date() - timedelta(days=365)
    
    # Obtener facturas del período
    facturas = Factura.objects.filter(
        fecha_factura__date__gte=fecha_inicio,
        fecha_factura__isnull=False
    )
    
    # Procesar productos vendidos
    productos_stats = {}
    
    for factura in facturas:
        if factura.productos_vendidos:
            try:
                productos = json.loads(factura.productos_vendidos)
                for producto in productos:
                    producto_id = producto.get('id')
                    nombre = producto.get('nombre', f'Producto {producto_id}')
                    cantidad = producto.get('cantidad', 1)
                    precio_total = producto.get('precio_total', 0)
                    
                    if producto_id not in productos_stats:
                        productos_stats[producto_id] = {
                            'nombre': nombre,
                            'cantidad_vendida': 0,
                            'ingresos_totales': 0,
                            'numero_ventas': 0
                        }
                    
                    productos_stats[producto_id]['cantidad_vendida'] += cantidad
                    productos_stats[producto_id]['ingresos_totales'] += float(precio_total)
                    productos_stats[producto_id]['numero_ventas'] += 1
            except (json.JSONDecodeError, KeyError):
                continue
    
    # Convertir a listas para el gráfico
    productos_lista = list(productos_stats.values())
    productos_lista.sort(key=lambda x: x['ingresos_totales'], reverse=True)
    
    # Tomar top 10
    top_productos = productos_lista[:10]
    
    return Response({
        'productos': top_productos,
        'periodo': periodo,
        'total_productos_diferentes': len(productos_stats)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_servicios(request):
    """Estadísticas de uso de servicios"""
    periodo = request.GET.get('periodo', 'diario')
    
    # Configurar rango de fechas
    now = timezone.now()
    if periodo == 'diario':
        fecha_inicio = now.date()
    elif periodo == 'semanal':
        fecha_inicio = now.date() - timedelta(days=7)
    elif periodo == 'mensual':
        fecha_inicio = now.date() - timedelta(days=30)
    else:  # anual
        fecha_inicio = now.date() - timedelta(days=365)
    
    # Estadísticas de servicios utilizados
    servicios_stats = (Turno.objects
                      .filter(created_at__date__gte=fecha_inicio)
                      .values('ID_Servicio__Nombre', 'ID_Servicio__id')
                      .annotate(
                          cantidad_usos=Count('id'),
                          turnos_finalizados=Count('id', filter=Q(estado='finalizado')),
                          turnos_cancelados=Count('id', filter=Q(estado='cancelado'))
                      )
                      .order_by('-cantidad_usos'))
    
    servicios_data = []
    for servicio in servicios_stats:
        servicios_data.append({
            'id': servicio['ID_Servicio__id'],
            'nombre': servicio['ID_Servicio__Nombre'] or 'Servicio Desconocido',
            'cantidad_usos': servicio['cantidad_usos'],
            'turnos_finalizados': servicio['turnos_finalizados'],
            'turnos_cancelados': servicio['turnos_cancelados'],
            'porcentaje_exito': round((servicio['turnos_finalizados'] / servicio['cantidad_usos'] * 100), 2) if servicio['cantidad_usos'] > 0 else 0
        })
    
    return Response({
        'servicios': servicios_data,
        'periodo': periodo
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_clientes(request):
    """Estadísticas de clientes"""
    periodo = request.GET.get('periodo', 'diario')
    
    # Configurar el truncate según el período
    trunc_map = {
        'diario': TruncDate,
        'semanal': TruncWeek,
        'mensual': TruncMonth,
        'anual': TruncYear
    }
    
    trunc_func = trunc_map.get(periodo, TruncDate)
    
    # Clientes que crearon turnos por período
    clientes_periodo = (Turno.objects
                       .annotate(periodo=trunc_func('created_at'))
                       .values('periodo')
                       .annotate(
                           clientes_unicos=Count('ID_Cliente', distinct=True),
                           total_turnos=Count('id'),
                           nuevos_clientes=Count('ID_Cliente', distinct=True, filter=Q(ID_Cliente__ID_Usuario__created_at__date=F('periodo')))
                       )
                       .order_by('periodo'))
    
    # Formatear datos
    labels = []
    clientes_unicos = []
    total_turnos = []
    nuevos_clientes = []
    
    for item in clientes_periodo:
        if item['periodo']:
            if periodo == 'diario':
                labels.append(item['periodo'].strftime('%Y-%m-%d'))
            elif periodo == 'semanal':
                labels.append(f"Semana {item['periodo'].strftime('%Y-%W')}")
            elif periodo == 'mensual':
                labels.append(item['periodo'].strftime('%Y-%m'))
            else:  # anual
                labels.append(str(item['periodo'].year))
            
            clientes_unicos.append(item['clientes_unicos'])
            total_turnos.append(item['total_turnos'])
            nuevos_clientes.append(item['nuevos_clientes'])
    
    # Estadísticas adicionales
    total_clientes = Cliente.objects.filter(ID_Usuario__deleted_at__isnull=True).count()
    clientes_activos = Turno.objects.filter(
        created_at__date__gte=timezone.now().date() - timedelta(days=30)
    ).values('ID_Cliente').distinct().count()
    
    return Response({
        'labels': labels,
        'clientes_unicos': clientes_unicos,
        'total_turnos': total_turnos,
        'nuevos_clientes': nuevos_clientes,
        'total_clientes': total_clientes,
        'clientes_activos_mes': clientes_activos,
        'periodo': periodo
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_tiempos_atencion(request):
    """Estadísticas de tiempos de atención y espera"""
    periodo = request.GET.get('periodo', 'diario')
    
    # Configurar rango de fechas
    now = timezone.now()
    if periodo == 'diario':
        fecha_inicio = now.date()
    elif periodo == 'semanal':
        fecha_inicio = now.date() - timedelta(days=7)
    elif periodo == 'mensual':
        fecha_inicio = now.date() - timedelta(days=30)
    else:  # anual
        fecha_inicio = now.date() - timedelta(days=365)
    
    # Obtener turnos con horarios
    turnos_con_horario = Turno.objects.filter(
        created_at__date__gte=fecha_inicio,
        ID_Horario__isnull=False,
        estado='finalizado'
    ).select_related('ID_Horario')
    
    tiempos_espera = []
    tiempos_atencion = []
    tiempos_totales = []
    
    for turno in turnos_con_horario:
        horario = turno.ID_Horario
        if horario.Hora_llegada and horario.Hora_atencion and horario.Hora_salida:
            # Tiempo de espera (desde llegada hasta atención)
            tiempo_espera = (horario.Hora_atencion - horario.Hora_llegada).total_seconds() / 60  # en minutos
            
            # Tiempo de atención (desde atención hasta salida)
            tiempo_atencion = (horario.Hora_salida - horario.Hora_atencion).total_seconds() / 60  # en minutos
            
            # Tiempo total
            tiempo_total = (horario.Hora_salida - horario.Hora_llegada).total_seconds() / 60  # en minutos
            
            if tiempo_espera >= 0 and tiempo_atencion >= 0:  # Validar que los tiempos sean positivos
                tiempos_espera.append(tiempo_espera)
                tiempos_atencion.append(tiempo_atencion)
                tiempos_totales.append(tiempo_total)
    
    # Calcular estadísticas
    if tiempos_espera:
        promedio_espera = sum(tiempos_espera) / len(tiempos_espera)
        max_espera = max(tiempos_espera)
        min_espera = min(tiempos_espera)
    else:
        promedio_espera = max_espera = min_espera = 0
    
    if tiempos_atencion:
        promedio_atencion = sum(tiempos_atencion) / len(tiempos_atencion)
        max_atencion = max(tiempos_atencion)
        min_atencion = min(tiempos_atencion)
    else:
        promedio_atencion = max_atencion = min_atencion = 0
    
    # Distribución de tiempos por rangos
    rangos_espera = {
        '0-5 min': len([t for t in tiempos_espera if 0 <= t <= 5]),
        '5-15 min': len([t for t in tiempos_espera if 5 < t <= 15]),
        '15-30 min': len([t for t in tiempos_espera if 15 < t <= 30]),
        '30+ min': len([t for t in tiempos_espera if t > 30])
    }
    
    rangos_atencion = {
        '0-5 min': len([t for t in tiempos_atencion if 0 <= t <= 5]),
        '5-15 min': len([t for t in tiempos_atencion if 5 < t <= 15]),
        '15-30 min': len([t for t in tiempos_atencion if 15 < t <= 30]),
        '30+ min': len([t for t in tiempos_atencion if t > 30])
    }
    
    return Response({
        'promedio_espera': round(promedio_espera, 2),
        'max_espera': round(max_espera, 2),
        'min_espera': round(min_espera, 2),
        'promedio_atencion': round(promedio_atencion, 2),
        'max_atencion': round(max_atencion, 2),
        'min_atencion': round(min_atencion, 2),
        'rangos_espera': rangos_espera,
        'rangos_atencion': rangos_atencion,
        'total_turnos_analizados': len(tiempos_espera),
        'periodo': periodo
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def estadisticas_resumen(request):
    """Resumen general de estadísticas"""
    periodo = request.GET.get('periodo', 'diario')
    
    # Configurar rango de fechas
    now = timezone.now()
    if periodo == 'diario':
        fecha_inicio = now.date()
    elif periodo == 'semanal':
        fecha_inicio = now.date() - timedelta(days=7)
    elif periodo == 'mensual':
        fecha_inicio = now.date() - timedelta(days=30)
    else:  # anual
        fecha_inicio = now.date() - timedelta(days=365)
    
    # Ventas totales del período
    ventas_periodo = Factura.objects.filter(
        fecha_factura__date__gte=fecha_inicio
    ).aggregate(
        total_ventas=Sum('Total'),
        cantidad_facturas=Count('id')
    )
    
    # Turnos del período
    turnos_periodo = Turno.objects.filter(
        created_at__date__gte=fecha_inicio
    ).aggregate(
        total_turnos=Count('id'),
        turnos_finalizados=Count('id', filter=Q(estado='finalizado')),
        turnos_cancelados=Count('id', filter=Q(estado='cancelado'))
    )
    
    # Clientes únicos del período
    clientes_periodo = Turno.objects.filter(
        created_at__date__gte=fecha_inicio
    ).values('ID_Cliente').distinct().count()
    
    # Servicios más usados
    servicios_top = (Turno.objects
                    .filter(created_at__date__gte=fecha_inicio)
                    .values('ID_Servicio__Nombre')
                    .annotate(cantidad=Count('id'))
                    .order_by('-cantidad')[:3])
    
    return Response({
        'ventas': {
            'total': float(ventas_periodo['total_ventas'] or 0),
            'cantidad_facturas': ventas_periodo['cantidad_facturas'],
            'promedio_por_factura': float((ventas_periodo['total_ventas'] or 0) / (ventas_periodo['cantidad_facturas'] or 1))
        },
        'turnos': {
            'total': turnos_periodo['total_turnos'],
            'finalizados': turnos_periodo['turnos_finalizados'],
            'cancelados': turnos_periodo['turnos_cancelados'],
            'porcentaje_exito': round((turnos_periodo['turnos_finalizados'] / (turnos_periodo['total_turnos'] or 1)) * 100, 2)
        },
        'clientes_unicos': clientes_periodo,
        'servicios_top': list(servicios_top),
        'periodo': periodo
    }) 