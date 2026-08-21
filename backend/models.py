from pydantic import BaseModel


class Book(BaseModel):
    title: str
    author: str
    isbn: str | None = None
    category: str | None = None
    section: str | None = None
    rack: str
    shelf: int
    position: int | None = None
    available: bool = True