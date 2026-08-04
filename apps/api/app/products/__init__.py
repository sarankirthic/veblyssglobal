from flask_openapi3 import APIBlueprint

categories_bp = APIBlueprint("categories", __name__, url_prefix="/api/v1/categories")
products_bp = APIBlueprint("products", __name__, url_prefix="/api/v1/products")

from app.products import models  # noqa: E402,F401  (registers models with SQLAlchemy metadata)
from app.products import views  # noqa: E402,F401  (registers routes on categories_bp/products_bp)
