import sys
from sqlalchemy import text
from app.db.database import engine, SessionLocal
from app.models import Admin, Base

def run_migration():
    print("Connecting to database...")
    with engine.connect() as conn:
        # Check and add role column
        try:
            conn.execute(text("ALTER TABLE admins ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'super_admin'"))
            conn.commit()
            print("Successfully added 'role' column to 'admins' table!")
        except Exception as e:
            print("Note on 'role' column:", e)

        # Check and create revoked_tokens
        try:
            conn.execute(text("""
                CREATE TABLE IF NOT EXISTS revoked_tokens (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    token VARCHAR(500) NOT NULL UNIQUE,
                    revoked_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_token (token)
                )
            """))
            conn.commit()
            print("Successfully ensured 'revoked_tokens' table exists!")
        except Exception as e:
            print("Note on 'revoked_tokens' table:", e)

    # Now verify querying Admin
    db = SessionLocal()
    try:
        admins = db.query(Admin).all()
        print(f"\n--- Admin Accounts Found: {len(admins)} ---")
        for a in admins:
            print(f"ID: {a.id} | Username: '{a.username}' | Email: '{a.email}' | Role: '{getattr(a, 'role', 'N/A')}' | Active: {a.is_active}")
    finally:
        db.close()

if __name__ == "__main__":
    run_migration()
