from datetime import timedelta

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
    UploadFile,
    File,
    status,
)
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import text

from .. import models, schemas
from ..config import settings
from ..db.database import get_db, engine
from ..utils.file_utils import save_upload_file

from ..core.security import (
    authenticate_admin,
    create_access_token,
    get_current_active_admin,
    oauth2_scheme,
    verify_password,
    get_password_hash,
)
from ..core.rate_limiter import limiter


router = APIRouter()


# Ensure columns in admins table
def _ensure_admin_columns():
    try:
        with engine.connect() as conn:
            # Check for full_name column
            try:
                conn.execute(text("ALTER TABLE admins ADD COLUMN full_name VARCHAR(150) NULL"))
                conn.commit()
            except Exception:
                pass
            # Check for avatar_url column
            try:
                conn.execute(text("ALTER TABLE admins ADD COLUMN avatar_url VARCHAR(500) NULL"))
                conn.commit()
            except Exception:
                pass
    except Exception:
        pass

_ensure_admin_columns()


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
    from datetime import datetime, timedelta, timezone

    # --------------------------------------------------
    # 1. Blacklist the current token
    # --------------------------------------------------
    existing = db.query(models.RevokedToken).filter(models.RevokedToken.token == token).first()
    if not existing:
        revoked = models.RevokedToken(token=token)
        db.add(revoked)
        db.commit()

    # --------------------------------------------------
    # 2. Opportunistic cleanup of expired revoked tokens
    #    Tokens older than ACCESS_TOKEN_EXPIRE_MINUTES
    #    are already expired — safe to delete.
    # --------------------------------------------------
    try:
        cutoff = (
            datetime.now(timezone.utc)
            - timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        db.query(models.RevokedToken).filter(
            models.RevokedToken.revoked_at < cutoff
        ).delete(synchronize_session=False)
        db.commit()
    except Exception:
        db.rollback()

    return {
        "message": "Successfully logged out and token invalidated",
        "success": True,
    }


# =========================================================
# UPLOAD ADMIN AVATAR
# =========================================================

@router.post(
    "/avatar",
    summary="Upload Admin Avatar",
)
def upload_admin_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    image_path = save_upload_file(file, subdir="avatars")
    current_admin.avatar_url = image_path
    db.add(current_admin)
    db.commit()
    db.refresh(current_admin)
    return {"avatar_url": image_path, "message": "Avatar uploaded successfully"}


# =========================================================
# UPDATE CURRENT ADMIN PROFILE
# =========================================================

@router.put(
    "/profile",
    response_model=schemas.Admin,
    summary="Update Admin Profile",
)
def update_profile(
    profile_in: schemas.AdminProfileUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    # Check username uniqueness if changed
    if profile_in.username and profile_in.username != current_admin.username:
        existing = db.query(models.Admin).filter(
            models.Admin.username == profile_in.username,
            models.Admin.id != current_admin.id,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already taken by another account",
            )
        current_admin.username = profile_in.username

    # Check email uniqueness if changed
    if profile_in.email and profile_in.email != current_admin.email:
        existing = db.query(models.Admin).filter(
            models.Admin.email == profile_in.email,
            models.Admin.id != current_admin.id,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already taken by another account",
            )
        current_admin.email = profile_in.email

    # Update full_name if provided
    if profile_in.full_name is not None:
        current_admin.full_name = profile_in.full_name

    # Update avatar_url if provided
    if profile_in.avatar_url is not None:
        current_admin.avatar_url = profile_in.avatar_url

    db.add(current_admin)
    db.commit()
    db.refresh(current_admin)
    return current_admin


# =========================================================
# CHANGE ADMIN PASSWORD
# =========================================================

@router.put(
    "/change-password",
    response_model=schemas.ResponseMessage,
    summary="Change Admin Password",
)
def change_password(
    password_data: schemas.AdminChangePassword,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    # Verify current password
    if not verify_password(password_data.current_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect",
        )

    # Validate new password match
    if password_data.new_password != password_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password and confirm password do not match",
        )

    if len(password_data.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long",
        )

    # Update hash
    current_admin.hashed_password = get_password_hash(password_data.new_password)
    db.add(current_admin)
    db.commit()

    return {
        "message": "Password changed successfully",
        "success": True,
    }

