from flask import Flask, jsonify
from marshmallow import ValidationError

from config import get_config
from app.extensions import init_extensions


def create_app(config_name: str = None) -> Flask:
    app = Flask(__name__)
    cfg = get_config(config_name or app.config.get("ENV", "development"))
    app.config.from_object(cfg)

    init_extensions(app)
    register_blueprints(app)
    register_error_handlers(app)

    return app


def register_blueprints(app: Flask) -> None:
    from app.routes.auth import auth_bp
    from app.routes.jobs import jobs_bp
    from app.routes.applications import applications_bp
    from app.routes.saved_jobs import saved_jobs_bp
    from app.routes.admin import admin_bp
    from app.routes.companies import companies_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(jobs_bp, url_prefix="/api/jobs")
    app.register_blueprint(applications_bp, url_prefix="/api/applications")
    app.register_blueprint(saved_jobs_bp, url_prefix="/api/saved-jobs")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(companies_bp, url_prefix="/api/companies")


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ValidationError)
    def handle_validation_error(err: ValidationError):
        return jsonify({"message": "Validation error", "errors": err.messages}), 400

    @app.errorhandler(404)
    def handle_not_found(err):
        return jsonify({"message": "Resource not found"}), 404

    @app.errorhandler(403)
    def handle_forbidden(err):
        return jsonify({"message": "Forbidden"}), 403

    @app.errorhandler(500)
    def handle_server_error(err):
        return jsonify({"message": "Internal server error"}), 500
