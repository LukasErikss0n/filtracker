from sqlmodel import Field, SQLModel


class Filament(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    brand: str
    material: str
    color_name: str
    hex: str
    price_per_kg: float
    grams: float
    full_grams: float
    owner_id: int | None = Field(default=None, foreign_key="member.id")
