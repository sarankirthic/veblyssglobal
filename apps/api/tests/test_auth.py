def test_login_wrong_password_rejected(client, admin_user):
    resp = client.post(
        "/api/v1/auth/login", json={"email": admin_user.email, "password": "wrong-password"}
    )
    assert resp.status_code == 401
    assert resp.json["error"]["code"] == "invalid_credentials"


def test_login_then_me(client, admin_user):
    resp = client.post(
        "/api/v1/auth/login", json={"email": admin_user.email, "password": "supersecret123"}
    )
    assert resp.status_code == 200
    assert resp.json["user"]["email"] == admin_user.email

    me = client.get("/api/v1/auth/me")
    assert me.status_code == 200
    assert me.json["user"]["role"] == "admin"


def test_me_requires_auth(client):
    resp = client.get("/api/v1/auth/me")
    assert resp.status_code == 401


def test_logout_clears_session(auth_client):
    resp = auth_client.post("/api/v1/auth/logout")
    assert resp.status_code == 200

    me = auth_client.get("/api/v1/auth/me")
    assert me.status_code == 401
