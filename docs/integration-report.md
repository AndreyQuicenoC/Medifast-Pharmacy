# Integration report

## FASE-0-1 — Inspección inicial y estabilización de `production`
**Validated:** 2026-10-23

### Integration contract
- **Backend base:** `http://localhost:8000/api` (desarrollo)
- **Frontend env:** `VITE_API_BASE_URL` en `frontend/.env` (desde `.env.example`)
- **Auth:** Token en header `Authorization: Token <key>` tras POST `/api/authtoken/`

### End-to-end flow (manual, local)
1. Copiar `backend/.env.example` → `backend/.env` (`USE_SQLITE=True`)
2. `py -3.13 -m venv backend/.venv` && `pip install -r requirements.txt`
3. `python manage.py migrate` && `python manage.py runserver`
4. Copiar `frontend/.env.example` → `frontend/.env`
5. `npm ci` && `npm run dev` — login contra API local

### Functional validation
| Criterion | Status | Evidence |
|-----------|--------|----------|
| Backend arranca con SQLite | PASS | `manage.py check`, migrate OK |
| Frontend compila | PASS | `npm run build` |
| Lint frontend | PASS | 0 errors ESLint |
| E2E login completo | NOT_VERIFIED | No ejecutado en esta sesión (servidor no dejado en background) |

### Security validation
| Control | Status | Notes |
|---------|--------|-------|
| Secretos removidos del índice | PASS | CREDENCIALES + frontend/.env untracked |
| Historial Git previo | NOT_VERIFIED | Puede contener secretos; rotación recomendada |
| Escaneo Gitleaks | NOT_RUN | Herramienta no ejecutada en entorno |

### Acceptance score
- **Result:** ~78% (7/9 criterios con evidencia automatizada; E2E y push pendientes en cierre de sesión)
- **Status:** CONDITIONAL — completar push y verificación remota

### Instructions (local)
```powershell
cd Medifast-Pharmacy
.\scripts\validate-local.ps1
# Terminal 1
cd backend; .\.venv\Scripts\python manage.py runserver
# Terminal 2
cd frontend; npm run dev
```
