def test_public_contact_submission(client):
    resp = client.post(
        "/api/v1/contact",
        json={"name": "Jane", "email": "jane@example.com", "message": "Interested in a wallet."},
    )
    assert resp.status_code == 201


def test_contact_list_requires_auth(client):
    resp = client.get("/api/v1/contact")
    assert resp.status_code == 401


def test_settings_upsert_and_public_read(client, auth_client):
    resp = auth_client.put(
        "/api/v1/settings/contact_details",
        json={"value": {"email": "info@veblyssglobal.com", "phone": "+44 7722 184477"}},
    )
    assert resp.status_code == 200

    public = client.get("/api/v1/settings")
    assert public.status_code == 200
    assert public.json["data"]["contact_details"]["email"] == "info@veblyssglobal.com"
