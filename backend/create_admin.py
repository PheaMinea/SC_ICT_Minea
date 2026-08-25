"""Create an administrator without exposing the password in shell history."""

import argparse
from getpass import getpass

from pydantic import ValidationError
from sqlalchemy.exc import IntegrityError

from app import crud, schemas
from app.db.database import SessionLocal


def main() -> int:
    parser = argparse.ArgumentParser(description="Create an SC Academy admin")
    parser.add_argument("--username", required=True, help="Unique login username")
    parser.add_argument("--email", required=True, help="Unique admin email")
    args = parser.parse_args()

    password = getpass("Password (8-72 characters): ")
    confirmation = getpass("Confirm password: ")
    if password != confirmation:
        print("Error: passwords do not match.")
        return 1

    try:
        payload = schemas.AdminCreate(
            username=args.username.strip(),
            email=args.email.strip().lower(),
            password=password,
        )
    except ValidationError as exc:
        for error in exc.errors():
            field = ".".join(str(part) for part in error["loc"])
            print(f"Invalid {field}: {error['msg']}")
        return 1

    with SessionLocal() as db:
        if crud.get_admin_by_username(db, payload.username):
            print("Error: username already exists.")
            return 1
        if crud.get_admin_by_email(db, str(payload.email)):
            print("Error: email already exists.")
            return 1

        try:
            admin = crud.create_admin(db, payload)
        except IntegrityError:
            print("Error: username or email already exists.")
            return 1

    print(f"Admin created successfully: id={admin.id}, username={admin.username}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
