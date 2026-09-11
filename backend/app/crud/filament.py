from sqlmodel import Session, select

from app.models.filament import Filament
from app.schemas.filament import FilamentCreate


def list_filaments(session: Session) -> list[Filament]:
    return list(session.exec(select(Filament)))


def get_filament(session: Session, filament_id: int) -> Filament | None:
    return session.get(Filament, filament_id)


def create_filament(session: Session, data: FilamentCreate) -> Filament:
    filament = Filament(
        brand=data.brand.strip() or "Generic",
        material=data.material,
        color_name=data.color_name.strip(),
        hex=data.hex,
        price_per_kg=data.price_per_kg,
        grams=data.grams,
        full_grams=data.grams,
        owner_id=data.owner_id,
    )
    session.add(filament)
    session.commit()
    session.refresh(filament)
    return filament
