import secrets

from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.identity.models import Cliente, User
from tests.support.factories import create_user_with_password


class LoginFunctionalTests(TestCase):
    """RF autenticacion: login por cc + contrasena."""

    def setUp(self):
        self.client = APIClient()

    def test_login_success_returns_token_and_role(self):
        user, password = create_user_with_password(rol="administrador")
        response = self.client.post(
            "/api/authtoken/",
            {"cc": user.cc, "password": password},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("token", response.data)
        self.assertEqual(response.data["rol"], "administrador")
        self.assertEqual(response.data["cc"], user.cc)

    def test_login_wrong_password_returns_401(self):
        user, _ = create_user_with_password(rol="cliente")
        response = self.client.post(
            "/api/authtoken/",
            {"cc": user.cc, "password": secrets.token_urlsafe(12)},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class RegisterFunctionalTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_client_creates_user_and_profile(self):
        from django.utils import timezone

        cc = int(f"3{secrets.randbelow(10**8):08d}")
        payload = {
            "cc": cc,
            "first_name": "Nuevo",
            "last_name": "Cliente",
            "email": f"nuevo{cc}@test.medifast.local",
            "password": secrets.token_urlsafe(14),
            "phone_number": 3001234567,
            "dob": timezone.now().isoformat(),
        }
        response = self.client.post("/api/register/", payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(cc=cc)
        self.assertEqual(user.rol, "cliente")
        self.assertTrue(Cliente.objects.filter(ID_Usuario=user).exists())

    def test_register_rejects_duplicate_cc(self):
        user, _ = create_user_with_password(rol="cliente")
        response = self.client.post(
            "/api/register/",
            {
                "cc": user.cc,
                "first_name": "Otro",
                "last_name": "User",
                "email": "otro@test.medifast.local",
                "password": secrets.token_urlsafe(14),
                "phone_number": 3009876543,
                "dob": user.dob.isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
