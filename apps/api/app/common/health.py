from flask import jsonify
from flask_openapi3 import APIBlueprint
from sqlalchemy import text

from app.extensions import db

health_bp = APIBlueprint("health", __name__, url_prefix="/api/v1")


@health_bp.get("/health")
def health():
    """Post-deploy smoke test target — see ARCHITECTURE.md §11 step 8."""
    try:
        db.session.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    status = "ok" if db_ok else "degraded"
    return jsonify({"status": status, "db": db_ok}), 200 if db_ok else 503
