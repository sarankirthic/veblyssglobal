from sqlalchemy.dialects.postgresql import JSONB

from app.common.mixins import TimestampMixin, uuid_pk
from app.extensions import db

JsonType = db.JSON().with_variant(JSONB, "postgresql")


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
    specs = db.Column(JsonType, nullable=False, default=list)
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
