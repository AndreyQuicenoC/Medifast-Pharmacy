#!/usr/bin/env python
"""
Script de verificación para el despliegue en Render
Verificar que todas las configuraciones estén correctas
"""

import importlib.util
import os
import sys
from pathlib import Path

DEPENDENCY_MODULES = (
    "corsheaders",
    "django",
    "gunicorn",
    "psycopg2",
    "rest_framework",
    "whitenoise",
)


def check_environment():
    """Verificar variables de entorno necesarias"""
    required_vars = ["SECRET_KEY", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT"]

    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)

    if missing_vars:
        print("❌ Variables de entorno faltantes:")
        for var in missing_vars:
            print(f"   - {var}")
        return False

    print("✅ Todas las variables de entorno están configuradas")
    return True


def check_files():
    """Verificar que los archivos necesarios existan"""
    base_dir = Path(__file__).resolve().parents[2]
    required_files = [
        "requirements.txt",
        "scripts/deploy/build.sh",
        "manage.py",
        "config/settings.py",
        "config/wsgi.py",
    ]

    missing_files = []
    for file_path in required_files:
        if not (base_dir / file_path).exists():
            missing_files.append(file_path)

    if missing_files:
        print("❌ Archivos faltantes:")
        for file_path in missing_files:
            print(f"   - {file_path}")
        return False

    print("✅ Todos los archivos necesarios están presentes")
    return True


def check_dependencies():
    """Verificar que las dependencias estén instaladas"""
    missing = [name for name in DEPENDENCY_MODULES if importlib.util.find_spec(name) is None]
    if missing:
        print("❌ Dependencias faltantes:")
        for name in missing:
            print(f"   - {name}")
        return False

    print("✅ Todas las dependencias están instaladas")
    return True


def main():
    """Función principal"""
    print("🔍 Verificando configuración para despliegue en Render...\n")

    checks = [check_files(), check_dependencies(), check_environment()]

    if all(checks):
        print("\n✅ Configuración lista para despliegue")
        return 0

    print("\n❌ Hay problemas en la configuración")
    return 1


if __name__ == "__main__":
    sys.exit(main())
