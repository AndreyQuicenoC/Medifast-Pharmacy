# Replica local del pipeline de calidad backend (Windows) — paridad con CI
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

python -m pip install --upgrade pip
pip install -r requirements-dev.txt

Copy-Item .env.example .env -Force -ErrorAction SilentlyContinue
if (-not (Select-String -Path .env -Pattern "SECRET_KEY=" -Quiet)) {
    Add-Content .env "`nSECRET_KEY=local-dev-only-not-for-production"
}
if (-not (Select-String -Path .env -Pattern "USE_SQLITE" -Quiet)) {
    Add-Content .env "`nUSE_SQLITE=True`nDEBUG=True"
}

ruff check apps config tests scripts/deploy scripts/setup
ruff format --check apps config tests scripts/deploy scripts/setup
python manage.py check
python manage.py migrate --noinput
pytest --cov=apps --cov=config --cov-report=term-missing --cov-fail-under=68
bandit -r apps config -c pyproject.toml `
  -x apps/operations/views.py `
  -x apps/identity/views.py `
  -x apps/operations/estadisticas_views.py
pip-audit -r requirements.txt
radon cc apps config -a -nb --total-average
interrogate apps config -c pyproject.toml

Write-Host "Backend quality pipeline OK"
