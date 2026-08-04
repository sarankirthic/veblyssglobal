from datetime import datetime, timezone

from flask import jsonify, session

from app.auth import auth_bp
from app.auth.models import User
from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_auth
from app.common.errors import ApiError
from app.extensions import db, limiter
from app.schemas.auth import LoginBody


@auth_bp.post("/login")
@limiter.limit("10 per minute")
def login(body: LoginBody):
    """Authenticate and start an HttpOnly session — mirrors ARCHITECTURE.md §6."""
    user = User.query.filter_by(email=body.email.lower()).first()
    if user is None or not user.check_password(body.password):
        log_activity("login_failed", "session")
        raise ApiError("Invalid email or password.", status_code=401, code="invalid_credentials")
    if not user.is_active:
        raise ApiError("This account is disabled.", status_code=403, code="account_disabled")
    session.clear()
    session.permanent = True
    session["user_id"] = user.id
    user.last_login_at = datetime.now(timezone.utc)
    db.session.commit()
    log_activity("login", "session", user_id=user.id)
    return jsonify({"user": user.to_public_dict()})


@auth_bp.post("/logout")
@require_auth
def logout():
    user = load_current_user()
    session.clear()
    if user:
        log_activity("logout", "session", user_id=user.id)
    return jsonify({"ok": True})


@auth_bp.get("/me")
@require_auth
def me():
    user = load_current_user()
    return jsonify({"user": user.to_public_dict()})
