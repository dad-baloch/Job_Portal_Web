from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import selectinload

from app.extensions import db
from app.models import Application, ApplicationStatus, Job, User
from app.routes.utils import get_current_user, require_role
from app.schemas import ApplicationSchema

applications_bp = Blueprint("applications", __name__)
application_schema = ApplicationSchema()
application_list_schema = ApplicationSchema(many=True)


@applications_bp.post("/")
@jwt_required()
def apply():
    user = get_current_user()
    forbidden = require_role(user, {"job_seeker"})
    if forbidden:
        return forbidden
    assert user is not None

    payload = request.get_json() or {}
    job_id = payload.get("job_id")
    if not job_id:
        return jsonify({"message": "job_id is required"}), 400

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    application = Application()
    application.user_id = user.id
    application.job_id = job.id
    application.cover_letter = payload.get("cover_letter")
    db.session.add(application)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"message": "Application already submitted"}), 400

    return jsonify(application_schema.dump(application)), 201


@applications_bp.get("/me")
@jwt_required()
def my_applications():
    user = get_current_user()
    forbidden = require_role(user, {"job_seeker"})
    if forbidden:
        return forbidden
    assert user is not None

    apps = (
        Application.query.options(selectinload(Application.job))
        .filter_by(user_id=user.id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return jsonify(application_list_schema.dump(apps))


@applications_bp.patch("/<int:application_id>/status")
@jwt_required()
def update_status(application_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"employer"})
    if forbidden:
        return forbidden
    assert user is not None

    payload = request.get_json() or {}
    new_status = payload.get("status")
    if new_status not in [s.value for s in ApplicationStatus]:
        return jsonify({"message": "Invalid status"}), 400

    application = Application.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    # Ensure the employer owns the job before changing status.
    if application.job.created_by != user.id:
        return jsonify({"message": "Forbidden"}), 403

    application.status = new_status
    db.session.commit()
    return jsonify(application_schema.dump(application))


@applications_bp.get("/job/<int:job_id>")
@jwt_required()
def applications_for_job(job_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"employer"})
    if forbidden:
        return forbidden
    assert user is not None

    job = Job.query.get(job_id)
    if not job:
        return jsonify({"message": "Job not found"}), 404

    if job.created_by != user.id:
        return jsonify({"message": "Forbidden"}), 403

    apps = (
        Application.query.options(
            selectinload(Application.job),
            selectinload(Application.applicant),
            selectinload(Application.applicant).selectinload(User.profile),
        )
        .filter(Application.job_id == job_id)
        .order_by(Application.created_at.desc())
        .all()
    )
    return jsonify(application_list_schema.dump(apps))


@applications_bp.delete("/<int:application_id>")
@jwt_required()
def delete_application(application_id: int):
    user = get_current_user()
    forbidden = require_role(user, {"employer"})
    if forbidden:
        return forbidden
    assert user is not None

    application = Application.query.get(application_id)
    if not application:
        return jsonify({"message": "Application not found"}), 404

    # Ensure the employer owns the job before deleting.
    if application.job.created_by != user.id:
        return jsonify({"message": "Forbidden"}), 403

    db.session.delete(application)
    db.session.commit()
    return ("", 204)
