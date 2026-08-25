from datetime import datetime
from typing import Optional

from pathlib import Path

from fastapi import (
    HTTPException,
    UploadFile,
    status
)
import shutil
import uuid


# ==========================================
# BASE DIRECTORY
# ==========================================

BASE_DIR = Path(
    __file__
).resolve().parents[2]


# ==========================================
# UPLOAD DIRECTORY
# ==========================================

UPLOAD_DIR = (
    BASE_DIR / "uploads"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================
# ALLOWED IMAGE TYPES
# ==========================================

ALLOWED_IMAGE_TYPES = {
    "image/jpeg",
    "image/png",
    "image/webp",
}


# ==========================================
# ALLOWED EXTENSIONS
# ==========================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

IMAGE_SIGNATURES = {
    ".jpg": lambda data: data.startswith(b"\xff\xd8\xff"),
    ".jpeg": lambda data: data.startswith(b"\xff\xd8\xff"),
    ".png": lambda data: data.startswith(b"\x89PNG\r\n\x1a\n"),
    ".webp": lambda data: data.startswith(b"RIFF") and data[8:12] == b"WEBP",
}

IMAGE_CONTENT_TYPES = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
}


# ==========================================
# MAX FILE SIZE
# 5 MB
# ==========================================

MAX_FILE_SIZE = (
    5 * 1024 * 1024
)


# ==========================================
# ALLOWED VIDEO TYPES
# ==========================================

ALLOWED_VIDEO_TYPES = {
    "video/mp4",
    "video/webm",
    "video/quicktime",
}


# ==========================================
# ALLOWED VIDEO EXTENSIONS
# ==========================================

ALLOWED_VIDEO_EXTENSIONS = {
    ".mp4",
    ".webm",
    ".mov",
}

VIDEO_SIGNATURES = {
    ".mp4": lambda data: len(data) >= 12 and data[4:8] == b"ftyp",
    ".mov": lambda data: len(data) >= 12 and data[4:8] == b"ftyp",
    ".webm": lambda data: data.startswith(b"\x1a\x45\xdf\xa3"),
}

VIDEO_CONTENT_TYPES = {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".webm": "video/webm",
}


# ==========================================
# MAX VIDEO FILE SIZE
# 50 MB
# ==========================================

MAX_VIDEO_FILE_SIZE = (
    50 * 1024 * 1024
)


# ==========================================
# VALIDATE SUBDIRECTORY
# ==========================================

def _get_safe_upload_dir(
    subdir: str = ""
) -> Path:

    if not subdir:
        return UPLOAD_DIR

    clean_subdir = (
        subdir
        .strip()
        .strip("/\\")
    )

    if not clean_subdir:
        return UPLOAD_DIR

    target_dir = (
        UPLOAD_DIR / clean_subdir
    ).resolve()

    upload_root = (
        UPLOAD_DIR.resolve()
    )

    try:
        target_dir.relative_to(
            upload_root
        )

    except ValueError:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid upload directory"
        )

    target_dir.mkdir(
        parents=True,
        exist_ok=True
    )

    return target_dir


# ==========================================
# VALIDATE IMAGE
# ==========================================

def validate_image(
    upload_file: UploadFile
) -> str:

    if not upload_file:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image file is required"
        )


    # --------------------------------------
    # CHECK CONTENT TYPE
    # --------------------------------------

    if (
        upload_file.content_type
        not in ALLOWED_IMAGE_TYPES
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid image type. "
                "Only JPG, JPEG, PNG and WEBP "
                "images are allowed."
            )
        )


    # --------------------------------------
    # CHECK EXTENSION
    # --------------------------------------

    original_filename = (
        upload_file.filename or ""
    )

    extension = (
        Path(original_filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid image extension. "
                "Only .jpg, .jpeg, .png and "
                ".webp are allowed."
            )
        )

    if upload_file.content_type != IMAGE_CONTENT_TYPES[extension]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image content type does not match its extension"
        )

    upload_file.file.seek(0)
    header = upload_file.file.read(16)
    upload_file.file.seek(0)
    if not IMAGE_SIGNATURES[extension](header):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted image file"
        )


    # --------------------------------------
    # CHECK FILE SIZE
    # --------------------------------------

    upload_file.file.seek(0)

    file_size = 0

    chunk_size = 1024 * 1024

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
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    "Image is too large. "
                    "Maximum file size is 5 MB."
                )
            )

    upload_file.file.seek(0)

    return extension


# ==========================================
# SAVE UPLOAD FILE
# ==========================================

