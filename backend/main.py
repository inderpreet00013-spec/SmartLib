from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection, create_tables
from models import Book

app = FastAPI(title="SmartLib API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create database table when server starts
create_tables()


@app.get("/")
def home():
    return {
        "message": "Welcome to SmartLib",
        "status": "Backend is running"
    }


@app.get("/books")
def get_books():
    connection = get_connection()

    books = connection.execute(
        "SELECT * FROM books"
    ).fetchall()

    connection.close()

    return [dict(book) for book in books]


@app.post("/books")
@app.get("/search")
def search_books(q: str):
    connection = get_connection()

    books = connection.execute("""
        SELECT * FROM books
        WHERE title LIKE ?
        OR author LIKE ?
        OR category LIKE ?
    """, (
        f"%{q}%",
        f"%{q}%",
        f"%{q}%"
    )).fetchall()

    connection.close()

    return [dict(book) for book in books]
def add_book(book: Book):
    connection = get_connection()

    cursor = connection.execute("""
        INSERT INTO books
        (title, author, isbn, category, section, rack, shelf, position, available)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        book.title,
        book.author,
        book.isbn,
        book.category,
        book.section,
        book.rack,
        book.shelf,
        book.position,
        int(book.available)
    ))

    connection.commit()

    book_id = cursor.lastrowid

    connection.close()

    return {
        "message": "Book added successfully",
        "book_id": book_id
    }