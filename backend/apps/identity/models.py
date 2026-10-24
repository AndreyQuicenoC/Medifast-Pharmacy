from django.contrib.auth.models import AbstractUser, Group, Permission
from django.core.validators import RegexValidator
from django.db import models
from django.utils import timezone

from .manager import CustomUserManager

# from apps.operations.models import Caja


class Rol(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        db_table = "ROL"
        verbose_name = "Rol"
        verbose_name_plural = "Roles"


class User(AbstractUser):
    """Usuario con auditoria y soft delete."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    # Cedula de ciudadania (busqueda; no es PK).
    cc = models.PositiveBigIntegerField(
        unique=True,
        blank=False,
        null=False,
        validators=[
            RegexValidator(
                regex=r"^\d{6,10}$",
                message=("No es un número de documento válido"),
                code="invalid_cc",
            )
        ],
        verbose_name="Cédula ciudadania",
    )

    """ telefono del usuario """
    phone_number = models.PositiveBigIntegerField(
        unique=False,
        blank=False,
        null=False,
        validators=[
            RegexValidator(
                regex=r"^(3|6)\d{9}$",
                message=("No es un número de teléfono válido"),
                code="invalid_phonenumber",
            )
        ],
        verbose_name="Número teléfono",
    )

    username = None

    dob = models.DateTimeField()

    """ Campo de rol """
    ROLE_CHOICES = [
        ("cliente", "Cliente"),
        ("empleado", "Empleado"),
        ("administrador", "Administrador"),
    ]

    rol = models.CharField(
        max_length=20, choices=ROLE_CHOICES, null=True, blank=True, verbose_name="Rol del usuario"
    )

    groups = models.ManyToManyField(Group, related_name="custom_user_groups")
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions")

    USERNAME_FIELD = "cc"
    REQUIRED_FIELDS = ["first_name", "last_name", "email", "phone_number"]

    objects = CustomUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name} - CC: {self.cc}"

    def soft_delete(self):
        if self.deleted_at is not None:
            self.deleted_at = timezone.now()
            self.save()

    class Meta:
        db_table = "USER"
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"
        ordering = ["id"]  # metodo de organización por id


class Cliente(models.Model):
    """LLave foranea a usuario para herencia"""

    ID_Usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    # Auditoria y soft delete.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    prioritario = models.BooleanField()


class Empleado(models.Model):
    """LLave foranea a usuario para herencia"""

    ID_Usuario = models.ForeignKey(User, on_delete=models.CASCADE, null=False)

    # Auditoria y soft delete.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    Fecha_contratacion = models.DateField()

    def __str__(self):
        return f"{self.ID_Usuario.first_name} {self.ID_Usuario.last_name} - Empleado"

    class Meta:
        db_table = "EMPLEADO"
        verbose_name = "Empleado"
        verbose_name_plural = "Empleados"
        ordering = ["id"]


class Administrador(models.Model):
    ID_Usuario = models.OneToOneField(
        User, on_delete=models.CASCADE, null=False
    )  # Debe ser unico ese id de usuario

    # Auditoria y soft delete.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)


"""
class Servicio(models.Model):
    descripcion = models.CharField(max_length=200)
    etiqueta = models.CharField(max_length=50)
    prioridad = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.etiqueta} - {self.descripcion}"

    class Meta:
        db_table = 'SERVICIO'
        verbose_name = 'Servicio'
        verbose_name_plural = 'Servicios'
        ordering = ['id']
"""
