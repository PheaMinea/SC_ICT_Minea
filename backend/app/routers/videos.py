from typing import List

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
# GET ALL VIDEOS - PUBLIC
# GET /api/videos/
# =========================================================

@router.get(
    "/",
    response_model=List[schemas.Video],
)
def get_videos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):

    return crud.get_videos(
        db,
        skip=skip,
        limit=limit,
    )


# =========================================================
# GET FEATURED VIDEOS - PUBLIC
# GET /api/videos/featured
# =========================================================

@router.get(
    "/featured",
    response_model=List[schemas.Video],
)
def get_featured_videos(
    limit: int = 3,
    db: Session = Depends(get_db),
):

    return crud.get_featured_videos(
        db,
        limit=limit,
    )


# =========================================================
# GET SINGLE VIDEO - PUBLIC
# GET /api/videos/{video_id}
# =========================================================

@router.get(
    "/{video_id}",
    response_model=schemas.Video,
)
def get_video(
    video_id: int,
    db: Session = Depends(get_db),
):

    video = crud.increment_video_views(
        db,
        video_id,
    )

    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )

    return video


# =========================================================
# CREATE VIDEO - ADMIN ONLY
# POST /api/videos/
# =========================================================

@router.post(
    "/",
    response_model=schemas.Video,
    status_code=status.HTTP_201_CREATED,
)
def create_video(
    video: schemas.VideoCreate,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    try:

        return crud.create_video(
            db,
            video,
        )

    except Exception:

        db.rollback()
        raise


# =========================================================
# UPDATE VIDEO - ADMIN ONLY
# PUT /api/videos/{video_id}
# =========================================================

@router.put(
    "/{video_id}",
    response_model=schemas.Video,
)
def update_video(
    video_id: int,

    video_update: schemas.VideoUpdate,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # -----------------------------------------------------
    # CHECK VIDEO
    # -----------------------------------------------------

    existing_video = crud.get_video(
        db,
        video_id,
    )

    if not existing_video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )


    # -----------------------------------------------------
    # UPDATE VIDEO
    # -----------------------------------------------------

    try:

        video = crud.update_video(
            db,
            video_id,
            video_update,
        )

    except Exception:

        db.rollback()
        raise


    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )

    return video


# =========================================================
# DELETE VIDEO - ADMIN ONLY
# DELETE /api/videos/{video_id}
# =========================================================

@router.delete(
    "/{video_id}",
    response_model=schemas.ResponseMessage,
)
def delete_video(
    video_id: int,

    db: Session = Depends(get_db),

    current_admin=Depends(
        get_current_active_admin
    ),
):

    # -----------------------------------------------------
    # CHECK VIDEO
    # -----------------------------------------------------

    existing_video = crud.get_video(
        db,
        video_id,
    )

    if not existing_video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )


    # -----------------------------------------------------
    # DELETE VIDEO
    # -----------------------------------------------------

    try:

        success = crud.delete_video(
            db,
            video_id,
        )

    except Exception:

        db.rollback()
        raise


    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Video not found",
        )


    return {
        "message": "Video deleted successfully",
        "success": True,
    }