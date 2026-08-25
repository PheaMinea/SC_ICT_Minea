"""
Migration script to add new fields to the enrollments table.
Run this script to update the database schema.
"""
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./school.db")

def migrate():
    engine = create_engine(DATABASE_URL)
    
    with engine.connect() as conn:
        # Check if columns already exist
        if "sqlite" in DATABASE_URL:
            # SQLite migration
            columns_to_add = [
                ("khmer_name", "VARCHAR(150)"),
                ("english_name", "VARCHAR(150)"),
                ("gender", "VARCHAR(20)"),
                ("age", "INTEGER"),
                ("date_of_birth", "VARCHAR(20)"),
                ("nationality", "VARCHAR(100)"),
                ("nation", "VARCHAR(100)"),
                ("religion", "VARCHAR(100)"),
                ("state_id_no", "VARCHAR(100)"),
                ("issued_on", "VARCHAR(20)"),
                ("expired_on", "VARCHAR(20)"),
                ("house_no", "VARCHAR(50)"),
                ("village", "VARCHAR(100)"),
                ("commune_sangkat", "VARCHAR(100)"),
                ("district_khan", "VARCHAR(100)"),
                ("province_city", "VARCHAR(100)"),
                ("phone", "VARCHAR(50)"),
                ("email", "VARCHAR(150)"),
            ]
            
            # Get existing columns
            result = conn.execute(text("PRAGMA table_info(enrollments)"))
            existing_columns = [row[1] for row in result.fetchall()]
            
            print(f"Existing columns: {existing_columns}")
            
            # Add missing columns
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    try:
                        sql = f"ALTER TABLE enrollments ADD COLUMN {col_name} {col_type}"
                        conn.execute(text(sql))
                        conn.commit()
                        print(f"✓ Added column: {col_name}")
                    except Exception as e:
                        print(f"✗ Error adding column {col_name}: {e}")
                else:
                    print(f"- Column already exists: {col_name}")
        else:
            # MySQL or other databases
            columns_to_add = [
                ("khmer_name", "VARCHAR(150)"),
                ("english_name", "VARCHAR(150)"),
                ("gender", "VARCHAR(20)"),
                ("age", "INTEGER"),
                ("date_of_birth", "VARCHAR(20)"),
                ("nationality", "VARCHAR(100)"),
                ("nation", "VARCHAR(100)"),
                ("religion", "VARCHAR(100)"),
                ("state_id_no", "VARCHAR(100)"),
                ("issued_on", "VARCHAR(20)"),
                ("expired_on", "VARCHAR(20)"),
                ("house_no", "VARCHAR(50)"),
                ("village", "VARCHAR(100)"),
                ("commune_sangkat", "VARCHAR(100)"),
                ("district_khan", "VARCHAR(100)"),
                ("province_city", "VARCHAR(100)"),
                ("phone", "VARCHAR(50)"),
                ("email", "VARCHAR(150)"),
            ]
            
            # Get existing columns for MySQL
            result = conn.execute(text("SHOW COLUMNS FROM enrollments"))
            existing_columns = [row[0] for row in result.fetchall()]
            
            for col_name, col_type in columns_to_add:
                if col_name not in existing_columns:
                    try:
                        sql = f"ALTER TABLE enrollments ADD COLUMN {col_name} {col_type}"
                        conn.execute(text(sql))
                        conn.commit()
                        print(f"✓ Added column: {col_name}")
                    except Exception as e:
                        print(f"✗ Error adding column {col_name}: {e}")
                else:
                    print(f"- Column already exists: {col_name}")
    
    print("\n✓ Migration completed successfully!")

if __name__ == "__main__":
    migrate()