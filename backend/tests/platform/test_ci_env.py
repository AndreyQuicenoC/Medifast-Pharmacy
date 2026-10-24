from pathlib import Path

from django.conf import settings
from django.test import SimpleTestCase


class CiEnvContractTests(SimpleTestCase):
    def test_secret_key_loaded_in_test_run(self):
        self.assertTrue(settings.SECRET_KEY)

    def test_ci_workflow_injects_secret_key(self):
        repo_root = Path(__file__).resolve().parents[3]
        workflow = repo_root / ".github" / "workflows" / "ci.yml"
        self.assertTrue(workflow.is_file())
        content = workflow.read_text(encoding="utf-8")
        self.assertIn("SECRET_KEY=ci-test-only-not-for-production", content)
