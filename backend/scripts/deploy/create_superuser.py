#!/usr/bin/env python
"""
Crea el primer superusuario usando variables de entorno (post-despliegue).
"""

import os
from datetime import datetime

import django

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    django.setup()

    from django.contrib.auth import get_user_model

    User = get_user_model()

    if User.objects.filter(is_superuser=True).exists():
        print("Ya existe un superusuario en el sistema.")
        raise SystemExit(0)

    required = ("ADMIN_CC", "ADMIN_EMAIL", "ADMIN_PASSWORD", "ADMIN_PHONE")
    missing = [name for name in required if not os.environ.get(name)]
    if missing:
        raise SystemExit("Defina variables de entorno: " + ", ".join(missing))

    User.objects.create_superuser(
        cc=os.environ["ADMIN_CC"],
        email=os.environ["ADMIN_EMAIL"],
        password=os.environ["ADMIN_PASSWORD"],
        first_name=os.environ.get("ADMIN_FIRST_NAME", "Administrador"),
        last_name=os.environ.get("ADMIN_LAST_NAME", "Sistema"),
        phone_number=os.environ["ADMIN_PHONE"],
        dob=datetime(1990, 1, 1),
        rol="administrador",
    )
    print(f"Superusuario creado: CC {os.environ['ADMIN_CC']}")
