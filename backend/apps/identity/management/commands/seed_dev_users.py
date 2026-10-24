"""
Crea usuarios ficticios de desarrollo por rol (cliente, empleado, administrador).
Idempotente: no sobrescribe usuarios existentes con la misma cedula (cc).
"""

from datetime import date, datetime

from apps.identity.models import Administrador, Cliente, Empleado, User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

DEV_USERS = [
    {
        "cc": 900100001,
        "email": "admin.dev@medifast.local",
        "first_name": "Admin",
        "last_name": "Desarrollo",
        "phone_number": 3001000001,
        "rol": "administrador",
        "profile": "administrador",
    },
    {
        "cc": 900100002,
        "email": "empleado.dev@medifast.local",
        "first_name": "Empleado",
        "last_name": "Desarrollo",
        "phone_number": 3001000002,
        "rol": "empleado",
        "profile": "empleado",
    },
    {
        "cc": 900100003,
        "email": "cliente.dev@medifast.local",
        "first_name": "Cliente",
        "last_name": "Desarrollo",
        "phone_number": 3001000003,
        "rol": "cliente",
        "profile": "cliente",
    },
]


class Command(BaseCommand):
    help = "Crea usuarios de prueba por rol para entorno local (datos ficticios)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            required=True,
            help="Contrasena ficticia para cuentas de desarrollo (solo local).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        password = options["password"]
        created = 0
        skipped = 0

        for spec in DEV_USERS:
            if User.objects.filter(cc=spec["cc"]).exists():
                skipped += 1
                self.stdout.write(f"Omitido (ya existe cc={spec['cc']})")
                continue

            user = User.objects.create_user(
                cc=spec["cc"],
                email=spec["email"],
                first_name=spec["first_name"],
                last_name=spec["last_name"],
                phone_number=spec["phone_number"],
                password=password,
                dob=timezone.make_aware(datetime(1995, 6, 15, 12, 0)),
                rol=spec["rol"],
                is_staff=spec["rol"] == "administrador",
                is_active=True,
            )

            if spec["profile"] == "administrador":
                Administrador.objects.create(ID_Usuario=user)
            elif spec["profile"] == "empleado":
                Empleado.objects.create(ID_Usuario=user, Fecha_contratacion=date(2024, 1, 10))
            elif spec["profile"] == "cliente":
                Cliente.objects.create(ID_Usuario=user, prioritario=False)

            created += 1
            self.stdout.write(
                self.style.SUCCESS(f"Creado {spec['rol']}: cc={spec['cc']} email={spec['email']}")
            )

        self.stdout.write(
            self.style.WARNING(
                f"Listo. creados={created} omitidos={skipped}. "
                "Use solo en desarrollo; no publique estas credenciales en produccion."
            )
        )
