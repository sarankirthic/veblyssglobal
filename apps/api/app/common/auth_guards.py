"""Session-cookie auth guards — the RBAC layer from ARCHITECTURE.md §6.

Session is an HttpOnly/Secure/SameSite cookie (configured in config.py) holding
just the user id; Flask's signed session cookie (itsdangerous) stands in for
Better Auth/Auth.js here, giving the same "no client-readable token" guarantee.
"""
from functools import wraps

from flask import g, session

from app.common.errors import ApiError
from app.extensions import db


def load_current_user():
    from app.models.user import User

    if g.get("current_user") is not None:
        return g.current_user

    user_id = session.get("user_id")
    if not user_id:
        g.current_user = None
        return None

    user = db.session.get(User, user_id)
    if user is None or not user.is_active:
        g.current_user = None
        return None

    g.current_user = user
    return user


def require_auth(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        user = load_current_user()
        if user is None:
            raise ApiError("Authentication required.", status_code=401, code="unauthorized")
        return fn(*args, **kwargs)

    return wrapper


def require_role(*roles):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = load_current_user()
            if user is None:
                raise ApiError("Authentication required.", status_code=401, code="unauthorized")
            if user.role not in roles:
                raise ApiError("You don't have permission to do that.", status_code=403, code="forbidden")
            return fn(*args, **kwargs)

        return wrapper

    return decorator
