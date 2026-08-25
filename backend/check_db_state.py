import pymysql
import re
from pathlib import Path

env = Path(__file__).resolve().parent / ".env"
text = env.read_text(encoding="utf-8")

match = re.search(
    r"mysql\+pymysql://([^:]*):([^@]*)@([^:]+):(\d+)/(.+)",
    text,
)
if not match:
    print("Could not parse DATABASE_URL")
    raise SystemExit(1)

user, password, host, port, db_name = match.groups()

conn = pymysql.connect(
    host=host,
    port=int(port),
    user=user,
    password=password,
    database=db_name,
    charset="utf8mb4",
)

try:
    with conn.cursor() as cur:
        # Check courses.category_id nullability
        cur.execute(
            """
            SELECT IS_NULLABLE FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA=%s AND TABLE_NAME='courses'
              AND COLUMN_NAME='category_id'
            """,
            (db_name,),
        )
        row = cur.fetchone()
        category_nullable = row[0] if row else "COLUMN NOT FOUND"

        # Check course_categories.image_url exists
        cur.execute(
            """
            SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA=%s AND TABLE_NAME='course_categories'
              AND COLUMN_NAME='image_url'
            """,
            (db_name,),
        )
        count = cur.fetchone()[0]
        image_url_exists = count > 0

        print("Database:", db_name)
        print("courses.category_id nullable:", category_nullable)
        print("course_categories.image_url exists:", image_url_exists)

        # Show courses count per category
        cur.execute(
            """
            SELECT cc.id, cc.name_en,
                   (SELECT COUNT(*) FROM courses c
                    WHERE c.category_id = cc.id) AS course_count
            FROM course_categories cc
            ORDER BY cc.id
            """
        )
        print("\nCategories and their course counts:")
        for r in cur.fetchall():
            print(f"  Category #{r[0]} ({r[1]}): {r[2]} course(s)")
finally:
    conn.close()