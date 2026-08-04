import os

from flask_cors import CORS
from flask_openapi3 import Info, OpenAPI
from werkzeug.middleware.proxy_fix import ProxyFix

from app.common.errors import register_error_handlers
from app.common.health import health_bp
from app.common.logging import configure_logging
from app.common.security_headers import register_security_headers
from app.config import Config, TestConfig
from app.extensions import db, limiter, migrate
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

    # Trust exactly one reverse-proxy hop (nginx/Cloudflare/load balancer in
    # front of gunicorn) for X-Forwarded-* — without this, request.scheme and
    # client IPs (used by the rate limiter below) reflect the proxy, not the
    # real client. Adjust the counts if the real deploy adds more hops.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)

    db.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)

    with app.app_context():
        # Each module's __init__.py defines its blueprint(s) and then imports
        # its own models.py + views.py, registering SQLAlchemy tables and
        # routes as a side effect of the import below.
        from app.auth import auth_bp
        from app.contact import contact_bp
        from app.gallery import gallery_bp
        from app.media import media_bp
        from app.metrics import metrics_bp
        from app.products import categories_bp, products_bp
        from app.settings import settings_bp

    CORS(app, origins=app.config["CORS_ORIGINS"] or [], supports_credentials=True)

    configure_logging(app)
    register_error_handlers(app)
    register_security_headers(app)

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
