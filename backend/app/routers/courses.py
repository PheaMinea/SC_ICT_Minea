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
# IMAGE CONFIG
# =========================================================

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
}

MAX_FILE_SIZE = 5 * 1024 * 1024

COURSES_SUBDIR = "courses"

ALLOWED_COURSE_STATUSES = {
    "available",
    "in_progress",
    "coming_soon",
}


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
                f"Invalid file type "
                f"'{upload_file.content_type}'. "
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
                    "File too large. "
                    "Maximum size is 5 MB."
                ),
            )

    upload_file.file.seek(0)


# =========================================================
# COURSES
# =========================================================


# =========================================================
# GET COURSES - PUBLIC
# GET /api/courses/
# =========================================================

@router.get(
    "/",
    response_model=List[schemas.Course],
)
def get_courses(
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_active: bool = True,
    is_featured: Optional[bool] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return crud.get_courses(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        is_active=is_active,
        is_featured=is_featured,
        status=status,
        search=search,
    )


# =========================================================
# COURSE CATEGORIES
# =========================================================


# =========================================================
# GET COURSE CATEGORIES - PUBLIC
# GET /api/courses/categories
# =========================================================

@router.get(
    "/categories",
    response_model=List[schemas.CourseCategory],
)
def get_course_categories(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return crud.get_course_categories(
        db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# GET ALL COURSE CATEGORIES - ADMIN ONLY
# GET /api/courses/categories/all
# =========================================================

@router.get(
    "/categories/all",
    response_model=List[schemas.CourseCategory],
)
def get_all_course_categories(
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    return crud.get_all_course_categories(
        db,
    )


# =========================================================
# GET SINGLE COURSE CATEGORY - PUBLIC
# GET /api/courses/categories/{category_id}
# =========================================================

@router.get(
    "/categories/{category_id}",
    response_model=schemas.CourseCategory,
)
def get_course_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = crud.get_course_category(
        db,
        category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course category not found",
        )

    return category


# =========================================================
# CREATE COURSE CATEGORY - ADMIN ONLY
# POST /api/courses/categories
# =========================================================

@router.post(
    "/categories",
    response_model=schemas.CourseCategory,
    status_code=status.HTTP_201_CREATED,
)
async def create_course_category(
    name_en: str = Form(...),
    description_en: Optional[str] = Form(None),

    name_km: Optional[str] = Form(None),
    description_km: Optional[str] = Form(None),

    slug: str = Form(...),
    is_active: bool = Form(True),
    order: int = Form(0),

    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    # -----------------------------------------------------
    # NORMALIZE SLUG
    # -----------------------------------------------------

    slug = slug.strip().lower()

    # -----------------------------------------------------
    # CHECK SLUG
    # -----------------------------------------------------

    existing = crud.get_course_category_by_slug(
        db,
        slug,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists",
        )

    # -----------------------------------------------------
    # BUILD CATEGORY SCHEMA
    # -----------------------------------------------------

    category_data = schemas.CourseCategoryCreate(
        name_en=name_en,
        description_en=description_en,
        name_km=name_km,
        description_km=description_km,
        slug=slug,
        is_active=is_active,
        order=order,
    )

    # -----------------------------------------------------
    # CREATE DATABASE RECORD
    # -----------------------------------------------------

    try:
        return crud.create_course_category(
            db,
            category_data,
        )

    except Exception:
        db.rollback()
        raise


# =========================================================
# UPDATE COURSE CATEGORY - ADMIN ONLY
# PUT /api/courses/categories/{category_id}
# =========================================================

@router.put(
    "/categories/{category_id}",
    response_model=schemas.CourseCategory,
)
async def update_course_category(
    category_id: int,

    name_en: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),

    name_km: Optional[str] = Form(None),
    description_km: Optional[str] = Form(None),

    slug: Optional[str] = Form(None),
    is_active: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),

    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    # -----------------------------------------------------
    # FIND CATEGORY
    # -----------------------------------------------------

    category = crud.get_course_category(
        db,
        category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course category not found",
        )

    update_data = {}

    if name_en is not None:
        update_data["name_en"] = name_en

    if description_en is not None:
        update_data["description_en"] = description_en

    if name_km is not None:
        update_data["name_km"] = name_km

    if description_km is not None:
        update_data["description_km"] = description_km

    if slug is not None:
        slug = slug.strip().lower()

        existing_slug = crud.get_course_category_by_slug(
            db,
            slug,
        )

        if (
            existing_slug
            and existing_slug.id != category_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists",
            )

        update_data["slug"] = slug

    if is_active is not None:
        update_data["is_active"] = is_active

    if order is not None:
        update_data["order"] = order

    # -----------------------------------------------------
    # BUILD UPDATE SCHEMA
    # -----------------------------------------------------

    category_update = schemas.CourseCategoryUpdate(
        **update_data
    )

    # -----------------------------------------------------
    # UPDATE DATABASE
    # -----------------------------------------------------

    try:
        updated = crud.update_course_category(
            db,
            category_id,
            category_update,
        )

    except Exception:
        db.rollback()
        raise

    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course category not found",
        )

    return updated


# =========================================================
# DELETE COURSE CATEGORY - ADMIN ONLY
# DELETE /api/courses/categories/{category_id}
# =========================================================

@router.delete(
    "/categories/{category_id}",
    response_model=schemas.ResponseMessage,
)
def delete_course_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(
        get_current_active_admin
    ),
):
    category = crud.get_course_category(
        db,
        category_id,
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course category not found",
        )

    try:
        success = crud.delete_course_category(
            db,
            category_id,
        )

    except ValueError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course category cannot be deleted while it is in use",
        )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course category not found",
        )

    return {
        "message": "Course category deleted successfully",
        "success": True,
    }


