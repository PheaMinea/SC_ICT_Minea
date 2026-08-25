from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .config import settings
from .db.database import Base, engine

# Import models before Base.metadata.create_all()
# so SQLAlchemy registers all database tables.
from . import models  # noqa: F401

from .core.rate_limiter import limiter

from .routers import (
    auth,
    admin,
    gallery,
    videos,
    contact,
    charity,
    settings as settings_router,
    courses,
    testimonials,
    schools,
    alumni,
)


# ============================================================
# SC ACADEMY - FASTAPI APPLICATION
# ============================================================


# ============================================================
# ENVIRONMENT
# ============================================================

ENVIRONMENT = settings.ENVIRONMENT.lower()

IS_PRODUCTION = ENVIRONMENT == "production"


# ============================================================
# CREATE DATABASE TABLES
# ============================================================
#
# IMPORTANT:
#
# MySQL database must already exist.
#
# Base.metadata.create_all() only creates missing tables.
# It does NOT:
#
# - rename columns
# - delete columns
# - change existing column types
# - automatically migrate old tables
#
# For production database changes, use Alembic.
#
# ============================================================

Base.metadata.create_all(
    bind=engine
)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SC Academy API",

    description=(
        "REST API for SC Academy website "
        "and administration system."
    ),

    version="1.0.0",

    docs_url=(
        None
        if IS_PRODUCTION
        else "/docs"
    ),

    redoc_url=(
        None
        if IS_PRODUCTION
        else "/redoc"
    ),

    openapi_url=(
        None
        if IS_PRODUCTION
        else "/openapi.json"
    ),
)


# ============================================================
# RATE LIMITER
# ============================================================

app.state.limiter = limiter

app.add_exception_handler(
    RateLimitExceeded,
    _rate_limit_exceeded_handler,
)


# ============================================================
# UPLOAD DIRECTORY
# ============================================================

UPLOAD_DIR = (
    Path(__file__).resolve().parents[1]
    / "uploads"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ============================================================
# STATIC FILES
# ============================================================

app.mount(
    "/uploads",
    StaticFiles(
        directory=str(UPLOAD_DIR)
    ),
    name="uploads",
)


# ============================================================
# CORS
# ============================================================

DEVELOPMENT_ORIGINS = [

    # ========================================================
    # React
    # ========================================================

    "http://localhost:3000",
    "http://localhost:3001",

    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",

    # ========================================================
    # Vite
    # ========================================================

    "http://localhost:5173",
    "http://localhost:5174",

    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]


PRODUCTION_ORIGINS = [

    # ========================================================
    # Add your real domains here
    # ========================================================

    # "https://scacademy.com",
    # "https://www.scacademy.com",
    # "https://admin.scacademy.com",

]


ALLOWED_ORIGINS = settings.allowed_origins or (
    PRODUCTION_ORIGINS if IS_PRODUCTION else DEVELOPMENT_ORIGINS
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.allowed_hosts,
)

if IS_PRODUCTION and settings.FORCE_HTTPS:
    app.add_middleware(HTTPSRedirectMiddleware)


app.add_middleware(
    CORSMiddleware,

    allow_origins=ALLOWED_ORIGINS,

    allow_credentials=True,

    allow_methods=[
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "OPTIONS",
    ],

    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
    ],
)


# ============================================================
# SECURITY HEADERS
# ============================================================

@app.middleware("http")
async def security_headers(
    request: Request,
    call_next,
):
    response = await call_next(request)

    # ========================================================
    # Prevent MIME sniffing
    # ========================================================

    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"

    # ========================================================
    # Prevent iframe embedding
    # ========================================================

    response.headers[
        "X-Frame-Options"
    ] = "DENY"

    response.headers[
        "Content-Security-Policy"
    ] = (
        "default-src 'none'; "
        "img-src 'self' data: blob: http: https:; "
        "media-src 'self' data: blob: http: https:; "
        "frame-ancestors 'none'"
    )

    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "no-store"

    # ========================================================
    # Referrer protection
    # ========================================================

    response.headers[
        "Referrer-Policy"
    ] = "strict-origin-when-cross-origin"

    # ========================================================
    # Browser permissions
    # ========================================================

    response.headers[
        "Permissions-Policy"
    ] = (
        "camera=(), "
        "microphone=(), "
        "geolocation=()"
    )

    # ========================================================
    # HSTS
    # Production only
    # ========================================================

    if IS_PRODUCTION:
        response.headers[
            "Strict-Transport-Security"
        ] = (
            "max-age=31536000; "
            "includeSubDomains"
        )

    return response


# ============================================================
# ROUTERS
# ============================================================


# ============================================================
# AUTHENTICATION
# ============================================================

app.include_router(
    auth.router,
    prefix="/api/auth",
    tags=["Authentication"],
)


# ============================================================
# ADMIN
# ============================================================

app.include_router(
    admin.router,
    prefix="/api/admin",
    tags=["Admin"],
)


# ============================================================
# COURSE CATEGORIES + COURSES
# ============================================================
#
# If course_categories endpoints are inside courses.py,
# this router can handle both.
#
# ============================================================

app.include_router(
    courses.router,
    prefix="/api/courses",
    tags=["Courses"],
)


# ============================================================
# ENROLLMENTS (Disabled - Website routes directly to Telegram)
# ============================================================

# app.include_router(
#     enrollments.router,
#     prefix="/api/enrollments",
#     tags=["Enrollments"],
# )


# ============================================================
# GALLERY
# ============================================================

app.include_router(
    gallery.router,
    prefix="/api/gallery",
    tags=["Gallery"],
)


# ============================================================
# VIDEOS
# ============================================================

app.include_router(
    videos.router,
    prefix="/api/videos",
    tags=["Videos"],
)


# ============================================================
# TESTIMONIALS
# ============================================================

app.include_router(
    testimonials.router,
    prefix="/api/testimonials",
    tags=["Testimonials"],
)


# ============================================================
# ALUMNI
# ============================================================

app.include_router(
    alumni.router,
    prefix="/api/alumni",
    tags=["Alumni"],
)


# ============================================================
# SCHOOLS
# ============================================================

app.include_router(
    schools.router,
    prefix="/api/schools",
    tags=["Schools"],
)


# ============================================================
# CHARITY
# ============================================================

app.include_router(
    charity.router,
    prefix="/api/charity",
    tags=["Charity"],
)


# ============================================================
# CONTACT
# ============================================================

app.include_router(
    contact.router,
    prefix="/api/contact",
    tags=["Contact"],
)


# ============================================================
# SITE SETTINGS
# ============================================================

app.include_router(
    settings_router.router,
    prefix="/api/settings",
    tags=["Settings"],
)


# ============================================================
# ROOT
# ============================================================

@app.get(
    "/",
    tags=["System"],
)
async def root():
    return {
        "success": True,
        "message": "SC Academy API is running",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get(
    "/health",
    tags=["System"],
)
async def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "SC Academy API",
    }
