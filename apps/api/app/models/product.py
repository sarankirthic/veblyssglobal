from sqlalchemy.dialects.postgresql import JSONB

from app.extensions import db
from app.models.mixins import TimestampMixin, uuid_pk

# JSONB is Postgres-only; fall back to generic JSON for SQLite in tests.
JsonType = db.JSON().with_variant(JSONB, "postgresql")


class Product(db.Model, TimestampMixin):
    __tablename__ = "products"

    id = uuid_pk()
    category_id = db.Column(db.String(36), db.ForeignKey("categories.id"), nullable=False, index=True)
    name = db.Column(db.String(200), nullable=False)
    slug = db.Column(db.String(220), unique=True, nullable=False, index=True)
    short_description = db.Column(db.String(400), nullable=True)
    description = db.Column(db.Text, nullable=True)

    materials = db.Column(db.String(300), nullable=True)
    dimensions = db.Column(db.String(120), nullable=True)
    moq = db.Column(db.String(60), nullable=True)
    packaging = db.Column(db.String(200), nullable=True)
    lead_time = db.Column(db.String(120), nullable=True)
    price_range = db.Column(db.String(120), nullable=True)

    # Free-form additional spec rows: [{"key": "Care", "value": "..."}]
    specs = db.Column(JsonType, nullable=False, default=list)
    # Ordered list of R2 image URLs
    images = db.Column(JsonType, nullable=False, default=list)

    featured = db.Column(db.Boolean, nullable=False, default=False)
    is_published = db.Column(db.Boolean, nullable=False, default=True)

    category = db.relationship("Category", back_populates="products")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "categoryId": self.category_id,
            "category": self.category.name if self.category else None,
            "name": self.name,
            "slug": self.slug,
            "shortDescription": self.short_description,
            "description": self.description,
            "materials": self.materials,
            "dimensions": self.dimensions,
            "moq": self.moq,
            "packaging": self.packaging,
            "leadTime": self.lead_time,
            "priceRange": self.price_range,
            "specs": self.specs or [],
            "images": self.images or [],
            "featured": self.featured,
            "isPublished": self.is_published,
        }
