from datetime import datetime, timezone
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
from ..db.database import get_db
from ..core.dependencies import get_current_active_admin
from ..utils.upload_paths import UPLOAD_DIR


router = APIRouter()


# =========================================================
# UPLOAD CONFIGURATION
# =========================================================

UPLOAD_DIRECTORY = UPLOAD_DIR / "charity"
UPLOAD_DIRECTORY.mkdir(parents=True, exist_ok=True)

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
# DEFAULT CONTENT
# =========================================================

def default_charity_content():
    return schemas.CharityContent(
        id=0,

        # English
        hero_title_en="Give Students More Chances to Learn",
        hero_description_en=(
            "Your support helps SC Academy provide learning opportunities, "
            "guidance, and resources for students and families in our community."
        ),
        impact_title_en="Support Education With Purpose",
        impact_description_en=(
            "Together we can help students access learning materials, "
            "mentorship, and a caring school community."
        ),
        support_title_en="Every Contribution Can Open a Door",
        support_description_en=(
            "Whether through donations, resources, or partnership, your "
            "support helps students continue learning and growing."
        ),
        support_options_en=(
            "Sponsor a student's learning materials\n"
            "Support classroom resources and activities\n"
            "Partner with SC Academy on education outreach\n"
            "Volunteer time, knowledge, or mentorship"
        ),
        cta_title_en="Support SC Academy Charity",
        cta_description_en=(
            "Contact our team to learn how you can support students and "
            "community education."
        ),

        # Khmer
        hero_title_km="ផ្តល់ឱកាសឱ្យសិស្សកាន់តែច្រើនបានសិក្សា",
        hero_description_km=(
            "ការគាំទ្ររបស់អ្នកជួយឱ្យ SC Academy ផ្តល់ឱកាសសិក្សា "
            "ការណែនាំ និងធនធានដល់សិស្ស និងគ្រួសារក្នុងសហគមន៍របស់យើង។"
        ),
        impact_title_km="គាំទ្រការអប់រំប្រកបដោយគោលបំណង",
        impact_description_km=(
            "រួមគ្នា យើងអាចជួយសិស្សទទួលបានសម្ភារៈសិក្សា "
            "ការណែនាំ និងសហគមន៍សាលាដែលពោរពេញដោយការយកចិត្តទុកដាក់។"
        ),
        support_title_km="ការចូលរួមគ្រប់បែបយ៉ាងអាចបើកទ្វារឱកាស",
        support_description_km=(
            "មិនថាតាមរយៈការបរិច្ចាគ ធនធាន ឬភាពជាដៃគូទេ "
            "ការគាំទ្ររបស់អ្នកជួយឱ្យសិស្សបន្តសិក្សា និងរីកចម្រើន។"
        ),
        support_options_km=(
            "ឧបត្ថម្ភសម្ភារៈសិក្សាសម្រាប់សិស្ស\n"
            "គាំទ្រធនធាន និងសកម្មភាពក្នុងថ្នាក់រៀន\n"
            "ចូលរួមជាដៃគូជាមួយ SC Academy ក្នុងសកម្មភាពអប់រំសហគមន៍\n"
            "ស្ម័គ្រចិត្តផ្តល់ពេលវេលា ចំណេះដឹង ឬការណែនាំ"
        ),
        cta_title_km="គាំទ្រសកម្មភាពសប្បុរសធម៌របស់ SC Academy",
        cta_description_km=(
            "ទាក់ទងក្រុមការងាររបស់យើង ដើម្បីស្វែងយល់ពីរបៀបដែលអ្នកអាច "
            "គាំទ្រសិស្ស និងការអប់រំក្នុងសហគមន៍។"
        ),

        is_active=True,
        updated_at=datetime.now(timezone.utc),
    )


# =========================================================
# CONTENT
# =========================================================

@router.get(
    "/",
    response_model=schemas.CharityContent,
)
def get_charity_content(
    db: Session = Depends(get_db),
):
    content = crud.get_charity_content(db)

    if not content:
        return default_charity_content()

    return content


@router.post(
    "/",
    response_model=schemas.CharityContent,
    status_code=status.HTTP_201_CREATED,
)
def create_charity_content(
    content: schemas.CharityContentCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    existing = crud.get_charity_content(db)

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Charity content already exists. Use PUT to update.",
        )

    try:
        return crud.create_charity_content(
            db,
            content,
        )

    except Exception as error:
        db.rollback()

        print(
            "Create Charity Content Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create Charity content",
        )


