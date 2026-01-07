from datetime import datetime

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.orm import selectinload

from app.extensions import db
from app.models import Job
from app.routes.utils import get_current_user, require_role
from app.schemas import JobSchema

# Import seeder logic lazily or here if needed
# from app.seeder import run_seeder_logic

admin_bp = Blueprint("admin", __name__)
job_schema = JobSchema()
job_list_schema = JobSchema(many=True)


@admin_bp.post("/reset-demo-data")
@jwt_required()
def reset_demo_data():
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
    if forbidden:
        return forbidden

    try:
        from app.seeder import run_seeder_logic
        run_seeder_logic()
        return jsonify({"message": "Demo data has been successfully reset."}), 200
    except Exception as e:
        current_app.logger.error(f"Reset failed: {e}")
        return jsonify({"message": "Failed to reset data.", "error": str(e)}), 500


@admin_bp.get("/jobs")
@jwt_required()
def list_jobs():
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
    if forbidden:
        return forbidden
    assert user is not None

    approval = (request.args.get("approval") or "pending").lower()

    page = request.args.get("page", 1, type=int)
    per_page = request.args.get(
        "per_page", current_app.config["PAGINATION_DEFAULT_PAGE_SIZE"], type=int
    )
    per_page = min(per_page, current_app.config["MAX_PAGE_SIZE"])

    query = Job.query.options(selectinload(
        Job.company)).order_by(Job.created_at.desc())
    if approval == "pending":
        query = query.filter(Job.is_approved.is_(False))
    elif approval == "approved":
        query = query.filter(Job.is_approved.is_(True))
    elif approval == "all":
        pass
    else:
        return jsonify({"message": "Invalid approval filter"}), 400

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        {
            "items": job_list_schema.dump(pagination.items),
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
        }
    )


@admin_bp.get("/jobs/pending")
@jwt_required()
def list_pending_jobs():
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
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
        .filter(Job.is_approved.is_(False))
        .order_by(Job.created_at.desc())
    )
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify(
        {
            "items": job_list_schema.dump(pagination.items),
            "page": page,
            "per_page": per_page,
            "total": pagination.total,
        }
    )


@admin_bp.patch("/jobs/<int:job_id>/approve")
@jwt_required()
def approve_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
    if forbidden:
        return forbidden
    assert user is not None

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    if job.is_approved:
        return jsonify(job_schema.dump(job))

    job.is_approved = True
    job.approved_by = user.id
    job.approved_at = datetime.utcnow()
    db.session.commit()
    return jsonify(job_schema.dump(job))


@admin_bp.patch("/jobs/<int:job_id>/disapprove")
@jwt_required()
def disapprove_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
    if forbidden:
        return forbidden
    assert user is not None

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    job.is_approved = False
    job.approved_by = None
    job.approved_at = None
    db.session.commit()
    return jsonify(job_schema.dump(job))


@admin_bp.delete("/jobs/<int:job_id>")
@jwt_required()
def delete_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"admin"})
    if forbidden:
        return forbidden
    assert user is not None

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    db.session.delete(job)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204
