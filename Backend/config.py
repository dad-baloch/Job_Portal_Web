import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

# Load variables from .env if present to keep secrets out of source control.
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent


def _get_bool(value: str, default: bool = False) -> bool:
    if value is None:
        return default
    return value.lower() in {"1", "true", "yes", "on"}


class BaseConfig:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "sqlite:///{0}".format(BASE_DIR.joinpath("job_portal.db")),
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-in-prod")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=12)
    PROPAGATE_EXCEPTIONS = True
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")
    PAGINATION_DEFAULT_PAGE_SIZE = int(os.getenv("PAGE_SIZE", 20))
    MAX_PAGE_SIZE = int(os.getenv("MAX_PAGE_SIZE", 100))
    JSON_SORT_KEYS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "TEST_DATABASE_URL", "sqlite:///:memory:")


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config(name: str):
    return config_by_name.get(name, DevelopmentConfig)
