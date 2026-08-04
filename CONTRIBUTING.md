# Maintainer guide

This is the technical reference for people working on this codebase — architecture
decisions, deviations from the plan, gotchas already hit and fixed, and where things
live. For install/run instructions or a feature overview, see [`README.md`](README.md)
instead; this doc assumes you're already past that.

## Repo shape

```
apps/
├── web/     Next.js 15 storefront (App Router)
└── api/     Flask 3 REST API
docs/        Planning docs — still the source of truth for content/structure decisions
```

`apps/admin` (Next.js admin panel + metrics dashboard, per `docs/ARCHITECTURE.md`) doesn't
exist yet. If you're building it, read that doc's admin section first and confirm scope —
it's the one piece of the original plan still unbuilt.

There used to be a hand-written static HTML site at repo root (`index.html`,
`products/*.html`, `assets/`), built before `apps/web` existed, during an early
content-rewrite pass. It duplicated `apps/web` with hardcoded (non-live) data and has
been deleted. **`.vercel/project.json` at repo root still points at the Vercel project
that served it** — that link was never repointed at `apps/web`. If you deploy `apps/web`
to Vercel, decide whether to reuse that project or create a new one; don't assume the
existing link is already correct.

There also used to be a `design/` directory — a generated design-exploration canvas
(multiple homepage visual-direction mockups, deployed to its own separate Vercel
project called "design"). It was already superseded once `apps/web` picked one
direction and implemented it, and has been deleted. **That separate Vercel project
was not deleted along with it** — only the local files were removed. If you have
Vercel access, decide whether to remove that project too.

## Why Flask instead of NestJS

`docs/ARCHITECTURE.md` §5 specifies NestJS for `apps/api`. It's Flask instead, per
explicit request — everything else in that doc (Postgres, R2, RBAC, module boundaries,
`/api/v1` versioning) was kept as designed. Full deviation table is in
[`apps/api/README.md`](apps/api/README.md). The one that actually matters day-to-day:

**Shared Zod validation is broken by design.** The architecture doc assumes one Zod
schema imported by `web`, `admin`, and `api`. A Python service can't import a
TypeScript schema, so `apps/api/app/schemas/` (Pydantic) and `apps/web/src/lib/schemas.ts`
(Zod) are two independent definitions that happen to describe the same shapes. **There
is no automatic sync between them.** If you change a field's validation on one side
(add a constraint, rename a field, change optionality), you must find and update the
other by hand, or the two apps will silently disagree about what's valid. Grep both
`app/schemas/` and `src/lib/schemas.ts` before touching any request/response shape.

## Gotchas already hit (don't re-discover these)

- **Python 3.14 will not build this venv.** `pydantic-core` and `psycopg2-binary` have
  no prebuilt wheels past 3.13, and building from source fails. Use `python3.12`
  specifically (`brew install python@3.12` on macOS). `start.sh` enforces this.
- **`pydantic.EmailStr` needs the `email-validator` extra** installed explicitly — it's
  not pulled in by `pydantic` alone.
