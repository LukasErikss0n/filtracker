from pydantic import BaseModel


class CreditRequest(BaseModel):
    member_id: int
    grams: float
    note: str = ""


class MarkPaidRequest(BaseModel):
    debtor_id: int
    creditor_id: int
