from datetime import datetime
from enum import Enum

from sqlalchemy import Integer, String, ForeignKey, DateTime, Text, Enum as SAEnum, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class ApplicationStatus(str, Enum):
    PENDING = "pending"
    REVIEWING = "reviewing"
    SHORTLISTED = "shortlisted"
    REJECTED = "rejected"
    HIRED = "hired"


class Application(db.Model):
    __tablename__ = "applications"
    __table_args__ = (
        Index("idx_applications_user_job", "user_id", "job_id", unique=True),
        Index("idx_applications_status", "status"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    job_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False
    )
    cover_letter: Mapped[str | None] = mapped_column(Text)
    status: Mapped[str] = mapped_column(
        SAEnum(ApplicationStatus), default=ApplicationStatus.PENDING, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    applicant: Mapped["User"] = relationship(
        "User", back_populates="applications")
    job: Mapped["Job"] = relationship("Job", back_populates="applications")
