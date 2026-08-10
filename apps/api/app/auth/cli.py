"""`flask --app wsgi.py create-admin` — creates a user with a set password,
or resets the password/role of an existing one. Idempotent: safe to run
more than once.
"""
import click
from flask import Flask

from app.auth.models import Role, User
from app.extensions import db


def create_admin(email: str, name: str, password: str, role: str) -> User:
    email = email.lower()
    user = User.query.filter_by(email=email).first()
    if user is None:
        user = User(email=email, name=name, role=role)
        db.session.add(user)
        click.echo(f"+ user: {email} ({role})")
    else:
        user.name = name
        user.role = role
        click.echo(f"= user exists, updating: {email} ({role})")
    user.set_password(password)
    db.session.commit()
    return user


def register_create_admin_command(app: Flask) -> None:
    @app.cli.command("create-admin")
    @click.option("--email", required=True, help="Login email.")
    @click.option("--name", required=True, help="Display name.")
    @click.option("--password", required=True, help="Login password.")
    @click.option("--role", default=Role.ADMIN, type=click.Choice(Role.ALL), help="User role.")
    def create_admin_command(email: str, name: str, password: str, role: str) -> None:
        create_admin(email, name, password, role)
        click.echo("Done.")
