from flask import jsonify
from flask_openapi3 import APIBlueprint

from app.common.auth_guards import require_role
from app.common.errors import ApiError
from app.extensions import db
from app.models.contact import ContactSubmission
from app.models.metric import MetricEvent
from app.models.user import Role
from app.schemas.contact import ContactQuery, ContactSubmissionBody

contact_bp = APIBlueprint("contact", __name__, url_prefix="/api/v1/contact")


@contact_bp.post("")
def submit(body: ContactSubmissionBody):
    """Public enquiry form endpoint — no auth required to submit."""
    submission = ContactSubmission(
        name=body.name,
        email=str(body.email),
        country=body.country,
        interest=body.interest,
        message=body.message,
        source="form",
    )
    db.session.add(submission)
    db.session.add(MetricEvent(type="enquiry", path="/contact"))
    db.session.commit()

    return jsonify({"data": {"id": submission.id}}), 201


@contact_bp.get("")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def list_submissions(query: ContactQuery):
    """Admin-only: browse enquiries for the Metrics Dashboard's enquiry funnel view."""
    q = ContactSubmission.query.order_by(ContactSubmission.created_at.desc())
    total = q.count()
    items = q.offset((query.page - 1) * query.per_page).limit(query.per_page).all()
    return jsonify(
        {
            "data": [s.to_dict() for s in items],
            "meta": {"page": query.page, "perPage": query.per_page, "total": total},
        }
    )


@contact_bp.get("/<submission_id>")
@require_role(Role.ADMIN, Role.EDITOR, Role.VIEWER)
def get_submission(submission_id: str):
    submission = db.session.get(ContactSubmission, submission_id)
    if submission is None:
        raise ApiError("Submission not found.", status_code=404, code="not_found")
    return jsonify({"data": submission.to_dict()})
