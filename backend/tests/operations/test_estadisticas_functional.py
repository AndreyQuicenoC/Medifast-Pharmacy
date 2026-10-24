from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from tests.support.factories import auth_headers_for, create_user_with_password


class EstadisticasFunctionalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin, _ = create_user_with_password(rol="administrador")

    def test_admin_can_read_resumen(self):
        response = self.client.get(
            "/api/estadisticas/resumen/",
            **auth_headers_for(self.admin),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, dict)
