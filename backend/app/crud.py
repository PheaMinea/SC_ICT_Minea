from datetime import datetime
from typing import List, Optional

from sqlalchemy import or_
from sqlalchemy.orm import Session

from . import models, schemas


# ==========================================
# ADMIN CRUD
# ==========================================

def get_admin_by_username(
    db: Session,
    username: str
) -> Optional[models.Admin]:

    
    return (
        db.query(models.Admin)
        .filter(models.Admin.username == username)
        .first()
    )


def get_admin_by_email(
    db: Session,
    email: str
) -> Optional[models.Admin]:

    return (
        db.query(models.Admin)
        .filter(models.Admin.email == email)
        .first()
    )


def get_admin_by_id(
    db: Session,
    admin_id: int
) -> Optional[models.Admin]:

    return (
        db.query(models.Admin)
        .filter(models.Admin.id == admin_id)
        .first()
    )


def get_all_admins(
    db: Session,
    skip: int = 0,
    limit: int = 100
) -> List[models.Admin]:

    return (
        db.query(models.Admin)
        .offset(skip)
        .limit(limit)
        .all()
    )


def create_admin(
    db: Session,
    admin: schemas.AdminCreate
) -> models.Admin:

    from .core.security import get_password_hash

    hashed_password = get_password_hash(
        admin.password
    )

    db_admin = models.Admin(
        username=admin.username,
        email=admin.email,
        hashed_password=hashed_password,
        role=getattr(admin, "role", "editor") or "editor",
    )

    try:
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)

        return db_admin

    except Exception:
        db.rollback()
        raise


def toggle_admin_active(
    db: Session,
    admin_id: int
) -> Optional[models.Admin]:

    admin = get_admin_by_id(
        db,
        admin_id
    )

    if not admin:
        return None

    admin.is_active = not admin.is_active

    db.commit()
    db.refresh(admin)

    return admin


def delete_admin(
    db: Session,
    admin_id: int
) -> bool:

    admin = get_admin_by_id(
        db,
        admin_id
    )

    if not admin:
        return False

    try:
        db.delete(admin)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# GALLERY CRUD
# ==========================================

