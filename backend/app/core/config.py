from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# The three household accounts this app is built for. Fixed on purpose —
# this isn't a multi-tenant app, it's a shared tracker for one printer.
ACCOUNT_SEEDS = [
    {"key": "vidar", "name": "Vidar", "color": "#ff4d2e"},
    {"key": "lukas", "name": "Lukas", "color": "#2f7de1"},
    {"key": "vincent", "name": "Vincent", "color": "#12855a"},
]

# Password hashes live as plain files (one per account, written by
# scripts/hash_password.py) instead of environment variables. A bcrypt hash
# contains literal `$` characters, and Docker Compose's env_file loader does
# shell-style variable interpolation on bare `$word` sequences — that would
# silently mangle the hash if it sat in a Compose-managed .env file. Reading
# it straight from a bind-mounted file sidesteps that entirely.
SECRETS_DIR_CANDIDATES = ["/app/secrets", "../secrets", "secrets"]


class Settings(BaseSettings):
    # Single project-root .env, no per-service copies. In Docker it's
    # injected directly as container env vars (env_file: in compose), so
    # nothing here needs to find a file. Running locally without Docker
    # (cwd is backend/), it's one level up.
    model_config = SettingsConfigDict(env_file=("../.env", ".env"), extra="ignore")

    api_key: str = ""
    secret_key: str = "insecure-dev-secret-change-me"
    access_token_expire_minutes: int = 60 * 24 * 30  # 30 days

    database_url: str = "sqlite:///./filtracker.db"
    currency: str = "kr"
    cors_origins: str = "*"

    secrets_dir: str = ""  # optional override; auto-detected otherwise

    def _secrets_dir(self) -> Path:
        if self.secrets_dir:
            return Path(self.secrets_dir)
        for candidate in SECRETS_DIR_CANDIDATES:
            if Path(candidate).is_dir():
                return Path(candidate)
        return Path("secrets")

    def password_hash_for(self, key: str) -> str:
        path = self._secrets_dir() / f"tempPass_{key}"
        if path.is_file():
            return path.read_text().strip()
        return ""


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
