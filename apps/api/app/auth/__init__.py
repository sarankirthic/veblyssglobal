from flask_openapi3 import APIBlueprint

auth_bp = APIBlueprint("auth", __name__, url_prefix="/api/v1/auth", abp_tags=[])

from app.auth import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.auth import views  # noqa: E402,F401  (registers routes on auth_bp)