# =========================================================
# GET FEATURED COURSES - PUBLIC
# GET /api/courses/featured
# =========================================================

@router.get(
    "/featured",
    response_model=List[schemas.Course],
)
def get_featured_courses(
    limit: int = 6,
    db: Session = Depends(get_db),
):
    return crud.get_featured_courses(
        db,
        limit=limit,
    )


# =========================================================
# GET POPULAR COURSES - PUBLIC
# GET /api/courses/popular
# =========================================================

@router.get(
    "/popular",
    response_model=List[schemas.Course],
)
def get_popular_courses(
    limit: int = 4,
    db: Session = Depends(get_db),
):
    return crud.get_popular_courses(
        db,
        limit=limit,
    )


# =========================================================
# GET COURSE BY SLUG - PUBLIC
# GET /api/courses/slug/{slug}
# =========================================================

@router.get(
    "/slug/{slug}",
    response_model=schemas.Course,
)
def get_course_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    course = crud.get_course_by_slug(
        db,
        slug,
    )

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    return course


# =========================================================
# CREATE COURSE - ADMIN ONLY
# POST /api/courses/
# =========================================================

@router.post(
    "/",
    response_model=schemas.Course,
    status_code=status.HTTP_201_CREATED,
)
async def create_course(
    # English
    title_en: str = Form(...),
    description_en: Optional[str] = Form(None),
    short_description_en: Optional[str] = Form(None),
    duration_en: Optional[str] = Form(None),
    level_en: Optional[str] = Form(None),

    # Khmer
    title_km: str = Form(...),
    description_km: Optional[str] = Form(None),
    short_description_km: Optional[str] = Form(None),
    duration_km: Optional[str] = Form(None),
    level_km: Optional[str] = Form(None),

    # Common
    slug: str = Form(...),
    price: Optional[str] = Form(None),

    # Detailed course information - English
    what_you_learn_en: Optional[str] = Form(None),
    requirements_en: Optional[str] = Form(None),
    target_students_en: Optional[str] = Form(None),

    # Detailed course information - Khmer
    what_you_learn_km: Optional[str] = Form(None),
    requirements_km: Optional[str] = Form(None),
    target_students_km: Optional[str] = Form(None),

    # Additional common course information
    certificate: bool = Form(True),
    language: Optional[str] = Form(None),
    schedule: Optional[str] = Form(None),

    # Course status
    course_status: str = Form(
        "available",
        alias="status",
    ),

    is_active: bool = Form(True),
    is_featured: bool = Form(False),
    order: int = Form(0),
    category_id: Optional[int] = Form(None),

    image_file: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):
    # -----------------------------------------------------
    # NORMALIZE SLUG AND STATUS
    # -----------------------------------------------------

    slug = slug.strip().lower()
    course_status = course_status.strip().lower()

    if course_status not in ALLOWED_COURSE_STATUSES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid course status. "
                "Allowed: available, in_progress, coming_soon"
            ),
        )

    # -----------------------------------------------------
    # CHECK SLUG
    # -----------------------------------------------------

    existing = crud.get_course_by_slug(
        db,
        slug,
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course with this slug already exists",
        )

    # -----------------------------------------------------
    # CHECK CATEGORY
    # -----------------------------------------------------

    if category_id is not None:
        category = crud.get_course_category(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course category not found",
            )

    # -----------------------------------------------------
    # UPLOAD IMAGE
    # -----------------------------------------------------

    image_url = None

    if image_file is not None and image_file.filename:
        validate_image(image_file)

        image_url = save_upload_file(
            image_file,
            subdir=COURSES_SUBDIR,
        )

    # -----------------------------------------------------
    # BUILD COURSE SCHEMA
    # -----------------------------------------------------

    course_data = schemas.CourseCreate(
        # English
        title_en=title_en,
        description_en=description_en,
        short_description_en=short_description_en,
        duration_en=duration_en,
        level_en=level_en,

        # Khmer
        title_km=title_km,
        description_km=description_km,
        short_description_km=short_description_km,
        duration_km=duration_km,
        level_km=level_km,

        # Common
        slug=slug,
        price=price,
        image_url=image_url,

        # Detailed English
        what_you_learn_en=what_you_learn_en,
        requirements_en=requirements_en,
        target_students_en=target_students_en,

        # Detailed Khmer
        what_you_learn_km=what_you_learn_km,
        requirements_km=requirements_km,
        target_students_km=target_students_km,

        # Additional
        certificate=certificate,
        language=language,
        schedule=schedule,

        status=course_status,

        is_active=is_active,
        is_featured=is_featured,

        order=order,
        category_id=category_id,
    )

    # -----------------------------------------------------
    # CREATE DATABASE RECORD
    # -----------------------------------------------------

    try:
        return crud.create_course(
            db,
            course_data,
        )

    except Exception:
        db.rollback()

        if image_url:
            delete_file(image_url)

        raise


