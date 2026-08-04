from app.common.mixins import TimestampMixin, uuid_pk
from app.extensions import db


class ContactSubmission(db.Model, TimestampMixin):
    __tablename__ = "contact_submissions"
    id = uuid_pk()
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(255), nullable=False, index=True)
    country = db.Column(db.String(120), nullable=True)
    interest = db.Column(db.String(200), nullable=True)
    message = db.Column(db.Text, nullable=False)
    source = db.Column(db.String(60), nullable=False, default="form")  # form | whatsapp | email

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "country": self.country,
            "interest": self.interest,
            "message": self.message,
            "source": self.source,
            "createdAt": self.created_at.isoformat(),
        }
