from datetime import datetime

from sqlalchemy import Integer, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class SavedJob(db.Model):
    __tablename__ = "saved_jobs"
    __table_args__ = (Index("idx_saved_jobs_user_job",
                      "user_id", "job_id", unique=True),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    job_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)

    user: Mapped["User"] = relationship("User", back_populates="saved_jobs")
    job: Mapped["Job"] = relationship("Job", back_populates="saved_by_users")
