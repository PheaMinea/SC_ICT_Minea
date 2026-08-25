from datetime import datetime, timedelta, timezone
from typing import Optional
import hashlib

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from ..config import settings
from ..db.database import get_db
from ..models import Admin
from ..schemas import TokenData


pwd_context = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto"
)


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/token"
)


def _normalize_password(password: str) -> str:
    return hashlib.sha256(
        password.encode("utf-8")
    ).hexdigest()


def verify_password(
    plain_password: str,
    hashed_password: str
) -> bool:

    if not plain_password or not hashed_password:
        return False

    # 1. Try direct verify (bcrypt, bcrypt_sha256, etc.)
    try:
        if pwd_context.verify(plain_password, hashed_password):
            return True
    except (ValueError, TypeError, Exception):
        pass

    # 2. Try normalized (sha256 pre-hashed) verify
    try:
        normalized = _normalize_password(plain_password)
        if pwd_context.verify(normalized, hashed_password):
            return True
    except (ValueError, TypeError, Exception):
        pass

    return False


def get_password_hash(password: str) -> str:

    if not password:
        raise ValueError(
            "Password cannot be empty"
        )

    normalized = _normalize_password(password)

    return pwd_context.hash(normalized)


def authenticate_admin(
    db: Session,
    username: str,
    password: str
) -> Optional[Admin]:

    admin = (
        db.query(Admin)
        .filter(Admin.username == username)
        .first()
    )

    if admin is None:
        return None

    if not verify_password(
        password,
        admin.hashed_password
    ):
        return None

    if not admin.is_active:
        return None

    return admin


def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:

    to_encode = data.copy()

    if expires_delta:
        expire = (
            datetime.now(timezone.utc)
            + expires_delta
        )
    else:
        expire = (
            datetime.now(timezone.utc)
            + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        )

    to_encode.update({
        "exp": expire
    })

    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Admin:

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={
            "WWW-Authenticate": "Bearer"
        }
    )

    # -----------------------------------------------------
    # CHECK REVOKED TOKENS (LOGOUT BLACKLIST)
    # -----------------------------------------------------
    from ..models import RevokedToken

    revoked = (
        db.query(RevokedToken)
        .filter(RevokedToken.token == token)
        .first()
    )

    if revoked is not None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has been revoked. Please log in again.",
            headers={
                "WWW-Authenticate": "Bearer"
            }
        )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        username = payload.get("sub")

        if username is None:
            raise credentials_exception

        token_data = TokenData(
            username=username
        )

    except JWTError:
        raise credentials_exception

    admin = (
        db.query(Admin)
        .filter(
            Admin.username == token_data.username
        )
        .first()
    )

    if admin is None:
        raise credentials_exception

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive"
        )

    return admin


async def get_current_active_admin(
    current_admin: Admin = Depends(
        get_current_admin
    )
) -> Admin:

    if not current_admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive admin"
        )

    return current_admin


async def require_super_admin(
    current_admin: Admin = Depends(
        get_current_active_admin
    )
) -> Admin:

    if getattr(current_admin, "role", "editor") != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="SuperAdmin privilege required for this action"
        )

    return current_admin