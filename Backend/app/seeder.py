
import random
import os
from datetime import datetime, timezone, timedelta
from app.extensions import db
from app.models import Company, Job, User, Application, JobSeekerProfile, SavedJob
from app.models.user import Role
from app.models.application import ApplicationStatus

# --- Constants & Data Pools ---

JOB_TITLES = [
    "Senior Frontend Engineer", "Backend Developer (Python)", "Full Stack Engineer",
    "Product Manager", "UI/UX Designer", "DevOps Engineer", "Data Scientist",
    "Machine Learning Engineer", "QA Automation Engineer", "Technical Product Owner",
    "Customer Success Manager", "Sales Representative", "Marketing Specialist",
    "Content Writer", "HR Manager", "Social Media Manager", "Growth Hacker",
    "iOS Developer", "Android Developer", "Cloud Architect"
]

LOCATIONS = [
    "San Francisco, CA", "New York, NY", "Austin, TX", "London, UK", "Berlin, DE",
    "Remote", "Toronto, ON", "Singapore", "Sydney, AU", "Seattle, WA"
]

SKILLS_POOL = ["React", "Python", "Node.js", "AWS", "SQL",
               "Figma", "Docker", "Kubernetes", "TypeScript", "Go"]

COMPANIES_DATA = [
    {
        "name": "TechFlow Systems",
        "description": "Leading the way in automated workflow solutions for enterprise.",
        "website": "https://techflow.demo",
        "location": "San Francisco, CA"
    },
    {
        "name": "Nebula Cloud",
        "description": "Next-generation cloud infrastructure for AI workloads.",
        "website": "https://nebula.demo",
        "location": "New York, NY"
    },
    {
        "name": "Pixel Perfect Studios",
        "description": "Award-winning digital design agency specializing in branding.",
        "website": "https://pixelperfect.demo",
        "location": "London, UK"
    },
    {
        "name": "Quantum Finance",
        "description": "Fintech startup revolutionizing personal banking.",
        "website": "https://quantum.demo",
        "location": "Singapore"
    },
    {
        "name": "GreenLeaf Energy",
        "description": "Sustainable energy management for modern homes.",
        "website": "https://greenleaf.demo",
        "location": "Berlin, DE"
    },
    {
        "name": "CyberGuard Security",
        "description": "Enterprise-grade cybersecurity solutions.",
        "website": "https://cyberguard.demo",
        "location": "Austin, TX"
    }
]


def seed_permanent_admin():
    """Ensures the permanent admin exists."""
    email = os.environ.get("PERMANENT_ADMIN_EMAIL", "admin@example.com")
    password = os.environ.get("PERMANENT_ADMIN_PASSWORD", "admin123")

    existing = User.query.filter_by(email=email).first()
    if not existing:
        print(f"Creating permanent admin: {email}")
        admin = User(email=email, role=Role.ADMIN)
        admin.set_password(password)
        db.session.add(admin)
        db.session.commit()
    else:
        print(f"Permanent admin {email} already exists.")


def clean_demo_data():
    """Deletes only demo data (users with @demo.com)."""
    print("Cleaning demo data...")
    # Because of cascade delete, deleting the users will delete their jobs, companies, profiles, applications
    demo_users = User.query.filter(User.email.like("%@demo.com")).all()
    for u in demo_users:
        db.session.delete(u)
    db.session.commit()
    print("Demo data cleaned.")


def create_users():
    print("Creating demo users...")
    users = {}

    # 1. Admin
    admin = User(email="admin@demo.com", role=Role.ADMIN)
    admin.set_password("demo123")
    db.session.add(admin)
    users["admin"] = admin

    # 2. Employers (1 Main + 5 others for companies)
    employers = []

    # Main demo employer
    main_emp = User(email="employer@demo.com", role=Role.EMPLOYER)
    main_emp.set_password("demo123")
    db.session.add(main_emp)
    employers.append(main_emp)

    # Extra employers
    for i in range(1, 6):
        emp = User(email=f"employer{i}@demo.com", role=Role.EMPLOYER)
        emp.set_password("demo123")
        db.session.add(emp)
        employers.append(emp)

    users["employers"] = employers

    # 3. Job Seekers (1 Main + 24 others)
    seekers = []

    # Main demo seeker
    main_seeker = User(email="seeker@demo.com", role=Role.JOB_SEEKER)
    main_seeker.set_password("demo123")
    db.session.add(main_seeker)
    seekers.append(main_seeker)

    # Profile for main seeker
    profile = JobSeekerProfile(
        user=main_seeker,
        full_name="Alex Johnson",
        location="New York, NY",
        skills={"tags": ["React", "TypeScript", "Node.js"]},
        experience_years=5,
        resume_url="https://example.com/resume.pdf"
    )
    db.session.add(profile)

    for i in range(1, 25):
        seeker = User(email=f"seeker{i}@demo.com", role=Role.JOB_SEEKER)
        seeker.set_password("demo123")
        db.session.add(seeker)
        seekers.append(seeker)

        # Random profile
        p = JobSeekerProfile(
            user=seeker,
            full_name=f"Demo Candidate {i}",
            location=random.choice(LOCATIONS),
            skills={"tags": random.sample(SKILLS_POOL, k=3)},
            experience_years=random.randint(1, 10),
        )
        db.session.add(p)

    users["seekers"] = seekers

    db.session.commit()
    return users


