#!/usr/bin/env python
"""
Script para crear superusuario en producción
Usar después del primer despliegue en Render
"""
import os
import django
from datetime import datetime
from django.core.management import execute_from_command_line

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DS1.settings")
    django.setup()
    
    from django.contrib.auth import get_user_model
    
    User = get_user_model()
    
    # Verificar si ya existe un superusuario
    if not User.objects.filter(is_superuser=True).exists():
        # Crear superusuario con datos de variables de entorno
        admin_cc = os.environ.get('ADMIN_CC', '12345678')
        admin_email = os.environ.get('ADMIN_EMAIL', 'admin@farmacia.com')
        admin_password = os.environ.get('ADMIN_PASSWORD', 'admin123')
        admin_phone = os.environ.get('ADMIN_PHONE', '3001234567')
        
        User.objects.create_superuser(
            cc='123456',
            email='admin@farmacia.com',
            password='Admin1234*',
            first_name='Administrador',
            last_name='Sistema',
            phone_number='3114322544',
            dob=datetime(1990, 1, 1),
            rol='administrador'
        )
        print(f"Superusuario creado: CC 123456, Email: admin@farmacia.com")
    else:
        print("Ya existe un superusuario en el sistema")
