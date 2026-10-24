from django.test import TestCase
from rest_framework.exceptions import NotFound
from rest_framework.test import APIRequestFactory

from DS1.exceptions import api_exception_handler


class ApiExceptionHandlerTests(TestCase):
    def test_not_found_wrapper(self):
        factory = APIRequestFactory()
        request = factory.get("/api/test/")
        response = api_exception_handler(NotFound("x"), {"request": request, "view": None})
        self.assertEqual(response.status_code, 404)
        self.assertFalse(response.data["success"])
        self.assertEqual(response.data["error"]["code"], 404)
