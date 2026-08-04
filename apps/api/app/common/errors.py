"""Global error handlers — consistent JSON error shape across every module."""
from flask import Flask, jsonify
from pydantic import ValidationError
from werkzeug.exceptions import HTTPException


class ApiError(Exception):
    def __init__(self, message: str, status_code: int = 400, code: str = "bad_request"):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.code = code


def register_error_handlers(app: Flask) -> None:
    @app.errorhandler(ApiError)
    def handle_api_error(err: ApiError):
        return jsonify({"error": {"code": err.code, "message": err.message}}), err.status_code

    @app.errorhandler(ValidationError)
    def handle_validation_error(err: ValidationError):
        return (
            jsonify(
                {
                    "error": {
                        "code": "validation_error",
                        "message": "Request failed validation.",
                        "details": err.errors(),
                    }
                }
            ),
            422,
        )

    @app.errorhandler(HTTPException)
    def handle_http_exception(err: HTTPException):
        return (
            jsonify({"error": {"code": err.name.lower().replace(" ", "_"), "message": err.description}}),
            err.code or 500,
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(err: Exception):
        app.logger.exception("unhandled_exception")
        return jsonify({"error": {"code": "internal_error", "message": "Something went wrong."}}), 500
