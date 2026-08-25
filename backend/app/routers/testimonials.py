from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)

from sqlalchemy.orm import Session

from .. import models, schemas
from ..db.database import get_db

from ..core.dependencies import (
    get_current_active_admin,
)

from ..utils.file_utils import (
    delete_file,
    save_upload_file,
)


router = APIRouter()


# =========================================================
# CONFIG
# =========================================================

TESTIMONIALS_SUBDIR = "testimonials"

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024


# =========================================================
# VALIDATE IMAGE
# =========================================================

def validate_image(
    upload_file: UploadFile,
) -> None:

    # -----------------------------------------------------
    # VALIDATE MIME TYPE
    # -----------------------------------------------------

    if (
        upload_file.content_type
        not in ALLOWED_IMAGE_TYPES
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid image type. "
                "Allowed: JPG, JPEG, PNG, WEBP."
            ),
        )


    # -----------------------------------------------------
    # VALIDATE FILE SIZE
    # -----------------------------------------------------

    file_size = 0

    chunk_size = 8192


    while True:

        chunk = upload_file.file.read(
            chunk_size
        )

        if not chunk:
            break

        file_size += len(chunk)


        if file_size > MAX_FILE_SIZE:

            upload_file.file.seek(0)

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Image must be 5 MB or smaller."
                ),
            )


    # Reset pointer before saving
    upload_file.file.seek(0)


# =========================================================
# GET ALL TESTIMONIALS - PUBLIC
#
# GET /api/testimonials/
# =========================================================

@router.get(
    "/",
    response_model=List[
        schemas.Testimonial
    ],
)
def get_testimonials(

    skip: int = 0,

    limit: int = 100,

    db: Session = Depends(get_db),
):

    return (
        db.query(
            models.Testimonial
        )
        .order_by(
            models.Testimonial.sort_order.asc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


# =========================================================
# GET FEATURED TESTIMONIALS - PUBLIC
#
# GET /api/testimonials/featured
# =========================================================

@router.get(
    "/featured",
    response_model=List[
        schemas.Testimonial
    ],
)
def get_featured_testimonials(

    limit: int = 6,

    db: Session = Depends(get_db),
):

    return (
        db.query(
            models.Testimonial
        )
        .filter(
            models.Testimonial.is_active.is_(
                True
            )
        )
        .order_by(
            models.Testimonial.sort_order.asc()
        )
        .limit(limit)
        .all()
    )


# =========================================================
# GET SINGLE TESTIMONIAL - PUBLIC
#
# GET /api/testimonials/{testimonial_id}
# =========================================================

@router.get(
    "/{testimonial_id}",
    response_model=schemas.Testimonial,
)
def get_testimonial(

    testimonial_id: int,

    db: Session = Depends(get_db),
):

    testimonial = (
        db.query(
            models.Testimonial
        )
        .filter(
            models.Testimonial.id
            == testimonial_id
        )
        .first()
    )


    if not testimonial:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )


    return testimonial


# =========================================================
# CREATE TESTIMONIAL - ADMIN ONLY
#
# POST /api/testimonials/
# =========================================================

@router.post(
    "/",
    response_model=schemas.Testimonial,
    status_code=status.HTTP_201_CREATED,
)
async def create_testimonial(

    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    name: str = Form(...),


    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    role_en: Optional[str] = Form(None),

    content_en: str = Form(...),


    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    role_km: Optional[str] = Form(None),

    content_km: Optional[str] = Form(None),


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    rating: int = Form(5),

    is_active: bool = Form(True),

    order: int = Form(0),

    avatar: Optional[
        UploadFile
    ] = File(None),


    # -----------------------------------------------------
    # DEPENDENCIES
    # -----------------------------------------------------

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # =====================================================
    # VALIDATE NAME
    # =====================================================

    clean_name = name.strip()


    if not clean_name:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name is required",
        )


    # =====================================================
    # VALIDATE ENGLISH CONTENT
    # =====================================================

    clean_content_en = (
        content_en.strip()
    )


    if not clean_content_en:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "English content is required"
            ),
        )


    # =====================================================
    # CLEAN ENGLISH ROLE
    # =====================================================

    clean_role_en = None


    if role_en is not None:

        role_value = role_en.strip()

        if role_value:
            clean_role_en = role_value


    # =====================================================
    # CLEAN KHMER ROLE
    # =====================================================

    clean_role_km = None


    if role_km is not None:

        role_value = role_km.strip()

        if role_value:
            clean_role_km = role_value


    # =====================================================
    # CLEAN KHMER CONTENT
    # =====================================================

    clean_content_km = None


    if content_km is not None:

        content_value = (
            content_km.strip()
        )

        if content_value:

            clean_content_km = (
                content_value
            )


    # =====================================================
    # VALIDATE RATING
    # =====================================================

    if rating < 1 or rating > 5:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Rating must be between 1 and 5"
            ),
        )


    # =====================================================
    # AVATAR
    # =====================================================

    avatar_path = None


    if (
        avatar is not None
        and avatar.filename
    ):

        # -------------------------------------------------
        # VALIDATE AVATAR
        # -------------------------------------------------

        validate_image(
            avatar
        )


        # -------------------------------------------------
        # SAVE AVATAR
        # -------------------------------------------------

        avatar_path = (
            save_upload_file(
                avatar,
                subdir=TESTIMONIALS_SUBDIR,
            )
        )


    # =====================================================
    # CREATE TESTIMONIAL MODEL
    # =====================================================

    db_testimonial = models.Testimonial(

        # -------------------------------------------------
        # COMMON
        # -------------------------------------------------

        name=clean_name,


        # -------------------------------------------------
        # ENGLISH
        # -------------------------------------------------

        role_en=clean_role_en,

        content_en=clean_content_en,


        # -------------------------------------------------
        # KHMER
        # -------------------------------------------------

        role_km=clean_role_km,

        content_km=clean_content_km,


        # -------------------------------------------------
        # COMMON
        # -------------------------------------------------

        avatar_url=avatar_path,

        rating=rating,

        is_active=is_active,

        sort_order=order,
    )


    # =====================================================
    # SAVE DATABASE
    # =====================================================

    try:

        db.add(
            db_testimonial
        )

        db.commit()

        db.refresh(
            db_testimonial
        )

        return db_testimonial


    except Exception as e:

        db.rollback()


        # -------------------------------------------------
        # DELETE AVATAR IF DATABASE FAILED
        # -------------------------------------------------

        if avatar_path:

            delete_file(
                avatar_path
            )


        print(
            "Create Testimonial Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to create testimonial"
            ),
        )


