# Replica local del pipeline de calidad backend (Windows)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

python -m pip install --upgrade pip
pip install -r requirements-dev.txt

Copy-Item .env.example .env -Force -ErrorAction SilentlyContinue
Add-Content .env "`nUSE_SQLITE=True`nDEBUG=True"

ruff check apps config tests scripts/deploy scripts/setup
ruff format --check apps config tests scripts/deploy scripts/setup
pytest --cov=apps --cov=config --cov-report=term-missing --cov-fail-under=55
bandit -r apps config -c pyproject.toml
pip-audit -r requirements.txt
radon cc apps config -a -nb --total-average
interrogate apps config -c pyproject.toml
python manage.py check
python manage.py migrate --noinput

Write-Host "Backend quality pipeline OK"
