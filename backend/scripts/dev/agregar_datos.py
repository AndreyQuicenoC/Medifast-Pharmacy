#!/usr/bin/env python3
"""
Script para agregar medicamentos y servicios a la base de datos
"""
import os
import sys
import django
from datetime import date, timedelta
from random import randint, choice

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.catalog.models import Producto
from apps.operations.models import Servicio

def agregar_medicamentos():
    """Agregar 15 medicamentos nuevos"""
    
    medicamentos = [
        {
            'Nombre': 'Ibuprofeno 400mg',
            'Presentacion': 'Tabletas x 20 unidades',
            'Descripcion': 'Antiinflamatorio no esteroideo para dolor y fiebre',
            'Tipo': 'Analgésico',
            'Precio': 12500,
            'Descuento': 0,
            'Stock': 150,
            'Marca': 'Genfar',
            'Codigo': 'MED001',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Acetaminofén 500mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'Analgésico y antipirético de uso común',
            'Tipo': 'Analgésico',
            'Precio': 8900,
            'Descuento': 5,
            'Stock': 200,
            'Marca': 'MK',
            'Codigo': 'MED002',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Amoxicilina 500mg',
            'Presentacion': 'Cápsulas x 21 unidades',
            'Descripcion': 'Antibiótico betalactámico de amplio espectro',
            'Tipo': 'Antibiótico',
            'Precio': 18750,
            'Descuento': 0,
            'Stock': 80,
            'Marca': 'Tecnoquímicas',
            'Codigo': 'MED003',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Loratadina 10mg',
            'Presentacion': 'Tabletas x 10 unidades',
            'Descripcion': 'Antihistamínico para alergias',
            'Tipo': 'Antihistamínico',
            'Precio': 15200,
            'Descuento': 10,
            'Stock': 120,
            'Marca': 'Lafrancol',
            'Codigo': 'MED004',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Omeprazol 20mg',
            'Presentacion': 'Cápsulas x 14 unidades',
            'Descripcion': 'Inhibidor de bomba de protones para gastritis',
            'Tipo': 'Gastroprotector',
            'Precio': 22400,
            'Descuento': 0,
            'Stock': 90,
            'Marca': 'Pfizer',
            'Codigo': 'MED005',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Dipirona 500mg',
            'Presentacion': 'Tabletas x 20 unidades',
            'Descripcion': 'Analgésico y antipirético potente',
            'Tipo': 'Analgésico',
            'Precio': 11800,
            'Descuento': 15,
            'Stock': 110,
            'Marca': 'Bayer',
            'Codigo': 'MED006',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Diclofenaco 50mg',
            'Presentacion': 'Tabletas x 20 unidades',
            'Descripcion': 'Antiinflamatorio para dolor muscular y articular',
            'Tipo': 'Antiinflamatorio',
            'Precio': 14600,
            'Descuento': 0,
            'Stock': 130,
            'Marca': 'Voltaren',
            'Codigo': 'MED007',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Simvastatina 20mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'Estatina para control del colesterol',
            'Tipo': 'Hipolipemiante',
            'Precio': 28900,
            'Descuento': 0,
            'Stock': 70,
            'Marca': 'Abbott',
            'Codigo': 'MED008',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Metformina 850mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'Antidiabético oral para diabetes tipo 2',
            'Tipo': 'Antidiabético',
            'Precio': 19500,
            'Descuento': 5,
            'Stock': 95,
            'Marca': 'Sanofi',
            'Codigo': 'MED009',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Atorvastatina 40mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'Estatina para reducir colesterol y triglicéridos',
            'Tipo': 'Hipolipemiante',
            'Precio': 35200,
            'Descuento': 0,
            'Stock': 60,
            'Marca': 'Lipitor',
            'Codigo': 'MED010',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Salbutamol 100mcg',
            'Presentacion': 'Inhalador x 200 dosis',
            'Descripcion': 'Broncodilatador para asma y EPOC',
            'Tipo': 'Broncodilatador',
            'Precio': 42800,
            'Descuento': 0,
            'Stock': 45,
            'Marca': 'Ventolin',
            'Codigo': 'MED011',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Captopril 25mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'IECA para hipertensión arterial',
            'Tipo': 'Antihipertensivo',
            'Precio': 16900,
            'Descuento': 10,
            'Stock': 85,
            'Marca': 'Capoten',
            'Codigo': 'MED012',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Losartán 50mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'ARA II para hipertensión y protección renal',
            'Tipo': 'Antihipertensivo',
            'Precio': 24700,
            'Descuento': 0,
            'Stock': 75,
            'Marca': 'Cozaar',
            'Codigo': 'MED013',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        },
        {
            'Nombre': 'Amlodipino 5mg',
            'Presentacion': 'Tabletas x 30 unidades',
            'Descripcion': 'Calcioantagonista para hipertensión',
            'Tipo': 'Antihipertensivo',
            'Precio': 21300,
            'Descuento': 5,
            'Stock': 100,
            'Marca': 'Norvasc',
            'Codigo': 'MED014',
            'Fecha_vencimiento': date.today() + timedelta(days=365*3)
        },
        {
            'Nombre': 'Cetirizina 10mg',
            'Presentacion': 'Tabletas x 20 unidades',
            'Descripcion': 'Antihistamínico de segunda generación',
            'Tipo': 'Antihistamínico',
            'Precio': 13800,
            'Descuento': 0,
            'Stock': 140,
            'Marca': 'Zyrtec',
            'Codigo': 'MED015',
            'Fecha_vencimiento': date.today() + timedelta(days=365*2)
        }
    ]
    
    productos_creados = 0
    for med_data in medicamentos:
        # Verificar si ya existe un producto con el mismo código
        if not Producto.objects.filter(Codigo=med_data['Codigo']).exists():
            producto = Producto.objects.create(**med_data)
            print(f"✅ Creado: {producto.Nombre} - Código: {producto.Codigo}")
            productos_creados += 1
        else:
            print(f"⚠️  Ya existe: {med_data['Nombre']} - Código: {med_data['Codigo']}")
    
    print(f"\n📊 Medicamentos creados: {productos_creados}/15")
    return productos_creados