def get_gallery_images(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    if not hasattr(models, "GalleryImage"):
        return []

    return (
        db.query(models.GalleryImage)
        .order_by(
            models.GalleryImage.sort_order.asc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_featured_gallery_images(
    db: Session,
    limit: int = 6
):
    if not hasattr(models, "GalleryImage"):
        return []

    query = db.query(
        models.GalleryImage
    )

    if hasattr(
        models.GalleryImage,
        "is_featured"
    ):
        query = query.filter(
            models.GalleryImage.is_featured == True
        )

    if hasattr(
        models.GalleryImage,
        "order"
    ):
        query = query.order_by(
            models.GalleryImage.sort_order.asc()
        )

    return query.limit(limit).all()


def get_gallery_by_category(
    db: Session,
    category: str
):
    if not hasattr(
        models,
        "GalleryImage"
    ):
        return []

    search_term = f"%{category}%"

    return (
        db.query(models.GalleryImage)
        .filter(
            or_(
                models.GalleryImage.category_en.ilike(
                    search_term
                ),
                models.GalleryImage.category_km.ilike(
                    search_term
                )
            )
        )
        .order_by(
            models.GalleryImage.sort_order.asc()
        )
        .all()
    )


def get_gallery_image(
    db: Session,
    image_id: int
):
    if not hasattr(
        models,
        "GalleryImage"
    ):
        return None

    return (
        db.query(models.GalleryImage)
        .filter(
            models.GalleryImage.id == image_id
        )
        .first()
    )


def create_gallery_image(
    db: Session,
    image: schemas.GalleryImageCreate
):
    if not hasattr(
        models,
        "GalleryImage"
    ):
        raise AttributeError(
            "GalleryImage model is missing"
        )

    db_image = models.GalleryImage(
        **image.model_dump()
    )

    try:
        db.add(db_image)
        db.commit()
        db.refresh(db_image)

        return db_image

    except Exception:
        db.rollback()
        raise


def update_gallery_image(
    db: Session,
    image_id: int,
    image_update: schemas.GalleryImageUpdate
):
    db_image = get_gallery_image(
        db,
        image_id
    )

    if not db_image:
        return None

    update_data = image_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_image,
            key,
            value
        )

    try:
        db.commit()
        db.refresh(db_image)

        return db_image

    except Exception:
        db.rollback()
        raise


def delete_gallery_image(
    db: Session,
    image_id: int
) -> bool:

    db_image = get_gallery_image(
        db,
        image_id
    )

    if not db_image:
        return False

    try:
        db.delete(db_image)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# VIDEO CRUD
# ==========================================

def get_videos(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    if not hasattr(models, "Video"):
        return []

    return (
        db.query(models.Video)
        .order_by(
            models.Video.published_at.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_video(
    db: Session,
    video_id: int
):
    if not hasattr(models, "Video"):
        return None

    return (
        db.query(models.Video)
        .filter(
            models.Video.id == video_id
        )
        .first()
    )


def get_featured_videos(
    db: Session,
    limit: int = 3
):
    if not hasattr(models, "Video"):
        return []

    query = db.query(models.Video)

    if hasattr(
        models.Video,
        "is_featured"
    ):
        query = query.filter(
            models.Video.is_featured == True
        )

    return (
        query
        .order_by(models.Video.published_at.desc())
        .limit(limit)
        .all()
    )


def increment_video_views(
    db: Session,
    video_id: int
):
    db_video = get_video(
        db,
        video_id
    )

    if not db_video:
        return None

    if hasattr(db_video, "views"):
        db_video.views = (
            db_video.views or 0
        ) + 1

    if hasattr(db_video, "updated_at"):
        db_video.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_video)

        return db_video

    except Exception:
        db.rollback()
        raise


def create_video(
    db: Session,
    video: schemas.VideoCreate
):
    if not hasattr(models, "Video"):
        raise AttributeError(
            "Video model is missing"
        )

    db_video = models.Video(
        **video.model_dump()
    )

    try:
        db.add(db_video)
        db.commit()
        db.refresh(db_video)

        return db_video

    except Exception:
        db.rollback()
        raise


def update_video(
    db: Session,
    video_id: int,
    video_update: schemas.VideoUpdate
):
    db_video = get_video(
        db,
        video_id
    )

    if not db_video:
        return None

    update_data = video_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_video,
            key,
            value
        )

    if hasattr(db_video, "updated_at"):
        db_video.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_video)

        return db_video

    except Exception:
        db.rollback()
        raise


def delete_video(
    db: Session,
    video_id: int
) -> bool:

    db_video = get_video(
        db,
        video_id
    )

    if not db_video:
        return False

    try:
        db.delete(db_video)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# CONTACT CRUD
# ==========================================

def create_contact_message(
    db: Session,
    message: schemas.ContactMessageCreate
):
    if not hasattr(
        models,
        "ContactMessage"
    ):
        raise AttributeError(
            "ContactMessage model is missing"
        )

    message_data = message.model_dump(exclude={"hp_trap"})

    db_message = models.ContactMessage(
        **message_data
    )

    try:
        db.add(db_message)
        db.commit()
        db.refresh(db_message)

        return db_message

    except Exception:
        db.rollback()
        raise


def get_contact_messages(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    if not hasattr(
        models,
        "ContactMessage"
    ):
        return []

    return (
        db.query(models.ContactMessage)
        .order_by(
            models.ContactMessage.created_at.desc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_contact_message(
    db: Session,
    message_id: int
):
    if not hasattr(
        models,
        "ContactMessage"
    ):
        return None

    return (
        db.query(models.ContactMessage)
        .filter(
            models.ContactMessage.id == message_id
        )
        .first()
    )


def get_unread_messages(
    db: Session
):
    if not hasattr(
        models,
        "ContactMessage"
    ):
        return []

    return (
        db.query(models.ContactMessage)
        .filter(
            models.ContactMessage.is_read == False
        )
        .order_by(
            models.ContactMessage.created_at.desc()
        )
        .all()
    )


def mark_message_as_read(
    db: Session,
    message_id: int
):
    db_message = get_contact_message(
        db,
        message_id
    )

    if not db_message:
        return None

    db_message.is_read = True

    try:
        db.commit()
        db.refresh(db_message)

        return db_message

    except Exception:
        db.rollback()
        raise


def delete_contact_message(
    db: Session,
    message_id: int
) -> bool:

    db_message = get_contact_message(
        db,
        message_id
    )

    if not db_message:
        return False

    try:
        db.delete(db_message)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# CHARITY CRUD
# ==========================================

def get_charity_content(
    db: Session
):
    if not hasattr(
        models,
        "CharityContent"
    ):
        return None

    return (
        db.query(models.CharityContent)
        .first()
    )


def create_charity_content(
    db: Session,
    content: schemas.CharityContentCreate
):
    if not hasattr(
        models,
        "CharityContent"
    ):
        raise AttributeError(
            "CharityContent model is missing"
        )

    db_content = models.CharityContent(
        **content.model_dump()
    )

    try:
        db.add(db_content)
        db.commit()
        db.refresh(db_content)

        return db_content

    except Exception:
        db.rollback()
        raise


def update_charity_content(
    db: Session,
    content: schemas.CharityContentUpdate
):
    db_content = get_charity_content(db)

    if not db_content:
        return None

    update_data = content.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_content,
            key,
            value
        )

    if hasattr(
        db_content,
        "updated_at"
    ):
        db_content.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_content)

        return db_content

    except Exception:
        db.rollback()
        raise


# ==========================================
# CHARITY IMAGE CRUD
# ==========================================

def get_charity_images(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
):
    if not hasattr(
        models,
        "CharityImage",
    ):
        return []

    query = db.query(
        models.CharityImage
    )

    if active_only:
        query = query.filter(
            models.CharityImage.is_active == True
        )

    return (
        query
        .order_by(
            models.CharityImage.sort_order.asc(),
            models.CharityImage.created_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_charity_images(
    db: Session,
    skip: int = 0,
    limit: int = 200,
):
    return get_charity_images(
        db=db,
        skip=skip,
        limit=limit,
        active_only=False,
    )


def get_charity_image(
    db: Session,
    image_id: int,
):
    if not hasattr(
        models,
        "CharityImage",
    ):
        return None

    return (
        db.query(models.CharityImage)
        .filter(
            models.CharityImage.id == image_id
        )
        .first()
    )


def create_charity_image(
    db: Session,
    image: schemas.CharityImageCreate,
):
    if not hasattr(
        models,
        "CharityImage",
    ):
        raise AttributeError(
            "CharityImage model is missing"
        )

    db_image = models.CharityImage(
        **image.model_dump()
    )

    try:
        db.add(db_image)
        db.commit()
        db.refresh(db_image)

        return db_image

    except Exception:
        db.rollback()
        raise


def update_charity_image(
    db: Session,
    image_id: int,
    image_update: schemas.CharityImageUpdate,
):
    db_image = get_charity_image(
        db,
        image_id,
    )

    if not db_image:
        return None

    update_data = image_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_image,
            key,
            value,
        )

    if hasattr(
        db_image,
        "updated_at",
    ):
        db_image.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_image)

        return db_image

    except Exception:
        db.rollback()
        raise


def delete_charity_image(
    db: Session,
    image_id: int,
) -> bool:
    db_image = get_charity_image(
        db,
        image_id,
    )

    if not db_image:
        return False

    try:
        db.delete(db_image)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# SITE SETTINGS CRUD
# ==========================================

def get_site_settings(
    db: Session
):
    if not hasattr(
        models,
        "SiteSettings"
    ):
        return None

    return (
        db.query(models.SiteSettings)
        .first()
    )


def create_site_settings(
    db: Session,
    settings_data: schemas.SiteSettingsBase
):
    if not hasattr(
        models,
        "SiteSettings"
    ):
        raise AttributeError(
            "SiteSettings model is missing"
        )

    db_settings = models.SiteSettings(
        **settings_data.model_dump()
    )

    try:
        db.add(db_settings)
        db.commit()
        db.refresh(db_settings)

        return db_settings

    except Exception:
        db.rollback()
        raise


def update_site_settings(
    db: Session,
    settings_data: schemas.SiteSettingsUpdate
):
    db_settings = get_site_settings(db)

    if not db_settings:
        return None

    update_data = settings_data.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_settings,
            key,
            value
        )

    if hasattr(
        db_settings,
        "updated_at"
    ):
        db_settings.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_settings)

        return db_settings

    except Exception:
        db.rollback()
        raise


# ==========================================
# COURSE CATEGORY CRUD
# ==========================================

def get_course_categories(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    if not hasattr(
        models,
        "CourseCategory"
    ):
        return []

    return (
        db.query(models.CourseCategory)
        .order_by(
            models.CourseCategory.sort_order.asc()
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_course_categories(
    db: Session
):
    if not hasattr(
        models,
        "CourseCategory"
    ):
        return []

    return (
        db.query(models.CourseCategory)
        .order_by(
            models.CourseCategory.sort_order.asc()
        )
        .all()
    )


def get_course_category(
    db: Session,
    category_id: int
):
    if not hasattr(
        models,
        "CourseCategory"
    ):
        return None

    return (
        db.query(models.CourseCategory)
        .filter(
            models.CourseCategory.id == category_id
        )
        .first()
    )


def get_course_category_by_slug(
    db: Session,
    slug: str
):
    if not hasattr(
        models,
        "CourseCategory"
    ):
        return None

    return (
        db.query(models.CourseCategory)
        .filter(
            models.CourseCategory.slug == slug
        )
        .first()
    )


def create_course_category(
    db: Session,
    category: schemas.CourseCategoryCreate
):
    if not hasattr(
        models,
        "CourseCategory"
    ):
        raise AttributeError(
            "CourseCategory model is missing"
        )

    db_category = models.CourseCategory(
        **category.model_dump()
    )

    try:
        db.add(db_category)
        db.commit()
        db.refresh(db_category)

        return db_category

    except Exception:
        db.rollback()
        raise


def update_course_category(
    db: Session,
    category_id: int,
    category_update: schemas.CourseCategoryUpdate
):
    db_category = get_course_category(
        db,
        category_id
    )

    if not db_category:
        return None

    update_data = category_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_category,
            key,
            value
        )

    if hasattr(
        db_category,
        "updated_at"
    ):
        db_category.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_category)

        return db_category

    except Exception:
        db.rollback()
        raise


def delete_course_category(
    db: Session,
    category_id: int
) -> bool:

    db_category = get_course_category(
        db,
        category_id
    )

    if not db_category:
        return False

    # Delete all courses (and their enrollments)
    # that belong to this category, then delete
    # the category itself. This avoids needing
    # category_id to be nullable.
    courses = (
        db.query(models.Course)
        .filter(
            models.Course.category_id == category_id
        )
        .all()
    )

    for course in courses:
        # Delete enrollments for this course
        if hasattr(models, "Enrollment"):
            (
                db.query(models.Enrollment)
                .filter(
                    models.Enrollment.course_id == course.id
                )
                .delete(
                    synchronize_session=False
                )
            )

        db.delete(course)

    try:
        db.delete(db_category)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


def get_courses(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    is_active: bool = True,
    is_featured: Optional[bool] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
):
    query = db.query(models.Course)

    # Active filter
    if is_active is not None:
        query = query.filter(
            models.Course.is_active == is_active
        )

    # Category filter
    if category_id is not None:
        query = query.filter(
            models.Course.category_id == category_id
        )

    # Featured filter
    if is_featured is not None:
        query = query.filter(
            models.Course.is_featured == is_featured
        )

    # Status filter
    if status is not None:
        query = query.filter(
            models.Course.status == status
        )

    # Search
    if search:
        search = f"%{search}%"

        query = query.filter(
            or_(
                models.Course.title_en.ilike(search),
                models.Course.title_km.ilike(search),
                models.Course.description_en.ilike(search),
                models.Course.description_km.ilike(search),
                models.Course.short_description_en.ilike(search),
                models.Course.short_description_km.ilike(search),
            )
        )

    return (
        query.order_by(
            models.Course.sort_order.asc(),
            models.Course.created_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_courses(
    db: Session,
    skip: int = 0,
    limit: int = 100
):
    if not hasattr(models, "Course"):
        return []

    query = db.query(models.Course)

    if hasattr(models.Course, "sort_order"):
        query = query.order_by(
            models.Course.sort_order.asc()
        )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_featured_courses(
    db: Session,
    limit: int = 6
):
    if not hasattr(models, "Course"):
        return []

    query = (
        db.query(models.Course)
        .filter(
            models.Course.is_featured == True,
            models.Course.is_active == True
        )
    )

    if hasattr(models.Course, "sort_order"):
        query = query.order_by(
            models.Course.sort_order.asc()
        )

    return (
        query
        .limit(limit)
        .all()
    )


def get_popular_courses(
    db: Session,
    limit: int = 4
):
    return get_featured_courses(
        db,
        limit=limit
    )


def get_course(
    db: Session,
    course_id: int
):
    if not hasattr(models, "Course"):
        return None

    return (
        db.query(models.Course)
        .filter(
            models.Course.id == course_id
        )
        .first()
    )


def get_course_by_slug(
    db: Session,
    slug: str
):
    if not hasattr(models, "Course"):
        return None

    return (
        db.query(models.Course)
        .filter(
            models.Course.slug == slug
        )
        .first()
    )


def create_course(
    db: Session,
    course: schemas.CourseCreate
):
    if not hasattr(models, "Course"):
        raise AttributeError(
            "Course model is missing"
        )

    # Check category
    if course.category_id is not None:
        category = get_course_category(
            db,
            course.category_id
        )

        if not category:
            raise ValueError(
                "Course category not found"
            )

    # Check duplicate slug
    existing = get_course_by_slug(
        db,
        course.slug
    )

    if existing:
        raise ValueError(
            "Course slug already exists"
        )

    db_course = models.Course(
        **course.model_dump()
    )

    try:
        db.add(db_course)
        db.commit()
        db.refresh(db_course)

        return db_course

    except Exception:
        db.rollback()
        raise


def update_course(
    db: Session,
    course_id: int,
    course_update: schemas.CourseUpdate
):
    db_course = get_course(
        db,
        course_id
    )

    if not db_course:
        return None

    update_data = course_update.model_dump(
        exclude_unset=True
    )

    # Validate category when changed
    if (
        "category_id" in update_data
        and update_data["category_id"] is not None
    ):
        category = get_course_category(
            db,
            update_data["category_id"]
        )

        if not category:
            raise ValueError(
                "Course category not found"
            )

    # Validate slug when changed
    if "slug" in update_data:
        existing = get_course_by_slug(
            db,
            update_data["slug"]
        )

        if (
            existing
            and existing.id != course_id
        ):
            raise ValueError(
                "Course slug already exists"
            )

    for key, value in update_data.items():
        setattr(
            db_course,
            key,
            value
        )

    if hasattr(
        db_course,
        "updated_at"
    ):
        db_course.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_course)

        return db_course

    except Exception:
        db.rollback()
        raise


def delete_course(
    db: Session,
    course_id: int
) -> bool:

    db_course = get_course(
        db,
        course_id
    )

    if not db_course:
        return False

    # Prevent deletion when students are enrolled
    if hasattr(models, "Enrollment"):
        enrollment_count = (
            db.query(models.Enrollment)
            .filter(
                models.Enrollment.course_id == course_id
            )
            .count()
        )

        if enrollment_count > 0:
            raise ValueError(
                f"Cannot delete course. "
                f"This course contains "
                f"{enrollment_count} enrollment(s)."
            )

    try:
        db.delete(db_course)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# ENROLLMENT CRUD
# ==========================================

def get_enrollments(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    course_id: Optional[int] = None,
    status: Optional[str] = None
):
    if not hasattr(
        models,
        "Enrollment"
    ):
        return []

    query = db.query(
        models.Enrollment
    )

    if course_id is not None:
        query = query.filter(
            models.Enrollment.course_id == course_id
        )

    if status is not None:
        query = query.filter(
            models.Enrollment.status == status
        )

    if hasattr(
        models.Enrollment,
        "created_at"
    ):
        query = query.order_by(
            models.Enrollment.created_at.desc()
        )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_enrollment(
    db: Session,
    enrollment_id: int
):
    if not hasattr(
        models,
        "Enrollment"
    ):
        return None

    return (
        db.query(models.Enrollment)
        .filter(
            models.Enrollment.id == enrollment_id
        )
        .first()
    )


def create_enrollment(
    db: Session,
    enrollment: schemas.EnrollmentCreate
):
    if not hasattr(
        models,
        "Enrollment"
    ):
        raise AttributeError(
            "Enrollment model is missing"
        )

    # Check course
    course = get_course(
        db,
        enrollment.course_id
    )

    if not course:
        raise ValueError(
            "Course not found"
        )

    if (
        hasattr(course, "is_active")
        and not course.is_active
    ):
        raise ValueError(
            "This course is currently unavailable"
        )

    enrollment_data = enrollment.model_dump(exclude={"hp_trap"})

    db_enrollment = models.Enrollment(
        **enrollment_data
    )

    if not getattr(
        db_enrollment,
        "status",
        None
    ):
        db_enrollment.status = "pending"

    try:
        db.add(db_enrollment)
        db.commit()
        db.refresh(db_enrollment)

        return db_enrollment

    except Exception:
        db.rollback()
        raise


def update_enrollment(
    db: Session,
    enrollment_id: int,
    enrollment_update: schemas.EnrollmentUpdate
):
    db_enrollment = get_enrollment(
        db,
        enrollment_id
    )

    if not db_enrollment:
        return None

    update_data = enrollment_update.model_dump(
        exclude_unset=True
    )

    if "course_id" in update_data:
        course = get_course(
            db,
            update_data["course_id"]
        )

        if not course:
            raise ValueError(
                "Course not found"
            )

    for key, value in update_data.items():
        setattr(
            db_enrollment,
            key,
            value
        )

    if hasattr(
        db_enrollment,
        "updated_at"
    ):
        db_enrollment.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_enrollment)

        return db_enrollment

    except Exception:
        db.rollback()
        raise


def delete_enrollment(
    db: Session,
    enrollment_id: int
) -> bool:

    db_enrollment = get_enrollment(
        db,
        enrollment_id
    )

    if not db_enrollment:
        return False

    try:
        db.delete(db_enrollment)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# TESTIMONIAL CRUD
# ==========================================

def get_testimonials(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True
):
    if not hasattr(
        models,
        "Testimonial"
    ):
        return []

    query = db.query(
        models.Testimonial
    )

    if active_only:
        query = query.filter(
            models.Testimonial.is_active == True
        )

    query = query.order_by(
        models.Testimonial.sort_order.asc()
    )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_testimonial(
    db: Session,
    testimonial_id: int
):
    if not hasattr(
        models,
        "Testimonial"
    ):
        return None

    return (
        db.query(models.Testimonial)
        .filter(
            models.Testimonial.id == testimonial_id
        )
        .first()
    )


def create_testimonial(
    db: Session,
    testimonial: schemas.TestimonialCreate
):
    if not hasattr(
        models,
        "Testimonial"
    ):
        raise AttributeError(
            "Testimonial model is missing"
        )

    db_testimonial = models.Testimonial(
        **testimonial.model_dump()
    )

    try:
        db.add(db_testimonial)
        db.commit()
        db.refresh(db_testimonial)

        return db_testimonial

    except Exception:
        db.rollback()
        raise


def update_testimonial(
    db: Session,
    testimonial_id: int,
    testimonial_update: schemas.TestimonialUpdate
):
    db_testimonial = get_testimonial(
        db,
        testimonial_id
    )

    if not db_testimonial:
        return None

    update_data = testimonial_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_testimonial,
            key,
            value
        )

    try:
        db.commit()
        db.refresh(db_testimonial)

        return db_testimonial

    except Exception:
        db.rollback()
        raise


def delete_testimonial(
    db: Session,
    testimonial_id: int
) -> bool:

    db_testimonial = get_testimonial(
        db,
        testimonial_id
    )

    if not db_testimonial:
        return False

    try:
        db.delete(db_testimonial)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# SCHOOL CRUD
# ==========================================

def get_schools(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
    search: Optional[str] = None
):
    if not hasattr(
        models,
        "School"
    ):
        return []

    query = db.query(models.School)

    if active_only:
        query = query.filter(
            models.School.is_active == True
        )

    if search:
        search_term = f"%{search}%"

        query = query.filter(
            or_(
                models.School.name_en.ilike(
                    search_term
                ),
                models.School.name_km.ilike(
                    search_term
                ),
                models.School.tag_en.ilike(
                    search_term
                ),
                models.School.tag_km.ilike(
                    search_term
                ),
                models.School.description_en.ilike(
                    search_term
                ),
                models.School.description_km.ilike(
                    search_term
                )
            )
        )

    query = query.order_by(
        models.School.sort_order.asc()
    )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_schools(
    db: Session
):
    if not hasattr(
        models,
        "School"
    ):
        return []

    return (
        db.query(models.School)
        .order_by(
            models.School.sort_order.asc()
        )
        .all()
    )


def get_school(
    db: Session,
    school_id: int
):
    if not hasattr(
        models,
        "School"
    ):
        return None

    return (
        db.query(models.School)
        .filter(
            models.School.id == school_id
        )
        .first()
    )


def create_school(
    db: Session,
    school: schemas.SchoolCreate
):
    if not hasattr(
        models,
        "School"
    ):
        raise AttributeError(
            "School model is missing"
        )

    db_school = models.School(
        **school.model_dump()
    )

    try:
        db.add(db_school)
        db.commit()
        db.refresh(db_school)

        return db_school

    except Exception:
        db.rollback()
        raise


def update_school(
    db: Session,
    school_id: int,
    school_update: schemas.SchoolUpdate
):
    db_school = get_school(
        db,
        school_id
    )

    if not db_school:
        return None

    update_data = school_update.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            db_school,
            key,
            value
        )

    if hasattr(
        db_school,
        "updated_at"
    ):
        db_school.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_school)

        return db_school

    except Exception:
        db.rollback()
        raise


