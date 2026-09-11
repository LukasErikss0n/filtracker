from pydantic import BaseModel


class FilamentCreate(BaseModel):
    brand: str = "Generic"
    material: str
    color_name: str
    hex: str = "#f4b400"
    price_per_kg: float
    grams: float
    owner_id: int | None = None
