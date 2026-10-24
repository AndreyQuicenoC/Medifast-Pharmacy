#!/usr/bin/env python
import os
import sys
import django

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS1.settings')
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
django.setup()

from apps.users.models import User, Cliente, Empleado, Administrador, Rol

def clean_database():
    """Limpiar completamente la base de datos de usuarios y roles"""
    print("Iniciando limpieza de la base de datos...")
    
    try:
        # Eliminar todos los registros de las tablas específicas
        print("Eliminando clientes...")
        Cliente.objects.all().delete()
        
        print("Eliminando empleados...")
        Empleado.objects.all().delete()
        
        print("Eliminando administradores...")
        Administrador.objects.all().delete()
        
        print("Eliminando usuarios...")
        User.objects.all().delete()
        
        print("Eliminando roles...")
        Rol.objects.all().delete()
        
        print("Base de datos limpiada completamente.")
        
    except Exception as e:
        print(f"Error al limpiar la base de datos: {e}")

if __name__ == "__main__":
    clean_database()
