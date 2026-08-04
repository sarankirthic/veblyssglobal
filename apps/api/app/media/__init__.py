from flask_openapi3 import APIBlueprint

media_bp = APIBlueprint("media", __name__, url_prefix="/api/v1/media")

from app.media import models  # noqa: E402,F401
from app.media import views  # noqa: E402,F401  (registers routes on media_bp)
