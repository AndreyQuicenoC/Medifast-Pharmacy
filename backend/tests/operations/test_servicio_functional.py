from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.operations.models import Servicio
from tests.support.factories import auth_headers_for, create_user_with_password


class ServicioApiFunctionalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin, _ = create_user_with_password(rol="administrador")
        Servicio.objects.create(
            Nombre="Consulta general",
            Prioridad=1,
            Descripcion="Atencion farmaceutica",
            Estado=True,
        )

    def test_admin_lists_servicios(self):
        response = self.client.get("/api/servicios/", **auth_headers_for(self.admin))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("results", response.data)
        self.assertGreaterEqual(len(data), 1)