# =========================================================
# UPDATE COURSE - ADMIN ONLY
# PUT /api/courses/{course_id}
# =========================================================

@router.put(
    "/{course_id}",
    response_model=schemas.Course,
)
async def update_course(
    course_id: int,

    # English
    title_en: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),
    short_description_en: Optional[str] = Form(None),
    duration_en: Optional[str] = Form(None),
    level_en: Optional[str] = Form(None),

    # Khmer
    title_km: Optional[str] = Form(None),
    description_km: Optional[str] = Form(None),
    short_description_km: Optional[str] = Form(None),
    duration_km: Optional[str] = Form(None),
    level_km: Optional[str] = Form(None),

    # Common
    slug: Optional[str] = Form(None),
    price: Optional[str] = Form(None),

    # Detailed course information - English
    what_you_learn_en: Optional[str] = Form(None),
    requirements_en: Optional[str] = Form(None),
    target_students_en: Optional[str] = Form(None),

    # Detailed course information - Khmer
    what_you_learn_km: Optional[str] = Form(None),
    requirements_km: Optional[str] = Form(None),
    target_students_km: Optional[str] = Form(None),

    # Additional common course information
    certificate: Optional[bool] = Form(None),
    language: Optional[str] = Form(None),
    schedule: Optional[str] = Form(None),

    # Course status
    course_status: Optional[str] = Form(
        None,
        alias="status",
    ),

    is_active: Optional[bool] = Form(None),
    is_featured: Optional[bool] = Form(None),
    order: Optional[int] = Form(None),
    category_id: Optional[int] = Form(None),

    image_file: Optional[UploadFile] = File(None),

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):
    # -----------------------------------------------------
    # FIND COURSE
    # -----------------------------------------------------

    course = crud.get_course(
        db,
        course_id,
    )

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    update_data = {}

    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    if title_en is not None:
        update_data["title_en"] = title_en

    if description_en is not None:
        update_data["description_en"] = description_en

    if short_description_en is not None:
        update_data[
            "short_description_en"
        ] = short_description_en

    if duration_en is not None:
        update_data["duration_en"] = duration_en

    if level_en is not None:
        update_data["level_en"] = level_en

    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    if title_km is not None:
        update_data["title_km"] = title_km

    if description_km is not None:
        update_data["description_km"] = description_km

    if short_description_km is not None:
        update_data[
            "short_description_km"
        ] = short_description_km

    if duration_km is not None:
        update_data["duration_km"] = duration_km

    if level_km is not None:
        update_data["level_km"] = level_km

    # -----------------------------------------------------
    # SLUG
    # -----------------------------------------------------

    if slug is not None:
        slug = slug.strip().lower()

        existing_slug = crud.get_course_by_slug(
            db,
            slug,
        )

        if (
            existing_slug
            and existing_slug.id != course_id
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Course with this slug already exists",
            )

        update_data["slug"] = slug

    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    if price is not None:
        update_data["price"] = price

    if what_you_learn_en is not None:
        update_data[
            "what_you_learn_en"
        ] = what_you_learn_en

    if requirements_en is not None:
        update_data[
            "requirements_en"
        ] = requirements_en

    if target_students_en is not None:
        update_data[
            "target_students_en"
        ] = target_students_en

    if what_you_learn_km is not None:
        update_data[
            "what_you_learn_km"
        ] = what_you_learn_km

    if requirements_km is not None:
        update_data[
            "requirements_km"
        ] = requirements_km

    if target_students_km is not None:
        update_data[
            "target_students_km"
        ] = target_students_km

    if certificate is not None:
        update_data["certificate"] = certificate

    if language is not None:
        update_data["language"] = language

    if schedule is not None:
        update_data["schedule"] = schedule

    if course_status is not None:
        course_status = (
            course_status
            .strip()
            .lower()
        )

        if course_status not in ALLOWED_COURSE_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid course status. "
                    "Allowed: available, in_progress, coming_soon"
                ),
            )

        update_data["status"] = course_status

    if is_active is not None:
        update_data["is_active"] = is_active

    if is_featured is not None:
        update_data[
            "is_featured"
        ] = is_featured

    if order is not None:
        update_data["order"] = order

    # -----------------------------------------------------
    # CATEGORY
    # -----------------------------------------------------

    if category_id is not None:
        category = crud.get_course_category(
            db,
            category_id,
        )

        if not category:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course category not found",
            )

        update_data["category_id"] = category_id

    # -----------------------------------------------------
    # IMAGE
    # -----------------------------------------------------

    new_image = None
    old_image = None

    if image_file is not None and image_file.filename:
        validate_image(image_file)

        old_image = course.image_url

        new_image = save_upload_file(
            image_file,
            subdir=COURSES_SUBDIR,
        )

        update_data["image_url"] = new_image

    # -----------------------------------------------------
    # BUILD UPDATE SCHEMA
    # -----------------------------------------------------

    course_update = schemas.CourseUpdate(
        **update_data
    )

    # -----------------------------------------------------
    # UPDATE DATABASE
    # -----------------------------------------------------

    try:
        updated = crud.update_course(
            db,
            course_id,
            course_update,
        )

    except Exception:
        db.rollback()

        if new_image:
            delete_file(new_image)

        raise

    if not updated:
        if new_image:
            delete_file(new_image)

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    # -----------------------------------------------------
    # DELETE OLD IMAGE AFTER SUCCESS
    # -----------------------------------------------------

    if (
        new_image
        and old_image
        and old_image != new_image
    ):
        delete_file(old_image)

    return updated


# =========================================================
# DELETE COURSE - ADMIN ONLY
# DELETE /api/courses/{course_id}
# =========================================================

@router.delete(
    "/{course_id}",
    response_model=schemas.ResponseMessage,
)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):
    course = crud.get_course(
        db,
        course_id,
    )

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    image_url = course.image_url

    try:
        success = crud.delete_course(
            db,
            course_id,
        )

    except ValueError:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course cannot be deleted in its current state",
        )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    if image_url:
        delete_file(image_url)

    return {
        "message": "Course deleted successfully",
        "success": True,
    }


# =========================================================
# GET SINGLE COURSE - PUBLIC
# IMPORTANT: Keep dynamic route at the bottom
# GET /api/courses/{course_id}
# =========================================================

@router.get(
    "/{course_id}",
    response_model=schemas.Course,
)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
):
    course = crud.get_course(
        db,
        course_id,
    )

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found",
        )

    return course
