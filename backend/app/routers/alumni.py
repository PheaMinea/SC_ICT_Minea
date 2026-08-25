from pathlib import Path
from typing import List
from uuid import uuid4
import shutil

from fastapi import (
    APIRouter,
    Depends,
    File,
    HTTPException,
    Query,
    UploadFile,
    status,
)
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..core.dependencies import get_current_active_admin
from ..db.database import get_db


router = APIRouter()


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================
# Project structure:
#
# project/
# ├── app/
# │   ├── main.py
# │   └── routers/
# │       └── alumni.py
# └── uploads/
#     └── alumni/
#
# main.py mounts:
# /uploads -> project/uploads
# =========================================================

UPLOAD_DIRECTORY = (
    Path(__file__).resolve().parents[2]
    / "uploads"
    / "alumni"
)

UPLOAD_DIRECTORY.mkdir(
    parents=True,
    exist_ok=True,
)


ALLOWED_IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5 MB


# =========================================================
# ADMIN — ត្រូវដាក់មុន /{alumni_id}
# =========================================================

@router.get(
    "/admin/all",
    response_model=List[schemas.Alumni],
)
def get_all_alumni_admin(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=200,
    ),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    return crud.get_all_alumni(
        db=db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# UPLOAD ALUMNI IMAGE
# ត្រូវដាក់មុន /{alumni_id}
# =========================================================

@router.post(
    "/upload",
    status_code=status.HTTP_201_CREATED,
)
async def upload_alumni_image(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_active_admin),
):
    # -----------------------------------------------------
    # Validate filename
    # -----------------------------------------------------

    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file selected",
        )

    original_filename = Path(file.filename)

    extension = original_filename.suffix.lower()

    # -----------------------------------------------------
    # Validate file extension
    # -----------------------------------------------------

    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Only JPG, JPEG, PNG and WEBP "
                "images are allowed"
            ),
        )

    # -----------------------------------------------------
    # Validate MIME type
    # -----------------------------------------------------

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image type",
        )

    # -----------------------------------------------------
    # Generate safe unique filename
    # -----------------------------------------------------

    unique_filename = (
        f"{uuid4().hex}{extension}"
    )

    destination = (
        UPLOAD_DIRECTORY
        / unique_filename
    )

    try:
        # -------------------------------------------------
        # Check file size
        # -------------------------------------------------

        file.file.seek(
            0,
            2,
        )

        file_size = file.file.tell()

        file.file.seek(0)

        if file_size > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=(
                    status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                ),
                detail="Image size must not exceed 5 MB",
            )

        # -------------------------------------------------
        # Save image
        # -------------------------------------------------

        with destination.open("wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer,
            )

    except HTTPException:
        if destination.exists():
            destination.unlink()

        raise

    except Exception as error:
        if destination.exists():
            destination.unlink()

        print(
            "Upload Alumni Image Error:",
            str(error),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to upload image",
        )

    finally:
        await file.close()

    # -----------------------------------------------------
    # Public image path
    # -----------------------------------------------------

    image_path = (
        f"/uploads/alumni/{unique_filename}"
    )

    return {
        "message": "Image uploaded successfully",
        "filename": unique_filename,
        "path": image_path,
        "url": image_path,
    }


# =========================================================
# PUBLIC — FEATURED ALUMNI
# =========================================================

@router.get(
    "/featured",
    response_model=List[schemas.Alumni],
)
def get_featured_alumni(
    limit: int = Query(
        default=6,
        ge=1,
        le=20,
    ),
    db: Session = Depends(get_db),
):
    return crud.get_featured_alumni(
        db=db,
        limit=limit,
    )


# =========================================================
# PUBLIC — ALUMNI LIST
# =========================================================

@router.get(
    "/",
    response_model=List[schemas.Alumni],
)
def get_alumni_list(
    skip: int = Query(
        default=0,
        ge=0,
    ),
    limit: int = Query(
        default=100,
        ge=1,
        le=200,
    ),
    db: Session = Depends(get_db),
):
    return crud.get_alumni_list(
        db=db,
        skip=skip,
        limit=limit,
        active_only=True,
    )


# =========================================================
# DYNAMIC ID — ត្រូវដាក់ក្រោយ Static Routes
# =========================================================

@router.get(
    "/{alumni_id}",
    response_model=schemas.Alumni,
)
def get_alumni_detail(
    alumni_id: int,
    db: Session = Depends(get_db),
):
    alumni = crud.get_alumni(
        db,
        alumni_id,
    )

    if (
        not alumni
        or not alumni.is_active
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Alumni not found",
        )

    return alumni


# =========================================================
# CREATE ALUMNI
# =========================================================

@router.post(
    "/",
    response_model=schemas.Alumni,
    status_code=status.HTTP_201_CREATED,
)
def create_alumni(
    alumni: schemas.AlumniCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        created_alumni = crud.create_alumni(
            db,
            alumni,
        )

        return created_alumni

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print(
            "Create Alumni Error:",
            str(error),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to create Alumni",
        )


# =========================================================
# UPDATE ALUMNI
# =========================================================

@router.put(
    "/{alumni_id}",
    response_model=schemas.Alumni,
)
def update_alumni(
    alumni_id: int,
    alumni: schemas.AlumniUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        updated_alumni = crud.update_alumni(
            db,
            alumni_id,
            alumni,
        )

        if not updated_alumni:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alumni not found",
            )

        return updated_alumni

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print(
            "Update Alumni Error:",
            str(error),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to update Alumni",
        )


# =========================================================
# DELETE ALUMNI
# =========================================================

@router.delete(
    "/{alumni_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_alumni(
    alumni_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        deleted = crud.delete_alumni(
            db,
            alumni_id,
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Alumni not found",
            )

        return None

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print(
            "Delete Alumni Error:",
            str(error),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail="Failed to delete Alumni",
        )