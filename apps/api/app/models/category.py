from app.extensions import db
from app.models.mixins import TimestampMixin, uuid_pk


class Category(db.Model, TimestampMixin):
    __tablename__ = "categories"

    id = uuid_pk()
    name = db.Column(db.String(120), nullable=False)
    slug = db.Column(db.String(140), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    origin_region = db.Column(db.String(120), nullable=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)

    products = db.relationship("Product", back_populates="category", lazy="selectin")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "originRegion": self.origin_region,
            "displayOrder": self.display_order,
        }
