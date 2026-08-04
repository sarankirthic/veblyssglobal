#!/usr/bin/env bash
set -euo pipefail

GRN='\033[0;32m'; YLW='\033[0;33m'; RED='\033[0;31m'; CYN='\033[0;36m'; RST='\033[0m'
ok()   { echo -e "${GRN}  [ok]  $*${RST}"; }
warn() { echo -e "${YLW}  [!!]  $*${RST}"; }
err()  { echo -e "${RED}  [xx]  $*${RST}" >&2; }
info() { echo -e "${CYN}  [--]  $*${RST}"; }
die()  { err "$*"; exit 1; }

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER="$ROOT/apps/api"
CLIENT="$ROOT/apps/web"
VENV="$SERVER/.venv"
LOG_DIR="$ROOT/.logs"
BACKEND_PORT=4000
FRONTEND_PORT=3000
LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I 2>/dev/null | awk '{print $1}' || echo "localhost")

MODE="${1:-dev}"
SUBCMD="${2:-}"
case "$MODE" in
  dev|prod) ;;
  restart|stop) ;;
  *) echo "Usage: $0 [dev|prod] | restart [backend|frontend] | stop" >&2; exit 1 ;;
esac

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  echo ""
  info "Shutting down..."
  [[ -n "$BACKEND_PID"  ]] && kill "$BACKEND_PID"  2>/dev/null && ok "Backend stopped"
  [[ -n "$FRONTEND_PID" ]] && kill "$FRONTEND_PID" 2>/dev/null && ok "Frontend stopped"
  exit 0
}
trap cleanup SIGINT SIGTERM

mkdir -p "$LOG_DIR"

# ── restart / stop dispatch ────────────────────────────────────────────────────
_kill_pid_file() {
  local f="$LOG_DIR/$1.pid"
  [[ -f "$f" ]] || return 0
  kill "$(cat "$f")" 2>/dev/null && ok "$1 stopped" || true
  rm -f "$f"
}

_restart_backend() {
  local mode; mode=$(cat "$LOG_DIR/mode" 2>/dev/null || echo "dev")
  _kill_pid_file backend
  info "Restarting backend ($mode)..."
  set -a; source "$SERVER/.env"; set +a
  export FLASK_APP="${FLASK_APP:-wsgi}"
  cd "$SERVER"
  if [[ "$mode" == "dev" ]]; then
    "$VENV/bin/flask" run --host=0.0.0.0 --port="$BACKEND_PORT" \
      >> "$LOG_DIR/backend.log" 2>&1 &
  else
    "$VENV/bin/gunicorn" -w 4 -b "0.0.0.0:$BACKEND_PORT" \
      --access-logfile "$LOG_DIR/gunicorn_access.log" \
      --error-logfile  "$LOG_DIR/gunicorn_error.log" \
      wsgi:app >> "$LOG_DIR/backend.log" 2>&1 &
  fi
  local pid=$!
  echo "$pid" > "$LOG_DIR/backend.pid"
  cd "$ROOT"
  for i in $(seq 1 20); do
    curl -sf "http://127.0.0.1:${BACKEND_PORT}/api/v1/health" &>/dev/null && break
    kill -0 "$pid" 2>/dev/null || { err "Backend crashed"; tail -10 "$LOG_DIR/backend.log" >&2; exit 1; }
    sleep 1
  done
  ok "Backend restarted (:${BACKEND_PORT})"
}

_restart_frontend() {
  local mode; mode=$(cat "$LOG_DIR/mode" 2>/dev/null || echo "dev")
  _kill_pid_file frontend
  info "Restarting frontend ($mode)..."
  if [[ "$mode" == "dev" ]]; then
    (cd "$CLIENT" && exec "$CLIENT/node_modules/.bin/next" dev -p "$FRONTEND_PORT") \
      >> "$LOG_DIR/frontend.log" 2>&1 &
  else
    (cd "$CLIENT" && exec "$CLIENT/node_modules/.bin/next" start -p "$FRONTEND_PORT") \
      >> "$LOG_DIR/frontend.log" 2>&1 &
  fi
  echo "$!" > "$LOG_DIR/frontend.pid"
  ok "Frontend restarted (:${FRONTEND_PORT})"
}

if [[ "$MODE" == "stop" ]]; then
  info "Stopping VeBlyss..."
  _kill_pid_file backend; _kill_pid_file frontend
  ok "All services stopped"
  exit 0
fi

if [[ "$MODE" == "restart" ]]; then
  case "$SUBCMD" in
    backend)  _restart_backend  ;;
    frontend) _restart_frontend ;;
    ""|all)
      info "Restarting all services..."
      _kill_pid_file backend; _kill_pid_file frontend
      _saved=$(cat "$LOG_DIR/mode" 2>/dev/null || echo "dev")
      exec "$0" "$_saved"
      ;;
    *) die "Unknown service '$SUBCMD'. Use: backend | frontend | all" ;;
  esac
  exit 0
fi
# ── end dispatch ───────────────────────────────────────────────────────────────

echo ""
echo -e "${CYN}========================================"
echo -e "  VeBlyss -- startup [${MODE}]"
echo -e "========================================${RST}"
echo ""
echo "$MODE" > "$LOG_DIR/mode"

