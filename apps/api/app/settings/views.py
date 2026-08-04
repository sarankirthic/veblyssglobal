from flask import jsonify

from app.auth.models import Role
from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_role
from app.extensions import db
from app.schemas.settings import SettingBody, SettingPath
from app.settings import settings_bp
from app.settings.models import SiteSetting

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