def delete_school(
    db: Session,
    school_id: int
) -> bool:

    db_school = get_school(
        db,
        school_id
    )

    if not db_school:
        return False

    try:
        db.delete(db_school)
        db.commit()

        return True

    except Exception:
        db.rollback()
        raise


# ==========================================
# ALUMNI CRUD
# ==========================================

def get_alumni_list(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    active_only: bool = True,
):
    if not hasattr(models, "Alumni"):
        return []

    query = db.query(models.Alumni)

    if active_only:
        query = query.filter(models.Alumni.is_active == True)

    return (
        query
        .order_by(
            models.Alumni.sort_order.asc(),
            models.Alumni.created_at.desc(),
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_all_alumni(
    db: Session,
    skip: int = 0,
    limit: int = 100,
):
    return get_alumni_list(
        db=db,
        skip=skip,
        limit=limit,
        active_only=False,
    )


def get_featured_alumni(
    db: Session,
    limit: int = 6,
):
    if not hasattr(models, "Alumni"):
        return []

    return (
        db.query(models.Alumni)
        .filter(
            models.Alumni.is_active == True,
            models.Alumni.is_featured == True,
        )
        .order_by(
            models.Alumni.sort_order.asc(),
            models.Alumni.created_at.desc(),
        )
        .limit(limit)
        .all()
    )


def get_alumni(
    db: Session,
    alumni_id: int,
):
    if not hasattr(models, "Alumni"):
        return None

    return (
        db.query(models.Alumni)
        .filter(models.Alumni.id == alumni_id)
        .first()
    )


def create_alumni(
    db: Session,
    alumni: schemas.AlumniCreate,
):
    if not hasattr(models, "Alumni"):
        raise AttributeError("Alumni model is missing")

    db_alumni = models.Alumni(**alumni.model_dump())

    try:
        db.add(db_alumni)
        db.commit()
        db.refresh(db_alumni)
        return db_alumni
    except Exception:
        db.rollback()
        raise


def update_alumni(
    db: Session,
    alumni_id: int,
    alumni_update: schemas.AlumniUpdate,
):
    db_alumni = get_alumni(db, alumni_id)

    if not db_alumni:
        return None

    update_data = alumni_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_alumni, key, value)

    if hasattr(db_alumni, "updated_at"):
        db_alumni.updated_at = datetime.utcnow()

    try:
        db.commit()
        db.refresh(db_alumni)
        return db_alumni
    except Exception:
        db.rollback()
        raise


def delete_alumni(
    db: Session,
    alumni_id: int,
) -> bool:
    db_alumni = get_alumni(db, alumni_id)

    if not db_alumni:
        return False

    try:
        db.delete(db_alumni)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise