# Backend Medifast

Punto de entrada Django. Documentacion completa: [docs/desarrollo/backend-instalacion.md](../docs/desarrollo/backend-instalacion.md).

```powershell
copy .env.example .env
py -3.13 -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py runserver
```
