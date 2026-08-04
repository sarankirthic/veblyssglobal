from collections import Counter
from datetime import datetime, timedelta, timezone

from flask import jsonify
from flask_openapi3 import APIBlueprint

from app.common.auth_guards import require_role
from app.extensions import db
from app.models.metric import ActivityLog, MetricEvent
from app.models.user import Role
from app.schemas.metrics import ActivityLogQuery, MetricEventBody, MetricsRangeQuery

metrics_bp = APIBlueprint("metrics", __name__, url_prefix="/api/v1/metrics")


@metrics_bp.post("/events")
def ingest_event(body: MetricEventBody):
    """Public beacon endpoint the frontend calls on pageview/product-view/etc.
    No auth — this is what populates the traffic/funnel/geo views below."""
    db.session.add(
        MetricEvent(type=body.type, path=body.path, referrer=body.referrer, country=body.country)
    )
    db.session.commit()
    return jsonify({"ok": True}), 201


def _events_since(days: int) -> list[MetricEvent]:
    since = datetime.now(timezone.utc) - timedelta(days=days)
    return MetricEvent.query.filter(MetricEvent.created_at >= since).all()


@metrics_bp.get("/traffic")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def traffic(query: MetricsRangeQuery):
    """Daily pageview counts for the Metrics Dashboard trend chart."""
    events = [e for e in _events_since(query.days) if e.type == "pageview"]
    by_day = Counter(e.created_at.date().isoformat() for e in events)
    series = [{"date": day, "count": count} for day, count in sorted(by_day.items())]
    return jsonify({"data": {"days": query.days, "total": len(events), "series": series}})


@metrics_bp.get("/funnel")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def funnel(query: MetricsRangeQuery):
    """Pageview → product view → enquiry funnel."""
    events = _events_since(query.days)
    counts = Counter(e.type for e in events)
    return jsonify(
        {
            "data": {
                "days": query.days,
                "pageviews": counts.get("pageview", 0),
                "productViews": counts.get("product_view", 0),
                "enquiries": counts.get("enquiry", 0),
            }
        }
    )


@metrics_bp.get("/products")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def product_performance(query: MetricsRangeQuery):
    """Top-viewed product paths — powers the product-performance panel."""
    events = [e for e in _events_since(query.days) if e.type == "product_view" and e.path]
    by_path = Counter(e.path for e in events)
    top = [{"path": path, "views": count} for path, count in by_path.most_common(20)]
    return jsonify({"data": {"days": query.days, "top": top}})


@metrics_bp.get("/geo")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def geo(query: MetricsRangeQuery):
    """Country breakdown — powers the geography panel."""
    events = [e for e in _events_since(query.days) if e.country]
    by_country = Counter(e.country for e in events)
    breakdown = [{"country": c, "count": count} for c, count in by_country.most_common()]
    return jsonify({"data": {"days": query.days, "breakdown": breakdown}})


@metrics_bp.get("/activity")
@require_role(Role.ADMIN)
def activity_log(query: ActivityLogQuery):
    """Admin activity log — every create/update/delete/login, per ARCHITECTURE.md §6."""
    q = ActivityLog.query.order_by(ActivityLog.created_at.desc())
    total = q.count()
    items = q.offset((query.page - 1) * query.per_page).limit(query.per_page).all()
    return jsonify(
        {
            "data": [a.to_dict() for a in items],
            "meta": {"page": query.page, "perPage": query.per_page, "total": total},
        }
    )
