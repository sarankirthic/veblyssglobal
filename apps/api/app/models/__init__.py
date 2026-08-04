"""Import every model so Flask-Migrate/Alembic can discover metadata."""
from app.models.user import User, Role  # noqa: F401
from app.models.category import Category  # noqa: F401
from app.models.product import Product  # noqa: F401
from app.models.gallery import GalleryAlbum, GalleryImage  # noqa: F401
from app.models.contact import ContactSubmission  # noqa: F401
from app.models.setting import SiteSetting  # noqa: F401
from app.models.metric import MetricEvent, ActivityLog  # noqa: F401
