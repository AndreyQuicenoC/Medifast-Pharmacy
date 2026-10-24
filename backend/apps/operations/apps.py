from django.apps import AppConfig


class OperationsConfig(AppConfig):
    """Operacion de farmacia: cajas, turnos, servicios, facturacion."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.operations"
    label = "tickets"
    verbose_name = "Operaciones de farmacia"
