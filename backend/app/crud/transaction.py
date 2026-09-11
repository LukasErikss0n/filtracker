from datetime import datetime, timedelta, timezone

from sqlmodel import Session, select

from app.models.filament import Filament
from app.models.member import Member
from app.models.transaction import CashDebt, Transaction, TransactionType


def per_gram(filament: Filament) -> float:
    return filament.price_per_kg / 1000


def log_print(
    session: Session, member_id: int, filament_id: int, grams: float
) -> Transaction:
    member = session.get(Member, member_id)
    filament = session.get(Filament, filament_id)
    if member is None or filament is None:
        raise ValueError("Unknown member or filament")
    if grams <= 0:
        raise ValueError("Grams must be positive")

    from_balance = min(member.gram_balance, grams)
    shortfall = round(grams - from_balance, 2)
    cash_charged = round(shortfall * per_gram(filament), 2)

    member.gram_balance = round(member.gram_balance - from_balance, 2)
    member.grams_printed = round(member.grams_printed + grams, 2)
    filament.grams = max(0, filament.grams - grams)
    session.add(member)
    session.add(filament)

    owner_id = filament.owner_id
    if cash_charged > 0 and owner_id and owner_id != member_id:
        debt = session.exec(
            select(CashDebt).where(
                CashDebt.debtor_id == member_id, CashDebt.creditor_id == owner_id
            )
        ).first()
        if debt:
            debt.amount = round(debt.amount + cash_charged, 2)
        else:
            debt = CashDebt(debtor_id=member_id, creditor_id=owner_id, amount=cash_charged)
        session.add(debt)

    txn = Transaction(
        type=TransactionType.print,
        member_id=member_id,
        filament_id=filament_id,
        grams=grams,
        from_balance=from_balance,
        cash_charged=cash_charged,
        owed_to_id=owner_id if cash_charged > 0 else None,
    )
    session.add(txn)
    session.commit()
    session.refresh(txn)
    return txn


def list_ledger(session: Session, limit: int = 200) -> list[Transaction]:
    return list(
        session.exec(
            select(Transaction).order_by(Transaction.created_at.desc()).limit(limit)
        )
    )


def prints_since(session: Session, days: int) -> list[Transaction]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    return list(
        session.exec(
            select(Transaction).where(
                Transaction.type == TransactionType.print,
                Transaction.created_at >= since,
            )
        )
    )
