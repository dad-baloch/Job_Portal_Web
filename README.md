# Job Portal Web (Flask + React)

Monorepo with:
- `Backend/` — Flask REST API (JWT auth, SQLAlchemy, migrations)
- `Frontend/` — React + Vite + TypeScript + Tailwind

## Quick start (local)

### 1) Backend

```bash
cd Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Optional: configure env (recommended)
cp .env.example .env

# DB migrations
flask db upgrade

# Seed demo data (creates demo accounts + jobs)
python3 seed.py

# Run API
python3 run.py
```

Backend URL: `http://127.0.0.1:5000`

### 2) Frontend

```bash
cd Frontend
npm install

cp .env.example .env
npm run dev
```

Frontend URL: `http://127.0.0.1:5173` (or next available port)

## Demo logins (seeded)

- Employer: `employer@example.com` / `Password123!`
- Job seeker: `seeker@example.com` / `Password123!`
- Admin: `admin@example.com` / `Password123!`

## Notes

- If you see JWT error `Subject must be a string`, log out and log back in (old tokens were issued in an older format).
- Vite may change the dev port if `5173` is already in use.
