"""Structured JSON request logging — the Pino equivalent from ARCHITECTURE.md §9.

Every request is logged with a request id, route, status and latency, feeding
both operational logs and the Metrics Dashboard's admin activity log.
"""
import logging
import time
import uuid

from flask import Flask, g, request
from pythonjsonlogger import jsonlogger


def configure_logging(app: Flask) -> None:
    handler = logging.StreamHandler()
    formatter = jsonlogger.JsonFormatter(
        "%(asctime)s %(levelname)s %(name)s %(message)s"
    )
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.handlers = [handler]
    root.setLevel(app.config["LOG_LEVEL"])

    access_logger = logging.getLogger("veblyss.access")

    @app.before_request
    def _start_timer():
        g.request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
        g.request_start = time.monotonic()

    @app.after_request
    def _log_request(response):
        latency_ms = round((time.monotonic() - g.get("request_start", time.monotonic())) * 1000, 2)
        access_logger.info(
            "request",
            extra={
                "request_id": g.get("request_id"),
                "method": request.method,
                "path": request.path,
                "status": response.status_code,
                "latency_ms": latency_ms,
                "remote_addr": request.headers.get("CF-Connecting-IP", request.remote_addr),
            },
        )
        response.headers["X-Request-Id"] = g.get("request_id", "")
        return response
