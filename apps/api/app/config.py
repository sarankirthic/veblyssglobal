import os
from datetime import timedelta


class Config:
    # Falls back to an obviously-unsafe dev default rather than crashing on import,
    # so `flask db init` / tests work without a .env file. Real deploys must set
    # these via environment — see .env.example.
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-only-insecure-secret-change-me")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "postgresql+psycopg2://veblyss:veblyss@localhost:5432/veblyss"
    )
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SESSION_COOKIE_NAME = os.environ.get("SESSION_COOKIE_NAME", "veblyss_session")
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.environ.get("SESSION_COOKIE_SECURE", "true").lower() == "true"
    SESSION_COOKIE_SAMESITE = os.environ.get("SESSION_COOKIE_SAMESITE", "Lax")
    PERMANENT_SESSION_LIFETIME = timedelta(days=int(os.environ.get("SESSION_LIFETIME_DAYS", "7")))

    CORS_ORIGINS = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]

    R2_ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID", "")
    R2_ACCESS_KEY_ID = os.environ.get("R2_ACCESS_KEY_ID", "")
    R2_SECRET_ACCESS_KEY = os.environ.get("R2_SECRET_ACCESS_KEY", "")
    R2_BUCKET_NAME = os.environ.get("R2_BUCKET_NAME", "veblyss-media")
    R2_PUBLIC_BASE_URL = os.environ.get("R2_PUBLIC_BASE_URL", "")

    REDIS_URL = os.environ.get("REDIS_URL", "")

    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")

    MAX_CONTENT_LENGTH = 15 * 1024 * 1024  # 15MB upload ceiling
    ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}


class TestConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL", "sqlite:///:memory:"
    )
    SESSION_COOKIE_SECURE = False
