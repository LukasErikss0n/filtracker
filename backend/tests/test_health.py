import os
import tempfile

os.environ.setdefault("DATABASE_URL", f"sqlite:///{tempfile.mktemp(suffix='.db')}")
os.environ.setdefault("API_KEY", "test-key")

from fastapi.testclient import TestClient

from app.main import app


def test_health():
    with TestClient(app) as client:
        resp = client.get("/api/health")
        assert resp.status_code == 200
        assert resp.json() == {"status": "ok"}


def test_members_requires_api_key():
    with TestClient(app) as client:
        resp = client.get("/api/members")
        assert resp.status_code == 401


def test_members_with_api_key_seeded():
    with TestClient(app) as client:
        resp = client.get("/api/members", headers={"X-API-Key": "test-key"})
        assert resp.status_code == 200
        names = {m["name"] for m in resp.json()}
        assert names == {"Vidar", "Lukas", "Vincent"}
