from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from app.extensions import db
from app.models import Role, User, JobSeekerProfile
from app.schemas import RegisterSchema, LoginSchema, UserSchema

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/register")
def register():
    payload = RegisterSchema().load(request.get_json() or {})
    email = payload["email"].lower()

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400

    user = User(email=email, role=Role(payload["role"]))
    user.set_password(payload["password"])
    db.session.add(user)
    db.session.flush()  # ensure user.id is available

    if user.role == Role.JOB_SEEKER:
        profile = JobSeekerProfile(
            user_id=user.id,
            full_name=payload.get("full_name"),
            location=payload.get("location"),
            skills={},
        )
        db.session.add(profile)

    db.session.commit()

    # JWT spec requires the `sub` (subject) claim to be a string.
    # Flask-JWT-Extended stores `identity` in `sub`, so keep it as a string and
    # put extra data (like role) into additional claims.
    access_token = create_access_token(
        identity=str(user.id), additional_claims={"role": user.role.value}
    )
    return jsonify({"token": access_token, "user": UserSchema().dump(user)}), 201


@auth_bp.post("/login")
def login():
    payload = LoginSchema().load(request.get_json() or {})
    user = User.query.filter_by(email=payload["email"].lower()).first()

    if not user or not user.check_password(payload["password"]):
        return jsonify({"message": "Invalid credentials"}), 401

    access_token = create_access_token(
        identity=str(user.id), additional_claims={"role": user.role.value}
    )
    return jsonify({"token": access_token, "user": UserSchema().dump(user)})


@auth_bp.get("/me")
@jwt_required()
def me():
    identity = get_jwt_identity()
    if not identity:
        return jsonify({"message": "User not found"}), 404
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return jsonify({"message": "User not found"}), 404

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
    return jsonify(UserSchema().dump(user))
