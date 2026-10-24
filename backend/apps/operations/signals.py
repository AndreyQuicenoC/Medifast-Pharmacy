from apps.identity.models import Cliente, Rol, User
from apps.operations.models import Caja, Servicio, Turno
from django.utils import timezone

# Datos dummy para SET_DEFAULT y conservar integridad referencial.


def create_default_roles():
    Rol.objects.get_or_create(
        id=1, defaults={"administrador": False, "cliente": True, "Empleado": False}
    )


def create_default_user_and_cliente():
    rol = Rol.objects.get(id=1)
    user, _ = User.objects.get_or_create(
        id=1,
        defaults={
            "cc": 0,
            "first_name": "default",
            "last_name": "default",
            "email": "default@gmail.com",
            "phone_number": 3000000000,
            "dob": timezone.now(),
            "rol": rol,
        },
    )
    Cliente.objects.get_or_create(id=1, defaults={"ID_Usuario": user, "prioritario": False})


def create_default_caja():
    Caja.objects.get_or_create(id=1, defaults={"Estado": False})


def create_default_servicio():
    Servicio.objects.get_or_create(
        id=1, defaults={"Nombre": "Default", "Prioridad": 0, "Estado": False}
    )


def create_default_turno():
    try:
        cliente = Cliente.objects.get(id=1)
        caja = Caja.objects.get(id=1)
        servicio = Servicio.objects.get(id=1)
    except (Cliente.DoesNotExist, Caja.DoesNotExist, Servicio.DoesNotExist):
        return
    Turno.objects.get_or_create(
        id=1,
        defaults={
            "ID_Cliente": cliente,
            "ID_Caja": caja,
            "ID_Servicio": servicio,
            "Cedula_manual": "0000000000",
        },
    )
