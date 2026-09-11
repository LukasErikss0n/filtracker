from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.dependencies import require_api_key
from app.core.config import settings
from app.crud import filament as filament_crud
from app.crud import member as member_crud
from app.crud import transaction as txn_crud
from app.crud.transaction import per_gram
from app.db.session import get_session
from app.models.transaction import TransactionType

router = APIRouter(dependencies=[Depends(require_api_key)])


@router.get("")
def dashboard(session: Session = Depends(get_session)):
    members = member_crud.list_members(session)
    filaments = filament_crud.list_filaments(session)
    ledger = txn_crud.list_ledger(session)

    total_grams_in_pool = round(sum(m.gram_balance for m in members), 2)
    grams_on_hand = round(sum(f.grams for f in filaments), 2)
    filament_value = round(sum(f.grams * per_gram(f) for f in filaments), 2)
    total_cash_owed = round(
        sum(sum(d.amount for d in member_crud.debts_for(session, m.id)) for m in members), 2
    )
    print_count = sum(1 for t in ledger if t.type == TransactionType.print)

    return {
        "currency": settings.currency,
        "total_grams_in_pool": total_grams_in_pool,
        "member_count": len(members),
        "spool_count": len(filaments),
        "grams_on_hand": grams_on_hand,
        "filament_value": filament_value,
        "total_cash_owed": total_cash_owed,
        "print_count": print_count,
    }
