#!/usr/bin/env python3
"""Generate a bcrypt hash for a household account password and write it to
secrets/tempPass_<account> (the plaintext password is never written to disk).

Each account gets its own file, e.g. secrets/tempPass_vidar. If that file
already exists, this script refuses to touch it — delete it yourself first
if you want to set a new password for that account.

Why a plain file instead of an env var: a bcrypt hash contains literal `$`
characters, and Docker Compose's env_file loader does shell-style variable
interpolation on bare `$word` sequences, which would silently mangle the
hash. Reading it from a bind-mounted file avoids that entirely.

Usage:
    docker compose run --rm backend python scripts/hash_password.py
    # or, running locally from backend/:
    .venv/bin/python scripts/hash_password.py

Run this in your own terminal — don't pipe a password into it or paste one
into a shared/logged session, since either would leave it in shell history
or logs in plaintext.
"""
import getpass
import os
from pathlib import Path

import bcrypt

ACCOUNTS = ["vidar", "lukas", "vincent"]

# /app/secrets when run in the backend container (bind-mounted by
# docker-compose.yml), ../secrets when run locally from backend/,
# secrets as a last resort.
CANDIDATE_SECRETS_DIRS = [
    os.environ.get("SECRETS_DIR"),
    "/app/secrets",
    "../secrets",
    "secrets",
]


def find_secrets_dir() -> Path:
    for candidate in CANDIDATE_SECRETS_DIRS:
        if candidate and Path(candidate).is_dir():
            return Path(candidate)
    raise SystemExit(
        "Couldn't find a secrets/ directory. Create it at the project root "
        "first (mkdir secrets), or set SECRETS_DIR to point at it."
    )


def main() -> None:
    if not os.isatty(0):
        raise SystemExit(
            "Refusing to run with stdin that isn't a real terminal — this "
            "prompts for a password and won't hide it otherwise."
        )

    secrets_dir = find_secrets_dir()

    print("Accounts:", ", ".join(ACCOUNTS))
    username = input("Which account is this password for? ").strip().lower()
    if username not in ACCOUNTS:
        raise SystemExit(f"Unknown account {username!r}. Expected one of {ACCOUNTS}.")

    target = secrets_dir / f"tempPass_{username}"
    if target.exists():
        raise SystemExit(
            f"{target} already exists — refusing to overwrite it. "
            f"Delete it yourself first if you want to set a new password."
        )

    password = getpass.getpass("New password: ")
    confirm = getpass.getpass("Confirm password: ")
    if password != confirm:
        raise SystemExit("Passwords did not match.")
    if not password:
        raise SystemExit("Password cannot be empty.")

    password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    target.write_text(password_hash + "\n")
    print(f"\nSaved to {target}.")
    print("Restart the backend for it to take effect: docker compose restart backend")


if __name__ == "__main__":
    main()
