import os

from flask_cors import CORS
from flask_openapi3 import Info, OpenAPI

from app.common.errors import register_error_handlers
from app.common.health import health_bp
from app.common.logging import configure_logging
from app.config import Config, TestConfig
from app.extensions import db, migrate
from app.seed import register_seed_command


def create_app(config_class=None):
    if config_class is None:
        config_class = TestConfig if os.environ.get("FLASK_ENV") == "testing" else Config

    info = Info(
        title="VeBlyss API",
        version="1.0.0",
        description=(
            "REST API for the VeBlyss public site and Admin Panel. "
            "Ported from the NestJS design in docs/ARCHITECTURE.md to Flask."
        ),
    )
    app = OpenAPI(__name__, info=info, doc_prefix="/api/docs")
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)

    with app.app_context():
        from app import models  # noqa: F401  (registers all tables with SQLAlchemy metadata)

    CORS(app, origins=app.config["CORS_ORIGINS"] or [], supports_credentials=True)

    configure_logging(app)
    register_error_handlers(app)

    from app.auth.routes import auth_bp
    from app.contact.routes import contact_bp
    from app.gallery.routes import gallery_bp
    from app.media.routes import media_bp
    from app.metrics.routes import metrics_bp
    from app.products.routes import categories_bp, products_bp
    from app.settings.routes import settings_bp

    for bp in (
        health_bp,
        auth_bp,
        categories_bp,
        products_bp,
        gallery_bp,
        media_bp,
        contact_bp,
        metrics_bp,
        settings_bp,
    ):
        app.register_api(bp)

    register_seed_command(app)

    return app
