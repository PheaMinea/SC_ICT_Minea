"""
Language Sync API
=================
Simple in-memory language preference endpoint so that
frontend_user (port 3000) and frontend_admin (port 3001)
can share a language setting through the backend.

Endpoints:
  GET  /api/language          → returns {"language": "km"} or {"language": "en"}
  POST /api/language          → body {"language": "km"} or {"language": "en"}
"""

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel

from ..core.rate_limiter import limiter

router = APIRouter()

# ============================================================
# SHARED IN-MEMORY LANGUAGE STATE
# ============================================================

_current_language: str = "km"   # default: Khmer


# ============================================================
# SCHEMAS
# ============================================================

class LanguagePayload(BaseModel):
    language: str


# ============================================================
# GET /api/language
# ============================================================

@router.get("/")
def get_language():
    return {"language": _current_language}


# ============================================================
# POST /api/language
# Rate limited: 20/minute per IP
# (Frontend polls every 2s = 30 req/min max — limit is fair)
# ============================================================

@router.post("/")
@limiter.limit("20/minute")
def set_language(request: Request, payload: LanguagePayload):
    global _current_language

    if payload.language not in ("en", "km"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Language must be 'en' or 'km'",
        )

    _current_language = payload.language

    return {"language": _current_language, "success": True}
