from django.test import TestCase
from rest_framework.test import APIClient


class IdentityApiPermissionTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_anonymous_cannot_list_users(self):
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 401)

    def test_anonymous_cannot_list_clients(self):
        response = self.client.get("/api/clients/")
        self.assertEqual(response.status_code, 401)


class PublicAuthEndpointsTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_login_endpoint_accepts_post_without_token(self):
        response = self.client.post("/api/authtoken/", {}, format="json")
        self.assertIn(response.status_code, (400, 401, 429))

    def test_register_endpoint_rejects_empty_body(self):
        response = self.client.post("/api/register/", {}, format="json")
        self.assertEqual(response.status_code, 400)
