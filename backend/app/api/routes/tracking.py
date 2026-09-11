from collections import defaultdict
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from app.api.dependencies import require_api_key
from app.crud import member as member_crud
from app.crud import transaction as txn_crud
from app.db.session import get_session

router = APIRouter(dependencies=[Depends(require_api_key)])


@router.get("")
def tracking(days: int = Query(default=7, ge=1, le=90), session: Session = Depends(get_session)):
    members = member_crud.list_members(session)
    prints = txn_crud.prints_since(session, days)

    today = datetime.now(timezone.utc).date()
    day_offsets = list(range(days - 1, -1, -1))  # oldest first
    dates = [today.toordinal() - o for o in day_offsets]

    grams_by_day: dict[int, dict[int, float]] = defaultdict(lambda: defaultdict(float))
    counts_by_day: dict[int, dict[int, int]] = defaultdict(lambda: defaultdict(int))
    for txn in prints:
        day_ord = txn.created_at.date().toordinal()
        grams_by_day[day_ord][txn.member_id] += txn.grams or 0
        counts_by_day[day_ord][txn.member_id] += 1

    series = []
    for member in members:
        series.append(
            {
                "member_id": member.id,
                "name": member.name,
                "color": member.color,
                "grams_per_day": [round(grams_by_day[d][member.id], 2) for d in dates],
                "prints_per_day": [counts_by_day[d][member.id] for d in dates],
                "gram_balance": member.gram_balance,
                "grams_printed": member.grams_printed,
            }
        )

    labels = [datetime.fromordinal(d).strftime("%a") for d in dates]
    return {"labels": labels, "series": series}
