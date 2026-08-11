<div align="center">

# VeBlyss Global

**Everyday pieces, made by hand.**
A D2C storefront for handcrafted Indian goods — leather, copperware, jewellery, home decor,
sustainable lifestyle products, and curated Indian pantry essentials — each traced back to a
named artisan community.

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-149ECA?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Flask](https://img.shields.io/badge/Flask-3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

[![Status](https://img.shields.io/badge/status-in_development-orange?style=flat-square)]()
[![License](https://img.shields.io/badge/license-private-lightgrey?style=flat-square)]()
[![Package Manager](https://img.shields.io/badge/pnpm-9-F69220?style=flat-square&logo=pnpm&logoColor=white)]()
[![Monorepo](https://img.shields.io/badge/monorepo-turborepo-EF4444?style=flat-square&logo=turborepo&logoColor=white)]()

**[Live Site (soon)](#deployment)** · [API Docs](#api-documentation) · [Architecture](docs/ARCHITECTURE.md) · [Brand Guide](docs/BRAND.md)

</div>

---

## What's in the box

A two-app monorepo: a public storefront and the API behind it.

| App | What it is | Stack |
|---|---|---|
| **`apps/web`** | Public storefront + admin panel (`/admin/*`) | Next.js 15 (App Router), React 19, TanStack Query, React Hook Form + Zod |
| **`apps/api`** | REST API — products, gallery, contact, auth, media, metrics | Flask 3, SQLAlchemy 2 + Alembic, Pydantic v2, PostgreSQL |

`docs/ARCHITECTURE.md` designs the admin panel as a separate `apps/admin` app. Per
explicit request it instead lives inside `apps/web` at `/admin/*` — one Next.js app,
one deploy. See `CONTRIBUTING.md` for the rationale.

## Features

**Storefront**
- Home, About, Products (6 category pages), Gallery, Certifications, FAQ, Our Promise, and Contact — all server-rendered
- Product category pages with per-category "why choose" copy, spec sheets, and material guarantees
- Gallery combines manually-curated albums (admin-managed) with per-product photos — any product can opt in via a "Show in Gallery" toggle instead of re-uploading the same image
- Certifications page lists all 16 real certifications/registrations behind the business
- Working contact form (validated client + server side, submits straight to the API)
- Content pulled live from the API — categories, products, and site settings aren't hardcoded
- No Blog — an earlier pass had one with fabricated placeholder posts and no real backend; deleted rather than shipped. "Shop by Occasion" is built but currently unlinked from nav (paused, not deleted) — see `FUTURE.md`

**Admin panel** (`/admin/*`, inside `apps/web`)
- Products, categories, gallery albums, contact submissions, site settings (contact details with an add/remove office-locations list, differentiators, social links), and a metrics dashboard
- Role-gated UI (`admin` / `editor` / `viewer`) matching the API's RBAC
- `flask create-admin --email ... --name ... --password ...` creates or resets an admin user — no more manual `flask shell` (see `apps/api/README.md`)

**API**
- Modular REST surface: `auth`, `products` (categories + products), `gallery`, `media`, `contact`, `metrics`, `settings`
- Session-cookie auth with role-based access control (`admin` / `editor` / `viewer`)
- Auto-generated OpenAPI/Swagger docs straight from the request/response schemas
- Cloudflare R2 media uploads with Pillow-based image processing
- Structured JSON request logging and an activity log for admin actions

**Product categories:** Leather Goods · Copperware · Jewellery · Handcrafted Home Decor · Sustainable Lifestyle Products · Curated Indian Essentials

## Quick start

The fastest path — one script checks your toolchain, installs dependencies, runs migrations, and boots both apps:

```bash
./start.sh dev
```

| | |
|---|---|
| Storefront | `http://localhost:3000` |
| API | `http://localhost:4000/api/v1/` |
| Swagger UI | `http://localhost:4000/api/docs` |

Other `start.sh` commands:

```bash
./start.sh prod              # production build + gunicorn + next start
./start.sh restart backend   # restart just the API
./start.sh restart frontend  # restart just the storefront
./start.sh stop              # stop everything
```

### Requirements

- **Python 3.12** — `pydantic-core`/`psycopg2-binary` don't yet build on 3.14
- **Node.js ≥ 20** and **pnpm 9**
- **PostgreSQL** running locally, or via `docker compose up postgres -d`

`start.sh` bootstraps `apps/api/.env` from `.env.example` on first run — fill in real secrets before deploying anywhere.

## Manual setup

<details>
<summary><strong>API (Flask)</strong></summary>

```bash
cd apps/api
python3.12 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env       # fill in SECRET_KEY, DATABASE_URL at minimum

flask --app wsgi.py db upgrade    # apply migrations
flask --app wsgi.py seed          # optional: seed demo categories/products
python wsgi.py                    # dev server on :4000
```

Full details, including how to create the first admin user, are in [`apps/api/README.md`](apps/api/README.md).
</details>

<details>
<summary><strong>Storefront (Next.js)</strong></summary>

```bash
pnpm install                       # from repo root — this is a pnpm workspace
cp apps/web/.env.local.example apps/web/.env.local
pnpm --filter @veblyss/web dev     # dev server on :3000
```
</details>

<details>
<summary><strong>Full stack via Docker</strong></summary>

```bash
docker compose up --build   # postgres + redis + api + web, all wired together
```

`docker-compose.override.yml` (auto-merged, local-dev-only) publishes each service to its
usual host port (`:5432`, `:6379`, `:4000`, `:3001`). `docker-compose.yaml` alone — no
`docker-compose.override.yml` — is what Dokploy deploys; see
[Deployment](#deployment) below.
</details>

## Testing

```bash
cd apps/api && pytest -q     # 17 tests — auth, RBAC, products, contact, settings
pnpm --filter @veblyss/web build   # type-checks + builds the storefront
pnpm --filter @veblyss/web lint    # ESLint
```

## API documentation

Once the API is running, interactive docs are generated automatically from the same Pydantic
schemas that validate requests:

- Swagger UI — `http://localhost:4000/api/docs`
- Health check — `http://localhost:4000/api/v1/health`

## Project structure

```
veblyss/
├── apps/
│   ├── web/          Next.js storefront
│   └── api/           Flask REST API
├── docs/                Planning docs — architecture, sitemap, brand guide, content audit
├── Dockerfile.api          Container build for apps/api
├── Dockerfile.web           Container build for apps/web (self-hosted/Dokploy — Vercel doesn't use this)
├── docker/entrypoint-api.sh    Runs `flask db upgrade` before gunicorn starts (see Production operations)
├── docker-compose.yaml         Full-stack orchestration — the file Dokploy deploys
├── docker-compose.override.yml Local-dev-only host port publishing (auto-merged)
└── start.sh                      One-command dev/prod orchestration
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full target architecture and
[`docs/STRUCTURE.md`](docs/STRUCTURE.md) for the page-by-page content spec.

## Deployment

Two supported paths — pick one, don't run both against the same domain:

- **Vercel + container host** — `apps/web` deploys to Vercel (Next.js 15, App Router, zero
  extra config beyond `NEXT_PUBLIC_API_URL`); `apps/api` ships as a container via
  `Dockerfile.api` to wherever you host it.
- **Fully self-hosted via Dokploy** — `docker-compose.yaml` deploys the whole
  stack (`postgres`, `redis`, `api`, `web`) as one unit. No service publishes a fixed host
  port — routing is meant to go through Dokploy's own reverse proxy (Traefik). Set
  `NEXT_PUBLIC_API_URL` as a **build arg** for
  the `web` service (see the comment in `Dockerfile.web` — it's baked into the browser
  bundle at build time, a runtime env var alone won't do it). `web`'s server-side fetches
  (SSR, admin pages) use `INTERNAL_API_URL` instead — hardcoded in `docker-compose.yaml`
  to the compose network's `veblyss.api` service name, so they never leave the Docker
  network or depend on public DNS/the tunnel being up; only browser-side fetches need
  `NEXT_PUBLIC_API_URL` to resolve. The optional `cloudflared` service is off by default
  (`profiles: ["tunnel"]`) — only enable it if a Cloudflare Tunnel is deliberately
  replacing the platform's own ingress, not running alongside it. Dokploy has no UI
  field for compose `--profile` flags (it just runs `docker compose up -d`), so enable
  it by setting `COMPOSE_PROFILES=tunnel` as an environment variable in Dokploy's env
  var UI instead — Compose reads that as a special variable from the same `.env` it
  already writes, and it activates the profile without a CLI flag.
  - `veblyss.api`'s secrets (`SECRET_KEY`, `CORS_ORIGINS`, `R2_*`, session cookie
    settings, etc.) are **not** read from `apps/api/.env` in this deployment path —
    that file is gitignored and never exists on a host that deploys by cloning this
    repo. They're interpolated from the root `.env` instead (`${SECRET_KEY}` etc. in
    `docker-compose.yaml`), the same convention `NEXT_PUBLIC_API_URL` and
    `CLOUDFLARE_TUNNEL_TOKEN` already use. Set them in Dokploy's own env var UI
    (it writes a `.env` next to `docker-compose.yaml`, which Compose reads
    automatically) — see `apps/api/.env.example` for the full list and
    `PRODUCTION_CHECKLIST.md` for which ones still need real values.

## Production operations

<details>
<summary><strong>Run a DB migration on prod</strong></summary>

Write + test the migration locally first (never `db migrate` against prod):

```bash
cd apps/api
flask --app wsgi.py db migrate -m "describe change"
flask --app wsgi.py db upgrade   # test against local DB
```

Commit the generated file under `apps/api/migrations/versions/` and deploy as usual.

**Applying it to prod is automatic** — `Dockerfile.api`'s entrypoint
(`docker/entrypoint-api.sh`) runs `flask db upgrade` every time the `api` container
boots, before gunicorn starts serving traffic. Alembic no-ops if the schema's already
current, so this is safe on every restart/redeploy. This assumes a single `api`
replica; if this stack ever scales to multiple replicas, cold-starting them
simultaneously would race on `db upgrade` and needs a different rollout strategy
(e.g. a one-off migration job before the replicas start).

Need to run it by hand anyway (e.g. the container's crash-looping before it gets that
far)?

```bash
docker compose ps                              # find the api container
docker compose exec api flask --app wsgi.py db upgrade
```

No `docker compose` on the host? Plain docker works too:

```bash
docker exec -it <api-container-id> flask --app wsgi.py db upgrade
```

Back up first — prod data, no undo:

```bash
docker compose exec postgres pg_dump -U veblyss veblyss > backup_$(date +%F).sql
```
</details>

<details>
<summary><strong>Add a new admin/editor/viewer user on prod</strong></summary>

Use the `create-admin` CLI (`apps/api/app/auth/cli.py`) — idempotent, safe to re-run to reset a password or role:

```bash
docker compose exec api flask --app wsgi.py create-admin \
  --email person@veblyssglobal.com \
  --name "Person Name" \
  --password "strong-real-password" \
  --role admin        # or editor / viewer
```

Running the API bare (no Docker)? Drop the `docker compose exec api` prefix and run the
`flask` command directly on the host.
</details>

## For maintainers

Architecture deviations, gotchas already hit and fixed, and code conventions live in
[`CONTRIBUTING.md`](CONTRIBUTING.md) — read that before making non-trivial changes.
Before an actual production launch, work through [`PRODUCTION_CHECKLIST.md`](PRODUCTION_CHECKLIST.md)
— what's already hardened vs. what still needs a real secret or infra decision.

## Known gaps

- [`TODO.md`](TODO.md) — real business facts still needed (pricing, delivery windows, return
  policy, payment methods) that are currently honest placeholders in the copy rather than
  fabricated numbers.
- [`FUTURE.md`](FUTURE.md) — features that are built (or partly built) but deliberately not
  live right now: Shop by Occasion (paused), a real per-product detail page, the Industries
  page, and a couple of others. Check it before rebuilding something that already exists.
