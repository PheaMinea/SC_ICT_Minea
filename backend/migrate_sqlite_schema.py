import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "sc_academy.db"

# Table -> required columns from SQLAlchemy models
REQUIRED_COLUMNS = {
    "admins": [
        ("id", "INTEGER"),
        ("username", "VARCHAR(50)"),
        ("email", "VARCHAR(100)"),
        ("hashed_password", "VARCHAR(255)"),
        ("is_active", "BOOLEAN DEFAULT 1"),
        ("created_at", "DATETIME"),
    ],
    "events": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("description", "TEXT"),
        ("image", "VARCHAR(500)"),
        ("date", "DATETIME"),
        ("location", "VARCHAR(255)"),
        ("is_upcoming", "BOOLEAN DEFAULT 1"),
        ("is_past", "BOOLEAN DEFAULT 0"),
        ("created_at", "DATETIME"),
        ("updated_at", "DATETIME"),
    ],
    "gallery_images": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("category", "VARCHAR(100)"),
        ("image_url", "VARCHAR(500)"),
        ("description", "TEXT"),
        ("is_featured", "BOOLEAN DEFAULT 0"),
        ('"order"', "INTEGER DEFAULT 0"),
        ("created_at", "DATETIME"),
    ],
    "videos": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("description", "TEXT"),
        ("video_url", "VARCHAR(500)"),
        ("thumbnail", "VARCHAR(500)"),
        ("category", "VARCHAR(100)"),
        ("date", "DATETIME"),
        ("is_featured", "BOOLEAN DEFAULT 0"),
        ("views", "INTEGER DEFAULT 0"),
        ("created_at", "DATETIME"),
        ("updated_at", "DATETIME"),
    ],
    "services": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("description", "TEXT"),
        ("icon", "VARCHAR(255)"),
        ("image", "VARCHAR(500)"),
        ("is_active", "BOOLEAN DEFAULT 1"),
        ('"order"', "INTEGER DEFAULT 0"),
        ("created_at", "DATETIME"),
    ],
    "contact_messages": [
        ("id", "INTEGER"),
        ("name", "VARCHAR(150)"),
        ("email", "VARCHAR(150)"),
        ("phone", "VARCHAR(50)"),
        ("subject", "VARCHAR(255)"),
        ("message", "TEXT"),
        ("is_read", "BOOLEAN DEFAULT 0"),
        ("is_replied", "BOOLEAN DEFAULT 0"),
        ("created_at", "DATETIME"),
    ],
    "about_content": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("content", "TEXT"),
        ("mission", "TEXT"),
        ("vision", "TEXT"),
        ("core_values", "TEXT"),
        ("principal_message", "TEXT"),
        ("principal_image", "VARCHAR(500)"),
        ("history", "TEXT"),
        ("updated_at", "DATETIME"),
    ],
    "site_settings": [
        ("id", "INTEGER"),
        ("site_name", "VARCHAR(255)"),
        ("site_description", "TEXT"),
        ("logo_url", "VARCHAR(500)"),
        ("favicon_url", "VARCHAR(500)"),
        ("address", "VARCHAR(255)"),
        ("phone", "VARCHAR(50)"),
        ("email", "VARCHAR(150)"),
        ("facebook_url", "VARCHAR(500)"),
        ("telegram_url", "VARCHAR(500)"),
        ("youtube_url", "VARCHAR(500)"),
        ("google_map_url", "VARCHAR(500)"),
        ("updated_at", "DATETIME"),
    ],
    "course_categories": [
        ("id", "INTEGER"),
        ("name", "VARCHAR(150)"),
        ("slug", "VARCHAR(200)"),
        ("description", "TEXT"),
        ("image_url", "VARCHAR(500)"),
        ("is_active", "BOOLEAN DEFAULT 1"),
        ('"order"', "INTEGER DEFAULT 0"),
        ("created_at", "DATETIME"),
        ("updated_at", "DATETIME"),
    ],
    "courses": [
        ("id", "INTEGER"),
        ("title", "VARCHAR(255)"),
        ("slug", "VARCHAR(255)"),
        ("description", "TEXT"),
        ("short_description", "VARCHAR(500)"),
        ("image_url", "VARCHAR(500)"),
        ("duration", "VARCHAR(100)"),
        ("level", "VARCHAR(100)"),
        ("price", "VARCHAR(100)"),
        ("is_active", "BOOLEAN DEFAULT 1"),
        ("is_featured", "BOOLEAN DEFAULT 0"),
        ('"order"', "INTEGER DEFAULT 0"),
        ("category_id", "INTEGER"),
        ("created_at", "DATETIME"),
        ("updated_at", "DATETIME"),
    ],
    "enrollments": [
        ("id", "INTEGER"),
        ("student_name", "VARCHAR(150)"),
        ("student_email", "VARCHAR(150)"),
        ("student_phone", "VARCHAR(50)"),
        ("message", "TEXT"),
        ("status", "VARCHAR(50) DEFAULT 'pending'"),
        ("course_id", "INTEGER"),
        ("created_at", "DATETIME"),
        ("updated_at", "DATETIME"),
    ],
}


def table_exists(cur: sqlite3.Cursor, table_name: str) -> bool:
    cur.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",
        (table_name,),
    )
    return cur.fetchone() is not None


def existing_columns(cur: sqlite3.Cursor, table_name: str) -> set[str]:
    cur.execute(f"PRAGMA table_info({table_name})")
    return {row[1] for row in cur.fetchall()}


def ensure_table(cur: sqlite3.Cursor, table_name: str, columns: list[tuple[str, str]]) -> None:
    if table_exists(cur, table_name):
        return

    col_defs = []
    for i, (name, col_type) in enumerate(columns):
        if i == 0 and name == "id":
            col_defs.append(f"{name} INTEGER PRIMARY KEY")
        else:
            col_defs.append(f"{name} {col_type}")

    sql = f"CREATE TABLE {table_name} ({', '.join(col_defs)})"
    cur.execute(sql)
    print(f"[CREATE] {table_name}")


def ensure_columns(cur: sqlite3.Cursor, table_name: str, columns: list[tuple[str, str]]) -> None:
    current = existing_columns(cur, table_name)

    for col_name, col_type in columns:
        normalized = col_name.replace('"', "")
        if normalized in current:
            continue

        sql = f"ALTER TABLE {table_name} ADD COLUMN {col_name} {col_type}"
        cur.execute(sql)
        print(f"[ADD] {table_name}.{normalized} {col_type}")


def main() -> None:
    if not DB_PATH.exists():
        raise FileNotFoundError(f"Database not found: {DB_PATH}")

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    try:
        for table, cols in REQUIRED_COLUMNS.items():
            ensure_table(cur, table, cols)
            ensure_columns(cur, table, cols)

        conn.commit()
        print("Schema migration completed successfully.")
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    main()
