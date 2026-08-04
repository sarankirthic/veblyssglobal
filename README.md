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
| **`apps/web`** | Public storefront — everything a customer sees | Next.js 15 (App Router), React 19, TanStack Query, React Hook Form + Zod |
| **`apps/api`** | REST API — products, gallery, contact, auth, media, metrics | Flask 3, SQLAlchemy 2 + Alembic, Pydantic v2, PostgreSQL |

`apps/admin` (an internal admin panel + metrics dashboard) is designed in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) but not yet built.

## Features

**Storefront**
- Home, About, Products (6 category pages), Gallery, Blog, FAQ, and Contact — all server-rendered
- Product category pages with per-category "why choose" copy, spec sheets, and material guarantees
- Working contact form (validated client + server side, submits straight to the API)
- Content pulled live from the API — categories, products, and site settings aren't hardcoded

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
<summary><strong>Datastores via Docker</strong></summary>

```bash
docker compose up --build   # postgres + redis + api, all wired together
```
</details>

## Testing

```bash
cd apps/api && pytest -q     # 13 tests — auth, RBAC, products, contact, settings
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
├── docker-compose.yml       Local postgres + redis + api orchestration
└── start.sh                  One-command dev/prod orchestration
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full target architecture and
[`docs/STRUCTURE.md`](docs/STRUCTURE.md) for the page-by-page content spec.

## Deployment

- **Storefront** — deploys cleanly to Vercel (Next.js 15, App Router, zero extra config beyond `NEXT_PUBLIC_API_URL`).
- **API** — ships as a container via `Dockerfile.api`; `docker-compose.yml` covers local orchestration as a starting point for a hosted deploy target.

## For maintainers

Architecture deviations, gotchas already hit and fixed, and code conventions live in
[`CONTRIBUTING.md`](CONTRIBUTING.md) — read that before making non-trivial changes.

## Known gaps

Tracked in [`TODO.md`](TODO.md) — mostly real business facts still needed (pricing, delivery
windows, return policy, payment methods) that are currently honest placeholders in the copy
rather than fabricated numbers.
