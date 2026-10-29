from datetime import date, datetime
from decimal import Decimal
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field


# ============================================================
# COMMON RESPONSE
# ============================================================

class ResponseMessage(BaseModel):
    message: str
    success: bool = True


# ============================================================
# TOKEN
# ============================================================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None


# ============================================================
# 1. ADMIN
# ============================================================

class AdminBase(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=50,
    )

    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str = Field(
        default="editor",
        description="Role: super_admin or editor",
    )


class AdminCreate(AdminBase):
    password: str = Field(
        ...,
        min_length=8,
        max_length=72,
    )


class AdminUpdate(BaseModel):
    username: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=50,
    )

    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

    password: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=72,
    )

    role: Optional[str] = None

    is_active: Optional[bool] = None


class AdminProfileUpdate(BaseModel):
    username: Optional[str] = Field(
        default=None,
        min_length=3,
        max_length=50,
    )
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None


class AdminChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(
        ...,
        min_length=8,
        max_length=72,
    )
    confirm_password: str


class AdminLogin(BaseModel):
    username: str
    password: str


class Admin(AdminBase):
    id: int

    is_active: bool

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 2. COURSE CATEGORY
# ============================================================

class CourseCategoryBase(BaseModel):

    # English
    name_en: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    description_en: Optional[str] = None

    # Khmer
    name_km: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    description_km: Optional[str] = None

    # URL
    slug: str = Field(
        ...,
        min_length=2,
        max_length=200,
    )

    # Settings
    is_active: bool = True
    sort_order: int = 0


class CourseCategoryCreate(CourseCategoryBase):
    pass


class CourseCategoryUpdate(BaseModel):

    name_en: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description_en: Optional[str] = None

    name_km: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    description_km: Optional[str] = None

    slug: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=200,
    )

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None


