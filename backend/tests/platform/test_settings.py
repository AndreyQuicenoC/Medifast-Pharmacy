from django.conf import settings
from django.test import SimpleTestCase


class SettingsSmokeTests(SimpleTestCase):
    def test_secret_key_configured(self):
        self.assertTrue(settings.SECRET_KEY)

    def test_database_configured(self):
        self.assertIn("default", settings.DATABASES)
        self.assertTrue(settings.DATABASES["default"]["ENGINE"])

    def test_default_api_permission_is_authenticated(self):
        perm = settings.REST_FRAMEWORK["DEFAULT_PERMISSION_CLASSES"][0]
        self.assertIn("IsAuthenticated", perm)
