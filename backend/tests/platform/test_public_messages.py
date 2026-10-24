from django.test import SimpleTestCase
from rest_framework import status

from config.exceptions import _public_message


class PublicMessageTests(SimpleTestCase):
    def test_known_status_messages(self):
        self.assertIn("valida", _public_message(status.HTTP_400_BAD_REQUEST))
        self.assertIn("Credenciales", _public_message(status.HTTP_401_UNAUTHORIZED))
        self.assertIn("permiso", _public_message(status.HTTP_403_FORBIDDEN))
        self.assertIn("no existe", _public_message(status.HTTP_404_NOT_FOUND))
        self.assertIn("Conflicto", _public_message(status.HTTP_409_CONFLICT))
        self.assertIn("Demasiadas", _public_message(status.HTTP_429_TOO_MANY_REQUESTS))

    def test_unknown_status_fallback(self):
        self.assertIn("error", _public_message(418).lower())
