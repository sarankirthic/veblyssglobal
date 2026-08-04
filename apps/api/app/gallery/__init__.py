from flask_openapi3 import APIBlueprint

gallery_bp = APIBlueprint("gallery", __name__, url_prefix="/api/v1/gallery")

from app.gallery import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.gallery import views  # noqa: E402,F401  (registers routes on gallery_bp)
