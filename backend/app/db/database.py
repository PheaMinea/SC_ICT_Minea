from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from ..config import settings


# =========================================================
# SC ACADEMY - DATABASE CONFIGURATION
# =========================================================


# ---------------------------------------------------------
# DATABASE URL
# ---------------------------------------------------------

SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL


# ---------------------------------------------------------
# MYSQL ENGINE
# ---------------------------------------------------------

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
)


# ---------------------------------------------------------
# DATABASE SESSION
# ---------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ---------------------------------------------------------
# SQLALCHEMY BASE
# ---------------------------------------------------------

Base = declarative_base()


# ---------------------------------------------------------
# FASTAPI DATABASE DEPENDENCY
# ---------------------------------------------------------

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()