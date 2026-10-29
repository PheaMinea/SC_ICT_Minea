from urllib.parse import urlsplit

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# ============================================================
# SC ACADEMY - APPLICATION SETTINGS
# ============================================================

class Settings(BaseSettings):

    # ========================================================
    # APPLICATION
    # ========================================================

    ENVIRONMENT: str = "development"

    APP_NAME: str = "SC Academy API"

    APP_VERSION: str = "1.0.0"


    # ========================================================
    # SECURITY / JWT
    # ========================================================

    SECRET_KEY: str

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ALLOWED_HOSTS: str = "localhost,127.0.0.1"
    ALLOWED_ORIGINS: str = ""
    FORCE_HTTPS: bool = False


    # ========================================================
    # DATABASE / MYSQL
    # ========================================================

    DATABASE_URL: str


    # ========================================================
    # TELEGRAM
    # ========================================================

    TELEGRAM_BOT_TOKEN: str = ""

    TELEGRAM_CHAT_ID: str = ""


    # ========================================================
    # UPLOAD
    # ========================================================

    MAX_UPLOAD_SIZE_MB: int = 10

    @property
    def allowed_hosts(self) -> list[str]:
        return [value.strip() for value in self.ALLOWED_HOSTS.split(",") if value.strip()]

    @property
    def allowed_origins(self) -> list[str]:
        return [value.strip().rstrip("/") for value in self.ALLOWED_ORIGINS.split(",") if value.strip()]

    @model_validator(mode="after")
    def validate_security_settings(self):
        if self.ALGORITHM != "HS256":
            raise ValueError("Only the configured HS256 JWT algorithm is supported")
        if not 5 <= self.ACCESS_TOKEN_EXPIRE_MINUTES <= 1440:
            raise ValueError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 5 and 1440")
        if self.ENVIRONMENT.lower() == "production":
            database_host = urlsplit(self.DATABASE_URL).hostname
            if not database_host or database_host.lower() in {
                "localhost",
                "127.0.0.1",
                "::1",
            }:
                raise ValueError(
                    "Production DATABASE_URL must use a reachable cloud database host, "
                    "not localhost"
                )
            if len(self.SECRET_KEY) < 32:
                raise ValueError("SECRET_KEY must contain at least 32 characters in production")
            if not self.allowed_hosts or "*" in self.allowed_hosts:
                raise ValueError("Production ALLOWED_HOSTS must contain explicit hostnames")
            if not self.allowed_origins:
                raise ValueError("Production ALLOWED_ORIGINS must contain frontend origins")
            if any(not origin.startswith("https://") for origin in self.allowed_origins):
                raise ValueError("Production ALLOWED_ORIGINS must use HTTPS")
        return self


    # ========================================================
    # PYDANTIC SETTINGS
    # ========================================================

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


# ============================================================
# SETTINGS INSTANCE
# ============================================================

settings = Settings()
