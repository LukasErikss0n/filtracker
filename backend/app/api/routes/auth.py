from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.dependencies import get_current_member, require_api_key
from app.core.config import settings
from app.core.security import create_access_token, verify_password
from app.db.session import get_session
from app.models.member import Member
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(dependencies=[Depends(require_api_key)])


def _member_out(member: Member) -> dict:
    return {
        "id": member.id,
        "key": member.key,
        "name": member.name,
        "color": member.color,
    }


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, session: Session = Depends(get_session)):
    username = payload.username.strip().lower()
    member = session.exec(select(Member).where(Member.key == username)).first()
    password_hash = settings.password_hash_for(username)
    if not member or not verify_password(payload.password, password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Wrong name or password")
    token = create_access_token(member.key)
    return LoginResponse(access_token=token, member=_member_out(member))


@router.get("/me")
def me(current: Member = Depends(get_current_member)):
    return _member_out(current)
