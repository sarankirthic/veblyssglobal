def _create_category(auth_client, slug="leather-goods"):
    resp = auth_client.post(
        "/api/v1/categories",
        json={"name": "Leather Goods", "slug": slug, "displayOrder": 1},
    )
    assert resp.status_code == 201
    return resp.json["data"]


def test_create_category_requires_auth(client):
    resp = client.post("/api/v1/categories", json={"name": "x", "slug": "x", "displayOrder": 0})
    assert resp.status_code == 401


def test_public_can_list_categories(client, auth_client):
    _create_category(auth_client)
    resp = client.get("/api/v1/categories")
    assert resp.status_code == 200
    assert len(resp.json["data"]) == 1


def test_duplicate_category_slug_conflicts(auth_client):
    _create_category(auth_client)
    resp = auth_client.post(
        "/api/v1/categories", json={"name": "Dup", "slug": "leather-goods", "displayOrder": 2}
    )
    assert resp.status_code == 409


def test_create_and_fetch_product(client, auth_client):
    category = _create_category(auth_client)
    resp = auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Leather Portfolio",
            "slug": "leather-portfolio",
            "materials": "Full-grain leather",
            "specs": [{"key": "Care", "value": "Wipe clean"}],
            "images": ["https://media.example.com/a.webp"],
        },
    )
    assert resp.status_code == 201
    product_id = resp.json["data"]["id"]

    get_resp = client.get(f"/api/v1/products/{product_id}")
    assert get_resp.status_code == 200
    assert get_resp.json["data"]["name"] == "Leather Portfolio"
    assert get_resp.json["data"]["category"] == "Leather Goods"


def test_product_defaults_show_in_gallery_false(client, auth_client):
    category = _create_category(auth_client)
    resp = auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Leather Portfolio",
            "slug": "leather-portfolio-gallery-default",
        },
    )
    assert resp.status_code == 201
    assert resp.json["data"]["showInGallery"] is False


def test_create_product_with_show_in_gallery_true(client, auth_client):
    category = _create_category(auth_client)
    resp = auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Copper Bottle",
            "slug": "copper-bottle-gallery-flag",
            "showInGallery": True,
        },
    )
    assert resp.status_code == 201
    assert resp.json["data"]["showInGallery"] is True


def test_update_product_toggles_show_in_gallery(client, auth_client):
    category = _create_category(auth_client)
    create_resp = auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Copper Bottle",
            "slug": "copper-bottle-gallery-toggle",
        },
    )
    product_id = create_resp.json["data"]["id"]
    assert create_resp.json["data"]["showInGallery"] is False

    update_resp = auth_client.put(
        f"/api/v1/products/{product_id}",
        json={
            "categoryId": category["id"],
            "name": "Copper Bottle",
            "slug": "copper-bottle-gallery-toggle",
            "showInGallery": True,
        },
    )
    assert update_resp.status_code == 200
    assert update_resp.json["data"]["showInGallery"] is True


def test_filter_products_by_show_in_gallery(client, auth_client):
    category = _create_category(auth_client)
    auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "In Gallery",
            "slug": "in-gallery-product",
            "showInGallery": True,
        },
    )
    auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Not In Gallery",
            "slug": "not-in-gallery-product",
            "showInGallery": False,
        },
    )
    resp = client.get("/api/v1/products?show_in_gallery=true")
    assert resp.status_code == 200
    names = [p["name"] for p in resp.json["data"]]
    assert names == ["In Gallery"]


def test_unpublished_product_hidden_from_public(client, auth_client):
    category = _create_category(auth_client)
    resp = auth_client.post(
        "/api/v1/products",
        json={
            "categoryId": category["id"],
            "name": "Draft Item",
            "slug": "draft-item",
            "isPublished": False,
        },
    )
    product_id = resp.json["data"]["id"]

    get_resp = client.get(f"/api/v1/products/{product_id}")
    assert get_resp.status_code == 404
