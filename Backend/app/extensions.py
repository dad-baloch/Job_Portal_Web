from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from flask_cors import CORS

# Central place to initialize extensions before attaching them to the app.
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
ma = Marshmallow()


def init_extensions(app):
    """Bind extensions to the Flask app and configure CORS."""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)

    # CORS is configured to allow the React frontend to call the API.
    CORS(
        app,
        resources={
            r"/api/*": {"origins": app.config.get("CORS_ORIGINS", "*")}},
        supports_credentials=True,
    )
