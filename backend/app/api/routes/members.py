from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.dependencies import get_current_member, require_api_key
from app.crud import member as member_crud
from app.db.session import get_session
from app.models.member import Member
from app.schemas.member import CreditRequest, MarkPaidRequest

router = APIRouter(dependencies=[Depends(require_api_key)])


def _member_out(session: Session, member: Member) -> dict:
    debts = member_crud.debts_for(session, member.id)
    debt_rows = []
    for debt in debts:
        creditor = member_crud.get_member(session, debt.creditor_id)
        debt_rows.append(
            {
                "creditor_id": debt.creditor_id,
                "creditor_name": creditor.name if creditor else "",
                "creditor_color": creditor.color if creditor else "#999",
                "amount": debt.amount,
            }
        )
    return {
        "id": member.id,
        "key": member.key,
        "name": member.name,
        "color": member.color,
        "gram_balance": member.gram_balance,
        "grams_printed": member.grams_printed,
        "cash_owed": debt_rows,
        "cash_owed_total": round(sum(d["amount"] for d in debt_rows), 2),
    }


@router.get("")
def list_members(session: Session = Depends(get_session)):
    return [_member_out(session, m) for m in member_crud.list_members(session)]


@router.post("/credit")
def credit_member(
    payload: CreditRequest,
    session: Session = Depends(get_session),
    _: Member = Depends(get_current_member),
):
    if payload.grams <= 0:
        raise HTTPException(400, "Grams must be positive")
    try:
        member = member_crud.credit_member(
            session, payload.member_id, payload.grams, payload.note
        )
    except ValueError as exc:
        raise HTTPException(404, str(exc)) from exc
    return _member_out(session, member)


@router.post("/mark-paid")
def mark_paid(
    payload: MarkPaidRequest,
    session: Session = Depends(get_session),
    _: Member = Depends(get_current_member),
):
    debtor = member_crud.get_member(session, payload.debtor_id)
    if not debtor:
        raise HTTPException(404, "Unknown member")
    member_crud.mark_paid(session, debtor_id=payload.debtor_id, creditor_id=payload.creditor_id)
    return _member_out(session, debtor)
