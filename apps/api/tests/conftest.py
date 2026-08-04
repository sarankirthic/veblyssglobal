import pytest

from app import create_app
from app.config import TestConfig
from app.extensions import db as _db
from app.models.user import Role, User


@pytest.fixture()
def app():
    application = create_app(TestConfig)
    with application.app_context():
        _db.create_all()

    # Context is NOT held open across the yield: each test_client() call must
    # push its own fresh request/app context, exactly like a real WSGI request
    # does. Holding one open here would let flask.g (and its current-user
    # cache) leak between requests within a single test.
    yield application

    with application.app_context():
        _db.session.remove()
        _db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def admin_user(app):
    with app.app_context():
        user = User(email="admin@veblyss-tests.local.dev", name="Admin", role=Role.ADMIN)
        user.set_password("supersecret123")
        _db.session.add(user)
        _db.session.commit()
        _db.session.refresh(user)
        _db.session.expunge(user)
    return user


@pytest.fixture()
def auth_client(client, admin_user):
    resp = client.post(
        "/api/v1/auth/login",
        json={"email": admin_user.email, "password": "supersecret123"},
    )
    assert resp.status_code == 200
    return client
