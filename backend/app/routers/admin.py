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
# GET DASHBOARD STATS (LIVE DATA)
# =========================================================

@router.get("/dashboard-stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    """
    Get aggregated live real statistics for Admin Dashboard.
    """
    try:
        from .. import models
        total_admins = db.query(models.Admin).count()
        total_courses = db.query(models.Course).count()
        total_messages = db.query(models.ContactMessage).count()
        total_gallery = db.query(models.GalleryImage).count()
        total_videos = db.query(models.Video).count()
        total_schools = db.query(models.School).count()
        total_enrollments = db.query(models.Enrollment).count()

        male_students = db.query(models.Enrollment).filter(models.Enrollment.gender == "male").count()
        female_students = db.query(models.Enrollment).filter(models.Enrollment.gender == "female").count()

        # Recent Messages
        recent_messages = (
            db.query(models.ContactMessage)
            .order_by(models.ContactMessage.created_at.desc())
            .limit(5)
            .all()
        )

        messages_list = [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "subject": m.subject,
                "message": m.message,
                "created_at": m.created_at.strftime("%Y-%m-%d %H:%M") if m.created_at else None,
            }
            for m in recent_messages
        ]

        return {
            "total_admin": total_admins,
            "total_courses": total_courses,
            "total_messages": total_messages,
            "total_gallery": total_gallery,
            "total_videos": total_videos,
            "total_schools": total_schools,
            "total_students": total_enrollments,
            "recent_messages": messages_list,
        }
    except Exception as e:
        logger.error("Get Dashboard Stats Error: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to load dashboard statistics"
        )


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