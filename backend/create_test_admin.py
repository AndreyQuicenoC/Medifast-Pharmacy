#!/usr/bin/env python
"""
Script para crear un usuario administrador de prueba.
"""
import os
import sys
import django

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS1.settings')
django.setup()

from apps.users.models import User, Administrador

def create_test_admin():
    """Crear un administrador de prueba"""
    try:
        # Verificar si ya existe
        if User.objects.filter(email='admin@test.com').exists():
            print("✓ Usuario administrador ya existe")
            return

        # Crear usuario
        from datetime import date
        user = User.objects.create(
            cc=12345678,
            first_name='Admin',
            last_name='Test',
            email='admin@test.com',
            phone_number='1234567890',
            rol_simple='administrador',
            is_staff=True,
            is_active=True,
            dob=date(1990, 1, 1)  # Fecha de nacimiento por defecto
        )
        user.set_password('admin123')
        user.save()

        # Crear entrada en tabla Administrador
        Administrador.objects.create(ID_Usuario=user)

        print(f"✓ Usuario administrador creado:")
        print(f"  Email: admin@test.com")
        print(f"  Password: admin123")
        print(f"  CC: 12345678")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    print("=== Creando usuario administrador de prueba ===")
    create_test_admin()
    print("=== Completado ===")
