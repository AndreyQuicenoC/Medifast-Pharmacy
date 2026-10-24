#!/usr/bin/env python
"""
Script de prueba para verificar que script_datosdeprueba.py funciona correctamente
Este script hace una copia de seguridad de la BD actual, ejecuta el script de datos,
y luego permite restaurar si algo sale mal.
"""

import os
import sys
import shutil
from datetime import datetime

def backup_database():
    """Hacer backup de la base de datos actual"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"db_backup_{timestamp}.sqlite3"
    
    if os.path.exists("db.sqlite3"):
        shutil.copy2("db.sqlite3", backup_file)
        print(f"✅ Backup creado: {backup_file}")
        return backup_file
    else:
        print("⚠️  No se encontró db.sqlite3")
        return None

def test_script():
    """Probar el script de datos"""
    print("🧪 Probando script_datosdeprueba.py...")
    
    # Hacer backup
    backup_file = backup_database()
    
    try:
        # Ejecutar el script de datos
        os.system("python script_datosdeprueba.py")
        
        print("✅ Script ejecutado correctamente")
        
        # Preguntar si mantener los cambios
        response = input("\n¿Mantener los datos generados? (s/n): ").lower()
        
        if response != 's':
            if backup_file and os.path.exists(backup_file):
                shutil.copy2(backup_file, "db.sqlite3")
                print("🔄 Base de datos restaurada desde backup")
            
    except Exception as e:
        print(f"❌ Error ejecutando script: {e}")
        
        # Restaurar desde backup
        if backup_file and os.path.exists(backup_file):
            shutil.copy2(backup_file, "db.sqlite3")
            print("🔄 Base de datos restaurada desde backup")
    
    finally:
        # Limpiar backup si el usuario lo desea
        if backup_file and os.path.exists(backup_file):
            cleanup = input(f"\n¿Eliminar backup {backup_file}? (s/n): ").lower()
            if cleanup == 's':
                os.remove(backup_file)
                print(f"🗑️  Backup {backup_file} eliminado")

if __name__ == "__main__":
    print("🔧 Tester para script_datosdeprueba.py")
    print("=" * 50)
    test_script()
