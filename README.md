# Spool — Shared Filament Tracker

A household filament tracker for a shared 3D printer, with three accounts:
**Vidar**, **Lukas**, and **Vincent**. Members contribute filament (credited as
grams), spend those grams when they print, and owe cash to whoever's spool
they printed from once their own gram balance runs out.

## Stack

- **Backend**: FastAPI + SQLModel (SQLite), JWT sessions, all endpoints behind
  a shared `X-API-Key` header.
- **Frontend**: React + Vite + Tailwind + daisyUI.
- **Docker Compose**: two separate stacks — `docker-compose.dev.yml` (local,
  live-reloading) and `docker-compose.prod.yml` (static build + Cloudflare
  tunnel).
KEY` —
no separate `VITE_`-prefixed variable or frontend-local `.env` needed. The
dev server proxies `/api` to `http://localhost:8000` by default.


