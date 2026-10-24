#!/usr/bin/env python
import os
import sys
import django
import json
from datetime import datetime, timedelta
from decimal import Decimal

# Add the current directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.identity.models import User, Cliente
from apps.operations.models import Factura, Turno, Servicio, Caja, Horario
from apps.catalog.models import Producto
from django.utils import timezone

print("=== CREANDO DATOS DE PRUEBA PARA ESTADÍSTICAS ===")
print()

# Crear servicios si no existen
servicios_datos = [
    {"Nombre": "Consulta General", "Prioridad": 1, "Descripcion": "Consulta médica general", "Estado": True},
    {"Nombre": "Medicina Especializada", "Prioridad": 2, "Descripcion": "Consulta con especialista", "Estado": True},
    {"Nombre": "Venta de Medicamentos", "Prioridad": 3, "Descripcion": "Compra de medicamentos", "Estado": True},
    {"Nombre": "Procedimientos", "Prioridad": 4, "Descripcion": "Procedimientos médicos", "Estado": True},
]

servicios_creados = []
for servicio_data in servicios_datos:
    servicio, created = Servicio.objects.get_or_create(
        Nombre=servicio_data["Nombre"],
        defaults=servicio_data
    )
    if created:
        print(f"✅ Servicio creado: {servicio.Nombre}")
    else:
        print(f"ℹ️  Servicio ya existe: {servicio.Nombre}")
    servicios_creados.append(servicio)

# Crear productos si no existen
productos_datos = [
    {"Nombre": "Acetaminofén 500mg", "Precio": 2500, "Stock": 100, "Tipo": "Analgésico", "Marca": "Genfar"},
    {"Nombre": "Ibuprofeno 400mg", "Precio": 3200, "Stock": 80, "Tipo": "Antiinflamatorio", "Marca": "MK"},
    {"Nombre": "Amoxicilina 500mg", "Precio": 8500, "Stock": 60, "Tipo": "Antibiótico", "Marca": "Farma"},
    {"Nombre": "Loratadina 10mg", "Precio": 4200, "Stock": 45, "Tipo": "Antihistamínico", "Marca": "Tecnoquímicas"},
    {"Nombre": "Omeprazol 20mg", "Precio": 6800, "Stock": 70, "Tipo": "Gastroprotector", "Marca": "Lafrancol"},
    {"Nombre": "Dipirona 500mg", "Precio": 3800, "Stock": 90, "Tipo": "Analgésico", "Marca": "Procaps"},
    {"Nombre": "Vitamina C 1g", "Precio": 5500, "Stock": 120, "Tipo": "Vitamina", "Marca": "Bayer"},
    {"Nombre": "Aspirina 100mg", "Precio": 1800, "Stock": 150, "Tipo": "Antiagregante", "Marca": "Bayer"},
]

productos_creados = []
for producto_data in productos_datos:
    producto, created = Producto.objects.get_or_create(
        Nombre=producto_data["Nombre"],
        defaults={
            **producto_data,
            "Presentacion": "Tabletas",
            "Descripcion": f"Medicamento {producto_data['Tipo']}",
            "Activo": True,
            "requiere_orden_medica": False
        }
    )
    if created:
        print(f"✅ Producto creado: {producto.Nombre}")
    else:
        print(f"ℹ️  Producto ya existe: {producto.Nombre}")
    productos_creados.append(producto)

# Crear cajas si no existen
cajas_datos = [
    {"nombre": "A", "Estado": True},
    {"nombre": "B", "Estado": True},
    {"nombre": "C", "Estado": False},
]

cajas_creadas = []
for caja_data in cajas_datos:
    caja, created = Caja.objects.get_or_create(
        nombre=caja_data["nombre"],
        defaults=caja_data
    )
    if created:
        print(f"✅ Caja creada: {caja.nombre}")
    else:
        print(f"ℹ️  Caja ya existe: {caja.nombre}")
    cajas_creadas.append(caja)

# Obtener clientes existentes
clientes = list(Cliente.objects.filter(ID_Usuario__deleted_at__isnull=True)[:10])
if not clientes:
    print("⚠️  No hay clientes disponibles. Crear algunos clientes primero.")
    sys.exit(1)

print(f"📊 Trabajando con {len(clientes)} clientes existentes")

# Crear datos de estadísticas para los últimos 30 días
now = timezone.now()
facturas_creadas = 0
turnos_creados = 0

