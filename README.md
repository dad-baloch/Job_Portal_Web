# 🚀 Job Portal Web Application

A full-stack job portal platform built with Flask and React, featuring role-based access control, job posting and application management, and comprehensive admin capabilities.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [User Roles](#user-roles)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This job portal application provides a complete platform for job seekers, employers, and administrators. It features a modern React frontend with TypeScript and Tailwind CSS, powered by a robust Flask REST API backend with JWT authentication.

### Key Capabilities

- **For Job Seekers**: Browse jobs, save favorites, apply with custom cover letters, track application status
- **For Employers**: Post and manage job listings, review applications, manage company profiles
- **For Admins**: Approve job postings, manage companies, oversee platform operations

## ✨ Features

### Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (Admin, Employer, Job Seeker)
- Protected routes and API endpoints
- Password hashing with Werkzeug

### Job Management
- Create, edit, and delete job postings
- Advanced job search and filtering (title, location, job type, remote options)
- Job approval workflow for admin moderation
- Salary range specification
- Skills tagging with JSON storage
- Company association and profiles

### Application System
- Submit applications with custom cover letters
- Application status tracking (Pending, Reviewed, Accepted, Rejected)
- Employer application review and management
- Application history for job seekers

### Additional Features
- Save/bookmark favorite jobs
- Pagination and efficient data loading
- Real-time updates with React Query
- Responsive design with Tailwind CSS
- Form validation with Zod and React Hook Form
- Toast notifications for user feedback
- Sanitized HTML content rendering

## 🛠 Tech Stack

### Backend
- **Framework**: Flask 3.0.0
- **Database ORM**: SQLAlchemy 2.0.23
- **Migrations**: Flask-Migrate (Alembic)
- **Authentication**: Flask-JWT-Extended 4.6.0
- **Validation**: Marshmallow & marshmallow-sqlalchemy
- **CORS**: Flask-CORS 4.0.0
- **Database**: PostgreSQL (production) / SQLite (development)
- **Environment Management**: python-dotenv

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite (Rolldown variant)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.18
- **Routing**: React Router DOM 7.11.0
- **State Management**: Zustand 5.0.9
- **Data Fetching**: TanStack React Query 5.90.16
- **HTTP Client**: Axios 1.13.2
- **Form Management**: React Hook Form 7.70.0 + Zod 4.3.5
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Utilities**: date-fns, DOMPurify, clsx

## 📁 Project Structure

```
Job_Portal_Web/
├── Backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy database models
│   │   │   ├── user.py      # User model with roles
│   │   │   ├── job.py       # Job postings
│   │   │   ├── application.py
│   │   │   ├── company.py
│   │   │   ├── profile.py
│   │   │   └── saved_job.py
│   │   ├── routes/          # API endpoints
│   │   │   ├── auth.py      # Login, register, user management
│   │   │   ├── jobs.py      # Job CRUD operations
│   │   │   ├── applications.py
│   │   │   ├── admin.py     # Admin-only endpoints
│   │   │   ├── companies.py
│   │   │   └── saved_jobs.py
│   │   ├── schemas/         # Marshmallow validation schemas
│   │   ├── extensions.py    # Flask extensions initialization
│   │   └── seeder.py        # Database seeding logic
│   ├── migrations/          # Alembic database migrations
│   ├── config.py            # Application configuration
│   ├── run.py               # Application entry point
│   ├── seed.py              # Seed script runner
│   └── requirements.txt     # Python dependencies
│
└── Frontend/
    ├── src/
    │   ├── api/             # API client functions
    │   ├── components/      # Reusable React components
    │   │   ├── auth/        # Login, register, protected routes
    │   │   ├── jobs/        # Job cards, filters, forms
    │   │   ├── applications/
    │   │   ├── common/      # Shared UI components
    │   │   └── layout/      # Layout components
    │   ├── pages/           # Route-level page components
    │   ├── hooks/           # Custom React hooks
    │   ├── store/           # Zustand state management
    │   ├── types/           # TypeScript type definitions
    │   ├── utils/           # Helper functions
    │   ├── routes.tsx       # Route configuration
    │   └── main.tsx         # Application entry point
    ├── public/              # Static assets
    └── package.json         # Node dependencies
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+ with pip
- Node.js 18+ with npm
- PostgreSQL (optional, for production setup)
- Git

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Create and activate virtual environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables** (optional but recommended)
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

5. **Run database migrations**
   ```bash
   flask db upgrade
   ```

6. **Seed demo data**
   ```bash
   python3 seed.py
   ```

7. **Start the Flask development server**
   ```bash
   python3 run.py
   ```

   Backend will be available at: **http://127.0.0.1:5000**

### Frontend Setup

1. **Navigate to Frontend directory**
   ```bash
   cd Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Ensure VITE_API_URL points to your backend
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   Frontend will be available at: **http://127.0.0.1:5173**

### Demo Accounts

After running the seed script, you can log in with these demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@demo.com` | `demo123` |
| **Employer** | `employer@demo.com` | `demo123` |
| **Job Seeker** | `seeker@demo.com` | `demo123` |

## 📚 API Documentation

### Base URL
```
http://127.0.0.1:5000/api
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and receive JWT token |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/me` | Update user profile |

### Job Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/jobs` | List all jobs (with filters) | No |
| GET | `/jobs/:id` | Get job details | No |
| POST | `/jobs` | Create new job | Employer |
| PUT | `/jobs/:id` | Update job | Employer (owner) |
| DELETE | `/jobs/:id` | Delete job | Employer (owner) |

### Application Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/applications` | Get user's applications | Job Seeker |
| POST | `/applications` | Submit job application | Job Seeker |
| GET | `/jobs/:id/applicants` | View job applicants | Employer |
| PUT | `/applications/:id/status` | Update application status | Employer |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/admin/jobs/pending` | Get pending job approvals | Admin |
| PUT | `/admin/jobs/:id/approve` | Approve job posting | Admin |
| PUT | `/admin/jobs/:id/reject` | Reject job posting | Admin |
| POST | `/admin/companies` | Create company | Admin |

### Query Parameters for Jobs

- `search` - Search in title and description
- `location` - Filter by location
- `job_type` - Filter by job type (full_time, part_time, contract, etc.)
- `is_remote` - Filter remote jobs (true/false)
- `page` - Page number (default: 1)
- `per_page` - Items per page (default: 20, max: 100)

## 🔐 Environment Variables

### Backend (.env)

```env
# Flask Configuration
FLASK_APP=run.py
FLASK_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/job_portal
# Or use SQLite for development:
# DATABASE_URL=sqlite:///job_portal.db

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET_KEY=your-secret-key-here-change-in-production

# CORS
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Pagination
PAGE_SIZE=20
MAX_PAGE_SIZE=100

# Admin Account
PERMANENT_ADMIN_EMAIL=admin@example.com
PERMANENT_ADMIN_PASSWORD=your-secure-password
```

### Frontend (.env)

```env
VITE_API_URL=http://127.0.0.1:5000/api
```

## 🗄 Database Schema

### Users Table
- `id` (Primary Key)
- `email` (Unique, Indexed)
- `password_hash`
- `role` (job_seeker, employer, admin)
- `created_at`, `updated_at`

### Jobs Table
- `id` (Primary Key)
- `title`, `description`
- `location`, `job_type`, `is_remote`
- `salary_min`, `salary_max`
- `skills` (JSON)
- `company_id` (Foreign Key)
- `created_by` (Foreign Key → Users)
- `is_approved` (Boolean)
- `approved_at`, `approved_by`
- `created_at`, `updated_at`

### Applications Table
- `id` (Primary Key)
- `job_id` (Foreign Key → Jobs)
- `user_id` (Foreign Key → Users)
- `cover_letter` (Text)
- `status` (pending, reviewed, accepted, rejected)
- `created_at`, `updated_at`

### Companies Table
- `id` (Primary Key)
- `name`, `description`
- `website`, `logo_url`
- `industry`, `company_size`
- `created_at`, `updated_at`

### Profiles Table
- User profile information for job seekers
- Resume, skills, experience details

### Saved Jobs Table
- Many-to-many relationship between users and jobs
- Allows bookmarking functionality

## 👥 User Roles

### Job Seeker
- Browse and search all approved jobs
- Save favorite jobs
- Apply to jobs with custom cover letters
- View and track application status
- Update profile and resume

### Employer
- Create and manage job postings
- View applications for their jobs
- Update application status
- Manage company profile
- Jobs require admin approval before being visible

### Admin
- Approve/reject job postings
- Create and manage companies
- View all platform data
- Moderate content
- Full access to all features

## 🔧 Development

### Running Tests
```bash
# Backend (setup needed)
cd Backend
python -m pytest

# Frontend
cd Frontend
npm run test
```

### Building for Production

**Backend:**
```bash
# Set environment to production
export FLASK_ENV=production

# Use production WSGI server (gunicorn)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 'app:create_app()'
```

**Frontend:**
```bash
npm run build
# Static files will be in dist/ directory
npm run preview  # Preview production build
```

### Database Migrations

```bash
# Create a new migration
flask db migrate -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback one version
flask db downgrade
```

## 🐛 Troubleshooting

### JWT Token Issues
If you see "Subject must be a string" errors:
1. Log out from the application
2. Clear browser local storage
3. Log in again

### Port Already in Use
- Backend: Change port in `run.py`
- Frontend: Vite will auto-increment to next available port (5174, 5175, etc.)

### Database Connection Issues
- Ensure PostgreSQL is running (if using PostgreSQL)
- Check DATABASE_URL in .env
- For SQLite, ensure write permissions in Backend directory

### CORS Errors
- Verify CORS_ORIGINS in backend .env includes your frontend URL
- Check that frontend VITE_API_URL matches backend URL

## 📝 Notes

- The application uses JWT tokens with a 12-hour expiration
- All passwords are hashed using Werkzeug's security utilities
- SQLAlchemy connection pooling is enabled with health checks
- Database migrations are managed with Flask-Migrate (Alembic)
- Frontend uses React Query for efficient data caching
- HTML content is sanitized with DOMPurify to prevent XSS attacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built By Daad with ❤️ using Flask and React**
