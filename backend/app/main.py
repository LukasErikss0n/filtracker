from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import auth, dashboard, filaments, members, tracking, transactions
from app.core.config import settings
from app.db.session import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Spool - Shared Filament Tracker", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(members.router, prefix="/api/members", tags=["members"])
app.include_router(filaments.router, prefix="/api/filaments", tags=["filaments"])
app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(tracking.router, prefix="/api/tracking", tags=["tracking"])


@app.get("/api/config")
def public_config():
    return {"currency": settings.currency}


@app.get("/api/health")
def health():
    return {"status": "ok"}