# -- 1. system tools ----------------------------------------------------------
echo -e "${CYN}[1/6] Checking system tools${RST}"

check_cmd() {
  local cmd=$1 label=${2:-$1}
  command -v "$cmd" &>/dev/null || die "$label not found. Install it and retry."
  ok "$label found"
}

# pydantic-core / psycopg2-binary have no prebuilt wheels beyond 3.13 yet —
# python3.14 fails to build this venv. Pin to 3.12 until that changes.
command -v python3.12 &>/dev/null \
  || die "python3.12 not found -- required (pydantic-core/psycopg2-binary don't build on 3.14 yet). Install via 'brew install python@3.12'."
ok "Python 3.12 found"
check_cmd pnpm "pnpm"
check_cmd node "Node.js"

echo ""

# -- 2. .env ------------------------------------------------------------------
echo -e "${CYN}[2/6] Checking environment config${RST}"

ENV_FILE="$SERVER/.env"
ENV_EXAMPLE="$SERVER/.env.example"

if [[ ! -f "$ENV_FILE" ]]; then
  [[ -f "$ENV_EXAMPLE" ]] || die "$ENV_EXAMPLE missing -- can't bootstrap .env"
  warn ".env not found -- copying from .env.example"
  cp "$ENV_EXAMPLE" "$ENV_FILE"
  warn "Edit $ENV_FILE and fill in secrets before production use."
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

[[ -z "${SECRET_KEY:-}"   ]] && warn "SECRET_KEY is not set in .env"
[[ -z "${DATABASE_URL:-}" ]] && warn "DATABASE_URL is not set in .env"
[[ -z "${R2_ACCOUNT_ID:-}"       ]] && warn "R2_ACCOUNT_ID is empty -- R2 media upload will not work"
[[ -z "${R2_ACCESS_KEY_ID:-}"    ]] && warn "R2_ACCESS_KEY_ID is empty -- R2 media upload will not work"
[[ -z "${R2_SECRET_ACCESS_KEY:-}" ]] && warn "R2_SECRET_ACCESS_KEY is empty -- R2 media upload will not work"
[[ -z "${REDIS_URL:-}" ]] && warn "REDIS_URL is empty -- caching layer disabled"

export FLASK_APP="${FLASK_APP:-wsgi}"
export FLASK_ENV="${FLASK_ENV:-development}"
[[ "$MODE" == "prod" ]] && export FLASK_ENV=production
ok ".env loaded (FLASK_ENV=$FLASK_ENV)"

