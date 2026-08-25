from datetime import timedelta

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import models, schemas
from ..config import settings
from ..db.database import get_db

from ..core.security import (
    authenticate_admin,
    create_access_token,
    get_current_active_admin,
    oauth2_scheme,
)
from ..core.rate_limiter import limiter


router = APIRouter()


# =========================================================
# ADMIN LOGIN
# =========================================================

@router.post(
    "/token",
    response_model=schemas.Token,
    summary="Admin Login",
)
@limiter.limit("5/minute")
def login_for_access_token(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # NORMALIZE USERNAME
    # -----------------------------------------------------

    username = form_data.username.strip()
    password = form_data.password


    # -----------------------------------------------------
    # VALIDATE INPUT
    # -----------------------------------------------------

    if not username or not password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required",
        )


    # -----------------------------------------------------
    # AUTHENTICATE ADMIN
    # -----------------------------------------------------

    admin = authenticate_admin(
        db=db,
        username=username,
        password=password,
    )


    # -----------------------------------------------------
    # INVALID CREDENTIALS
    # -----------------------------------------------------

    if admin is None:

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={
                "WWW-Authenticate": "Bearer",
            },
        )


    # -----------------------------------------------------
    # INACTIVE ADMIN
    # -----------------------------------------------------

    if not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin account is inactive",
        )


    # -----------------------------------------------------
    # CREATE ACCESS TOKEN
    # -----------------------------------------------------

    access_token = create_access_token(
        data={
            "sub": admin.username,
        },
        expires_delta=timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        ),
    )


    # -----------------------------------------------------
    # RESPONSE
    # -----------------------------------------------------

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================================================
# CURRENT ADMIN
# =========================================================

@router.get(
    "/me",
    response_model=schemas.Admin,
    summary="Current Admin",
)
def get_current_admin_info(
    current_admin=Depends(
        get_current_active_admin
    ),
):

    return current_admin


# =========================================================
# ADMIN LOGOUT (TOKEN REVOCATION / BLACKLIST)
# =========================================================

@router.post(
    "/logout",
    response_model=schemas.ResponseMessage,
    summary="Admin Logout",
)
def logout(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    # Save the revoked token in the database
    existing = db.query(models.RevokedToken).filter(models.RevokedToken.token == token).first()
    if not existing:
        revoked = models.RevokedToken(token=token)
        db.add(revoked)
        db.commit()

    return {
        "message": "Successfully logged out and token invalidated",
        "success": True,
    }
