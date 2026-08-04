from flask_openapi3 import APIBlueprint

settings_bp = APIBlueprint("settings", __name__, url_prefix="/api/v1/settings")

from app.settings import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.settings import views  # noqa: E402,F401  (registers routes on settings_bp)
