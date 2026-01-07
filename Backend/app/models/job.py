from datetime import datetime

from sqlalchemy import (
    Integer,
    String,
    ForeignKey,
    DateTime,
    Text,
    Boolean,
    Numeric,
    Index,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Job(db.Model):
    __tablename__ = "jobs"
    __table_args__ = (
        Index("idx_jobs_title_location", "title", "location"),
        Index("idx_jobs_job_type", "job_type"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), index=True)
    job_type: Mapped[str] = mapped_column(String(50), index=True)
    is_remote: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    salary_min: Mapped[float | None] = mapped_column(Numeric(scale=2))
    salary_max: Mapped[float | None] = mapped_column(Numeric(scale=2))
    skills: Mapped[dict] = mapped_column(JSON, default=dict)
    company_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("companies.id", ondelete="SET NULL"), nullable=True
    )
    created_by: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )

    is_approved: Mapped[bool] = mapped_column(
        Boolean, default=False, index=True)
    approved_by: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    approved_at: Mapped[datetime | None] = mapped_column(
        DateTime, nullable=True)

    status: Mapped[str] = mapped_column(String(50), default="open", index=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    company: Mapped["Company"] = relationship("Company", back_populates="jobs")
    creator: Mapped["User"] = relationship(
        "User", back_populates="jobs", foreign_keys=[created_by]
    )
    approver: Mapped["User"] = relationship("User", foreign_keys=[approved_by])
    applications: Mapped[list["Application"]] = relationship(
        "Application", back_populates="job", cascade="all, delete-orphan"
    )
    saved_by_users: Mapped[list["SavedJob"]] = relationship(
        "SavedJob", back_populates="job", cascade="all, delete-orphan"
    )
