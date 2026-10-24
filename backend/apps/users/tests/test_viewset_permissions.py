from django.test import TestCase
from rest_framework.test import APIClient


class ViewSetPermissionTests(TestCase):
    """APIs criticas exigen autenticacion (IsAuthenticated)."""

    def setUp(self):
        self.client = APIClient()

    def test_anonymous_cannot_list_users(self):
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_list_products(self):
        response = self.client.get("/api/producto/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_list_cajas(self):
        response = self.client.get("/api/caja/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_list_facturas(self):
        response = self.client.get("/api/facturas/")
        self.assertEqual(response.status_code, 401)
