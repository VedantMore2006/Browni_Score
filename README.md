# Vitals&Vectors — Skeleton (Phase 1)

Solo Leveling themed monitoring platform. FastAPI + SQLite backend, vanilla HTML/CSS/JS frontend.

`backend/` and `frontend/` live at the repo root (`Browni_Score/`).

## Setup

```bash
conda create -n vitals_vectors python=3.11
conda activate vitals_vectors
cd backend
pip install -r requirements.txt
```

## Run Locally

```bash
# Backend (from backend/)
conda activate vitals_vectors
uvicorn main:app --reload --port 8000
# API docs: http://localhost:8000/docs

# Frontend (from frontend/, separate terminal)
python -m http.server --bind localhost 3000 
# Open: http://localhost:3000/index.html
```

Health check: `curl http://localhost:8000/health` → `{"status": "ok"}`

> **Server ownership:** these servers are started/stopped manually by whoever runs this project locally — not automatically by any assistant working in this repo. If you're an assistant picking up this project: don't start or kill the backend/frontend processes; assume they're already running and use `curl http://localhost:8000/health` (or hit any endpoint) to check before making API calls.

On first run, the backend seeds a default admin account:

- **Username:** `admin`
- **Password:** `admin123`

Log in as admin, then use **Members** to create coordinators and members, and **Assign Tasks** to create and rate work.

## What's implemented (skeleton phase)

- JWT auth, role-based access (member / coordinator / admin)
- Member CRUD, password reset, deactivate, audit log
- Task create / assign / complete / rate → auto point award (+3 / +5 / +8)
- Manual point add/deduct log (admin & coordinator)
- Warnings (3rd warning auto-suspends)
- Weekly & monthly leaderboard, Hero of Week/Month
- Admin alerts (below 100 pts, 2 warnings, overdue tasks)
- All 9 pages from the build plan, Solo Leveling dark theme, mobile responsive
- `/health` endpoint for liveness checks

## Known placeholders (per build plan v2.0)

These are intentionally not wired up yet — flagged in the build plan for a later decision:

- Presence-streak point awarding (attendance logging source not yet decided)
- 85%-weekly-completion auto point bonus (needs a Sunday cron/scheduled job)
- Automatic weekly/monthly reset job (points currently accumulate continuously; no reset job runs yet)
- Flex-day tracking
- Notifications (WhatsApp / email / in-platform)
- Google Classroom / Premises app integrations
- VPS deployment
