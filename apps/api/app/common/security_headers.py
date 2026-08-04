"""Baseline security headers on every response — no new dependency (skip
flask-talisman) since this is the full set this API actually needs: a JSON
API with no server-rendered HTML, so there's no inline-script/CSP surface to
manage.
"""
from flask import Flask


def register_security_headers(app: Flask) -> None:
    @app.after_request
    def _add_security_headers(response):
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        return response
