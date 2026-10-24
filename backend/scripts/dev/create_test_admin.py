#!/usr/bin/env python
"""
Script para crear un usuario administrador de prueba.
"""
import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from scripts.bootstrap_django import setup_django

setup_django()

from apps.identity.models import User, Administrador


def _dev_password():
    value = os.environ.get("MEDIFAST_DEV_PASSWORD")
    if not value:
        raise RuntimeError("Defina MEDIFAST_DEV_PASSWORD antes de ejecutar este script.")
    return value


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
            phone_number=3001234567,
            rol='administrador',
            is_staff=True,
            is_active=True,
            dob=date(1990, 1, 1)  # Fecha de nacimiento por defecto
        )
        user.set_password(_dev_password())
        user.save()

        # Crear entrada en tabla Administrador
        Administrador.objects.create(ID_Usuario=user)

        print("Usuario administrador creado (admin@test.com, cc=12345678).")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == '__main__':
    print("=== Creando usuario administrador de prueba ===")
    create_test_admin()
    print("=== Completado ===")
