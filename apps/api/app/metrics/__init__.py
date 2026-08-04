from flask_openapi3 import APIBlueprint

metrics_bp = APIBlueprint("metrics", __name__, url_prefix="/api/v1/metrics")

from app.metrics import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.metrics import views  # noqa: E402,F401  (registers routes on metrics_bp)