print()
print("=== CREANDO TURNOS Y FACTURAS DE PRUEBA ===")

for dia in range(30):  # Últimos 30 días
    fecha = now - timedelta(days=dia)
    
    # Crear entre 3-8 turnos por día
    import random
    turnos_del_dia = random.randint(3, 8)
    
    for turno_num in range(turnos_del_dia):
        try:
            # Seleccionar cliente, servicio y caja aleatoriamente
            cliente = random.choice(clientes)
            servicio = random.choice(servicios_creados)
            caja = random.choice(cajas_creadas[:2])  # Solo cajas activas
            
            # Crear horario
            hora_base = fecha.replace(hour=random.randint(8, 17), minute=random.randint(0, 59))
            horario = Horario.objects.create(
                Hora_llegada=hora_base,
                Hora_atencion=hora_base + timedelta(minutes=random.randint(5, 30)),
                Hora_salida=hora_base + timedelta(minutes=random.randint(35, 90))
            )
            
            # Crear turno
            estado = random.choice(['finalizado', 'finalizado', 'finalizado', 'cancelado'])  # 75% finalizados
            turno = Turno.objects.create(
                ID_Cliente=cliente,
                ID_Caja=caja,
                ID_Servicio=servicio,
                ID_Horario=horario,
                Cedula_manual=str(cliente.ID_Usuario.cc),
                numero_turno=1000 + turnos_creados,
                estado=estado,
                es_prioritario=random.choice([True, False, False, False]),  # 25% prioritarios
                created_at=fecha,
                updated_at=fecha
            )
            turnos_creados += 1
            
            # Crear factura si el turno fue finalizado
            if estado == 'finalizado' and random.choice([True, True, False]):  # 66% de turnos finalizados tienen factura
                # Crear productos vendidos
                num_productos = random.randint(1, 4)
                productos_vendidos = []
                total_factura = 0
                
                productos_seleccionados = random.sample(productos_creados, min(num_productos, len(productos_creados)))
                
                for producto in productos_seleccionados:
                    cantidad = random.randint(1, 3)
                    precio_unitario = producto.Precio
                    precio_total = precio_unitario * cantidad
                    total_factura += precio_total
                    
                    productos_vendidos.append({
                        "id": producto.id,
                        "nombre": producto.Nombre,
                        "cantidad": cantidad,
                        "precio_unitario": precio_unitario,
                        "precio_total": precio_total
                    })
                
                # Aplicar descuento aleatorio (0-20%)
                descuento = random.uniform(0, 0.2)
                total_con_descuento = total_factura * (1 - descuento)
                
                factura = Factura.objects.create(
                    ID_Turno=turno,
                    Total=Decimal(str(round(total_con_descuento, 2))),
                    productos_vendidos=json.dumps(productos_vendidos),
                    fecha_factura=fecha
                )
                facturas_creadas += 1
                
        except Exception as e:
            print(f"Error creando datos para día {dia}: {e}")
            continue
    
    if dia % 5 == 0:
        print(f"📅 Procesados {dia + 1} días...")

print()
print("=== RESUMEN DE DATOS CREADOS ===")
print(f"✅ Servicios: {len(servicios_creados)} disponibles")
print(f"✅ Productos: {len(productos_creados)} disponibles")
print(f"✅ Cajas: {len(cajas_creadas)} disponibles")
print(f"✅ Turnos creados: {turnos_creados}")
print(f"✅ Facturas creadas: {facturas_creadas}")

# Estadísticas rápidas
total_ventas = Factura.objects.filter(fecha_factura__date__gte=(now - timedelta(days=30)).date()).aggregate(
    total=django.db.models.Sum('Total')
)['total'] or 0

turnos_finalizados = Turno.objects.filter(
    created_at__date__gte=(now - timedelta(days=30)).date(),
    estado='finalizado'
).count()

print()
print("=== ESTADÍSTICAS GENERADAS ===")
print(f"💰 Total ventas últimos 30 días: ${total_ventas}")
print(f"✅ Turnos finalizados últimos 30 días: {turnos_finalizados}")
print(f"📊 Promedio ventas por factura: ${float(total_ventas) / max(facturas_creadas, 1):.2f}")

print()
print("🎉 ¡Datos de prueba creados exitosamente!")
print("Ahora puedes probar las estadísticas en el frontend.")
