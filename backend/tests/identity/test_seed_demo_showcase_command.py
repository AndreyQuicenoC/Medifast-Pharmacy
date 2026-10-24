import os
import secrets

from django.core.management import call_command
from django.test import TestCase

from apps.catalog.models import Producto
from apps.identity.models import User
from apps.operations.models import Factura, Turno


class SeedDemoShowcaseCommandTests(TestCase):
    def test_seed_demo_showcase_is_idempotent(self):
        password = secrets.token_urlsafe(12)
        call_command("seed_demo_showcase", password=password)
        users_after_first = User.objects.filter(cc__gte=910900001, cc__lte=910900010).count()
        products_after_first = Producto.objects.filter(Codigo__startswith="DEMO-").count()
        turnos_after_first = Turno.objects.filter(numero_turno__gte=9000).count()
        facturas_after_first = Factura.objects.count()

        call_command("seed_demo_showcase", password=password)

        self.assertEqual(
            User.objects.filter(cc__gte=910900001, cc__lte=910900010).count(),
            users_after_first,
        )
        self.assertGreaterEqual(products_after_first, 85)
        self.assertGreaterEqual(turnos_after_first, 45)
        self.assertGreaterEqual(facturas_after_first, 8)

    def test_seed_requires_password(self):
        old = os.environ.pop("DEMO_SEED_PASSWORD", None)
        try:
            with self.assertRaises(SystemExit):
                call_command("seed_demo_showcase", password="")
        finally:
            if old is not None:
                os.environ["DEMO_SEED_PASSWORD"] = old
