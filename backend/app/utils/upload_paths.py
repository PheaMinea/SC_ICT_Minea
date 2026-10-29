import os
from pathlib import Path


BACKEND_DIR = Path(__file__).resolve().parents[2]
UPLOAD_DIR = (
    Path("/tmp/uploads")
    if os.getenv("VERCEL") == "1"
    else BACKEND_DIR / "uploads"
)

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
