from sqlalchemy import text

from app.database import engine
from app import models


def reset_leadership_table():
    print("Resetting leadership_team table...")

    with engine.begin() as connection:
        connection.execute(
            text("DROP TABLE IF EXISTS leadership_team")
        )

    models.LeadershipTeam.__table__.create(
        bind=engine,
        checkfirst=True
    )

    print("leadership_team table created successfully!")


if __name__ == "__main__":
    reset_leadership_table()
