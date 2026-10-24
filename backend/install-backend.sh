#!/bin/bash
# ===================================================
# Backend Installation Script - Farmacia Django React
# ===================================================

echo "🚀 Instalando dependencias del backend..."

# Verificar si Python está instalado
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: Python3 no está instalado"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Crear entorno virtual si no existe
if [ ! -d "env" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv env
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source env/bin/activate

# Actualizar pip
echo "📋 Actualizando pip..."
pip install --upgrade pip

# Instalar dependencias
echo "📦 Instalando dependencias del backend..."
pip install -r requirements.txt

# Verificar instalaciones críticas
echo "🔍 Verificando instalaciones..."
python -c "import django; print(f'✅ Django {django.get_version()} instalado correctamente')"
python -c "import rest_framework; print('✅ Django REST Framework instalado correctamente')"
python -c "import corsheaders; print('✅ Django CORS Headers instalado correctamente')"

echo ""
echo "🎉 ¡Backend instalado correctamente!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Activar entorno virtual: source env/bin/activate"
echo "2. Ejecutar migraciones: python manage.py migrate"
echo "3. Crear superusuario: python manage.py createsuperuser"
echo "4. Iniciar servidor: python manage.py runserver"
echo ""
echo "📚 Archivos disponibles:"
echo "   - python create_test_admin.py (crear admin de prueba)"
echo "   - python crear_datos_estadisticas.py (datos de ejemplo)"
echo ""