class CourseCategory(CourseCategoryBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 3. COURSE
# ============================================================

CourseStatus = Literal[
    "available",
    "in_progress",
    "coming_soon",
]


class CourseBase(BaseModel):

    # ========================================================
    # ENGLISH
    # ========================================================

    title_en: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    short_description_en: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    description_en: Optional[str] = None

    duration_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    level_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # ========================================================
    # KHMER
    # ========================================================

    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    short_description_km: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    description_km: Optional[str] = None

    duration_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    level_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # ========================================================
    # BASIC INFORMATION
    # ========================================================

    slug: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    price: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    # ========================================================
    # COURSE DETAIL - ENGLISH
    # ========================================================

    what_you_learn_en: Optional[str] = None

    requirements_en: Optional[str] = None

    target_students_en: Optional[str] = None

    # ========================================================
    # COURSE DETAIL - KHMER
    # ========================================================

    what_you_learn_km: Optional[str] = None

    requirements_km: Optional[str] = None

    target_students_km: Optional[str] = None

    # ========================================================
    # SETTINGS
    # ========================================================

    certificate: bool = True

    language: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    schedule: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    status: CourseStatus = "available"

    is_featured: bool = False

    is_active: bool = True

    sort_order: int = 0

    # Foreign Key
    category_id: Optional[int] = None


class CourseCreate(CourseBase):
    pass


class CourseUpdate(BaseModel):

    # English
    title_en: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    short_description_en: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    description_en: Optional[str] = None

    duration_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    level_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Khmer
    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    short_description_km: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    description_km: Optional[str] = None

    duration_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    level_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Basic
    slug: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    price: Optional[Decimal] = Field(
        default=None,
        ge=0,
        max_digits=10,
        decimal_places=2,
    )

    # Detail English
    what_you_learn_en: Optional[str] = None

    requirements_en: Optional[str] = None

    target_students_en: Optional[str] = None

    # Detail Khmer
    what_you_learn_km: Optional[str] = None

    requirements_km: Optional[str] = None

    target_students_km: Optional[str] = None

    # Settings
    certificate: Optional[bool] = None

    language: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    schedule: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    status: Optional[CourseStatus] = None

    is_featured: Optional[bool] = None

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None

    category_id: Optional[int] = None


class Course(CourseBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# COURSE FOR ENROLLMENT RESPONSE
# ============================================================

class EnrollmentCourse(BaseModel):
    id: int

    title_en: str
    title_km: Optional[str] = None

    slug: str

    image_url: Optional[str] = None

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 4. ENROLLMENT
# ============================================================

EnrollmentStatus = Literal[
    "pending",
    "approved",
    "rejected",
    "completed",
]

GenderType = Literal[
    "male",
    "female",
    "other",
]


class EnrollmentBase(BaseModel):

    # ========================================================
    # COURSE
    # ========================================================

    course_id: int

    # ========================================================
    # PERSONAL INFORMATION
    # ========================================================

    khmer_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    english_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    gender: GenderType

    date_of_birth: Optional[date] = None

    nationality: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    religion: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # ========================================================
    # NATIONAL ID
    # ========================================================

    national_id: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    id_issued_date: Optional[date] = None

    id_expiry_date: Optional[date] = None

    # ========================================================
    # ADDRESS
    # ========================================================

    house_no: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    village: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    commune: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    district: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    province: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # ========================================================
    # CONTACT
    # ========================================================

    phone: str = Field(
        ...,
        min_length=8,
        max_length=50,
    )

    email: Optional[EmailStr] = None

    # ========================================================
    # EDUCATION / WORK
    # ========================================================

    occupation: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    school_name: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    education_level: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # ========================================================
    # ENROLLMENT INFORMATION
    # ========================================================

    preferred_schedule: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    how_did_you_know_us: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    note: Optional[str] = None


class EnrollmentCreate(EnrollmentBase):
    hp_trap: Optional[str] = None


class EnrollmentUpdate(BaseModel):

    course_id: Optional[int] = None

    khmer_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    english_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    gender: Optional[GenderType] = None

    date_of_birth: Optional[date] = None

    nationality: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    religion: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    national_id: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    id_issued_date: Optional[date] = None

    id_expiry_date: Optional[date] = None

    house_no: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    village: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    commune: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    district: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    province: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    phone: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=50,
    )

    email: Optional[EmailStr] = None

    occupation: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    school_name: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    education_level: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    preferred_schedule: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    how_did_you_know_us: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    note: Optional[str] = None

    status: Optional[EnrollmentStatus] = None


class Enrollment(EnrollmentBase):
    id: int

    status: EnrollmentStatus

    course: Optional[EnrollmentCourse] = None

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 5. GALLERY IMAGE
# ============================================================

class GalleryImageBase(BaseModel):

    # English
    title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_en: Optional[str] = None

    category_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Khmer
    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    category_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Image
    image_url: str = Field(
        ...,
        max_length=500,
    )

    # Settings
    is_featured: bool = False

    is_active: bool = True

    sort_order: int = 0


class GalleryImageCreate(GalleryImageBase):
    pass


class GalleryImageUpdate(BaseModel):

    title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_en: Optional[str] = None

    category_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    category_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    is_featured: Optional[bool] = None

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None


class GalleryImage(GalleryImageBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 6. VIDEO
# ============================================================

class VideoBase(BaseModel):

    # English
    title_en: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    description_en: Optional[str] = None

    category_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Khmer
    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    category_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    # Media
    video_url: str = Field(
        ...,
        max_length=500,
    )

    thumbnail_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # Publish
    published_at: Optional[datetime] = None

    # Settings
    is_featured: bool = False

    is_active: bool = True


class VideoCreate(VideoBase):
    pass


class VideoUpdate(BaseModel):

    title_en: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    description_en: Optional[str] = None

    category_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    category_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    video_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    thumbnail_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    published_at: Optional[datetime] = None

    is_featured: Optional[bool] = None

    is_active: Optional[bool] = None


class Video(VideoBase):
    id: int

    views: int = 0

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 7. TESTIMONIAL
# ============================================================

class TestimonialBase(BaseModel):

    # Student
    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    # English
    role_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    content_en: Optional[str] = None

    # Khmer
    role_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    content_km: Optional[str] = None

    # Profile
    avatar_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # Rating
    rating: int = Field(
        default=5,
        ge=1,
        le=5,
    )

    # Settings
    is_active: bool = True

    sort_order: int = 0


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):

    name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    role_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    content_en: Optional[str] = None

    role_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    content_km: Optional[str] = None

    avatar_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    rating: Optional[int] = Field(
        default=None,
        ge=1,
        le=5,
    )

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None


class Testimonial(TestimonialBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 8. ALUMNI
# ============================================================

class AlumniBase(BaseModel):

    # English
    name_en: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    role_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    company_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    story_en: Optional[str] = None

    # Khmer
    name_km: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    role_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    company_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    story_km: Optional[str] = None

    # Media
    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # Graduation
    graduation_year: Optional[int] = Field(
        default=None,
        ge=1900,
        le=2200,
    )

    # Settings
    is_featured: bool = False

    is_active: bool = True

    sort_order: int = 0


class AlumniCreate(AlumniBase):
    pass


class AlumniUpdate(BaseModel):

    name_en: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    role_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    company_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    story_en: Optional[str] = None

    name_km: Optional[str] = Field(
        default=None,
        max_length=150,
    )

    role_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    company_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    story_km: Optional[str] = None

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    graduation_year: Optional[int] = Field(
        default=None,
        ge=1900,
        le=2200,
    )

    is_featured: Optional[bool] = None

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None


class Alumni(AlumniBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 9. SCHOOL
# ============================================================

class SchoolBase(BaseModel):

    # English
    name_en: str = Field(
        ...,
        min_length=2,
        max_length=255,
    )

    tag_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    description_en: Optional[str] = None

    features_en: Optional[str] = None

    # Khmer
    name_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    tag_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    description_km: Optional[str] = None

    features_km: Optional[str] = None

    # Common
    acronym: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # Settings
    is_active: bool = True

    sort_order: int = 0


class SchoolCreate(SchoolBase):
    pass


class SchoolUpdate(BaseModel):

    name_en: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=255,
    )

    tag_en: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    description_en: Optional[str] = None

    features_en: Optional[str] = None

    name_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    tag_km: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    description_km: Optional[str] = None

    features_km: Optional[str] = None

    acronym: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    is_active: Optional[bool] = None

    sort_order: Optional[int] = None


class School(SchoolBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 10. CHARITY CONTENT
# ============================================================

class CharityContentBase(BaseModel):

    # ========================================================
    # HERO
    # ========================================================

    hero_title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    hero_description_en: Optional[str] = None

    hero_title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    hero_description_km: Optional[str] = None

    # ========================================================
    # IMPACT
    # ========================================================

    impact_title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    impact_description_en: Optional[str] = None

    impact_title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    impact_description_km: Optional[str] = None

    # ========================================================
    # SUPPORT
    # ========================================================

    support_title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    support_description_en: Optional[str] = None

    support_options_en: Optional[str] = None

    support_title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    support_description_km: Optional[str] = None

    support_options_km: Optional[str] = None

    # ========================================================
    # CTA
    # ========================================================

    cta_title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    cta_description_en: Optional[str] = None

    cta_title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    cta_description_km: Optional[str] = None

    # Settings
    is_active: bool = True


class CharityContentCreate(CharityContentBase):
    pass


class CharityContentUpdate(BaseModel):

    hero_title_en: Optional[str] = None
    hero_description_en: Optional[str] = None

    hero_title_km: Optional[str] = None
    hero_description_km: Optional[str] = None

    impact_title_en: Optional[str] = None
    impact_description_en: Optional[str] = None

    impact_title_km: Optional[str] = None
    impact_description_km: Optional[str] = None

    support_title_en: Optional[str] = None
    support_description_en: Optional[str] = None
    support_options_en: Optional[str] = None

    support_title_km: Optional[str] = None
    support_description_km: Optional[str] = None
    support_options_km: Optional[str] = None

    cta_title_en: Optional[str] = None
    cta_description_en: Optional[str] = None

    cta_title_km: Optional[str] = None
    cta_description_km: Optional[str] = None

    is_active: Optional[bool] = None


class CharityContent(CharityContentBase):
    id: int

    created_at: Optional[datetime] = None
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 11. CHARITY IMAGE
# ============================================================

class CharityImageBase(BaseModel):

    # English
    title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_en: Optional[str] = None

    # Khmer
    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    # Image
    image_url: str = Field(
        ...,
        max_length=500,
    )

    # Settings
    sort_order: int = 0

    is_active: bool = True


class CharityImageCreate(CharityImageBase):
    pass


class CharityImageUpdate(BaseModel):

    title_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_en: Optional[str] = None

    title_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    description_km: Optional[str] = None

    image_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    sort_order: Optional[int] = None

    is_active: Optional[bool] = None


class CharityImage(CharityImageBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 12. CONTACT MESSAGE
# ============================================================

class ContactMessageBase(BaseModel):

    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    phone: Optional[str] = Field(
        default=None,
        min_length=8,
        max_length=50,
    )

    subject: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    message: str = Field(
        ...,
        min_length=5,
        max_length=5000,
    )


class ContactMessageCreate(ContactMessageBase):
    hp_trap: Optional[str] = None


class ContactMessageUpdate(BaseModel):

    is_read: Optional[bool] = None

    is_replied: Optional[bool] = None


class ContactMessage(ContactMessageBase):
    id: int

    is_read: bool

    is_replied: bool

    created_at: datetime

    model_config = {
        "from_attributes": True
    }


# ============================================================
# 13. SITE SETTINGS
# ============================================================

class SiteSettingsBase(BaseModel):

    # ========================================================
    # ENGLISH
    # ========================================================

    site_name_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    site_description_en: Optional[str] = None

    address_en: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    # ========================================================
    # KHMER
    # ========================================================

    site_name_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    site_description_km: Optional[str] = None

    address_km: Optional[str] = Field(
        default=None,
        max_length=255,
    )

    # ========================================================
    # BRANDING
    # ========================================================

    logo_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    favicon_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # ========================================================
    # CONTACT
    # ========================================================

    phone: Optional[str] = Field(
        default=None,
        max_length=50,
    )

    email: Optional[EmailStr] = None

    # ========================================================
    # SOCIAL MEDIA
    # ========================================================

    facebook_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    telegram_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    youtube_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )

    # ========================================================
    # LOCATION
    # ========================================================

    google_map_url: Optional[str] = Field(
        default=None,
        max_length=500,
    )


class SiteSettingsCreate(SiteSettingsBase):
    pass


class SiteSettingsUpdate(BaseModel):

    site_name_en: Optional[str] = None
    site_description_en: Optional[str] = None
    address_en: Optional[str] = None

    site_name_km: Optional[str] = None
    site_description_km: Optional[str] = None
    address_km: Optional[str] = None

    logo_url: Optional[str] = None
    favicon_url: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    facebook_url: Optional[str] = None
    telegram_url: Optional[str] = None
    youtube_url: Optional[str] = None

    google_map_url: Optional[str] = None


class SiteSettings(SiteSettingsBase):
    id: int

    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True
    }