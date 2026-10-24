"""Fabricas de datos para pruebas aisladas (sin credenciales versionadas)."""

from __future__ import annotations

import secrets
from datetime import datetime

from apps.identity.models import Administrador, Cliente, Empleado, User
from django.utils import timezone


def _unique_cc() -> int:
    return int(secrets.randbelow(899_999_999) + 100_000_000)


def _unique_phone() -> int:
    return int(f"3{secrets.randbelow(10**9):09d}")


def create_user_with_password(*, rol: str = "cliente", **overrides):
    """Crea usuario y devuelve (user, password_plano) para asserts de login."""
    password = secrets.token_urlsafe(16)
    cc = overrides.pop("cc", _unique_cc())
    email = overrides.pop("email", f"user{cc}@test.medifast.local")
    user = User.objects.create_user(
        cc=cc,
        email=email,
        first_name=overrides.pop("first_name", "Test"),
        last_name=overrides.pop("last_name", "User"),
        phone_number=overrides.pop("phone_number", _unique_phone()),
        password=password,
        dob=overrides.pop("dob", timezone.make_aware(datetime(1995, 6, 15))),
        rol=rol,
        **overrides,
    )
    if rol == "cliente":
        Cliente.objects.get_or_create(
            ID_Usuario=user,
            defaults={"prioritario": False},
        )
    if rol == "administrador":
        Administrador.objects.get_or_create(ID_Usuario=user)
    if rol == "empleado":
        Empleado.objects.get_or_create(
            ID_Usuario=user,
            defaults={"Fecha_contratacion": timezone.now().date()},
        )
    return user, password


def auth_headers_for(user) -> dict[str, str]:
    from rest_framework.authtoken.models import Token

    token, _ = Token.objects.get_or_create(user=user)
    return {"HTTP_AUTHORIZATION": f"Token {token.key}"}
