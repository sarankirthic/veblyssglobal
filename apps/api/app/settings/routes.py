from flask import jsonify
from flask_openapi3 import APIBlueprint

from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_role
from app.extensions import db
from app.models.setting import SiteSetting
from app.models.user import Role
from app.schemas.settings import SettingBody, SettingPath

settings_bp = APIBlueprint("settings", __name__, url_prefix="/api/v1/settings")

# Seed keys this endpoint expects the Admin Panel's Site Settings module to manage —
# see ARCHITECTURE.md §4.2 and §13 ("single source of truth for content").
KNOWN_KEYS = {"contact_details", "differentiators", "social_links", "site_meta"}


@settings_bp.get("")
def list_settings():
    """Public read — the web app pulls contact details/differentiators from here
    so they can never drift between pages again."""
    rows = SiteSetting.query.all()
    return jsonify({"data": {row.key: row.value for row in rows}})


@settings_bp.get("/<key>")
def get_setting(path: SettingPath):
    row = db.session.get(SiteSetting, path.key)
    if row is None:
        return jsonify({"data": None}), 200
    return jsonify({"data": row.to_dict()})


@settings_bp.put("/<key>")
@require_role(Role.ADMIN, Role.EDITOR)
def upsert_setting(path: SettingPath, body: SettingBody):
    row = db.session.get(SiteSetting, path.key)
    if row is None:
        row = SiteSetting(key=path.key, value=body.value)
        db.session.add(row)
    else:
        row.value = body.value

    db.session.commit()
    log_activity("update", "setting", path.key, load_current_user().id)
    return jsonify({"data": row.to_dict()})
