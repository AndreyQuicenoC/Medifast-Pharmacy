from django.apps import AppConfig


class IdentityConfig(AppConfig):
    """Usuarios, roles, autenticacion y perfiles (cliente, empleado, administrador)."""

    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.identity"
    label = "users"
    verbose_name = "Identidad y cuentas"
