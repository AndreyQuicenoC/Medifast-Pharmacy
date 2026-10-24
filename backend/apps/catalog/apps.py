from django.apps import AppConfig


class CatalogConfig(AppConfig):
    """Catalogo de productos y medicamentos."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.catalog"
    label = "products"
    verbose_name = "Catalogo de productos"
