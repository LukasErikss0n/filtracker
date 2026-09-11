from sqlmodel import Field, SQLModel


class Member(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    key: str = Field(unique=True, index=True)  # matches login username + AUTH_<KEY>_PASSWORD_HASH
    name: str
    color: str
    gram_balance: float = 0
    grams_printed: float = 0
