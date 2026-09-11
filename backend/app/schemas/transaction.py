from pydantic import BaseModel


class PrintRequest(BaseModel):
    member_id: int
    filament_id: int
    grams: float
