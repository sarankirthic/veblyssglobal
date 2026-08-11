#!/bin/sh
set -eu

# Applies pending Alembic migrations before gunicorn starts serving traffic.
# Safe to run on every boot — Flask-Migrate/Alembic no-ops when the schema is
# already current. NOT safe with >1 replica cold-starting at once (concurrent
# `db upgrade` race) — this repo runs a single api replica, so that's moot
# here; revisit if that ever changes.
flask --app wsgi.py db upgrade

exec "$@"