def save_upload_file(
    upload_file: UploadFile,
    subdir: str = ""
) -> str:

    extension = validate_image(
        upload_file
    )


    # --------------------------------------
    # RANDOM SAFE FILENAME
    # --------------------------------------

    filename = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )


    # --------------------------------------
    # SAFE TARGET DIRECTORY
    # --------------------------------------

    target_dir = (
        _get_safe_upload_dir(
            subdir
        )
    )


    file_path = (
        target_dir / filename
    )


    # --------------------------------------
    # SAVE FILE
    # --------------------------------------

    try:

        with file_path.open(
            "wb"
        ) as buffer:

            while True:

                chunk = (
                    upload_file.file.read(
                        1024 * 1024
                    )
                )

                if not chunk:
                    break

                buffer.write(
                    chunk
                )

    except OSError:

        if file_path.exists():

            try:
                file_path.unlink()

            except OSError:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save image"
        )

    finally:

        upload_file.file.seek(0)


    # --------------------------------------
    # RETURN PUBLIC URL
    # --------------------------------------

    if subdir:

        clean_subdir = (
            subdir
            .strip()
            .strip("/\\")
            .replace("\\", "/")
        )

        return (
            f"/uploads/"
            f"{clean_subdir}/"
            f"{filename}"
        )

    return (
        f"/uploads/{filename}"
    )


# ==========================================
# VALIDATE VIDEO
# ==========================================

def validate_video(
    upload_file: UploadFile
) -> str:

    if not upload_file:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video file is required"
        )


    # --------------------------------------
    # CHECK CONTENT TYPE
    # --------------------------------------

    if (
        upload_file.content_type
        not in ALLOWED_VIDEO_TYPES
    ):

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid video type. "
                "Only MP4, WebM and MOV "
                "videos are allowed."
            )
        )


    # --------------------------------------
    # CHECK EXTENSION
    # --------------------------------------

    original_filename = (
        upload_file.filename or ""
    )

    extension = (
        Path(original_filename)
        .suffix
        .lower()
    )

    if extension not in ALLOWED_VIDEO_EXTENSIONS:

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                "Invalid video extension. "
                "Only .mp4, .webm and "
                ".mov are allowed."
            )
        )

    if upload_file.content_type != VIDEO_CONTENT_TYPES[extension]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video content type does not match its extension"
        )

    upload_file.file.seek(0)
    header = upload_file.file.read(16)
    upload_file.file.seek(0)
    if not VIDEO_SIGNATURES[extension](header):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or corrupted video file"
        )


    # --------------------------------------
    # CHECK FILE SIZE
    # --------------------------------------

    upload_file.file.seek(0)

    file_size = 0

    chunk_size = 1024 * 1024

    while True:

        chunk = upload_file.file.read(
            chunk_size
        )

        if not chunk:
            break

        file_size += len(chunk)

        if file_size > MAX_VIDEO_FILE_SIZE:

            upload_file.file.seek(0)

            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=(
                    "Video is too large. "
                    "Maximum file size is 50 MB."
                )
            )

    upload_file.file.seek(0)

    return extension


# ==========================================
# SAVE VIDEO FILE
# ==========================================

def save_video_file(
    upload_file: UploadFile,
    subdir: str = "hero_videos"
) -> str:

    extension = validate_video(
        upload_file
    )


    # --------------------------------------
    # RANDOM SAFE FILENAME
    # --------------------------------------

    filename = (
        f"{uuid.uuid4().hex}"
        f"{extension}"
    )


    # --------------------------------------
    # SAFE TARGET DIRECTORY
    # --------------------------------------

    target_dir = (
        _get_safe_upload_dir(
            subdir
        )
    )


    file_path = (
        target_dir / filename
    )


    # --------------------------------------
    # SAVE FILE
    # --------------------------------------

    try:

        with file_path.open(
            "wb"
        ) as buffer:

            while True:

                chunk = (
                    upload_file.file.read(
                        1024 * 1024
                    )
                )

                if not chunk:
                    break

                buffer.write(
                    chunk
                )

    except OSError:

        if file_path.exists():

            try:
                file_path.unlink()

            except OSError:
                pass

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to save video"
        )

    finally:

        upload_file.file.seek(0)


    # --------------------------------------
    # RETURN PUBLIC URL
    # --------------------------------------

    if subdir:

        clean_subdir = (
            subdir
            .strip()
            .strip("/\\")
            .replace("\\", "/")
        )

        return (
            f"/uploads/"
            f"{clean_subdir}/"
            f"{filename}"
        )

    return (
        f"/uploads/{filename}"
    )


# ==========================================
# DELETE FILE SAFELY
# ==========================================

def delete_file(
    file_url: Optional[str]
) -> None:

    if not file_url:
        return


    # --------------------------------------
    # ONLY ALLOW /uploads/ FILES
    # --------------------------------------

    clean_url = (
        file_url
        .split("?")[0]
        .split("#")[0]
    )

    relative = (
        clean_url.lstrip("/\\")
    )


    if not relative.startswith(
        "uploads/"
    ):

        return


    file_path = (
        BASE_DIR / relative
    ).resolve()

    upload_root = (
        UPLOAD_DIR.resolve()
    )


    # --------------------------------------
    # PREVENT PATH TRAVERSAL
    # --------------------------------------

    try:

        file_path.relative_to(
            upload_root
        )

    except ValueError:

        return


    # --------------------------------------
    # DELETE FILE
    # --------------------------------------

    if (
        file_path.exists()
        and file_path.is_file()
    ):

        try:

            file_path.unlink()

        except OSError:

            pass
