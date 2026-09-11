from sqlmodel import Session, select

from app.models.member import Member
from app.models.transaction import CashDebt, Transaction, TransactionType


def list_members(session: Session) -> list[Member]:
    return list(session.exec(select(Member)))


def get_member(session: Session, member_id: int) -> Member | None:
    return session.get(Member, member_id)


def debts_for(session: Session, debtor_id: int) -> list[CashDebt]:
    return list(
        session.exec(select(CashDebt).where(CashDebt.debtor_id == debtor_id, CashDebt.amount > 0))
    )


def credit_member(session: Session, member_id: int, grams: float, note: str) -> Member:
    member = session.get(Member, member_id)
    if member is None:
        raise ValueError("Unknown member")
    member.gram_balance = round(member.gram_balance + grams, 2)
    session.add(member)
    session.add(
        Transaction(
            type=TransactionType.contrib,
            member_id=member_id,
            grams=grams,
            note=note.strip() or "Filament contribution",
        )
    )
    session.commit()
    session.refresh(member)
    return member


def mark_paid(session: Session, debtor_id: int, creditor_id: int) -> None:
    debt = session.exec(
        select(CashDebt).where(
            CashDebt.debtor_id == debtor_id, CashDebt.creditor_id == creditor_id
        )
    ).first()
    if debt:
        session.delete(debt)
    session.add(
        Transaction(
            type=TransactionType.paid,
            member_id=debtor_id,
            owed_to_id=creditor_id,
        )
    )
    session.commit()
