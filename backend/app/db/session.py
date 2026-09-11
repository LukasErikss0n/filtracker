from sqlmodel import Session, SQLModel, create_engine, select

from app.core.config import ACCOUNT_SEEDS, settings

connect_args = (
    {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
)
engine = create_engine(settings.database_url, connect_args=connect_args)


def get_session():
    with Session(engine) as session:
        yield session


def init_db() -> None:
    # Import models so SQLModel's metadata knows about their tables before create_all.
    from app.models import filament, member, transaction  # noqa: F401

    SQLModel.metadata.create_all(engine)
    _seed_members()


def _seed_members() -> None:
    from app.models.member import Member

    with Session(engine) as session:
        for seed in ACCOUNT_SEEDS:
            existing = session.exec(
                select(Member).where(Member.key == seed["key"])
            ).first()
            if not existing:
                session.add(Member(**seed))
        session.commit()
