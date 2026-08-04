from app.extensions import db
from app.models.mixins import TimestampMixin, uuid_pk


class GalleryAlbum(db.Model, TimestampMixin):
    __tablename__ = "gallery_albums"

    id = uuid_pk()
    name = db.Column(db.String(160), nullable=False)
    slug = db.Column(db.String(180), unique=True, nullable=False, index=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)

    images = db.relationship(
        "GalleryImage",
        back_populates="album",
        order_by="GalleryImage.order",
        cascade="all, delete-orphan",
        lazy="selectin",
    )

    def to_dict(self, include_images: bool = True) -> dict:
        data = {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "displayOrder": self.display_order,
            "imageCount": len(self.images),
        }
        if include_images:
            data["images"] = [img.to_dict() for img in self.images]
        return data


class GalleryImage(db.Model, TimestampMixin):
    __tablename__ = "gallery_images"

    id = uuid_pk()
    album_id = db.Column(db.String(36), db.ForeignKey("gallery_albums.id"), nullable=False, index=True)
    url = db.Column(db.String(500), nullable=False)
    alt_text = db.Column(db.String(300), nullable=True)
    order = db.Column(db.Integer, nullable=False, default=0)

    album = db.relationship("GalleryAlbum", back_populates="images")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "albumId": self.album_id,
            "url": self.url,
            "altText": self.alt_text,
            "order": self.order,
        }
