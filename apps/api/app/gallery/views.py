from flask import jsonify
from sqlalchemy.exc import IntegrityError

from app.auth.models import Role
from app.common.activity import log_activity
from app.common.auth_guards import load_current_user, require_role
from app.common.errors import ApiError
from app.extensions import db
from app.gallery import gallery_bp
from app.gallery.models import GalleryAlbum, GalleryImage
from app.schemas.gallery import AlbumBody, AlbumPath, ImageBody, ImagePath, ReorderBody


@gallery_bp.get("/albums")
def list_albums():
    albums = GalleryAlbum.query.order_by(GalleryAlbum.display_order.asc()).all()
    return jsonify({"data": [a.to_dict(include_images=False) for a in albums]})


@gallery_bp.get("/albums/<album_id>")
def get_album(path: AlbumPath):
    album = db.session.get(GalleryAlbum, path.album_id)
    if album is None:
        raise ApiError("Album not found.", status_code=404, code="not_found")
    return jsonify({"data": album.to_dict()})


@gallery_bp.post("/albums")
@require_role(Role.ADMIN, Role.EDITOR)
def create_album(body: AlbumBody):
    album = GalleryAlbum(name=body.name, slug=body.slug, display_order=body.displayOrder)
    db.session.add(album)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        raise ApiError("An album with that slug already exists.", status_code=409, code="conflict")
    log_activity("create", "gallery_album", album.id, load_current_user().id)
    return jsonify({"data": album.to_dict()}), 201


@gallery_bp.delete("/albums/<album_id>")
@require_role(Role.ADMIN)
def delete_album(path: AlbumPath):
    album = db.session.get(GalleryAlbum, path.album_id)
    if album is None:
        raise ApiError("Album not found.", status_code=404, code="not_found")
    db.session.delete(album)
    db.session.commit()
    log_activity("delete", "gallery_album", path.album_id, load_current_user().id)
    return jsonify({"ok": True})


@gallery_bp.post("/albums/<album_id>/images")
@require_role(Role.ADMIN, Role.EDITOR)
def add_image(path: AlbumPath, body: ImageBody):
    if db.session.get(GalleryAlbum, path.album_id) is None:
        raise ApiError("Album not found.", status_code=404, code="not_found")
    image = GalleryImage(album_id=path.album_id, url=body.url, alt_text=body.altText, order=body.order)
    db.session.add(image)
    db.session.commit()
    log_activity("create", "gallery_image", image.id, load_current_user().id)
    return jsonify({"data": image.to_dict()}), 201


@gallery_bp.delete("/albums/<album_id>/images/<image_id>")
@require_role(Role.ADMIN, Role.EDITOR)
def delete_image(path: ImagePath):
    image = GalleryImage.query.filter_by(id=path.image_id, album_id=path.album_id).first()
    if image is None:
        raise ApiError("Image not found.", status_code=404, code="not_found")
    db.session.delete(image)
    db.session.commit()
    log_activity("delete", "gallery_image", path.image_id, load_current_user().id)
    return jsonify({"ok": True})


@gallery_bp.put("/albums/<album_id>/order")
@require_role(Role.ADMIN, Role.EDITOR)
def reorder_images(path: AlbumPath, body: ReorderBody):
    """Bulk-set image order — admin drags images into a new sequence."""
    images = {img.id: img for img in GalleryImage.query.filter_by(album_id=path.album_id).all()}
    for position, image_id in enumerate(body.imageIds):
        if image_id in images:
            images[image_id].order = position
    db.session.commit()
    log_activity("update", "gallery_album_order", path.album_id, load_current_user().id)
    return jsonify({"ok": True})