- **`.test` / `.example` / `.invalid` / `.localhost` email domains are rejected** by
  `email-validator` (they're RFC 2606-reserved), even with deliverability checks off.
  Test fixtures use `@veblyss-tests.local.dev` instead — don't "simplify" this back to
  `.test`, it'll break the fixture.
- **`flask.g` leaks across requests if the app context is held open across a test's
  `yield`.** See the comment in `apps/api/tests/conftest.py::app` — the fixture
  deliberately does *not* wrap the `yield` in `with application.app_context():`, only
  the `create_all()`/`drop_all()` calls. Doing so previously caused
  `flask.g.current_user` (and its auth cache) to leak between sequential
  `test_client()` calls within one test, producing a phantom-logged-in-user bug in
  `test_logout_clears_session`. Don't add `pytest-flask` back either — its autouse
  fixture does the same thing and reintroduces the bug.
- **Use `db.session.get(Model, id)`, not `Model.query.get(id)`** — the latter is
  deprecated in SQLAlchemy 2.0 and logs a warning on every call. All current routes
  already do this; keep it that way in new code.
- **`create-next-app` installs whatever the latest major is (was 16.x) even if you ask
  for 15.** `apps/web/package.json` pins `next` and `eslint-config-next` to `15.5.22`
  intentionally — don't let a dependency bump drift this without checking the App
  Router / config API actually still matches (Next 16 introduced typed-route helpers
  like `LayoutProps<"/">` that don't exist in 15; an earlier generated `layout.tsx`
  used one and had to be reverted to a plain `Readonly<{ children: React.ReactNode }>`).
- **`eslint-config-next@15.5.22` exports old-style `.eslintrc` config, not flat config.**
  `apps/web/.eslintrc.json` (`{"extends": "next/core-web-vitals"}`) is the correct
  format for this version — there is no `eslint.config.mjs`, and there shouldn't be
  one unless `eslint-config-next` is upgraded to a version that ships flat config.
  Relatedly: `package.json`'s `lint` script must call **`next lint`**, not a bare
  `eslint` — bare `eslint` v9 refuses to run without a flat config file and this was
  silently broken (never actually invoked/tested) until it got caught during a
  cleanup pass.
- **`next.config.ts` sets `outputFileTracingRoot`** to the monorepo root explicitly.
  Without it, Next misdetects the workspace root because of an unrelated lockfile
  that lives outside this repo entirely (in the developer's home directory) — don't
  remove this thinking it's dead config.
- **Category marketing copy (`whyChoose`, `idealFor`, `guarantee`, hero headline) is
  NOT in the database.** It lives in `apps/web/src/lib/category-content.ts`, keyed by
  category slug. This is intentional, not a shortcut: `docs/STRUCTURE.md` §4's
  admin-editable field map doesn't list these as CMS fields, so modeling them in
  Postgres would add DB/API surface the content spec never asked for. If a future
  requirement makes these admin-editable, that's a real schema change (new columns +
  Pydantic/Zod schema updates on both sides), not a one-line edit.

## Security middleware (added during a production-hardening pass)

- **Rate limiting** — `app/extensions.py::limiter` (Flask-Limiter). Applied per-route
  via `@limiter.limit(...)`, currently on `POST /auth/login` and `POST /contact` only
  — the two unauthenticated, abuse-prone endpoints. Storage backend is
  `RATELIMIT_STORAGE_URI` in `config.py`, which is Redis if `REDIS_URL` is set,
  otherwise in-memory. In-memory is per-process — if you ever run more than one
  gunicorn worker/instance without Redis, each gets its own independent counter,
  which quietly makes the limit N× more permissive than it looks. `TestConfig` sets
  `RATELIMIT_ENABLED = False` — the limiter is a process-wide singleton, so without
  this, an earlier test's requests would count against a later test's assertions.
- **`ProxyFix`** in `app/__init__.py` — trusts one reverse-proxy hop for
  `X-Forwarded-For`/`-Proto`/`-Host`. If a real deploy adds more hops (CDN → LB →
  app), the `x_for`/`x_proto`/`x_host` counts need to go up, or `request.remote_addr`
  (which the rate limiter keys on) will resolve to the wrong hop's IP.
- **Security headers** — `app/common/security_headers.py`, plain `after_request`,
  no new dependency (flask-talisman was considered and skipped — this is a JSON API
  with no server-rendered HTML, so there's no CSP/inline-script surface to manage).

## Testing

```bash
cd apps/api && pytest -q
```

Runs against an in-memory SQLite DB (`app/config.py::TestConfig`) — no Postgres needed.
13 tests: auth/session lifecycle, RBAC guards, categories/products CRUD, contact
submission, settings. If you add a route, add a test in the matching `tests/test_*.py`
file rather than a new file, unless it's a genuinely new module.

```bash
pnpm --filter @veblyss/web build   # type-checks + builds — treat build failures as real
pnpm --filter @veblyss/web lint    # next lint, ESLint 9 via next/core-web-vitals
```

There's no component-level test suite on the frontend yet — `build` is currently the
main correctness signal for `apps/web`.

## Conventions

**API (`apps/api/app/`)** — one folder per module (`auth/`, `products/`, `gallery/`,
`media/`, `contact/`, `metrics/`, `settings/`), each following the same internal layout:
`__init__.py` defines the `flask_openapi3.APIBlueprint`(s) and then imports `models.py`
and `views.py` for their side effects (registers SQLAlchemy metadata and routes on the
blueprint — the `# noqa: F401` comments there are intentional, not oversight; a lint tool
flagging them as "unused imports" is a false positive, don't "fix" it by removing the
imports). `views.py` holds the route handlers with Pydantic-typed `body`/`path`/`query`
params; `models.py` holds the module's SQLAlchemy models; `helpers/` and `workers/` are
scaffolded per module for pure helper functions and future Celery tasks. Shared model
mixins (`TimestampMixin`, `uuid_pk`) live in `app/common/mixins.py`.

**Web (`apps/web/src/`)** — Server Components do direct async data fetching via
`src/lib/data.ts` (no React Query needed there); Client Components (forms, nav toggle)
use `"use client"` + TanStack Query for mutations. `src/lib/api.ts` is the one place
that knows about `NEXT_PUBLIC_API_URL` and response envelopes — don't call `fetch()`
directly from a page or component. `src/lib/types.ts` mirrors the API's `to_dict()`
shapes by hand (see the Zod/Pydantic drift note above — same caveat applies here).

**Auth** — session cookies (Flask's built-in signed cookie, not JWT). RBAC roles are
`admin` / `editor` / `viewer`, enforced via `require_auth`/`require_role` decorators in
`app/common/auth_guards.py`, which cache the current user on `flask.g`. There's no
public signup route — create the first admin via `flask shell` (see
`apps/api/README.md`).

## Local dev orchestration

`start.sh` (root) drives both apps directly on the host for local dev/prod runs (no
Docker involved) — see `README.md` for usage. It intentionally does not run nginx:
for host-run dev, `apps/web`'s `next dev`/`next start` and `apps/api`'s
`flask run`/`gunicorn` are hit on their own ports directly, no reverse proxy needed.

## Container/Coolify deployment

`docker-compose.yml` is the file a platform like Coolify actually deploys — it's
written for that: no service publishes a fixed host port (Coolify routes through its
own Traefik proxy on its internal network; hardcoding `ports: "4000:4000"` would
fight that and risks colliding with other apps on a shared host). `postgres`/`redis`
don't declare a port at all — nothing outside the stack should reach them directly.
`docker-compose.override.yml` is auto-merged by plain `docker compose up` and adds
back fixed host-port publishing, but *only* for local convenience — Coolify (or
anything deploying `docker-compose.yml` directly) never sees it.

`Dockerfile.web` exists only for this self-hosted path — Vercel deploys of `apps/web`
never use it, they use Vercel's own build pipeline. The one gotcha worth remembering:
`NEXT_PUBLIC_API_URL` is read by `ContactForm.tsx`, a Client Component, so it's inlined
into the browser bundle at **build** time, not read at container start. It has to be
passed as a Docker build arg (`docker-compose.yml`'s `web.build.args`), not just a
runtime `environment:` entry — the latter would only affect the Node server process,
and the shipped browser JS would silently keep whatever URL (or lack of one) was
baked in at image build time.

The `cloudflared` service is `profiles: ["tunnel"]` — off by default. It was added to
`docker-compose.yml` from outside this session's work; a Cloudflare Tunnel and
Coolify's own Traefik proxy are two different ingress mechanisms, so decide which one
is actually fronting traffic before enabling both.

## Where to look for content/copy decisions

- `docs/BRAND.md` §4 and §11 — canonical differentiators list, contact details, colors,
  certifications. Treat as single source of truth; `docs/AUDIT.md` documents the *old*
  live site's inconsistencies that this rebuild is correcting, don't pull values from it.
- `docs/STRUCTURE.md` §4 — which fields are admin-editable vs. static, before assuming
  something belongs in the database.
- `TODO.md` — real business facts still missing (pricing, delivery windows, return
  policy, payment methods, founder quote). These are deliberate honest placeholders in
  the copy, not bugs — don't fabricate values to fill them in.
