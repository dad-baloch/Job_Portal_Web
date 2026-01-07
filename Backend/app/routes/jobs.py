from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.extensions import db
from app.models import Application, Job, Company
from app.routes.utils import get_current_user, require_role
from app.schemas import JobSchema

jobs_bp = Blueprint("jobs", __name__)
job_schema = JobSchema()
job_list_schema = JobSchema(many=True)


def _apply_filters(query):
    title = request.args.get("title")
    location = request.args.get("location")
    job_type = request.args.get("job_type")
    company_id = request.args.get("company_id", type=int)
    is_remote = request.args.get("is_remote")

    if title:
        query = query.filter(Job.title.ilike(f"%{title}%"))
    if location:
        query = query.filter(Job.location.ilike(f"%{location}%"))
    if job_type:
        query = query.filter(Job.job_type == job_type)
    if company_id:
        query = query.filter(Job.company_id == company_id)
    if is_remote is not None:
        if is_remote.lower() in {"1", "true", "yes"}:
            query = query.filter(Job.is_remote.is_(True))
        elif is_remote.lower() in {"0", "false", "no"}:
            query = query.filter(Job.is_remote.is_(False))
    return query


@jobs_bp.get("/")
def list_jobs():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get(
        "per_page", current_app.config["PAGINATION_DEFAULT_PAGE_SIZE"], type=int)
    per_page = min(per_page, current_app.config["MAX_PAGE_SIZE"])

    query = Job.query.options(selectinload(Job.company)).filter(
        Job.is_approved.is_(True))
    query = _apply_filters(query)
    pagination = query.order_by(Job.created_at.desc()).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify(
        {
            "items": job_list_schema.dump(pagination.items),
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
        }
    )


@jobs_bp.get("/mine")
@jwt_required()
def my_jobs():
    user = get_current_user()
    forbidden = require_role(user, {"employer"})
    if forbidden:
        return forbidden
    assert user is not None

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get(
        "per_page", current_app.config["PAGINATION_DEFAULT_PAGE_SIZE"], type=int
    )
    per_page = min(per_page, current_app.config["MAX_PAGE_SIZE"])

    query = (
        Job.query.options(selectinload(Job.company))
        .filter(Job.created_by == user.id)
        .order_by(Job.created_at.desc())
    )

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    job_ids = [j.id for j in pagination.items]
    counts: dict[int, int] = {}
    if job_ids:
        rows = (
            db.session.query(Application.job_id, func.count(Application.id))
            .filter(Application.job_id.in_(job_ids))
            .group_by(Application.job_id)
            .all()
        )
        counts = {int(job_id): int(cnt) for job_id, cnt in rows}

    items = job_list_schema.dump(pagination.items)
    for item in items:
        item["applications_count"] = counts.get(int(item["id"]), 0)

    return jsonify(
        {
            "items": items,
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
        }
    )


@jobs_bp.post("/")
@jwt_required()
def create_job():
    user = get_current_user()
    forbidden = require_role(user, {"employer"})
    if forbidden:
        return forbidden
    assert user is not None

    payload = request.get_json() or {}

    title = payload.get("title")
    description = payload.get("description")
    is_remote = bool(payload.get("is_remote", False))
    location = payload.get("location")
    if isinstance(location, str):
        location = location.strip()

    if not title:
        return jsonify({"message": "title is required"}), 400
    if not description:
        return jsonify({"message": "description is required"}), 400
    if not location:
        location = "Remote" if is_remote else None
    if not location:
        return jsonify({"message": "location is required (or set is_remote=true)"}), 400

    job_type = payload.get("job_type")
    if isinstance(job_type, str):
        job_type = job_type.strip()
    if not job_type:
        job_type = "full-time"

    company_id = payload.get("company_id")

    # Auto-assign company if the user is an employer and has a company
    if not company_id and user.role.value == "employer":
        if user.company:
            company_id = user.company.id

    if company_id:
        company = Company.query.get(company_id)
        if not company:
            return jsonify({"message": "Company not found"}), 404

    job = Job()
    job.title = title
    job.description = description
    job.location = location
    job.job_type = job_type
    job.is_remote = is_remote
    job.salary_min = payload.get("salary_min")
    job.salary_max = payload.get("salary_max")
    job.skills = payload.get("skills") or {}
    job.company_id = company_id
    job.created_by = user.id
    job.is_approved = False
    job.status = payload.get("status", "open")
    db.session.add(job)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Invalid job payload"}), 400
    return jsonify(job_schema.dump(job)), 201


@jobs_bp.get("/<int:job_id>")
@jwt_required(optional=True)
def get_job(job_id: int):
    user = get_current_user()
    job = Job.query.options(selectinload(Job.company)).get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    if not job.is_approved:
        role_value = getattr(user.role, "value", user.role) if user else None
        if not user or (role_value != "admin" and job.created_by != user.id):
            return jsonify({"message": "Job not found"}), 404
    return jsonify(job_schema.dump(job))


@jobs_bp.put("/<int:job_id>")
@jobs_bp.patch("/<int:job_id>")
@jwt_required()
def update_job(job_id: int):
    user = get_current_user()
    assert user is not None
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    if job.created_by != user.id:
        return jsonify({"message": "Forbidden"}), 403

    payload = request.get_json() or {}
    if "location" in payload:
        location = payload.get("location")
        if isinstance(location, str):
            location = location.strip()
        if not location and payload.get("is_remote", job.is_remote):
            location = "Remote"
        if not location:
            return jsonify({"message": "location cannot be empty"}), 400
        payload["location"] = location

    for field in [
        "title",
        "description",
        "location",
        "job_type",
        "is_remote",
        "salary_min",
        "salary_max",
        "skills",
        "status",
    ]:
        if field in payload:
            setattr(job, field, payload[field])
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Invalid job payload"}), 400
    return jsonify(job_schema.dump(job))


@jobs_bp.delete("/<int:job_id>")
@jwt_required()
def delete_job(job_id: int):
    user = get_current_user()
    assert user is not None
    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404
    if job.created_by != user.id:
        return jsonify({"message": "Forbidden"}), 403

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204
