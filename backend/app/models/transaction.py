from datetime import datetime, timezone
from enum import Enum

from sqlmodel import Field, SQLModel, UniqueConstraint


class TransactionType(str, Enum):
    print = "print"
    contrib = "contrib"
    paid = "paid"


class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    type: TransactionType
    member_id: int = Field(foreign_key="member.id")
    filament_id: int | None = Field(default=None, foreign_key="filament.id")
    grams: float | None = None
    from_balance: float | None = None
    cash_charged: float | None = None
    owed_to_id: int | None = Field(default=None, foreign_key="member.id")
    note: str | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CashDebt(SQLModel, table=True):
    """How much `debtor` owes `creditor` for printing beyond their gram balance."""

    __table_args__ = (UniqueConstraint("debtor_id", "creditor_id"),)

    id: int | None = Field(default=None, primary_key=True)
    debtor_id: int = Field(foreign_key="member.id")
    creditor_id: int = Field(foreign_key="member.id")
    amount: float = 0
