from werkzeug.security import check_password_hash, generate_password_hash

from app.common.mixins import TimestampMixin, uuid_pk
from app.extensions import db


class Role:
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"
    ALL = (ADMIN, EDITOR, VIEWER)


class User(db.Model, TimestampMixin):
    __tablename__ = "users"
    id = uuid_pk()
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default=Role.ADMIN)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    last_login_at = db.Column(db.DateTime(timezone=True), nullable=True)

    def set_password(self, raw_password: str) -> None:
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password_hash(self.password_hash, raw_password)

    def to_public_dict(self) -> dict:
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "role": self.role,
            "isActive": self.is_active,
        }
