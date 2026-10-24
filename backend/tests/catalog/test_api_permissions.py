from django.test import TestCase
from rest_framework.test import APIClient


class CatalogApiPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_anonymous_cannot_list_products(self):
        response = self.client.get("/api/producto/")
        self.assertEqual(response.status_code, 401)
