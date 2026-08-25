"""
Migration script to remove old enrollment fields and keep only new fields.
Run: python migrate_remove_old_enrollment_fields.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql://root:password@localhost/school")

def migrate():
    engine = create_engine(DATABASE_URL)

    with engine.connect() as conn:
        # 1. Clear old enrollment records if any (required for NOT NULL columns)
        try:
            conn.execute(text("DELETE FROM enrollments"))
            conn.commit()
            print("✓ Cleared old enrollment records")
        except Exception as e:
            print(f"✗ Error clearing enrollments: {e}")

        # 2. Drop old columns
        old_columns = ["student_name", "student_email", "student_phone", "message"]

        # Get existing columns
        result = conn.execute(text("SHOW COLUMNS FROM enrollments"))
        existing_columns = [row[0] for row in result.fetchall()]

        print(f"Existing columns: {existing_columns}")

        for col_name in old_columns:
            if col_name in existing_columns:
                try:
                    sql = f"ALTER TABLE enrollments DROP COLUMN {col_name}"
                    conn.execute(text(sql))
                    conn.commit()
                    print(f"✓ Dropped column: {col_name}")
                except Exception as e:
                    print(f"✗ Error dropping column {col_name}: {e}")
            else:
                print(f"- Column not found (skipping): {col_name}")

        # 3. Make required columns NOT NULL
        required_columns = ["khmer_name", "english_name", "gender", "email"]
        for col_name in required_columns:
            try:
                sql = f"ALTER TABLE enrollments MODIFY {col_name} VARCHAR(150) NOT NULL"
                conn.execute(text(sql))
                conn.commit()
                print(f"✓ Made column NOT NULL: {col_name}")
            except Exception as e:
                print(f"✗ Error making column NOT NULL {col_name}: {e}")

    print("\n✓ Migration completed successfully!")

if __name__ == "__main__":
    migrate()