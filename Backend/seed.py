"""Seed demo data into the database.

Usage:
  1) Ensure migrations are applied:
     flask db upgrade
  2) Run (with venv active):
      python seed.py

This is safe to run multiple times (idempotent-ish).
"""

from __future__ import annotations

from datetime import datetime, timezone

from app import create_app
from app.extensions import db
from app.models import Company, Job, User
from app.models.application import Application
from app.models.profile import JobSeekerProfile
from app.models.saved_job import SavedJob
from app.models.user import Role


def _get_or_create_employer(email: str, password: str) -> User:
    employer = User.query.filter_by(email=email).first()
    if employer:
        return employer

    employer = User(email=email, role=Role.EMPLOYER)
    employer.set_password(password)
    db.session.add(employer)
    db.session.commit()
    return employer


def _get_or_create_company(name: str, owner: User) -> Company:
    company = Company.query.filter_by(name=name).first()
    if company:
        if company.owner_id is None:
            company.owner_id = owner.id
            db.session.commit()
        return company

    company = Company(
        name=name,
        description="Demo company seeded for local development.",
        website="https://example.com",
        location="Remote",
        owner_id=owner.id,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )
    db.session.add(company)
    db.session.commit()
    return company


def _get_or_create_job_seeker(email: str, password: str) -> User:
    seeker = User.query.filter_by(email=email).first()
    if seeker:
        return seeker

    seeker = User(email=email, role=Role.JOB_SEEKER)
    seeker.set_password(password)
    db.session.add(seeker)
    db.session.commit()
    return seeker


def _get_or_create_admin(email: str, password: str) -> User:
    admin = User.query.filter_by(email=email).first()
    if admin:
        return admin

    admin = User(email=email, role=Role.ADMIN)
    admin.set_password(password)
    db.session.add(admin)
    db.session.commit()
    return admin


def _get_or_create_job_seeker_profile(user: User) -> JobSeekerProfile:
    profile = JobSeekerProfile.query.filter_by(user_id=user.id).first()
    if profile:
        return profile

    profile = JobSeekerProfile(
        user_id=user.id,
        full_name="Demo Job Seeker",
        location="Karachi",
        skills={"tags": ["react", "python", "sql"]},
        experience_years=1.5,
        resume_url="https://example.com/resume.pdf",
    )
    db.session.add(profile)
    db.session.commit()
    return profile


def _seed_jobs(*, employer: User, company: Company) -> int:
    # Don’t create duplicates if jobs already exist for this employer.
    existing_count = Job.query.filter(Job.created_by == employer.id).count()
    if existing_count > 0:
        return 0

    jobs: list[Job] = [
        Job(
            title="Frontend Developer (React)",
            description=(
                "<p>Build modern UI with React + TypeScript.</p>"
                "<ul><li>React 19</li><li>TypeScript</li><li>Tailwind</li></ul>"
            ),
            location="Remote",
            job_type="full_time",
            is_remote=True,
            salary_min=60000,
            salary_max=90000,
            skills={"tags": ["react", "typescript", "tailwind"]},
            company_id=company.id,
            created_by=employer.id,
            is_approved=True,
            status="open",
        ),
        Job(
            title="Backend Developer (Flask)",
            description=(
                "<p>Work on REST APIs, auth, and database migrations.</p>"
                "<p><strong>Nice to have:</strong> SQLAlchemy, Alembic.</p>"
            ),
            location="Karachi",
            job_type="full_time",
            is_remote=False,
            salary_min=70000,
            salary_max=110000,
            skills={"tags": ["python", "flask", "sqlalchemy"]},
            company_id=company.id,
            created_by=employer.id,
            is_approved=True,
            status="open",
        ),
        Job(
            title="QA Engineer",
            description="<p>Help ensure product quality with manual + automated testing.</p>",
            location="Remote",
            job_type="contract",
            is_remote=True,
            salary_min=None,
            salary_max=None,
            skills={"tags": ["testing", "playwright", "api"]},
            company_id=company.id,
            created_by=employer.id,
            is_approved=True,
            status="open",
        ),
        Job(
            title="Pending Approval: Junior UI Designer",
            description=(
                "<p>This job is <strong>pending</strong> so the admin dashboard isn't empty.</p>"
                "<p>Approve it to make it visible publicly.</p>"
            ),
            location="Remote",
            job_type="contract",
            is_remote=True,
            salary_min=30000,
            salary_max=45000,
            skills={"tags": ["figma", "ui", "design"]},
            company_id=company.id,
            created_by=employer.id,
            is_approved=False,
            status="open",
        ),
    ]

    db.session.add_all(jobs)
    db.session.commit()
    return len(jobs)


def _seed_saved_job(*, seeker: User, job: Job) -> bool:
    existing = SavedJob.query.filter_by(
        user_id=seeker.id, job_id=job.id).first()
    if existing:
        return False
    db.session.add(SavedJob(user_id=seeker.id, job_id=job.id))
    db.session.commit()
    return True


def _seed_application(*, seeker: User, job: Job) -> bool:
    existing = Application.query.filter_by(
        user_id=seeker.id, job_id=job.id).first()
    if existing:
        return False
    db.session.add(
        Application(
            user_id=seeker.id,
            job_id=job.id,
            cover_letter="Hi! I’d love to be considered for this role.",
        )
    )
    db.session.commit()
    return True


def main() -> None:
    app = create_app()

    with app.app_context():
        admin = _get_or_create_admin(
            email="admin@example.com",
            password="Password123!",
        )
        employer = _get_or_create_employer(
            email="employer@example.com",
            password="Password123!",
        )
        seeker = _get_or_create_job_seeker(
            email="seeker@example.com",
            password="Password123!",
        )
        _get_or_create_job_seeker_profile(seeker)

        company = _get_or_create_company("Demo Co", employer)
        created_jobs = _seed_jobs(employer=employer, company=company)

        # Attach one saved job + one application to make the UI non-empty.
        newest_job = Job.query.order_by(Job.created_at.desc()).first()
        saved_created = False
        application_created = False
        if newest_job:
            saved_created = _seed_saved_job(seeker=seeker, job=newest_job)
            application_created = _seed_application(
                seeker=seeker, job=newest_job)

        print("Seed complete")
        print(f"Admin: {admin.email}")
        print(f"Employer: {employer.email}")
        print(f"Job seeker: {seeker.email}")
        print(f"Company:  {company.name}")
        print(f"Jobs created: {created_jobs}")
        print(f"Saved job created: {saved_created}")
        print(f"Application created: {application_created}")


if __name__ == "__main__":
    main()
