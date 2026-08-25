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

from .. import crud, models, schemas
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

SCHOOLS_SUBDIR = "schools"

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
# CLEAN OPTIONAL TEXT
# =========================================================

def clean_optional(
    value: Optional[str],
) -> Optional[str]:

    if value is None:
        return None


    value = value.strip()


    return (
        value
        if value
        else None
    )


# =========================================================
# PARSE BOOLEAN
# =========================================================

def parse_boolean(
    value: Optional[str],
    default: Optional[bool] = None,
) -> Optional[bool]:

    if value is None:
        return default


    normalized = (
        value
        .strip()
        .lower()
    )


    true_values = {
        "true",
        "1",
        "yes",
        "on",
    }

    false_values = {
        "false",
        "0",
        "no",
        "off",
    }


    if normalized in true_values:
        return True


    if normalized in false_values:
        return False


    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=(
            f"Invalid boolean value: {value}"
        ),
    )


# =========================================================
# GET ACTIVE SCHOOLS - PUBLIC
#
# GET /api/schools/
# =========================================================

@router.get(
    "/",
    response_model=List[
        schemas.School
    ],
)
def get_schools(

    skip: int = 0,

    limit: int = 100,

    db: Session = Depends(get_db),
):

    return crud.get_schools(
        db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# GET ALL SCHOOLS - PUBLIC
#
# GET /api/schools/all
# =========================================================

@router.get(
    "/all",
    response_model=List[
        schemas.School
    ],
)
def get_all_schools(
    db: Session = Depends(get_db),
):

    return crud.get_all_schools(
        db
    )


# =========================================================
# GET SINGLE SCHOOL - PUBLIC
#
# GET /api/schools/{school_id}
# =========================================================

@router.get(
    "/{school_id}",
    response_model=schemas.School,
)
def get_school(

    school_id: int,

    db: Session = Depends(get_db),
):

    school = crud.get_school(
        db,
        school_id,
    )


    if not school:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found",
        )


    return school


# =========================================================
# CREATE SCHOOL - ADMIN ONLY
#
# POST /api/schools/
# =========================================================

@router.post(
    "/",
    response_model=schemas.School,
    status_code=status.HTTP_201_CREATED,
)
def create_school(

    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    name_en: str = Form(...),

    tag_en: Optional[str] = Form(None),

    description_en: Optional[str] = Form(None),

    features_en: Optional[str] = Form(None),


    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    name_km: str = Form(...),

    tag_km: Optional[str] = Form(None),

    description_km: Optional[str] = Form(None),

    features_km: Optional[str] = Form(None),


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    acronym: Optional[str] = Form(None),

    is_active: bool = Form(True),

    order: int = Form(0),

    image: Optional[
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
    # VALIDATE ENGLISH NAME
    # =====================================================

    clean_name_en = (
        name_en.strip()
    )


    if not clean_name_en:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "English school name is required"
            ),
        )


    # =====================================================
    # VALIDATE KHMER NAME
    # =====================================================

    clean_name_km = (
        name_km.strip()
    )


    if not clean_name_km:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Khmer school name is required"
            ),
        )


    # =====================================================
    # IMAGE
    # =====================================================

    image_path = None


    if (
        image is not None
        and image.filename
    ):

        # -------------------------------------------------
        # VALIDATE IMAGE
        # -------------------------------------------------

        validate_image(
            image
        )


        # -------------------------------------------------
        # SAVE IMAGE
        # -------------------------------------------------

        image_path = (
            save_upload_file(
                image,
                subdir=SCHOOLS_SUBDIR,
            )
        )


    # =====================================================
    # BUILD SCHOOL DATA
    # =====================================================

    school_data = schemas.SchoolCreate(

        # -------------------------------------------------
        # ENGLISH
        # -------------------------------------------------

        name_en=clean_name_en,

        tag_en=clean_optional(
            tag_en
        ),

        description_en=clean_optional(
            description_en
        ),

        features_en=clean_optional(
            features_en
        ),


        # -------------------------------------------------
        # KHMER
        # -------------------------------------------------

        name_km=clean_name_km,

        tag_km=clean_optional(
            tag_km
        ),

        description_km=clean_optional(
            description_km
        ),

        features_km=clean_optional(
            features_km
        ),


        # -------------------------------------------------
        # COMMON
        # -------------------------------------------------

        acronym=clean_optional(
            acronym
        ),

        image_url=image_path,

        is_active=is_active,

        sort_order=order,
    )


    # =====================================================
    # CREATE DATABASE RECORD
    # =====================================================

    try:

        school = crud.create_school(
            db,
            school_data,
        )


        return school


    except Exception as e:

        db.rollback()


        # -------------------------------------------------
        # DELETE IMAGE IF DATABASE FAILED
        # -------------------------------------------------

        if image_path:

            delete_file(
                image_path
            )


        print(
            "Create School Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to create school"
            ),
        )


# =========================================================
# UPDATE SCHOOL - ADMIN ONLY
#
# PUT /api/schools/{school_id}
# =========================================================

@router.put(
    "/{school_id}",
    response_model=schemas.School,
)
def update_school(

    school_id: int,


    # -----------------------------------------------------
    # ENGLISH
    # -----------------------------------------------------

    name_en: Optional[str] = Form(None),

    tag_en: Optional[str] = Form(None),

    description_en: Optional[str] = Form(None),

    features_en: Optional[str] = Form(None),


    # -----------------------------------------------------
    # KHMER
    # -----------------------------------------------------

    name_km: Optional[str] = Form(None),

    tag_km: Optional[str] = Form(None),

    description_km: Optional[str] = Form(None),

    features_km: Optional[str] = Form(None),


    # -----------------------------------------------------
    # COMMON
    # -----------------------------------------------------

    acronym: Optional[str] = Form(None),

    is_active: Optional[str] = Form(None),

    order: Optional[str] = Form(None),

    image: Optional[
        UploadFile
    ] = File(None),

    remove_image: Optional[str] = Form(None),


    # -----------------------------------------------------
    # DEPENDENCIES
    # -----------------------------------------------------

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # =====================================================
    # FIND SCHOOL
    # =====================================================

    existing_school = (
        db.query(
            models.School
        )
        .filter(
            models.School.id
            == school_id
        )
        .first()
    )


    if not existing_school:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found",
        )


    # =====================================================
    # STATE
    # =====================================================

    old_image = (
        existing_school.image_url
    )

    new_image_path = None

    remove_old_image = False

    update_data = {}


    # =====================================================
    # ENGLISH NAME
    # =====================================================

    if name_en is not None:

        clean_name_en = (
            name_en.strip()
        )


        if not clean_name_en:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "English school name "
                    "cannot be empty"
                ),
            )


        update_data[
            "name_en"
        ] = clean_name_en


    # =====================================================
    # ENGLISH TAG
    # =====================================================

    if tag_en is not None:

        update_data[
            "tag_en"
        ] = clean_optional(
            tag_en
        )


    # =====================================================
    # ENGLISH DESCRIPTION
    # =====================================================

    if description_en is not None:

        update_data[
            "description_en"
        ] = clean_optional(
            description_en
        )


    # =====================================================
    # ENGLISH FEATURES
    # =====================================================

    if features_en is not None:

        update_data[
            "features_en"
        ] = clean_optional(
            features_en
        )


    # =====================================================
    # KHMER NAME
    # =====================================================

    if name_km is not None:

        clean_name_km = (
            name_km.strip()
        )


        if not clean_name_km:

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Khmer school name "
                    "cannot be empty"
                ),
            )


        update_data[
            "name_km"
        ] = clean_name_km


    # =====================================================
    # KHMER TAG
    # =====================================================

    if tag_km is not None:

        update_data[
            "tag_km"
        ] = clean_optional(
            tag_km
        )


    # =====================================================
    # KHMER DESCRIPTION
    # =====================================================

    if description_km is not None:

        update_data[
            "description_km"
        ] = clean_optional(
            description_km
        )


    # =====================================================
    # KHMER FEATURES
    # =====================================================

    if features_km is not None:

        update_data[
            "features_km"
        ] = clean_optional(
            features_km
        )


    # =====================================================
    # ACRONYM
    # =====================================================

    if acronym is not None:

        update_data[
            "acronym"
        ] = clean_optional(
            acronym
        )


    # =====================================================
    # ACTIVE STATUS
    # =====================================================

    if is_active is not None:

        update_data[
            "is_active"
        ] = parse_boolean(
            is_active
        )


    # =====================================================
    # ORDER
    # =====================================================

    if order is not None:

        try:

            update_data[
                "sort_order"
            ] = int(order)


        except (
            ValueError,
            TypeError,
        ):

            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Invalid order value"
                ),
            )


    # =====================================================
    # NEW IMAGE
    # =====================================================

    if (
        image is not None
        and image.filename
    ):

        # -------------------------------------------------
        # VALIDATE IMAGE
        # -------------------------------------------------

        validate_image(
            image
        )


        # -------------------------------------------------
        # SAVE IMAGE
        # -------------------------------------------------

        new_image_path = (
            save_upload_file(
                image,
                subdir=SCHOOLS_SUBDIR,
            )
        )


        update_data[
            "image_url"
        ] = new_image_path


    # =====================================================
    # REMOVE IMAGE
    # =====================================================

    elif remove_image is not None:

        should_remove = (
            parse_boolean(
                remove_image,
                default=False,
            )
        )


        if should_remove:

            update_data[
                "image_url"
            ] = None

            remove_old_image = True


    # =====================================================
    # BUILD UPDATE SCHEMA
    # =====================================================

    school_update = (
        schemas.SchoolUpdate(
            **update_data
        )
    )


    # =====================================================
    # UPDATE DATABASE
    # =====================================================

    try:

        school = crud.update_school(
            db,
            school_id,
            school_update,
        )


    except Exception as e:

        db.rollback()


        # -------------------------------------------------
        # REMOVE NEW IMAGE IF DATABASE FAILED
        # -------------------------------------------------

        if new_image_path:

            delete_file(
                new_image_path
            )


        print(
            "Update School Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to update school"
            ),
        )


    # =====================================================
    # SCHOOL NOT FOUND
    # =====================================================

    if not school:

        if new_image_path:

            delete_file(
                new_image_path
            )


        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found",
        )


    # =====================================================
    # DELETE OLD IMAGE AFTER SUCCESS
    # =====================================================

    if (
        old_image
        and (
            new_image_path
            or remove_old_image
        )
    ):

        delete_file(
            old_image
        )


    return school


# =========================================================
# DELETE SCHOOL - ADMIN ONLY
#
# DELETE /api/schools/{school_id}
# =========================================================

@router.delete(
    "/{school_id}",
    response_model=schemas.ResponseMessage,
)
def delete_school(

    school_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # =====================================================
    # FIND SCHOOL
    # =====================================================

    existing_school = (
        db.query(
            models.School
        )
        .filter(
            models.School.id
            == school_id
        )
        .first()
    )


    if not existing_school:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found",
        )


    image_path = (
        existing_school.image_url
    )


    # =====================================================
    # DELETE DATABASE RECORD
    # =====================================================

    try:

        success = (
            crud.delete_school(
                db,
                school_id,
            )
        )


    except Exception as e:

        db.rollback()


        print(
            "Delete School Error:",
            str(e),
        )


        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to delete school"
            ),
        )


    # =====================================================
    # CHECK RESULT
    # =====================================================

    if not success:

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="School not found",
        )


    # =====================================================
    # DELETE IMAGE AFTER DATABASE SUCCESS
    # =====================================================

    if image_path:

        delete_file(
            image_path
        )


    return {
        "message": (
            "School deleted successfully"
        ),
        "success": True,
    }