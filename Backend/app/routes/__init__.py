from app.routes.auth import auth_bp
from app.routes.jobs import jobs_bp
from app.routes.applications import applications_bp
from app.routes.saved_jobs import saved_jobs_bp

__all__ = ["auth_bp", "jobs_bp", "applications_bp", "saved_jobs_bp"]
