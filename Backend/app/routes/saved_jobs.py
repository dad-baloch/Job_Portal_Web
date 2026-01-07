from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.extensions import db
from app.models import Job, SavedJob
from app.routes.utils import get_current_user, require_role
from app.schemas import SavedJobSchema

saved_jobs_bp = Blueprint("saved_jobs", __name__)
saved_job_schema = SavedJobSchema()
saved_job_list_schema = SavedJobSchema(many=True)


@saved_jobs_bp.post("/<int:job_id>")
@jwt_required()
def save_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"job_seeker"})
    if forbidden:
        return forbidden

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    saved_job = SavedJob(user_id=user.id, job_id=job.id)
    db.session.add(saved_job)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Job already saved"}), 400

    return jsonify(saved_job_schema.dump(saved_job)), 201


@saved_jobs_bp.delete("/<int:job_id>")
@jwt_required()
def unsave_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"job_seeker"})
    if forbidden:
        return forbidden

    saved_job = SavedJob.query.filter_by(
        user_id=user.id, job_id=job_id).first()
    if not saved_job:
        return jsonify({"message": "Saved job not found"}), 404

    db.session.delete(saved_job)
    db.session.commit()
    return jsonify({"message": "Removed"}), 204


@saved_jobs_bp.get("/")
@jwt_required()
def list_saved_jobs():
    user = get_current_user()
    forbidden = require_role(user, {"job_seeker"})
    if forbidden:
        return forbidden

    saved = (
        SavedJob.query.options(selectinload(SavedJob.job))
        .filter_by(user_id=user.id)
        .order_by(SavedJob.created_at.desc())
        .all()
    )
    return jsonify(saved_job_list_schema.dump(saved))
