#!/usr/bin/env python
import os
import sys
import django
from django.contrib.auth.hashers import make_password
from datetime import datetime, date

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS1.settings')
django.setup()

from apps.users.models import User, Cliente

def crear_clientes():
    """Crear 10 clientes con cédulas colombianas y contraseña 'pinito1'"""
    
    clientes_data = [
        {
            'cc': 1234567890,
            'first_name': 'María',
            'last_name': 'García Rodríguez',
            'email': 'maria.garcia@email.com',
            'phone_number': 3101234567,
            'dob': date(1985, 3, 15),
            'prioritario': False
        },
        {
            'cc': 1098765432,
            'first_name': 'Carlos',
            'last_name': 'López Martínez',
            'email': 'carlos.lopez@email.com',
            'phone_number': 3209876543,
            'dob': date(1955, 8, 22),
            'prioritario': True  # Cliente prioritario (adulto mayor)
        },
        {
            'cc': 1456789123,
            'first_name': 'Ana',
            'last_name': 'Fernández Silva',
            'email': 'ana.fernandez@email.com',
            'phone_number': 3145678912,
            'dob': date(1992, 11, 8),
            'prioritario': False
        },
        {
            'cc': 1789456123,
            'first_name': 'Luis',
            'last_name': 'Morales Castro',
            'email': 'luis.morales@email.com',
            'phone_number': 3178945612,
            'dob': date(1948, 5, 30),
            'prioritario': True  # Cliente prioritario
        },
        {
            'cc': 1654321987,
            'first_name': 'Patricia',
            'last_name': 'Herrera Gómez',
            'email': 'patricia.herrera@email.com',
            'phone_number': 3165432198,
            'dob': date(1978, 9, 12),
            'prioritario': False
        },
        {
            'cc': 1987654321,
            'first_name': 'Jorge',
            'last_name': 'Ramírez Vargas',
            'email': 'jorge.ramirez@email.com',
            'phone_number': 3198765432,
            'dob': date(1990, 2, 18),
            'prioritario': False
        },
        {
            'cc': 1369258147,
            'first_name': 'Carmen',
            'last_name': 'Jiménez Ruiz',
            'email': 'carmen.jimenez@email.com',
            'phone_number': 3136925814,
            'dob': date(1960, 7, 4),
            'prioritario': True  # Cliente prioritario
        },
        {
            'cc': 1741852963,
            'first_name': 'Roberto',
            'last_name': 'Vásquez Torres',
            'email': 'roberto.vasquez@email.com',
            'phone_number': 3174185296,
            'dob': date(1987, 12, 25),
            'prioritario': False
        },
        {
            'cc': 1852963741,
            'first_name': 'Isabella',
            'last_name': 'Mendoza Peña',
            'email': 'isabella.mendoza@email.com',
            'phone_number': 3185296374,
            'dob': date(1995, 6, 10),
            'prioritario': False
        },
        {
            'cc': 1963741852,
            'first_name': 'Fernando',
            'last_name': 'Guerrero Sánchez',
            'email': 'fernando.guerrero@email.com',
            'phone_number': 3196374185,
            'dob': date(1952, 4, 14),
            'prioritario': True  # Cliente prioritario
        }
    ]
    
    password = make_password('pinito1')
    created_count = 0
    
    for cliente_data in clientes_data:
        try:
            # Verificar si ya existe el usuario
            if User.objects.filter(cc=cliente_data['cc']).exists():
                print(f"Usuario con CC {cliente_data['cc']} ya existe, saltando...")
                continue
                
            # Crear usuario
            usuario = User.objects.create(
                cc=cliente_data['cc'],
                first_name=cliente_data['first_name'],
                last_name=cliente_data['last_name'],
                email=cliente_data['email'],
                phone_number=cliente_data['phone_number'],
                dob=cliente_data['dob'],
                password=password,
                rol='cliente',
                is_active=True
            )
            
            # Crear cliente asociado
            Cliente.objects.create(
                ID_Usuario=usuario,
                prioritario=cliente_data['prioritario']
            )
            
            created_count += 1
            print(f"✅ Cliente creado: {cliente_data['first_name']} {cliente_data['last_name']} - CC: {cliente_data['cc']}")
            
        except Exception as e:
            print(f"❌ Error creando cliente {cliente_data['first_name']} {cliente_data['last_name']}: {str(e)}")
    
    print(f"\n🎉 Proceso completado. {created_count} clientes creados exitosamente.")
    print("Contraseña para todos los clientes: pinito1")

if __name__ == '__main__':
    crear_clientes()