def agregar_servicios():
    """Agregar 2 servicios prioritarios y 3 no prioritarios"""
    
    servicios = [
        # Servicios prioritarios (Prioridad = 1)
        {
            'Nombre': 'Consulta de Urgencias',
            'Prioridad': 1,
            'Descripcion': 'Atención médica inmediata para casos de urgencia y emergencia',
            'Estado': True
        },
        {
            'Nombre': 'Atención Prioritaria Adulto Mayor',
            'Prioridad': 1,
            'Descripcion': 'Servicio especializado para personas de la tercera edad con atención preferencial',
            'Estado': True
        },
        # Servicios no prioritarios (Prioridad = 0)
        {
            'Nombre': 'Consulta Medicina General',
            'Prioridad': 0,
            'Descripcion': 'Consulta médica general para evaluación y diagnóstico de condiciones comunes',
            'Estado': True
        },
        {
            'Nombre': 'Aplicación de Inyecciones',
            'Prioridad': 0,
            'Descripcion': 'Servicio de enfermería para aplicación de medicamentos inyectables',
            'Estado': True
        },
        {
            'Nombre': 'Toma de Signos Vitales',
            'Prioridad': 0,
            'Descripcion': 'Medición de presión arterial, temperatura, pulso y otros signos vitales',
            'Estado': True
        }
    ]
    
    servicios_creados = 0
    servicios_prioritarios = 0
    servicios_normales = 0
    
    for serv_data in servicios:
        # Verificar si ya existe un servicio con el mismo nombre
        if not Servicio.objects.filter(Nombre=serv_data['Nombre']).exists():
            servicio = Servicio.objects.create(**serv_data)
            if servicio.Prioridad == 1:
                servicios_prioritarios += 1
                print(f"🔥 Servicio prioritario creado: {servicio.Nombre}")
            else:
                servicios_normales += 1
                print(f"📋 Servicio normal creado: {servicio.Nombre}")
            servicios_creados += 1
        else:
            print(f"⚠️  Ya existe: {serv_data['Nombre']}")
    
    print(f"\n📊 Servicios creados: {servicios_creados}/5")
    print(f"   - Prioritarios: {servicios_prioritarios}")
    print(f"   - Normales: {servicios_normales}")
    return servicios_creados

def main():
    print("🏥 AGREGANDO DATOS A LA BASE DE DATOS")
    print("=" * 50)
    
    print("\n💊 AGREGANDO MEDICAMENTOS...")
    medicamentos_creados = agregar_medicamentos()
    
    print("\n🩺 AGREGANDO SERVICIOS...")
    servicios_creados = agregar_servicios()
    
    print("\n" + "=" * 50)
    print("📋 RESUMEN:")
    print(f"   • Medicamentos agregados: {medicamentos_creados}")
    print(f"   • Servicios agregados: {servicios_creados}")
    print("✅ Proceso completado exitosamente!")

if __name__ == "__main__":
    main()
