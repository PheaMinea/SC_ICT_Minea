from typing import List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    Request,
    UploadFile,
    status,
)

from sqlalchemy.orm import Session

from .. import crud, schemas
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

GALLERY_SUBDIR = "gallery"

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
    upload_file: UploadFile
) -> None:

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

    upload_file.file.seek(0)


# =========================================================
# GET ALL GALLERY IMAGES - PUBLIC
# GET /api/gallery/
# =========================================================

@router.get(
    "/",
    response_model=List[
        schemas.GalleryImage
    ],
)
def get_gallery_images(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):

    return crud.get_gallery_images(
        db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# GET FEATURED GALLERY IMAGES - PUBLIC
# GET /api/gallery/featured
# =========================================================

@router.get(
    "/featured",
    response_model=List[
        schemas.GalleryImage
    ],
)
def get_featured_images(
    limit: int = 6,
    db: Session = Depends(get_db),
):

    return (
        crud.get_featured_gallery_images(
            db,
            limit=limit,
        )
    )


# =========================================================
# GET SINGLE GALLERY IMAGE - PUBLIC
# GET /api/gallery/{image_id}
# =========================================================

@router.get(
    "/{image_id}",
    response_model=schemas.GalleryImage,
)
def get_gallery_image(
    image_id: int,
    db: Session = Depends(get_db),
):

    image = crud.get_gallery_image(
        db,
        image_id,
    )

    if not image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    return image


# =========================================================
# CREATE GALLERY IMAGE - ADMIN ONLY
# POST /api/gallery/
# =========================================================

@router.post(
    "/",
    response_model=schemas.GalleryImage,
    status_code=status.HTTP_201_CREATED,
)
def create_gallery_image(

    # English
    title_en: Optional[str] = Form(None),
    category_en: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),

    # Khmer
    title_km: Optional[str] = Form(None),
    category_km: Optional[str] = Form(None),
    description_km: Optional[str] = Form(None),

    # Common
    is_featured: bool = Form(False),
    order: int = Form(0),

    image_file: UploadFile = File(...),

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # -----------------------------------------------------
    # VALIDATE IMAGE
    # -----------------------------------------------------

    validate_image(
        image_file
    )


    # -----------------------------------------------------
    # SAVE IMAGE
    # -----------------------------------------------------

    image_path = save_upload_file(
        image_file,
        subdir=GALLERY_SUBDIR,
    )


    # -----------------------------------------------------
    # BUILD SCHEMA
    # -----------------------------------------------------

    image_data = (
        schemas.GalleryImageCreate(

            # English
            title_en=title_en,
            category_en=category_en,
            description_en=description_en,

            # Khmer
            title_km=title_km,
            category_km=category_km,
            description_km=description_km,

            # Common
            image_url=image_path,
            is_featured=is_featured,
            order=order,
        )
    )


    # -----------------------------------------------------
    # CREATE DATABASE RECORD
    # -----------------------------------------------------

    try:

        return crud.create_gallery_image(
            db,
            image_data,
        )

    except Exception:

        db.rollback()

        if image_path:
            delete_file(
                image_path
            )

        raise


# =========================================================
# UPDATE GALLERY IMAGE - ADMIN ONLY
# PUT /api/gallery/{image_id}
# =========================================================

@router.put(
    "/{image_id}",
    response_model=schemas.GalleryImage,
)
async def update_gallery_image(

    image_id: int,

    request: Request,

    # English
    title_en: Optional[str] = Form(None),
    category_en: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),

    # Khmer
    title_km: Optional[str] = Form(None),
    category_km: Optional[str] = Form(None),
    description_km: Optional[str] = Form(None),

    # Common
    is_featured: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),

    image_file: Optional[
        UploadFile
    ] = File(None),

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # -----------------------------------------------------
    # FIND IMAGE
    # -----------------------------------------------------

    existing_image = (
        crud.get_gallery_image(
            db,
            image_id,
        )
    )

    if not existing_image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )


    old_image_path = (
        existing_image.image_url
    )

    new_image_path = None


    # -----------------------------------------------------
    # GET SUBMITTED FORM FIELDS
    # -----------------------------------------------------

    form = await request.form()

    update_data = {}


    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    if "title_en" in form:
        update_data["title_en"] = (
            title_en
        )

    if "category_en" in form:
        update_data["category_en"] = (
            category_en
        )

    if "description_en" in form:
        update_data[
            "description_en"
        ] = description_en


    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    if "title_km" in form:
        update_data["title_km"] = (
            title_km
        )

    if "category_km" in form:
        update_data["category_km"] = (
            category_km
        )

    if "description_km" in form:
        update_data[
            "description_km"
        ] = description_km


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    if "is_featured" in form:
        update_data[
            "is_featured"
        ] = is_featured

    if "order" in form:
        update_data["order"] = order


    # -----------------------------------------------------
    # NEW IMAGE
    # -----------------------------------------------------

    if (
        image_file is not None
        and image_file.filename
    ):

        validate_image(
            image_file
        )

        new_image_path = (
            save_upload_file(
                image_file,
                subdir=GALLERY_SUBDIR,
            )
        )

        update_data["image_url"] = (
            new_image_path
        )


    # -----------------------------------------------------
    # BUILD UPDATE SCHEMA
    # -----------------------------------------------------

    image_update = (
        schemas.GalleryImageUpdate(
            **update_data
        )
    )


    # -----------------------------------------------------
    # UPDATE DATABASE
    # -----------------------------------------------------

    try:

        image = (
            crud.update_gallery_image(
                db,
                image_id,
                image_update,
            )
        )

    except Exception:

        db.rollback()

        if new_image_path:
            delete_file(
                new_image_path
            )

        raise


    if not image:

        if new_image_path:
            delete_file(
                new_image_path
            )

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )


    # -----------------------------------------------------
    # DELETE OLD IMAGE
    # -----------------------------------------------------

    if (
        new_image_path
        and old_image_path
        and old_image_path
        != new_image_path
    ):
        delete_file(
            old_image_path
        )


    return image


# =========================================================
# DELETE GALLERY IMAGE - ADMIN ONLY
# DELETE /api/gallery/{image_id}
# =========================================================

@router.delete(
    "/{image_id}",
    response_model=schemas.ResponseMessage,
)
def delete_gallery_image(

    image_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    existing_image = (
        crud.get_gallery_image(
            db,
            image_id,
        )
    )

    if not existing_image:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )


    image_path = (
        existing_image.image_url
    )


    # -----------------------------------------------------
    # DELETE DATABASE RECORD
    # -----------------------------------------------------

    try:

        success = (
            crud.delete_gallery_image(
                db,
                image_id,
            )
        )

    except Exception:

        db.rollback()
        raise


    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )


    # -----------------------------------------------------
    # DELETE FILE
    # -----------------------------------------------------

    if image_path:
        delete_file(
            image_path
        )


    return {
        "message": (
            "Image deleted successfully"
        ),
        "success": True,
    }