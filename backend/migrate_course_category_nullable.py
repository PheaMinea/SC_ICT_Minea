import re
from pathlib import Path

import pymysql

# Load environment
env_path = Path(__file__).resolve().parent / ".env"

DATABASE_URL = None

with open(env_path, "r", encoding="utf-8") as f:
    for line in f:
        line = line.strip()
        if line.startswith("DATABASE_URL="):
            DATABASE_URL = line.split("=", 1)[1].strip()
            break

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL not found in .env")


# Parse mysql+pymysql://user:pass@host:port/db
match = re.match(
    r"mysql\+pymysql://([^:]*):([^@]*)@([^:]+):(\d+)/(.+)",
    DATABASE_URL,
)

if not match:
    raise RuntimeError(
        f"Could not parse DATABASE_URL: {DATABASE_URL}"
    )

user, password, host, port, db_name = match.groups()


def column_is_nullable(cursor, table, column):
    cursor.execute(
        """
        SELECT IS_NULLABLE
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = %s
          AND TABLE_NAME = %s
          AND COLUMN_NAME = %s
        """,
        (db_name, table, column),
    )
    row = cursor.fetchone()
    return row and row[0] == "YES"


def column_exists(cursor, table, column):
    cursor.execute(
        """
        SELECT COUNT(*)
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = %s
          AND TABLE_NAME = %s
          AND COLUMN_NAME = %s
        """,
        (db_name, table, column),
    )
    return cursor.fetchone()[0] > 0


def migrate():
    """Apply all course category schema migrations."""
    conn = pymysql.connect(
        host=host,
        port=int(port),
        user=user,
        password=password,
        database=db_name,
        charset="utf8mb4",
    )

    try:
        with conn.cursor() as cursor:
            # 1. Make courses.category_id nullable
            if not column_is_nullable(cursor, "courses", "category_id"):
                cursor.execute(
                    "ALTER TABLE courses MODIFY COLUMN category_id INT NULL"
                )
                print("Made courses.category_id nullable.")
            else:
                print("courses.category_id is already nullable.")

            # 2. Drop course_categories.image_url
            if column_exists(cursor, "course_categories", "image_url"):
                cursor.execute(
                    "ALTER TABLE course_categories DROP COLUMN image_url"
                )
                print("Dropped course_categories.image_url.")
            else:
                print("course_categories.image_url already dropped.")

            conn.commit()
            print("Database migration completed successfully.")

    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


if __name__ == "__main__":
    migrate()