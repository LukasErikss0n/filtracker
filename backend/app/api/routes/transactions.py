from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from app.api.dependencies import get_current_member, require_api_key
from app.crud import member as member_crud
from app.crud import transaction as txn_crud
from app.crud.filament import get_filament
from app.db.session import get_session
from app.models.member import Member
from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import PrintRequest

router = APIRouter(dependencies=[Depends(require_api_key)])


def _txn_out(session: Session, txn: Transaction) -> dict:
    member = member_crud.get_member(session, txn.member_id)
    filament = get_filament(session, txn.filament_id) if txn.filament_id else None
    owner = member_crud.get_member(session, txn.owed_to_id) if txn.owed_to_id else None
    return {
        "id": txn.id,
        "type": txn.type.value,
        "created_at": txn.created_at.isoformat(),
        "member": {"id": member.id, "name": member.name, "color": member.color} if member else None,
        "filament": (
            {"id": filament.id, "color_name": filament.color_name, "material": filament.material}
            if filament
            else None
        ),
        "grams": txn.grams,
        "from_balance": txn.from_balance,
        "cash_charged": txn.cash_charged,
        "note": txn.note,
        "owed_to": {"id": owner.id, "name": owner.name} if owner else None,
    }


@router.post("/print")
def create_print(
    payload: PrintRequest,
    session: Session = Depends(get_session),
    _: Member = Depends(get_current_member),
):
    try:
        txn = txn_crud.log_print(session, payload.member_id, payload.filament_id, payload.grams)
    except ValueError as exc:
        raise HTTPException(400, str(exc)) from exc
    return _txn_out(session, txn)


@router.get("/ledger")
def ledger(session: Session = Depends(get_session)):
    return [_txn_out(session, t) for t in txn_crud.list_ledger(session)]
