from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.catalog.models import Producto
from tests.support.factories import auth_headers_for, create_user_with_password


class ProductoCrudFunctionalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin, _ = create_user_with_password(rol="administrador")

    def test_admin_lists_products_empty(self):
        response = self.client.get("/api/producto/", **auth_headers_for(self.admin))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_creates_product(self):
        payload = {
            "Nombre": "Acetaminofen",
            "Presentacion": "Caja x 10",
            "Descripcion": "Analgesico",
            "Tipo": "Analgesico",
            "Precio": 5000,
            "Descuento": 0,
            "Stock": 20,
            "Marca": "Genfar",
            "Activo": True,
            "requiere_orden_medica": False,
        }
        response = self.client.post(
            "/api/producto/",
            payload,
            format="json",
            **auth_headers_for(self.admin),
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Producto.objects.filter(Nombre="Acetaminofen").exists())
