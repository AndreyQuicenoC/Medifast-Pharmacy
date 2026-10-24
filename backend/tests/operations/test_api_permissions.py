from django.test import TestCase
from rest_framework.test import APIClient


class OperationsApiPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_anonymous_cannot_list_cajas(self):
        response = self.client.get("/api/caja/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_list_facturas(self):
        response = self.client.get("/api/facturas/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_access_estadisticas(self):
        response = self.client.get("/api/estadisticas/resumen/")
        self.assertEqual(response.status_code, 401)

    def test_removed_debug_test_auth_route(self):
        """La ruta debug ya no expone tokens; exige autenticacion o no existe."""
        response = self.client.get("/api/turnos/test_auth/")
        self.assertNotEqual(response.status_code, 200)
        self.assertIn(response.status_code, (401, 404))
