from fastapi import Depends, Header, HTTPException, status
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_session
from app.models.member import Member


def require_api_key(x_api_key: str = Header(default="")) -> None:
    if not settings.api_key or x_api_key != settings.api_key:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or missing API key")


def get_current_member(
    authorization: str = Header(default=""),
    session: Session = Depends(get_session),
    _: None = Depends(require_api_key),
) -> Member:
    if not authorization.startswith("Bearer "):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    token = authorization.removeprefix("Bearer ").strip()
    try:
        member_key = decode_access_token(token)
    except Exception as exc:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED, "Invalid or expired session"
        ) from exc
    member = session.exec(select(Member).where(Member.key == member_key)).first()
    if not member:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unknown member")
    return member
