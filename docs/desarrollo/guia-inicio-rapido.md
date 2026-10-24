# Guia de inicio rapido

## 1. Clonar y rama

```powershell
git clone https://github.com/AndreyQuicenoC/Medifast-Pharmacy.git
cd Medifast-Pharmacy
git checkout develop
```

## 2. Backend

```powershell
cd backend
copy .env.example .env
py -3.13 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_dev_users
.\.venv\Scripts\python manage.py runserver
```

## 3. Frontend

```powershell
cd frontend
copy .env.example .env
npm ci
npm run dev
```

## 4. Validacion

Desde la raiz: `.\scripts\validate-local.ps1`

## 5. PostgreSQL opcional

`docker compose up -d db` y configurar `USE_SQLITE=False` con variables `DB_*` en `.env`.
