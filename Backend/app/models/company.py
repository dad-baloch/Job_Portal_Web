from datetime import datetime

from sqlalchemy import Integer, String, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.extensions import db


class Company(db.Model):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    website: Mapped[str | None] = mapped_column(String(255))
    location: Mapped[str | None] = mapped_column(String(255), index=True)
    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    owner: Mapped["User"] = relationship("User", back_populates="company")
    jobs: Mapped[list["Job"]] = relationship(
        "Job", back_populates="company", cascade="all, delete-orphan"
    )
