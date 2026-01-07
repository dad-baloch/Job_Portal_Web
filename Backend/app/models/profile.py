from datetime import datetime

from sqlalchemy import Integer, String, JSON, ForeignKey, DateTime, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class JobSeekerProfile(db.Model):
    __tablename__ = "job_seeker_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    full_name: Mapped[str] = mapped_column(String(255), index=True)
    location: Mapped[str] = mapped_column(String(255), index=True)
    skills: Mapped[dict] = mapped_column(JSON, default=dict)
    experience_years: Mapped[float | None] = mapped_column(
        Float, nullable=True)
    resume_url: Mapped[str | None] = mapped_column(String(512))
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user: Mapped["User"] = relationship("User", back_populates="profile")
