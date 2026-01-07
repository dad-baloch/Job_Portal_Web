from flask import jsonify
from flask_jwt_extended import get_jwt_identity

from app.models import User


def get_current_user() -> User | None:
    identity = get_jwt_identity()
    if not identity:
        return None
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        return None
    return User.query.get(user_id)


def require_role(user: User | None, allowed: set[str]):
    if user is None:
        return jsonify({"message": "Forbidden"}), 403
    role_value = getattr(user.role, "value", user.role)
    if role_value not in allowed:
        return jsonify({"message": "Forbidden"}), 403
    return None
