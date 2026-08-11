# Production checklist

What's already hardened, and what still needs a real value or a decision before this
goes live. Nothing here is fabricated — if a section says "not implemented," it means
exactly that, not "implemented but untested."

## Already done

- **Rate limiting** — `POST /api/v1/auth/login` (10/min/IP), `POST /api/v1/contact`
  (5/min/IP), via Flask-Limiter. Storage is Redis if `REDIS_URL` is set, otherwise
  in-memory (fine for one process, **not** shared across gunicorn's `-w 4` workers —
  set `REDIS_URL` before deploying with multiple workers/instances).
- **Security headers** — `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy` on every API response (`app/common/security_headers.py`).
- **ProxyFix** — API trusts exactly one reverse-proxy hop for `X-Forwarded-*`. If the
  real deploy has more hops (e.g. CDN → load balancer → app), update the `x_for`/
  `x_proto`/`x_host` counts in `app/__init__.py` accordingly.
- **`DEBUG = False`** explicit in `Config`, not left to Flask's implicit default.
- **`.dockerignore`** added — without it, `Dockerfile.api`'s `COPY apps/api/ .` would
  have baked a local `apps/api/.env` (real secrets) straight into the image.
- **`veblyss.api` no longer uses `env_file: apps/api/.env`** — that file is gitignored,
  so it never existed on a host that deploys by cloning this repo (Dokploy); relying on
  it caused a hard `docker compose` failure in production. All of `api`'s runtime
  secrets are now interpolated into `docker-compose.yaml` from the root `.env`
  (`${SECRET_KEY}` etc.), the same convention `NEXT_PUBLIC_API_URL`/
  `CLOUDFLARE_TUNNEL_TOKEN` already used — set them in Dokploy's env var UI.
- **DB migrations run automatically on `api` boot** — `docker/entrypoint-api.sh` runs
  `flask db upgrade` before gunicorn starts. Safe on every restart (Alembic no-ops if
  already current); assumes a single `api` replica.
- **`Dockerfile.api`** already ran as a non-root user and had an image-level
  healthcheck before this pass; `docker-compose.yaml` now also has matching
  `restart: unless-stopped` and a compose-level healthcheck on `api`, `postgres`,
  `redis`.
- **`next.config.ts`** image `remotePatterns` restricted to the real R2 media
  hostname — it was a wildcard (`hostname: "**"`), a known SSRF vector for Next's
  `/_next/image` endpoint.
- **`requirements.txt` / `requirements-dev.txt` split** — the production image no
  longer installs `pytest`.
- Session cookies already default to `Secure` / `HttpOnly`, CORS is already
  env-driven (no wildcard), `SECRET_KEY` already refuses to silently work with an
  obviously-fake value in code review (see below — it still needs a *real* value).
- **`apps/web` containerized** — `Dockerfile.web` (standalone Next.js build,
  non-root, healthcheck) and a `web` service in `docker-compose.yaml`, so the whole
  stack (`postgres`, `redis`, `api`, `web`) can deploy as one Dokploy Docker Compose
  resource, not just `apps/api` — see the [Deployment](README.md#deployment) section
  of the README for the two supported paths.
- **`docker-compose.yaml` reshaped for Dokploy** — no service publishes a fixed host
  port anymore (was `5432:5432`, `6379:6379`, `4000:4000`, fighting Dokploy's own
  Traefik-based routing and risking port collisions on a shared host).
  `docker-compose.override.yml` (new) restores those fixed ports, but only for local
  `docker compose up` — Dokploy never reads that file.
- **`cloudflared` made opt-in** (`profiles: ["tunnel"]`) — it was in `docker-compose.yaml`
  from outside this session's work, unconditionally on; running it alongside Dokploy's
  own ingress is more likely to conflict than help, so it no longer starts by default.

## You still need to do

**Secrets — nothing below has a real value yet, all are dev placeholders:**
- [ ] `SECRET_KEY` — generate a real random 64-char string (`python -c "import secrets; print(secrets.token_hex(32))"`), not `change-me-to-a-random-64-char-string`
- [ ] `DATABASE_URL` — real managed Postgres, not the local dev role created this session
- [ ] `CORS_ORIGINS` — the real `apps/web` production domain(s), not `localhost`
- [ ] `R2_ACCOUNT_ID` / `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` — currently empty; media upload silently doesn't work without these
- [ ] `CLOUDFLARE_TUNNEL_TOKEN` (root `.env`) — only relevant if you deliberately enable the opt-in `cloudflared` service (`docker compose --profile tunnel up`); leave it unset otherwise
- [ ] `NEXT_PUBLIC_API_URL` — real API domain. Set as a Vercel env var if deploying `apps/web` there, **or** as `docker-compose.yaml`'s `web.build.args.NEXT_PUBLIC_API_URL` if self-hosting — it's a build-time value either way, see `Dockerfile.web`

**Infrastructure decisions — not made yet:**
- [ ] **Which deployment path.** `README.md`'s Deployment section lays out two:
  Vercel (web) + a container host (api), or everything self-hosted via
  `docker-compose.yaml` on Dokploy. Pick one per environment — don't end up with
  both `apps/web` on Vercel *and* the `web` service in `docker-compose.yaml` live at
  the same time, serving the same domain.
- [ ] If self-hosting via Dokploy: when you add this repo as a "Docker Compose"
  resource, Dokploy's UI will ask which domain/FQDN routes to which service (`api`,
  `web`) — confirm the exact env var convention it expects in Dokploy's own UI/docs
  at deploy time rather than assuming a name here.
- [ ] Root `.vercel/project.json` still points at the Vercel project that served the
  now-deleted static HTML site. Decide: repoint at `apps/web`, or create a fresh project.
- [ ] R2 bucket itself needs creating + its own CORS config (separate from the Flask
  app's CORS) if the browser will ever upload directly to it.
- [ ] Postgres backups — nothing configured. Whatever host you land on, turn on
  automated backups before real customer/contact data accumulates.
- [ ] Error monitoring (Sentry or similar) — not integrated. Right now a 500 is only
  visible in stdout logs.
- [ ] First admin user — no signup route exists by design; see
  ["Creating the first admin user"](apps/api/README.md#creating-the-first-admin-user)
  in the API README. Do this once against the real production database.
- [ ] `SESSION_COOKIE_SAMESITE` — currently `Lax`, correct if `apps/web` and `apps/api`
  end up on the same parent domain. If they're on genuinely different domains (not
  subdomains of the same site), the session cookie won't be sent cross-site and you'll
  need `SameSite=None` + `Secure` instead — a deliberate call, not a default to flip blind.

**Known gaps, not addressed this pass:**
- No CI pipeline (lint/test/build on push) — nothing currently gates a bad commit before deploy.
- No log aggregation beyond stdout JSON — fine if your host captures stdout (most
  container platforms do), not fine if you need searchable logs long-term.
- The admin panel + metrics dashboard (`apps/web/src/app/admin/`) is built and gated
  behind session auth + RBAC, but hasn't been through a security/UX review pass the way
  the public site and API hardening in this checklist has — treat it as functional, not
  yet production-audited, before pointing real admin users at it.
- Real business content still has placeholders — pricing, delivery windows, return
  policy, payment methods, founder quote — tracked in [`TODO.md`](TODO.md). These are
  deliberate honest placeholders, not something this pass touches.
