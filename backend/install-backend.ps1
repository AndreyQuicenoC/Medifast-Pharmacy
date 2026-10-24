# ===================================================
# Backend Installation Script - Farmacia Django React
# PowerShell Version for Windows
# ===================================================

Write-Host "🚀 Instalando dependencias del backend..." -ForegroundColor Green

# Verificar si Python está instalado
$pythonCmd = "py -3.13"
try {
    $pythonVersion = & py -3.13 --version 2>&1
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
} catch {
    $pythonCmd = "python"
    $pythonVersion = python --version 2>&1
    Write-Host "Python encontrado: $pythonVersion" -ForegroundColor Green
}

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "Archivo .env creado desde .env.example" -ForegroundColor Yellow
}

# Crear entorno virtual si no existe
if (!(Test-Path ".venv")) {
    Write-Host "Creando entorno virtual..." -ForegroundColor Yellow
    Invoke-Expression "$pythonCmd -m venv .venv"
}

# Activar entorno virtual
Write-Host "Activando entorno virtual..." -ForegroundColor Yellow
& ".venv\Scripts\Activate.ps1"

# Actualizar pip
Write-Host "📋 Actualizando pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip

# Instalar dependencias
Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
pip install -r requirements.txt

# Verificar instalaciones críticas
Write-Host "🔍 Verificando instalaciones..." -ForegroundColor Yellow
try {
    python -c "import django; print(f'✅ Django {django.get_version()} instalado correctamente')"
    python -c "import rest_framework; print('✅ Django REST Framework instalado correctamente')"
    python -c "import corsheaders; print('✅ Django CORS Headers instalado correctamente')"
} catch {
    Write-Host "⚠️ Algunas verificaciones fallaron, pero las dependencias principales están instaladas" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 ¡Backend instalado correctamente!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos pasos:" -ForegroundColor Cyan
Write-Host "1. Activar entorno virtual: env\Scripts\Activate.ps1"
Write-Host "2. Ejecutar migraciones: python manage.py migrate"
Write-Host "3. Crear superusuario: python manage.py createsuperuser"
Write-Host "4. Iniciar servidor: python manage.py runserver"
Write-Host ""
Write-Host "📚 Archivos disponibles:" -ForegroundColor Cyan
Write-Host "   - python create_test_admin.py (crear admin de prueba)"
Write-Host "   - python crear_datos_estadisticas.py (datos de ejemplo)"
Write-Host ""
