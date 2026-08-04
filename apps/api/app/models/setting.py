from sqlalchemy.dialects.postgresql import JSONB

from app.extensions import db
from app.models.mixins import TimestampMixin

JsonType = db.JSON().with_variant(JSONB, "postgresql")


class SiteSetting(db.Model, TimestampMixin):
    """Single source of truth for site-wide content — fixes the duplicated
    contact-email / differentiator-list problem found in the content audit."""

    __tablename__ = "site_settings"

    key = db.Column(db.String(120), primary_key=True)
    value = db.Column(JsonType, nullable=False)

    def to_dict(self) -> dict:
        return {"key": self.key, "value": self.value, "updatedAt": self.updated_at.isoformat()}
