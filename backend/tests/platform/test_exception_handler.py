from django.test import TestCase
from rest_framework.exceptions import NotFound, PermissionDenied, ValidationError
from rest_framework.test import APIRequestFactory

from config.exceptions import _public_message, api_exception_handler


class ApiExceptionHandlerTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.context = {"request": self.factory.get("/api/test/"), "view": None}

    def test_not_found_wrapper(self):
        response = api_exception_handler(NotFound("x"), self.context)
        self.assertEqual(response.status_code, 404)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["error"]["code"], 404)

    def test_permission_denied_wrapper(self):
        response = api_exception_handler(PermissionDenied(), self.context)
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data["error"]["message"], _public_message(403))

    def test_validation_error_preserves_details(self):
        exc = ValidationError({"cc": ["invalido"]})
        response = api_exception_handler(exc, self.context)
        self.assertEqual(response.status_code, 400)
        self.assertIn("cc", response.data["error"]["details"])
