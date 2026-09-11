from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.api.dependencies import get_current_member, require_api_key
from app.crud import filament as filament_crud
from app.db.session import get_session
from app.models.filament import Filament
from app.models.member import Member
from app.schemas.filament import FilamentCreate

router = APIRouter(dependencies=[Depends(require_api_key)])


def _filament_out(filament: Filament) -> dict:
    return {
        "id": filament.id,
        "brand": filament.brand,
        "material": filament.material,
        "color_name": filament.color_name,
        "hex": filament.hex,
        "price_per_kg": filament.price_per_kg,
        "grams": filament.grams,
        "full_grams": filament.full_grams,
        "owner_id": filament.owner_id,
    }


@router.get("")
def list_filaments(session: Session = Depends(get_session)):
    return [_filament_out(f) for f in filament_crud.list_filaments(session)]


@router.post("")
def create_filament(
    payload: FilamentCreate,
    session: Session = Depends(get_session),
    _: Member = Depends(get_current_member),
):
    filament = filament_crud.create_filament(session, payload)
    return _filament_out(filament)
