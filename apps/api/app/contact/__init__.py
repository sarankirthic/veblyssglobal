from flask_openapi3 import APIBlueprint

contact_bp = APIBlueprint("contact", __name__, url_prefix="/api/v1/contact")

from app.contact import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.contact import views  # noqa: E402,F401  (registers routes on contact_bp)
