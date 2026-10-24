import json
from decimal import Decimal

from apps.identity.models import Cliente
from apps.operations.models import Caja, Factura, Horario, Servicio, Turno
from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from tests.support.factories import auth_headers_for, create_user_with_password


class CajaFacturaTurnoFunctionalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin, _ = create_user_with_password(rol="administrador")
        self.empleado, _ = create_user_with_password(rol="empleado")

    def test_admin_lists_and_creates_caja(self):
        list_resp = self.client.get("/api/caja/", **auth_headers_for(self.admin))
        self.assertEqual(list_resp.status_code, status.HTTP_200_OK)

        create_resp = self.client.post(
            "/api/caja/",
            {"nombre": "T-1", "Estado": True, "ID_Usuario": self.empleado.id},
            format="json",
            **auth_headers_for(self.admin),
        )
        self.assertEqual(create_resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Caja.objects.filter(nombre="T-1").exists())

    def test_admin_lists_facturas_after_seed_like_row(self):
        cliente_user, _ = create_user_with_password(rol="cliente")
        cliente = Cliente.objects.get(ID_Usuario=cliente_user)
        servicio = Servicio.objects.create(
            Nombre="Entrega rapida",
            Prioridad=2,
            Descripcion="Demo",
            Estado=True,
        )
        horario = Horario.objects.create(
            Hora_llegada=timezone.now(),
            Hora_atencion=timezone.now(),
            Hora_salida=timezone.now(),
        )
        turno = Turno.objects.create(
            ID_Cliente=cliente,
            ID_Servicio=servicio,
            ID_Horario=horario,
            Cedula_manual=str(cliente_user.cc),
            numero_turno=880001,
            estado="finalizado",
        )
        Factura.objects.create(
            ID_Turno=turno,
            Total=Decimal("25000.00"),
            productos_vendidos=json.dumps([{"nombre": "Demo", "cantidad": 1}]),
            fecha_factura=timezone.now(),
        )

        response = self.client.get("/api/facturas/", **auth_headers_for(self.admin))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data.get("results", response.data)
        self.assertGreaterEqual(len(data), 1)

    def test_admin_lists_turnos(self):
        response = self.client.get("/api/turnos/", **auth_headers_for(self.admin))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