# =========================================================
# UPDATE TESTIMONIAL - ADMIN ONLY
#
# PUT /api/testimonials/{testimonial_id}
# =========================================================

@router.put(
    "/{testimonial_id}",
    response_model=schemas.Testimonial,
)
async def update_testimonial(

    testimonial_id: int,


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    name: Optional[str] = Form(None),


    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    role_en: Optional[str] = Form(None),

    content_en: Optional[str] = Form(None),


    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    role_km: Optional[str] = Form(None),

    content_km: Optional[str] = Form(None),


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    rating: Optional[int] = Form(None),

    is_active: Optional[bool] = Form(None),

    order: Optional[int] = Form(None),

    avatar: Optional[
        UploadFile
    ] = File(None),

    remove_avatar: bool = Form(False),


    # -----------------------------------------------------
    # DEPENDENCIES
    # -----------------------------------------------------

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # =====================================================
    # FIND TESTIMONIAL
    # =====================================================

    db_testimonial = (
        db.query(
            models.Testimonial
        )
        .filter(
            models.Testimonial.id
            == testimonial_id
        )
        .first()
    )


    if not db_testimonial:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )


    # =====================================================
    # AVATAR STATE
    # =====================================================

    old_avatar = (
        db_testimonial.avatar_url
    )

    new_avatar_path = None

    remove_old_avatar = False


    # =====================================================
    # UPDATE NAME
    # =====================================================

    if name is not None:

        clean_name = (
            name.strip()
        )


        if not clean_name:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Name cannot be empty"
                ),
            )


        db_testimonial.name = (
            clean_name
        )


    # =====================================================
    # UPDATE ENGLISH ROLE
    # =====================================================

    if role_en is not None:

        clean_role_en = (
            role_en.strip()
        )


        db_testimonial.role_en = (
            clean_role_en
            if clean_role_en
            else None
        )


    # =====================================================
    # UPDATE ENGLISH CONTENT
    # =====================================================

    if content_en is not None:

        clean_content_en = (
            content_en.strip()
        )


        if not clean_content_en:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "English content "
                    "cannot be empty"
                ),
            )


        db_testimonial.content_en = (
            clean_content_en
        )


    # =====================================================
    # UPDATE KHMER ROLE
    # =====================================================

    if role_km is not None:

        clean_role_km = (
            role_km.strip()
        )


        db_testimonial.role_km = (
            clean_role_km
            if clean_role_km
            else None
        )


    # =====================================================
    # UPDATE KHMER CONTENT
    # =====================================================

    if content_km is not None:

        clean_content_km = (
            content_km.strip()
        )


        db_testimonial.content_km = (
            clean_content_km
            if clean_content_km
            else None
        )


    # =====================================================
    # UPDATE RATING
    # =====================================================

    if rating is not None:

        if rating < 1 or rating > 5:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Rating must be "
                    "between 1 and 5"
                ),
            )


        db_testimonial.rating = (
            rating
        )


    # =====================================================
    # UPDATE ACTIVE STATUS
    # =====================================================

    if is_active is not None:

        db_testimonial.is_active = (
            is_active
        )


    # =====================================================
    # UPDATE ORDER
    # =====================================================

    if order is not None:

        db_testimonial.sort_order = (
            order
        )


    # =====================================================
    # UPLOAD NEW AVATAR
    # =====================================================

    if (
        avatar is not None
        and avatar.filename
    ):

        # -------------------------------------------------
        # VALIDATE
        # -------------------------------------------------

        validate_image(
            avatar
        )


        # -------------------------------------------------
        # SAVE
        # -------------------------------------------------

        new_avatar_path = (
            save_upload_file(
                avatar,
                subdir=TESTIMONIALS_SUBDIR,
            )
        )


        db_testimonial.avatar_url = (
            new_avatar_path
        )


    # =====================================================
    # REMOVE AVATAR
    # =====================================================

    elif remove_avatar:

        db_testimonial.avatar_url = None

        remove_old_avatar = True


    # =====================================================
    # UPDATE DATABASE
    # =====================================================

    try:

        db.commit()

        db.refresh(
            db_testimonial
        )


    except Exception as e:

        db.rollback()


        # -------------------------------------------------
        # REMOVE NEW FILE IF DATABASE FAILED
        # -------------------------------------------------

        if new_avatar_path:

            delete_file(
                new_avatar_path
            )


        print(
            "Update Testimonial Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to update testimonial"
            ),
        )


    # =====================================================
    # DELETE OLD AVATAR AFTER DATABASE SUCCESS
    # =====================================================

    if (
        old_avatar
        and (
            new_avatar_path
            or remove_old_avatar
        )
    ):

        delete_file(
            old_avatar
        )


    return db_testimonial


# =========================================================
# DELETE TESTIMONIAL - ADMIN ONLY
#
# DELETE /api/testimonials/{testimonial_id}
# =========================================================

@router.delete(
    "/{testimonial_id}",
    response_model=schemas.ResponseMessage,
)
def delete_testimonial(

    testimonial_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # =====================================================
    # FIND TESTIMONIAL
    # =====================================================

    db_testimonial = (
        db.query(
            models.Testimonial
        )
        .filter(
            models.Testimonial.id
            == testimonial_id
        )
        .first()
    )


    if not db_testimonial:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Testimonial not found",
        )


    avatar_path = (
        db_testimonial.avatar_url
    )


    # =====================================================
    # DELETE DATABASE RECORD
    # =====================================================

    try:

        db.delete(
            db_testimonial
        )

        db.commit()


    except Exception as e:

        db.rollback()


        print(
            "Delete Testimonial Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to delete testimonial"
            ),
        )


    # =====================================================
    # DELETE AVATAR AFTER DATABASE SUCCESS
    # =====================================================

    if avatar_path:

        delete_file(
            avatar_path
        )


    return {
        "message": (
            "Testimonial deleted successfully"
        ),
        "success": True,
    }
