"""Write-through helper for the admin activity log (feeds the Metrics Dashboard)."""
from typing import Optional

from app.extensions import db


def log_activity(action: str, entity: str, entity_id: Optional[str] = None, user_id: Optional[str] = None) -> None:
    from app.metrics.models import ActivityLog

    db.session.add(ActivityLog(user_id=user_id, action=action, entity=entity, entity_id=entity_id))
    db.session.commit()