if [[ "$MODE" == "prod" ]]; then
  [[ "${SECRET_KEY:-}" == *"change-me"* ]] && die "SECRET_KEY is a placeholder -- set a real secret in .env before running prod"
  [[ ${#SECRET_KEY} -lt 32 ]] && die "SECRET_KEY too short (min 32 chars required)"
  [[ -z "${DATABASE_URL:-}" ]] && die "DATABASE_URL must be set for prod"
  [[ "${SESSION_COOKIE_SECURE:-}" != "true" ]] && warn "SESSION_COOKIE_SECURE is not 'true' -- session cookies won't be Secure in prod"
  ok "Secrets validated"
fi

echo ""

# -- 3. services --------------------------------------------------------------
echo -e "${CYN}[3/6] Checking services${RST}"
nc -z localhost 5432 2>/dev/null \
  && ok "PostgreSQL reachable on :5432" \
  || warn "PostgreSQL not reachable on :5432 -- backend may fail (try: docker compose up postgres -d)"
if [[ -n "${REDIS_URL:-}" ]]; then
  nc -z localhost 6379 2>/dev/null \
    && ok "Redis reachable on :6379" \
    || warn "Redis not reachable on :6379"
fi
echo ""

# -- 4. python venv -----------------------------------------------------------
echo -e "${CYN}[4/6] Checking Python environment${RST}"

if [[ ! -d "$VENV" ]]; then
  info "Creating virtualenv at $VENV..."
  python3.12 -m venv "$VENV"
  ok "Virtualenv created"
fi

PIP="$VENV/bin/pip"
FLASK="$VENV/bin/flask"
GUNICORN="$VENV/bin/gunicorn"

REQ_HASH_FILE="$VENV/.req_hash"
REQ_HASH=$(md5sum "$SERVER/requirements.txt" 2>/dev/null | awk '{print $1}' \
           || md5 -q "$SERVER/requirements.txt" 2>/dev/null || echo "")
CACHED_HASH=$(cat "$REQ_HASH_FILE" 2>/dev/null || echo "")

if [[ "$REQ_HASH" != "$CACHED_HASH" ]]; then
  info "Installing Python dependencies..."
  "$PIP" install -q -r "$SERVER/requirements.txt"
  echo "$REQ_HASH" > "$REQ_HASH_FILE"
  ok "Python dependencies installed"
else
  ok "Python dependencies up to date"
fi
echo ""

# -- 5. node deps + migrations ------------------------------------------------
echo -e "${CYN}[5/6] Node dependencies + DB migrations${RST}"

NODE_HASH_FILE="$ROOT/.pnpm_hash"
NODE_HASH=$(md5sum "$ROOT/pnpm-lock.yaml" 2>/dev/null | awk '{print $1}' \
            || md5 -q "$ROOT/pnpm-lock.yaml" 2>/dev/null || echo "")
CACHED_NODE_HASH=$(cat "$NODE_HASH_FILE" 2>/dev/null || echo "")

if [[ ! -d "$CLIENT/node_modules" ]] || [[ "$NODE_HASH" != "$CACHED_NODE_HASH" ]]; then
  info "Installing Node dependencies..."
  (cd "$ROOT" && pnpm install --silent)
  echo "$NODE_HASH" > "$NODE_HASH_FILE"
  ok "Node dependencies installed"
else
  ok "Node dependencies up to date"
fi

info "Running database migrations..."
cd "$SERVER"
if ! "$FLASK" db upgrade 2>&1 | tee "$LOG_DIR/migrations.log"; then
  err "Migration failed -- check $LOG_DIR/migrations.log"
  exit 1
fi
ok "Database migrations applied"
cd "$ROOT"
echo ""

# -- 6. start -----------------------------------------------------------------
echo -e "${CYN}[6/6] Starting services${RST}"

wait_for_http() {
  local url=$1 pid=$2 log=$3 label=$4 ready_msg=$5
  for i in $(seq 1 30); do
    if curl -sf "$url" &>/dev/null; then
      ok "$ready_msg"
      return 0
    fi
    if ! kill -0 "$pid" 2>/dev/null; then
      err "$label crashed. Logs:"
      tail -20 "$log" >&2
      exit 1
    fi
    sleep 1
  done
  err "$label did not become ready after 30s. Logs:"
  tail -20 "$log" >&2
  exit 1
}

if [[ "$MODE" == "dev" ]]; then
  info "Starting Flask backend (dev) on :${BACKEND_PORT}..."
  cd "$SERVER"
  "$FLASK" run --host=0.0.0.0 --port="${BACKEND_PORT}" \
    > "$LOG_DIR/backend.log" 2>&1 &
  BACKEND_PID=$!
  echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"
  cd "$ROOT"
  wait_for_http "http://127.0.0.1:${BACKEND_PORT}/api/v1/health" "$BACKEND_PID" \
    "$LOG_DIR/backend.log" "Backend" "Backend up (:${BACKEND_PORT})"

  info "Starting Next.js frontend (dev) on :${FRONTEND_PORT}..."
  (cd "$CLIENT" && exec "$CLIENT/node_modules/.bin/next" dev -p "${FRONTEND_PORT}") \
    > "$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"
  wait_for_http "http://127.0.0.1:${FRONTEND_PORT}" "$FRONTEND_PID" \
    "$LOG_DIR/frontend.log" "Frontend" "Frontend up (:${FRONTEND_PORT})"

else
  info "Building frontend for production..."
  (cd "$CLIENT" && "$CLIENT/node_modules/.bin/next" build 2>&1 | tee "$LOG_DIR/frontend_build.log")
  ok "Frontend built"

  info "Starting gunicorn on :${BACKEND_PORT} (4 workers)..."
  cd "$SERVER"
  "$GUNICORN" -w 4 -b "0.0.0.0:${BACKEND_PORT}" \
    --access-logfile "$LOG_DIR/gunicorn_access.log" \
    --error-logfile  "$LOG_DIR/gunicorn_error.log" \
    wsgi:app &
  BACKEND_PID=$!
  echo "$BACKEND_PID" > "$LOG_DIR/backend.pid"
  cd "$ROOT"
  wait_for_http "http://127.0.0.1:${BACKEND_PORT}/api/v1/health" "$BACKEND_PID" \
    "$LOG_DIR/gunicorn_error.log" "Gunicorn" "Gunicorn up (:${BACKEND_PORT})"

  info "Starting Next.js frontend (prod) on :${FRONTEND_PORT}..."
  (cd "$CLIENT" && exec "$CLIENT/node_modules/.bin/next" start -p "${FRONTEND_PORT}") \
    > "$LOG_DIR/frontend.log" 2>&1 &
  FRONTEND_PID=$!
  echo "$FRONTEND_PID" > "$LOG_DIR/frontend.pid"
  wait_for_http "http://127.0.0.1:${FRONTEND_PORT}" "$FRONTEND_PID" \
    "$LOG_DIR/frontend.log" "Frontend" "Frontend up (:${FRONTEND_PORT})"
fi

echo ""
echo -e "${GRN}========================================"
echo -e "  VeBlyss is running [${MODE}]"
echo -e ""
echo -e "  App     -> http://${LOCAL_IP}:${FRONTEND_PORT}"
echo -e "  API     -> http://${LOCAL_IP}:${BACKEND_PORT}/api/v1/"
echo -e "  Swagger -> http://${LOCAL_IP}:${BACKEND_PORT}/api/docs"
echo -e "  Logs    -> .logs/"
echo -e ""
echo -e "  Press Ctrl+C to stop"
echo -e "========================================${RST}"
echo ""

wait "$BACKEND_PID" "$FRONTEND_PID"
