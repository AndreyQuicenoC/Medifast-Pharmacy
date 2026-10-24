# Validaciones minimas de estabilizacion (Fase 1)
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
Set-Location $Root

Write-Host "Backend: comprobacion Django..."
Set-Location "$Root\backend"
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}
$py = "py"
if (-not (Get-Command py -ErrorAction SilentlyContinue)) { $py = "python" }
if (-not (Test-Path ".venv")) {
    & $py -3.13 -m venv .venv
}
.\.venv\Scripts\pip install -q -r requirements.txt
.\.venv\Scripts\python manage.py check
.\.venv\Scripts\python manage.py migrate --noinput
.\.venv\Scripts\python manage.py test apps.identity.tests.test_settings_smoke

Write-Host "Frontend: lint y build..."
Set-Location "$Root\frontend"
if (-not (Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
}
npm ci
npm run lint
npm run build

Write-Host "Validacion local completada."
