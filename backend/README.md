# Backend — Medifast Pharmacy

API Django 5 + DRF. Estructura y dominios: [docs/STRUCTURE.md](docs/STRUCTURE.md).

## Desarrollo rapido

```bash
cp .env.example .env
# USE_SQLITE=True en .env para SQLite local
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py runserver
```

## Calidad (paridad con CI)

Linux / macOS:

```bash
make quality
```

Windows:

```powershell
.\scripts\quality.ps1
```

## Scripts

Ver [scripts/README.md](scripts/README.md).
