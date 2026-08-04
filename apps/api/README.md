# apps/api — VeBlyss REST API (Flask)

Implements the backend described in [`docs/ARCHITECTURE.md`](../../docs/ARCHITECTURE.md) §5,
with **Flask substituted for NestJS** per explicit request. Everything else in
the architecture doc (Postgres, R2, RBAC, module boundaries, `/api/v1`
versioning) is kept as designed. See "Deviations from the doc" below for what
had to change as a result of the framework swap.

## Stack

| Concern | Architecture doc says | This implementation uses |
|---|---|---|
| Framework | NestJS | **Flask 3** |
| ORM | Prisma | **SQLAlchemy 2 + Alembic** (via Flask-Migrate) — Prisma is a Node-ecosystem tool; SQLAlchemy is the idiomatic Flask equivalent |
| Validation | Zod (shared across web/admin/api) | **Pydantic v2** — Zod is TypeScript-only, can't be imported into a Python service. See deviations below |
| Structured logging | Pino | **Python `logging` + `python-json-logger`** — same JSON-per-request-line behavior (request id, route, status, latency) |
| Session auth | Better Auth / Auth.js | **Flask's built-in signed session cookie** (itsdangerous) — same HttpOnly/Secure/SameSite guarantee, no separate library needed |
| OpenAPI/Swagger | Auto-generated from NestJS decorators | **flask-openapi3** — auto-generates Swagger UI/ReDoc from the same Pydantic models used for request validation, at `/api/docs` |
| Database | PostgreSQL | Unchanged |
| File storage | Cloudflare R2 | Unchanged (via `boto3`, R2's S3-compatible API) |
| Image processing | Sharp | **Pillow** — Sharp is a Node binding; Pillow is the Python equivalent |

## Deviations from the doc

- **Shared Zod validation is broken by design.** ARCHITECTURE.md §3 describes one
  Zod schema consumed by `web`, `admin`, and `api`. Once `api` is Python, it
  can't import a TypeScript schema. This service defines its own Pydantic
  schemas (`app/schemas/`) that mirror the field names and constraints of what
  the Zod schemas *would* be. **If/when `apps/web` and `apps/admin` are built,
  their Zod schemas need to be kept in sync with these by hand** — there's no
  automatic bridge. Worth revisiting if drift becomes a real problem (e.g.
  generating one from the other via `pydantic-to-typescript` or an OpenAPI
  client generator pointed at `/api/docs/openapi.json`).
- **RBAC roles**: `admin`, `editor`, `viewer` are implemented (the doc says
  "an `Admin` role for now, with the schema designed to add `Editor`/`Viewer`
  roles later" — built straight in since it cost nothing extra).

## Module layout

Each feature module is self-contained — blueprint, models, and routes live
together instead of in a central `models/`/`routes/` split:

```
app/
├── auth/            # login/logout/me, session cookies
├── products/         # categories + products CRUD
├── gallery/           # albums + images, ordering
├── media/              # R2 upload, Pillow resize/WebP
├── contact/             # public enquiry form + admin read
├── metrics/               # event ingestion, traffic/funnel/product/geo, activity log
├── settings/               # single source of truth for site-wide content
├── schemas/                  # Pydantic request/response schemas
└── common/                    # auth guards, error handlers, logging, health check, shared model mixins
```

Each `app/<module>/` follows the same internal layout (`app/auth/` is the
template):

```
app/<module>/
├── __init__.py     # defines the blueprint(s), then imports models.py + views.py to register them
├── models.py       # SQLAlchemy models owned by this module
├── views.py        # route handlers (decorate the bp imported from __init__)
├── helpers/        # pure helper functions (no Flask context)
└── workers/        # Celery background tasks (none wired up yet)
```

`media/` has no database models of its own (`models.py` is a stub — uploaded
media is referenced by URL from `Product`/`GalleryImage` rows), and its R2
client lives in `media/helpers/storage.py`.

## Running locally

```bash
cd apps/api
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt   # requirements.txt + pytest; prod images install requirements.txt only

cp .env.example .env   # fill in real values — at minimum SECRET_KEY and DATABASE_URL

flask --app wsgi.py db upgrade   # apply migrations (needs a running Postgres — see docker-compose.yml)
python wsgi.py                    # dev server on :4000, or:
gunicorn --bind 0.0.0.0:4000 wsgi:app
```

Or via Docker (Postgres + Redis + API together):

```bash
docker compose up --build
```

Swagger UI: `http://localhost:4000/api/docs`
Health check: `http://localhost:4000/api/v1/health`

## Creating the first admin user

There's no public signup route (this is an admin-only API surface plus a
public read/contact surface, matching the doc). Create the first user directly:

```bash
flask --app wsgi.py shell
>>> from app.extensions import db
>>> from app.auth.models import User, Role
>>> u = User(email="you@veblyssglobal.com", name="Your Name", role=Role.ADMIN)
>>> u.set_password("choose-a-real-password")
>>> db.session.add(u); db.session.commit()
```

## Tests

```bash
pytest -q
```

Uses an in-memory SQLite DB (`app/config.py::TestConfig`) — no Postgres needed
to run the suite. 13 tests cover auth/session lifecycle, RBAC guards,
categories/products CRUD, contact submission, and settings.

## Migrations

Standard Flask-Migrate/Alembic workflow:

```bash
flask --app wsgi.py db migrate -m "describe the change"   # autogenerate, needs a live DB to diff against
flask --app wsgi.py db upgrade                              # apply
```

The initial migration (`migrations/versions/b9d62d00878f_initial_schema.py`)
was generated and verified end-to-end against a real local Postgres instance
before being committed.