@router.put(
    "/",
    response_model=schemas.CharityContent,
)
def update_charity_content(
    content: schemas.CharityContentUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        updated = crud.update_charity_content(
            db,
            content,
        )

        if updated:
            return updated

        data = default_charity_content().model_dump()

        data.update(
            content.model_dump(
                exclude_unset=True,
            )
        )

        data.pop("id", None)
        data.pop("updated_at", None)

        return crud.create_charity_content(
            db,
            schemas.CharityContentCreate(**data),
        )

    except Exception as error:
        db.rollback()

        print(
            "Update Charity Content Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update Charity content",
        )


# =========================================================
# CHARITY IMAGE UPLOAD
# IMPORTANT: Keep static routes before /images/{image_id}
# =========================================================

@router.post(
    "/images/upload",
    status_code=status.HTTP_201_CREATED,
)
async def upload_charity_image(
    file: UploadFile = File(...),
    current_admin=Depends(get_current_active_admin),
):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image file selected",
        )

    original_filename = Path(file.filename)
    extension = original_filename.suffix.lower()

    if extension not in ALLOWED_IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, JPEG, PNG and WEBP images are allowed",
        )

    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image type",
        )

    unique_filename = f"{uuid4().hex}{extension}"
    destination = UPLOAD_DIRECTORY / unique_filename

    try:
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="Image size must not exceed 5 MB",
            )

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
            "Upload Charity Image Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to upload charity image",
        )

    finally:
        await file.close()

    image_path = f"/uploads/charity/{unique_filename}"

    return {
        "message": "Image uploaded successfully",
        "filename": unique_filename,
        "path": image_path,
        "url": image_path,
    }


# =========================================================
# CHARITY IMAGES — ADMIN
# Keep before /images/{image_id}
# =========================================================

@router.get(
    "/images/admin/all",
    response_model=List[schemas.CharityImage],
)
def get_all_charity_images_admin(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=200, ge=1, le=500),
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    return crud.get_all_charity_images(
        db=db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# CHARITY IMAGES — PUBLIC LIST
# =========================================================

@router.get(
    "/images",
    response_model=List[schemas.CharityImage],
)
def get_charity_images(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=200),
    db: Session = Depends(get_db),
):
    return crud.get_charity_images(
        db=db,
        skip=skip,
        limit=limit,
        active_only=True,
    )


# =========================================================
# CHARITY IMAGE CREATE
# =========================================================

@router.post(
    "/images",
    response_model=schemas.CharityImage,
    status_code=status.HTTP_201_CREATED,
)
def create_charity_image(
    image: schemas.CharityImageCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        return crud.create_charity_image(
            db,
            image,
        )

    except Exception as error:
        db.rollback()

        print(
            "Create Charity Image Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create charity image",
        )


# =========================================================
# CHARITY IMAGE DETAIL
# Keep dynamic route after static image routes
# =========================================================

@router.get(
    "/images/{image_id}",
    response_model=schemas.CharityImage,
)
def get_charity_image(
    image_id: int,
    db: Session = Depends(get_db),
):
    image = crud.get_charity_image(
        db,
        image_id,
    )

    if not image or not image.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charity image not found",
        )

    return image


# =========================================================
# CHARITY IMAGE UPDATE
# =========================================================

@router.put(
    "/images/{image_id}",
    response_model=schemas.CharityImage,
)
def update_charity_image(
    image_id: int,
    image: schemas.CharityImageUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        updated = crud.update_charity_image(
            db,
            image_id,
            image,
        )

        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Charity image not found",
            )

        return updated

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print(
            "Update Charity Image Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update charity image",
        )


# =========================================================
# CHARITY IMAGE DELETE
# =========================================================

@router.delete(
    "/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_charity_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_active_admin),
):
    try:
        image = crud.get_charity_image(
            db,
            image_id,
        )

        if not image:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Charity image not found",
            )

        image_path = image.image_url

        deleted = crud.delete_charity_image(
            db,
            image_id,
        )

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Charity image not found",
            )

        if (
            image_path
            and image_path.startswith("/uploads/charity/")
        ):
            filename = Path(image_path).name
            stored_file = UPLOAD_DIRECTORY / filename

            try:
                if stored_file.exists():
                    stored_file.unlink()
            except Exception as file_error:
                print(
                    "Delete Charity Image File Error:",
                    str(file_error),
                )

        return None

    except HTTPException:
        raise

    except Exception as error:
        db.rollback()

        print(
            "Delete Charity Image Error:",
            str(error),
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete charity image",
        )