#!/usr/bin/env python
"""
Script de verificación para el despliegue en Render
Verificar que todas las configuraciones estén correctas
"""
import os
import sys
from pathlib import Path

def check_environment():
    """Verificar variables de entorno necesarias"""
    required_vars = [
        'SECRET_KEY',
        'DB_NAME',
        'DB_USER', 
        'DB_PASSWORD',
        'DB_HOST',
        'DB_PORT'
    ]
    
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
        'requirements.txt',
        'scripts/deploy/build.sh',
        'manage.py',
        'config/settings.py',
        'config/wsgi.py',
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
    try:
        import django
        import psycopg2
        import gunicorn
        import whitenoise
        import corsheaders
        import rest_framework
        print("✅ Todas las dependencias están instaladas")
        return True
    except ImportError as e:
        print(f"❌ Dependencia faltante: {e}")
        return False

def main():
    """Función principal"""
    print("🔍 Verificando configuración para despliegue en Render...\n")
    
    checks = [
        check_files(),
        check_dependencies(),
        check_environment()
    ]
    
    if all(checks):
        print("\n🎉 Todo está listo para el despliegue!")
        print("📝 Próximos pasos:")
        print("   1. git add .")
        print("   2. git commit -m 'prepare for render deployment'")
        print("   3. git push origin production")
        print("   4. Configurar en Render siguiendo DEPLOY-RENDER.md")
        return 0
    else:
        print("\n❌ Hay problemas que resolver antes del despliegue")
        return 1

if __name__ == "__main__":
    sys.exit(main())
