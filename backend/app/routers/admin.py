from typing import List
import logging

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status
)

from sqlalchemy.orm import Session

from .. import crud, schemas
from ..db.database import get_db
from ..core.dependencies import (
    get_current_active_admin,
    require_super_admin,
)

logger = logging.getLogger(__name__)

router = APIRouter()


# =========================================================
# GET ALL ADMINS
# =========================================================

@router.get(
    "/users",
    response_model=List[schemas.Admin]
)
def get_all_admins(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    """
    Get all admin accounts.

    Admin authentication required.
    """

    try:
        admins = crud.get_all_admins(
            db,
            skip=skip,
            limit=limit
        )

        return admins

    except Exception as e:
        logger.error("Get All Admins Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load admin users"
        )


# =========================================================
# GET ADMIN BY ID
# =========================================================

@router.get(
    "/users/{admin_id}",
    response_model=schemas.Admin
)
def get_admin_by_id(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    """
    Get a single admin account by ID.

    Admin authentication required.
    """

    try:
        admin = crud.get_admin_by_id(
            db,
            admin_id
        )

        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found"
            )

        return admin

    except HTTPException:
        raise

    except Exception as e:
        logger.error("Get Admin Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load admin"
        )


# =========================================================
# CREATE ADMIN (SUPER_ADMIN ONLY)
# =========================================================

@router.post(
    "/users",
    response_model=schemas.Admin,
    status_code=status.HTTP_201_CREATED
)
def create_new_admin(
    admin_in: schemas.AdminCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(
        require_super_admin
    ),
):
    """
    Create a new admin account.

    SuperAdmin authentication required.
    """
    existing_user = crud.get_admin_by_username(db, admin_in.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )

    existing_email = crud.get_admin_by_email(db, admin_in.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    try:
        return crud.create_admin(db, admin_in)
    except Exception as e:
        logger.error("Create Admin Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create admin"
        )


# =========================================================
# TOGGLE ADMIN ACTIVE STATUS (SUPER_ADMIN ONLY)
# =========================================================

@router.put(
    "/users/{admin_id}/toggle-active",
    response_model=schemas.Admin
)
def toggle_admin_active(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        require_super_admin
    ),
):
    """
    Activate or deactivate an admin account.

    SuperAdmin authentication required.
    The currently logged-in admin cannot deactivate their own account.
    """

    # Prevent admin from disabling own account
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot deactivate your own account"
        )

    try:
        admin = crud.toggle_admin_active(
            db,
            admin_id
        )

        if not admin:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found"
            )

        return admin

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        logger.error("Toggle Admin Active Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update admin status"
        )


# =========================================================
# DELETE ADMIN (SUPER_ADMIN ONLY)
# =========================================================

@router.delete(
    "/users/{admin_id}",
    response_model=schemas.ResponseMessage
)
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        require_super_admin
    ),
):
    """
    Delete an admin account.

    SuperAdmin authentication required.
    The currently logged-in admin cannot delete their own account.
    """

    # Prevent admin from deleting own account
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    try:
        success = crud.delete_admin(
            db,
            admin_id
        )

        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Admin not found"
            )

        return {
            "message": "Admin deleted successfully",
            "success": True
        }

    except HTTPException:
        raise

    except Exception as e:
        db.rollback()
        logger.error("Delete Admin Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete admin"
        )