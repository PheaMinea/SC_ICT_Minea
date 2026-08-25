from datetime import datetime
import enum

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from .db.database import Base


# ============================================================
# 1. ADMINS
# ============================================================

class AdminRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    EDITOR = "editor"


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)

    username = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(50),
        nullable=False,
        default="super_admin",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 2. COURSE CATEGORIES
# ============================================================

class CourseCategory(Base):
    __tablename__ = "course_categories"

    id = Column(Integer, primary_key=True, index=True)

    # English
    name_en = Column(
        String(150),
        nullable=False,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    # Khmer
    name_km = Column(
        String(150),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    # URL
    slug = Column(
        String(200),
        unique=True,
        nullable=False,
        index=True,
    )

    # Settings
    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # Relationships
    courses = relationship(
        "Course",
        back_populates="category",
    )


# ============================================================
# 3. COURSES
# ============================================================

class Course(Base):
    __tablename__ = "courses"

    id = Column(Integer, primary_key=True, index=True)

    # ========================================================
    # FOREIGN KEY
    # ========================================================

    category_id = Column(
        Integer,
        ForeignKey("course_categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    # ========================================================
    # ENGLISH CONTENT
    # ========================================================

    title_en = Column(
        String(255),
        nullable=False,
    )

    short_description_en = Column(
        String(500),
        nullable=True,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    duration_en = Column(
        String(100),
        nullable=True,
    )

    level_en = Column(
        String(100),
        nullable=True,
    )

    # ========================================================
    # KHMER CONTENT
    # ========================================================

    title_km = Column(
        String(255),
        nullable=True,
    )

    short_description_km = Column(
        String(500),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    duration_km = Column(
        String(100),
        nullable=True,
    )

    level_km = Column(
        String(100),
        nullable=True,
    )

    # ========================================================
    # BASIC INFORMATION
    # ========================================================

    slug = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    image_url = Column(
        String(500),
        nullable=True,
    )

    price = Column(
        Numeric(10, 2),
        nullable=True,
        default=0.00,
    )

    # ========================================================
    # COURSE DETAIL - ENGLISH
    # ========================================================

    what_you_learn_en = Column(
        Text,
        nullable=True,
    )

    requirements_en = Column(
        Text,
        nullable=True,
    )

    target_students_en = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # COURSE DETAIL - KHMER
    # ========================================================

    what_you_learn_km = Column(
        Text,
        nullable=True,
    )

    requirements_km = Column(
        Text,
        nullable=True,
    )

    target_students_km = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # SETTINGS
    # ========================================================

    certificate = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    language = Column(
        String(100),
        nullable=True,
    )

    schedule = Column(
        String(255),
        nullable=True,
    )

    status = Column(
        Enum(
            "available",
            "in_progress",
            "coming_soon",
            name="course_status_enum",
        ),
        nullable=False,
        default="available",
        index=True,
    )

    is_featured = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    category = relationship(
        "CourseCategory",
        back_populates="courses",
    )

    enrollments = relationship(
        "Enrollment",
        back_populates="course",
    )


# ============================================================
# 4. ENROLLMENTS
# ============================================================

class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)

    # ========================================================
    # COURSE
    # ========================================================

    course_id = Column(
        Integer,
        ForeignKey("courses.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    # ========================================================
    # PERSONAL INFORMATION
    # ========================================================

    khmer_name = Column(
        String(150),
        nullable=False,
    )

    english_name = Column(
        String(150),
        nullable=False,
    )

    gender = Column(
        Enum(
            "male",
            "female",
            "other",
            name="gender_enum",
        ),
        nullable=False,
    )

    date_of_birth = Column(
        Date,
        nullable=True,
    )

    nationality = Column(
        String(100),
        nullable=True,
    )

    religion = Column(
        String(100),
        nullable=True,
    )

    # ========================================================
    # NATIONAL ID
    # ========================================================

    national_id = Column(
        String(100),
        nullable=True,
    )

    id_issued_date = Column(
        Date,
        nullable=True,
    )

    id_expiry_date = Column(
        Date,
        nullable=True,
    )

    # ========================================================
    # ADDRESS
    # ========================================================

    house_no = Column(
        String(50),
        nullable=True,
    )

    village = Column(
        String(100),
        nullable=True,
    )

    commune = Column(
        String(100),
        nullable=True,
    )

    district = Column(
        String(100),
        nullable=True,
    )

    province = Column(
        String(100),
        nullable=True,
    )

    # ========================================================
    # CONTACT
    # ========================================================

    phone = Column(
        String(50),
        nullable=False,
        index=True,
    )

    email = Column(
        String(150),
        nullable=True,
    )

    # ========================================================
    # EDUCATION / WORK
    # ========================================================

    occupation = Column(
        String(150),
        nullable=True,
    )

    school_name = Column(
        String(255),
        nullable=True,
    )

    education_level = Column(
        String(100),
        nullable=True,
    )

    # ========================================================
    # ENROLLMENT INFORMATION
    # ========================================================

    preferred_schedule = Column(
        String(255),
        nullable=True,
    )

    how_did_you_know_us = Column(
        String(150),
        nullable=True,
    )

    note = Column(
        Text,
        nullable=True,
    )

    status = Column(
        Enum(
            "pending",
            "approved",
            "rejected",
            "completed",
            name="enrollment_status_enum",
        ),
        nullable=False,
        default="pending",
        index=True,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )

    # ========================================================
    # RELATIONSHIPS
    # ========================================================

    course = relationship(
        "Course",
        back_populates="enrollments",
    )


# ============================================================
# 5. GALLERY IMAGES
# ============================================================

class GalleryImage(Base):
    __tablename__ = "gallery_images"

    id = Column(Integer, primary_key=True, index=True)

    # English
    title_en = Column(
        String(255),
        nullable=True,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    category_en = Column(
        String(100),
        nullable=True,
    )

    # Khmer
    title_km = Column(
        String(255),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    category_km = Column(
        String(100),
        nullable=True,
    )

    # Image
    image_url = Column(
        String(500),
        nullable=False,
    )

    # Settings
    is_featured = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 6. VIDEOS
# ============================================================

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)

    # English
    title_en = Column(
        String(255),
        nullable=False,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    category_en = Column(
        String(100),
        nullable=True,
    )

    # Khmer
    title_km = Column(
        String(255),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    category_km = Column(
        String(100),
        nullable=True,
    )

    # Media
    video_url = Column(
        String(500),
        nullable=False,
    )

    thumbnail_url = Column(
        String(500),
        nullable=True,
    )

    # Publish
    published_at = Column(
        DateTime,
        nullable=True,
        index=True,
    )

    # Analytics
    views = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Settings
    is_featured = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 7. TESTIMONIALS
# ============================================================

class Testimonial(Base):
    __tablename__ = "testimonials"

    __table_args__ = (
        CheckConstraint(
            "rating >= 1 AND rating <= 5",
            name="chk_testimonials_rating",
        ),
    )

    id = Column(Integer, primary_key=True, index=True)

    # Student
    name = Column(
        String(150),
        nullable=False,
    )

    # English
    role_en = Column(
        String(255),
        nullable=True,
    )

    content_en = Column(
        Text,
        nullable=True,
    )

    # Khmer
    role_km = Column(
        String(255),
        nullable=True,
    )

    content_km = Column(
        Text,
        nullable=True,
    )

    # Profile
    avatar_url = Column(
        String(500),
        nullable=True,
    )

    # Rating
    rating = Column(
        Integer,
        nullable=False,
        default=5,
    )

    # Settings
    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 8. ALUMNI
# ============================================================

class Alumni(Base):
    __tablename__ = "alumni"

    id = Column(Integer, primary_key=True, index=True)

    # English
    name_en = Column(
        String(150),
        nullable=False,
    )

    role_en = Column(
        String(255),
        nullable=True,
    )

    company_en = Column(
        String(255),
        nullable=True,
    )

    story_en = Column(
        Text,
        nullable=True,
    )

    # Khmer
    name_km = Column(
        String(150),
        nullable=True,
    )

    role_km = Column(
        String(255),
        nullable=True,
    )

    company_km = Column(
        String(255),
        nullable=True,
    )

    story_km = Column(
        Text,
        nullable=True,
    )

    # Media
    image_url = Column(
        String(500),
        nullable=True,
    )

    # Graduation
    graduation_year = Column(
        Integer,
        nullable=True,
        index=True,
    )

    # Settings
    is_featured = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 9. SCHOOLS
# ============================================================

class School(Base):
    __tablename__ = "schools"

    id = Column(Integer, primary_key=True, index=True)

    # English
    name_en = Column(
        String(255),
        nullable=False,
    )

    tag_en = Column(
        String(100),
        nullable=True,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    features_en = Column(
        Text,
        nullable=True,
    )

    # Khmer
    name_km = Column(
        String(255),
        nullable=True,
    )

    tag_km = Column(
        String(100),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    features_km = Column(
        Text,
        nullable=True,
    )

    # Common
    acronym = Column(
        String(50),
        nullable=True,
    )

    image_url = Column(
        String(500),
        nullable=True,
    )

    # Settings
    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 10. CHARITY CONTENT
# ============================================================

class CharityContent(Base):
    __tablename__ = "charity_content"

    id = Column(Integer, primary_key=True, index=True)

    # ========================================================
    # HERO - ENGLISH
    # ========================================================

    hero_title_en = Column(
        String(255),
        nullable=True,
    )

    hero_description_en = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # HERO - KHMER
    # ========================================================

    hero_title_km = Column(
        String(255),
        nullable=True,
    )

    hero_description_km = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # IMPACT - ENGLISH
    # ========================================================

    impact_title_en = Column(
        String(255),
        nullable=True,
    )

    impact_description_en = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # IMPACT - KHMER
    # ========================================================

    impact_title_km = Column(
        String(255),
        nullable=True,
    )

    impact_description_km = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # SUPPORT - ENGLISH
    # ========================================================

    support_title_en = Column(
        String(255),
        nullable=True,
    )

    support_description_en = Column(
        Text,
        nullable=True,
    )

    support_options_en = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # SUPPORT - KHMER
    # ========================================================

    support_title_km = Column(
        String(255),
        nullable=True,
    )

    support_description_km = Column(
        Text,
        nullable=True,
    )

    support_options_km = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # CTA - ENGLISH
    # ========================================================

    cta_title_en = Column(
        String(255),
        nullable=True,
    )

    cta_description_en = Column(
        Text,
        nullable=True,
    )

    # ========================================================
    # CTA - KHMER
    # ========================================================

    cta_title_km = Column(
        String(255),
        nullable=True,
    )

    cta_description_km = Column(
        Text,
        nullable=True,
    )

    # Settings
    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 11. CHARITY IMAGES
# ============================================================

class CharityImage(Base):
    __tablename__ = "charity_images"

    id = Column(Integer, primary_key=True, index=True)

    # English
    title_en = Column(
        String(255),
        nullable=True,
    )

    description_en = Column(
        Text,
        nullable=True,
    )

    # Khmer
    title_km = Column(
        String(255),
        nullable=True,
    )

    description_km = Column(
        Text,
        nullable=True,
    )

    # Image
    image_url = Column(
        String(500),
        nullable=False,
    )

    # Settings
    sort_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
    )

    # Timestamps
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 12. CONTACT MESSAGES
# ============================================================

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)

    # Sender Information
    name = Column(
        String(150),
        nullable=False,
    )

    email = Column(
        String(150),
        nullable=False,
    )

    phone = Column(
        String(50),
        nullable=True,
    )

    # Message
    subject = Column(
        String(255),
        nullable=True,
    )

    message = Column(
        Text,
        nullable=False,
    )

    # Status
    is_read = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    is_replied = Column(
        Boolean,
        nullable=False,
        default=False,
        index=True,
    )

    # Timestamp
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        index=True,
    )


# ============================================================
# 13. SITE SETTINGS
# ============================================================

class SiteSettings(Base):
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, index=True)

    # ========================================================
    # ENGLISH
    # ========================================================

    site_name_en = Column(
        String(255),
        nullable=True,
    )

    site_description_en = Column(
        Text,
        nullable=True,
    )

    address_en = Column(
        String(255),
        nullable=True,
    )

    # ========================================================
    # KHMER
    # ========================================================

    site_name_km = Column(
        String(255),
        nullable=True,
    )

    site_description_km = Column(
        Text,
        nullable=True,
    )

    address_km = Column(
        String(255),
        nullable=True,
    )

    # ========================================================
    # BRANDING
    # ========================================================

    logo_url = Column(
        String(500),
        nullable=True,
    )

    favicon_url = Column(
        String(500),
        nullable=True,
    )

    # ========================================================
    # CONTACT
    # ========================================================

    phone = Column(
        String(50),
        nullable=True,
    )

    email = Column(
        String(150),
        nullable=True,
    )

    # ========================================================
    # SOCIAL MEDIA
    # ========================================================

    facebook_url = Column(
        String(500),
        nullable=True,
    )

    telegram_url = Column(
        String(500),
        nullable=True,
    )

    youtube_url = Column(
        String(500),
        nullable=True,
    )

    # ========================================================
    # LOCATION
    # ========================================================

    google_map_url = Column(
        String(500),
        nullable=True,
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )


# ============================================================
# 13. REVOKED TOKENS (JWT BLACKLIST)
# ============================================================

class RevokedToken(Base):
    __tablename__ = "revoked_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(500), unique=True, index=True, nullable=False)
    revoked_at = Column(DateTime, nullable=False, default=datetime.utcnow)