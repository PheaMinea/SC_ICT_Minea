from datetime import datetime, timezone

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from .. import crud, schemas
from ..db.database import get_db

from ..core.dependencies import (
    get_current_active_admin,
)


router = APIRouter()


# =========================================================
# GET SITE SETTINGS - PUBLIC
# GET /api/settings/
# =========================================================

@router.get(
    "/",
    response_model=schemas.SiteSettings,
)
def get_site_settings(
    db: Session = Depends(get_db),
):

    site_settings = (
        crud.get_site_settings(
            db
        )
    )

    # -----------------------------------------------------
    # DEFAULT SETTINGS
    # -----------------------------------------------------

    if not site_settings:

        now = datetime.now(
            timezone.utc
        )

        return schemas.SiteSettings(

            id=0,

            # =============================================
            # English
            # =============================================

            site_name_en="SC Academy",

            site_description_en=None,

            address_en=(
                "SC Academy, AP Plaza, Preah Monivong Blvd, "
                "Phnom Penh, Cambodia"
            ),


            # =============================================
            # Khmer
            # =============================================

            site_name_km="SC Academy",

            site_description_km=None,

            address_km=(
                "SC Academy, អគារ AP Plaza, មហាវិថីព្រះមុនីវង្ស, "
                "រាជធានីភ្នំពេញ, កម្ពុជា"
            ),


            # =============================================
            # Common
            # =============================================

            logo_url=None,

            favicon_url=None,

            phone="+855 12 345 678",

            email="info@scacademy.edu",

            facebook_url=None,

            telegram_url="https://t.me/SCAcademy",

            youtube_url=None,

            google_map_url=(
                "https://maps.app.goo.gl/y19U8vRnrNh8tSvo8"
            ),

            created_at=now,

            updated_at=now,
        )

    return site_settings


# =========================================================
# CREATE SITE SETTINGS - ADMIN ONLY
# POST /api/settings/
# =========================================================

@router.post(
    "/",
    response_model=schemas.SiteSettings,
    status_code=status.HTTP_201_CREATED,
)
def create_site_settings(

    settings_data: schemas.SiteSettingsBase,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # -----------------------------------------------------
    # CHECK EXISTING SETTINGS
    # -----------------------------------------------------

    existing = (
        crud.get_site_settings(
            db
        )
    )

    if existing:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Settings already exist. "
                "Use PUT to update."
            ),
        )


    # -----------------------------------------------------
    # CREATE SETTINGS
    # -----------------------------------------------------

    try:

        return crud.create_site_settings(
            db,
            settings_data,
        )

    except Exception as e:

        db.rollback()

        print(
            "Create Site Settings Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to create site settings"
            ),
        )


# =========================================================
# UPDATE SITE SETTINGS - ADMIN ONLY
# PUT /api/settings/
# =========================================================

@router.put(
    "/",
    response_model=schemas.SiteSettings,
)
def update_site_settings(

    settings_data: schemas.SiteSettingsUpdate,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    try:

        # -------------------------------------------------
        # GET EXISTING SETTINGS
        # -------------------------------------------------

        existing = (
            crud.get_site_settings(
                db
            )
        )


        # -------------------------------------------------
        # UPDATE EXISTING SETTINGS
        # -------------------------------------------------

        if existing:

            updated = (
                crud.update_site_settings(
                    db,
                    settings_data,
                )
            )

            if not updated:

                raise HTTPException(
                    status_code=(
                        status.HTTP_500_INTERNAL_SERVER_ERROR
                    ),
                    detail=(
                        "Failed to update site settings"
                    ),
                )

            return updated


        # =================================================
        # CREATE IF SETTINGS DO NOT EXIST
        # =================================================

        data = settings_data.model_dump(
            exclude_unset=True
        )


        # -------------------------------------------------
        # DEFAULT DATA
        # -------------------------------------------------

        create_data = {

            # =============================================
            # English
            # =============================================

            "site_name_en": data.get(
                "site_name_en",
                "SC Academy",
            ),

            "site_description_en": data.get(
                "site_description_en",
                None,
            ),

            "address_en": data.get(
                "address_en",
                None,
            ),


            # =============================================
            # Khmer
            # =============================================

            "site_name_km": data.get(
                "site_name_km",
                "SC Academy",
            ),

            "site_description_km": data.get(
                "site_description_km",
                None,
            ),

            "address_km": data.get(
                "address_km",
                None,
            ),


            # =============================================
            # Common
            # =============================================

            "logo_url": data.get(
                "logo_url",
                None,
            ),

            "favicon_url": data.get(
                "favicon_url",
                None,
            ),

            "phone": data.get(
                "phone",
                None,
            ),

            "email": data.get(
                "email",
                None,
            ),

            "facebook_url": data.get(
                "facebook_url",
                None,
            ),

            "telegram_url": data.get(
                "telegram_url",
                None,
            ),

            "youtube_url": data.get(
                "youtube_url",
                None,
            ),

            "google_map_url": data.get(
                "google_map_url",
                None,
            ),
        }


        # -------------------------------------------------
        # BUILD CREATE SCHEMA
        # -------------------------------------------------

        create_schema = (
            schemas.SiteSettingsBase(
                **create_data
            )
        )


        # -------------------------------------------------
        # CREATE SETTINGS
        # -------------------------------------------------

        return crud.create_site_settings(
            db,
            create_schema,
        )


    except HTTPException:

        raise


    except Exception as e:

        db.rollback()

        print(
            "Update Site Settings Error:",
            str(e),
        )

        raise HTTPException(
            status_code=(
                status.HTTP_500_INTERNAL_SERVER_ERROR
            ),
            detail=(
                "Failed to update site settings"
            ),
        )
