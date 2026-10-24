import secrets

from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from tests.support.factories import create_user_with_password


class RegisterValidationTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_rejects_invalid_phone(self):
        cc = int(f"31{secrets.randbelow(10**8):08d}")
        response = self.client.post(
            "/api/register/",
            {
                "cc": cc,
                "first_name": "Tel",
                "last_name": "Invalido",
                "email": f"t{cc}@test.medifast.local",
                "password": secrets.token_urlsafe(12),
                "phone_number": 123,
                "dob": timezone.now().isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone_number", str(response.data))

    def test_register_rejects_duplicate_email(self):
        user, _ = create_user_with_password(rol="cliente")
        response = self.client.post(
            "/api/register/",
            {
                "cc": int(f"32{secrets.randbelow(10**8):08d}"),
                "first_name": "Otro",
                "last_name": "User",
                "email": user.email,
                "password": secrets.token_urlsafe(12),
                "phone_number": 3001234567,
                "dob": user.dob.isoformat(),
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_rejects_missing_required_field(self):
        response = self.client.post(
            "/api/register/",
            {"cc": 300000001},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
