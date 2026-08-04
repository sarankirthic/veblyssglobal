from flask import jsonify, request

from app.auth.models import Role
from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_role
from app.common.errors import ApiError
from app.media import media_bp
from app.media.helpers.storage import delete_image, upload_image


@media_bp.post("/upload")
@require_role(Role.ADMIN, Role.EDITOR)
def upload():
    """Upload a product/gallery image. multipart/form-data, field name 'file'.
    Validates type/size, then hands off to Pillow for resize + WebP
    conversion before storing in R2 — see app/media/helpers/storage.py.
    """
    from flask import current_app

    if "file" not in request.files:
        raise ApiError("No file provided.", status_code=400, code="bad_request")
    file = request.files["file"]
    if file.filename == "":
        raise ApiError("No file selected.", status_code=400, code="bad_request")
    if file.mimetype not in current_app.config["ALLOWED_IMAGE_TYPES"]:
        raise ApiError(
            f"Unsupported file type: {file.mimetype}. Allowed: jpeg, png, webp.",
            status_code=422,
            code="unsupported_type",
        )
    raw = file.read()
    if len(raw) > current_app.config["MAX_CONTENT_LENGTH"]:
        raise ApiError("File too large.", status_code=413, code="file_too_large")
    folder = request.form.get("folder", "products")
    result = upload_image(raw, file.filename, folder=folder)
    log_activity("create", "media", result["key"], load_current_user().id)
    return jsonify({"data": result}), 201


@media_bp.delete("/<path:key>")
@require_role(Role.ADMIN, Role.EDITOR)
def remove(key: str):
    delete_image(key)
    log_activity("delete", "media", key, load_current_user().id)
    return jsonify({"ok": True})
