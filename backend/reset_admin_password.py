import sys
from app.db.database import SessionLocal
from app.models import Admin
from app.core.security import get_password_hash

def reset_password(username="admin", new_password=""):
    if not new_password:
        print("Usage: py -3.12 reset_admin_password.py <username> <new_password>")
        print("Example: py -3.12 reset_admin_password.py admin Admin@123")
        return

    db = SessionLocal()
    try:
        admin = db.query(Admin).filter(Admin.username == username).first()
        if not admin:
            print(f"Admin with username '{username}' not found!")
            return

        admin.hashed_password = get_password_hash(new_password)
        admin.is_active = True
        admin.role = "super_admin"
        db.commit()
        print(f"Successfully updated password for admin '{username}' to: '{new_password}'")
        print("Status: Active | Role: super_admin")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) >= 3:
        reset_password(sys.argv[1], sys.argv[2])
    elif len(sys.argv) == 2:
        reset_password("admin", sys.argv[1])
    else:
        # Default test / helper
        print("Current Admin Status:")
        db = SessionLocal()
        for a in db.query(Admin).all():
            print(f"- ID: {a.id}, Username: '{a.username}', Email: '{a.email}', Active: {a.is_active}, Role: '{getattr(a, 'role', 'N/A')}'")
        db.close()
        print("\nTo set/reset password, run:")
        print("py -3.12 reset_admin_password.py admin <your_new_password>")