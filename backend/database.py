import sqlite3

DATABASE = "../dataset/library.db"


def get_connection():
    connection = sqlite3.connect(DATABASE)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables():
    connection = get_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            isbn TEXT,
            category TEXT,
            section TEXT,
            rack TEXT,
            shelf INTEGER,
            position INTEGER,
            available INTEGER DEFAULT 1
        )
    """)

    connection.commit()
    connection.close()