def create_companies(employers):
    print("Creating companies...")
    companies = []

    for i, data in enumerate(COMPANIES_DATA):
        owner = employers[i % len(employers)]
        comp = Company(
            name=data["name"],
            description=data["description"],
            website=data["website"],
            location=data["location"],
            owner_id=owner.id
        )
        db.session.add(comp)
        companies.append(comp)

    db.session.commit()
    return companies


def create_jobs(companies, employers):
    print("Creating 80 jobs...")
    jobs = []

    # Ensure Main Employer (index 0) has specific jobs
    main_emp_company = Company.query.filter_by(
        owner_id=employers[0].id).first()

    if main_emp_company:
        demo_jobs_config = [
            ("Senior React Developer", "open", True),      # Open, Approved
            ("Legacy System Maintainer", "closed", True),  # Closed, Approved
            # Open, Pending (Unapproved)
            ("Experimental AI Reseacher", "open", False),
        ]

        for title, status, approved in demo_jobs_config:
            job = Job(
                title=title,
                description=f"Demo job for {title} at {main_emp_company.name}.",
                location=main_emp_company.location,
                job_type="full-time",
                is_remote=True,
                salary_min=80000,
                salary_max=120000,
                skills={"tags": ["React", "Demo"]},
                company_id=main_emp_company.id,
                created_by=main_emp_company.owner_id,
                status=status,
                is_approved=approved,
                created_at=datetime.utcnow()
            )
            db.session.add(job)
            jobs.append(job)

    # Rest of random jobs
    for i in range(80 - 3):
        company = random.choice(companies)
        title = random.choice(JOB_TITLES)
        is_remote = random.choice([True, False])
        location = "Remote" if is_remote else company.location

        is_approved = random.choices([True, False], weights=[0.9, 0.1])[0]
        status = random.choices(["open", "closed"], weights=[0.85, 0.15])[0]

        salary_base = random.randint(50, 150) * 1000

        job = Job(
            title=title,
            description=f"<p>We are looking for a talented <strong>{title}</strong>...</p>",
            location=location,
            job_type=random.choice(["full-time", "contract", "part-time"]),
            is_remote=is_remote,
            salary_min=salary_base,
            salary_max=salary_base + random.randint(10, 40) * 1000,
            skills={"tags": random.sample(
                SKILLS_POOL, k=random.randint(2, 5))},
            company_id=company.id,
            created_by=company.owner_id,
            status=status,
            is_approved=is_approved,
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 30))
        )
        db.session.add(job)
        jobs.append(job)

    db.session.commit()
    return jobs


def create_applications(seekers, jobs):
    print("Creating 100 applications...")
    available_jobs = jobs
    used_pairs = set()
    count = 0

    # 1. Main Seeker
    main_seeker = seekers[0]
    demo_statuses = [ApplicationStatus.PENDING, ApplicationStatus.HIRED,
                     ApplicationStatus.REJECTED, ApplicationStatus.REVIEWING]

    for status in demo_statuses:
        job = random.choice(available_jobs)
        while (main_seeker.id, job.id) in used_pairs:
            job = random.choice(available_jobs)

        app = Application(
            user_id=main_seeker.id,
            job_id=job.id,
            status=status,
            cover_letter=f"Demo application with status {status.value}.",
            created_at=datetime.utcnow()
        )
        db.session.add(app)
        used_pairs.add((main_seeker.id, job.id))
        count += 1

    # Rest
    max_attempts = 1000
    attempts = 0
    while count < 100 and attempts < max_attempts:
        attempts += 1
        seeker = random.choice(seekers)
        job = random.choice(available_jobs)

        if (seeker.id, job.id) in used_pairs:
            continue

        status = random.choice(list(ApplicationStatus))

        app = Application(
            user_id=seeker.id,
            job_id=job.id,
            status=status,
            cover_letter="Interested.",
            created_at=datetime.utcnow() - timedelta(days=random.randint(0, 10))
        )
        db.session.add(app)
        used_pairs.add((seeker.id, job.id))
        count += 1

    db.session.commit()


def run_seeder_logic():
    seed_permanent_admin()
    clean_demo_data()
    users = create_users()
    companies = create_companies(users["employers"])
    jobs = create_jobs(companies, users["employers"])
    create_applications(users["seekers"], jobs)
    print("Seeding logic complete.")
