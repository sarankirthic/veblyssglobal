from app.extensions import db
from app.models.mixins import uuid_pk
from datetime import datetime, timezone


class MetricEvent(db.Model):
    __tablename__ = "metric_events"

    id = uuid_pk()
    type = db.Column(db.String(60), nullable=False, index=True)  # pageview | enquiry | product_view ...
    path = db.Column(db.String(300), nullable=True)
    referrer = db.Column(db.String(300), nullable=True)
    country = db.Column(db.String(2), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "type": self.type,
            "path": self.path,
            "referrer": self.referrer,
            "country": self.country,
            "createdAt": self.created_at.isoformat(),
        }


class ActivityLog(db.Model):
    __tablename__ = "activity_logs"

    id = uuid_pk()
    user_id = db.Column(db.String(36), db.ForeignKey("users.id"), nullable=True, index=True)
    action = db.Column(db.String(80), nullable=False)  # create | update | delete | login | login_failed
    entity = db.Column(db.String(80), nullable=False)  # product | gallery_image | setting | session ...
    entity_id = db.Column(db.String(36), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "userId": self.user_id,
            "action": self.action,
            "entity": self.entity,
            "entityId": self.entity_id,
            "createdAt": self.created_at.isoformat(),
        }
