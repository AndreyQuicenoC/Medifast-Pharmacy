#!/usr/bin/env python
"""
Script de datos de prueba - Farmacia Django React
Generado automáticamente el: 2025-07-22 21:50:43
Este script recrea todos los datos existentes en la base de datos
"""

import os
import sys
import django
from datetime import datetime, date
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'DS1.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.users.models import User, Cliente, Rol, Empleado, Administrador
from apps.products.models import Producto
from apps.tickets.models import Factura, Caja, Turno, Horario, Servicio
from rest_framework.authtoken.models import Token
from django.db import transaction

def create_test_data():
    """Crear todos los datos de prueba"""
    print("🚀 Iniciando creación de datos de prueba...")

    with transaction.atomic():

        # ===== ROLES =====
        print("🔐 Creando roles...")
        rol_1, created = Rol.objects.get_or_create(
            nombre="cliente"
        )

        rol_2, created = Rol.objects.get_or_create(
            nombre="empleado"
        )

        rol_3, created = Rol.objects.get_or_create(
            nombre="administrador"
        )

        # ===== USUARIOS =====
        print("👥 Creando usuarios...")
        user_1, created = User.objects.get_or_create(
            cc=12345678,
            defaults={
                "email": "admin@test.com",
                "first_name": "Admin",
                "last_name": "Test",
                "phone_number": 1234567890,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_1.set_password("123456")  # Password por defecto
            user_1.save()

        user_2, created = User.objects.get_or_create(
            cc=87654321,
            defaults={
                "email": "usuario@test.com",
                "first_name": "Usuario",
                "last_name": "Sin Rol",
                "phone_number": 987654321,
                "dob": datetime(1995, 5, 15, 0, 0, 0),
                "rol": "",
                "is_active": False,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_2.set_password("123456")  # Password por defecto
            user_2.save()

        user_3, created = User.objects.get_or_create(
            cc=1110287653,
            defaults={
                "email": "franjua@gmail.com",
                "first_name": "Angel",
                "last_name": "Quiceno",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_3.set_password("123456")  # Password por defecto
            user_3.save()

        user_4, created = User.objects.get_or_create(
            cc=1110287658,
            defaults={
                "email": "andyquic@gmail.com",
                "first_name": "Admi",
                "last_name": "Quiceno",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "",
                "is_active": False,
                "is_staff": True,
                "is_superuser": False,
            }
        )
        if created:
            user_4.set_password("123456")  # Password por defecto
            user_4.save()

        user_5, created = User.objects.get_or_create(
            cc=1110287654,
            defaults={
                "email": "andytru@gmail.com",
                "first_name": "Andrey",
                "last_name": "Trujillo",
                "phone_number": 3186111159,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "",
                "is_active": False,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_5.set_password("123456")  # Password por defecto
            user_5.save()

        user_7, created = User.objects.get_or_create(
            cc=99999999,
            defaults={
                "email": "test@admin.com",
                "first_name": "Test",
                "last_name": "Admin",
                "phone_number": 3001234567,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": True,
                "is_superuser": False,
            }
        )
        if created:
            user_7.set_password("123456")  # Password por defecto
            user_7.save()

        user_8, created = User.objects.get_or_create(
            cc=11111111,
            defaults={
                "email": "admin.prueba@test.com",
                "first_name": "Admin",
                "last_name": "Prueba",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "",
                "is_active": False,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_8.set_password("123456")  # Password por defecto
            user_8.save()

        user_9, created = User.objects.get_or_create(
            cc=22222222,
            defaults={
                "email": "cajero1@test.com",
                "first_name": "Cajero",
                "last_name": "Uno",
                "phone_number": 3156787654,
                "dob": datetime(1992, 5, 15, 0, 0, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": True,
                "is_superuser": False,
            }
        )
        if created:
            user_9.set_password("123456")  # Password por defecto
            user_9.save()

        user_10, created = User.objects.get_or_create(
            cc=33333333,
            defaults={
                "email": "cajero2@medifast.com",
                "first_name": "Cajero",
                "last_name": "Dos",
                "phone_number": 3333333333,
                "dob": datetime(1994, 8, 20, 0, 0, 0),
                "rol": "empleado",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_10.set_password("123456")  # Password por defecto
            user_10.save()

        user_11, created = User.objects.get_or_create(
            cc=1110287655,
            defaults={
                "email": "cajero2@test.com",
                "first_name": "Admin",
                "last_name": "Quiceno",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": True,
                "is_superuser": False,
            }
        )
        if created:
            user_11.set_password("123456")  # Password por defecto
            user_11.save()

        user_12, created = User.objects.get_or_create(
            cc=44444444,
            defaults={
                "email": "carlos.rodriguez@farmacia.com",
                "first_name": "Carlos",
                "last_name": "Rodríguez",
                "phone_number": 4444444444,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "empleado",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_12.set_password("123456")  # Password por defecto
            user_12.save()

        user_13, created = User.objects.get_or_create(
            cc=55555555,
            defaults={
                "email": "ana.garcia@farmacia.com",
                "first_name": "Ana",
                "last_name": "García",
                "phone_number": 5555555555,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "empleado",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_13.set_password("123456")  # Password por defecto
            user_13.save()

        user_14, created = User.objects.get_or_create(
            cc=66666666,
            defaults={
                "email": "luis.martinez@farmacia.com",
                "first_name": "Luis",
                "last_name": "Martínez",
                "phone_number": 6666666666,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "empleado",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_14.set_password("123456")  # Password por defecto
            user_14.save()

        user_15, created = User.objects.get_or_create(
            cc=77777777,
            defaults={
                "email": "maria.lopez@farmacia.com",
                "first_name": "María",
                "last_name": "López",
                "phone_number": 7777777777,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "empleado",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_15.set_password("123456")  # Password por defecto
            user_15.save()

        user_16, created = User.objects.get_or_create(
            cc=1110287651,
            defaults={
                "email": "franjua@gmail.com",
                "first_name": "Alberto",
                "last_name": "Rodriguez",
                "phone_number": 3186786754,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_16.set_password("123456")  # Password por defecto
            user_16.save()

        user_17, created = User.objects.get_or_create(
            cc=1110287659,
            defaults={
                "email": "andrytru@gmail.com",
                "first_name": "Andrey",
                "last_name": "Trujillo",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_17.set_password("123456")  # Password por defecto
            user_17.save()

        user_18, created = User.objects.get_or_create(
            cc=1110289857,
            defaults={
                "email": "adoqui@medifast.com",
                "first_name": "Adolfo",
                "last_name": "Quiceno",
                "phone_number": 3186111159,
                "dob": datetime(2005, 9, 30, 12, 10, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_18.set_password("123456")  # Password por defecto
            user_18.save()

        user_19, created = User.objects.get_or_create(
            cc=1234567890,
            defaults={
                "email": "maria.garcia@email.com",
                "first_name": "María",
                "last_name": "García Rodríguez",
                "phone_number": 3101234567,
                "dob": datetime(1985, 3, 15, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_19.set_password("123456")  # Password por defecto
            user_19.save()

        user_20, created = User.objects.get_or_create(
            cc=1098765432,
            defaults={
                "email": "carlos.lopez@email.com",
                "first_name": "Carlos",
                "last_name": "López Martínez",
                "phone_number": 3209876543,
                "dob": datetime(1955, 8, 22, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_20.set_password("123456")  # Password por defecto
            user_20.save()

        user_21, created = User.objects.get_or_create(
            cc=1456789123,
            defaults={
                "email": "ana.fernandez@email.com",
                "first_name": "Ana",
                "last_name": "Fernández Silva",
                "phone_number": 3145678912,
                "dob": datetime(1992, 11, 8, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_21.set_password("123456")  # Password por defecto
            user_21.save()

        user_22, created = User.objects.get_or_create(
            cc=1789456123,
            defaults={
                "email": "luis.morales@email.com",
                "first_name": "Luis",
                "last_name": "Morales Castro",
                "phone_number": 3178945612,
                "dob": datetime(1948, 5, 30, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_22.set_password("123456")  # Password por defecto
            user_22.save()

        user_23, created = User.objects.get_or_create(
            cc=1654321987,
            defaults={
                "email": "patricia.herrera@email.com",
                "first_name": "Patricia",
                "last_name": "Herrera Gómez",
                "phone_number": 3165432198,
                "dob": datetime(1978, 9, 12, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_23.set_password("123456")  # Password por defecto
            user_23.save()

        user_24, created = User.objects.get_or_create(
            cc=1987654321,
            defaults={
                "email": "jorge.ramirez@email.com",
                "first_name": "Jorge",
                "last_name": "Ramírez Vargas",
                "phone_number": 3198765432,
                "dob": datetime(1990, 2, 18, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_24.set_password("123456")  # Password por defecto
            user_24.save()

        user_25, created = User.objects.get_or_create(
            cc=1369258147,
            defaults={
                "email": "carmen.jimenez@email.com",
                "first_name": "Carmen",
                "last_name": "Jiménez Ruiz",
                "phone_number": 3136925814,
                "dob": datetime(1960, 7, 4, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_25.set_password("123456")  # Password por defecto
            user_25.save()

        user_26, created = User.objects.get_or_create(
            cc=1741852963,
            defaults={
                "email": "roberto.vasquez@email.com",
                "first_name": "Roberto",
                "last_name": "Vásquez Torres",
                "phone_number": 3174185296,
                "dob": datetime(1987, 12, 25, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_26.set_password("123456")  # Password por defecto
            user_26.save()

        user_27, created = User.objects.get_or_create(
            cc=1852963741,
            defaults={
                "email": "yarith.mendoza@email.com",
                "first_name": "Yarith",
                "last_name": "Mendoza Peña",
                "phone_number": 3185296374,
                "dob": datetime(1995, 6, 10, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_27.set_password("123456")  # Password por defecto
            user_27.save()

        user_28, created = User.objects.get_or_create(
            cc=1963741852,
            defaults={
                "email": "fernando.guerrero@email.com",
                "first_name": "Fernando",
                "last_name": "Guerrero Sánchez",
                "phone_number": 3196374185,
                "dob": datetime(1952, 4, 14, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_28.set_password("123456")  # Password por defecto
            user_28.save()

        user_29, created = User.objects.get_or_create(
            cc=1110289854,
            defaults={
                "email": "angelrodri@gmail.com",
                "first_name": "Angel",
                "last_name": "Rodriguez",
                "phone_number": 3156787654,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_29.set_password("123456")  # Password por defecto
            user_29.save()

        user_30, created = User.objects.get_or_create(
            cc=1108640755,
            defaults={
                "email": "heidyduque1515@gmail.com",
                "first_name": "Heidy",
                "last_name": "Diusa",
                "phone_number": 3186991659,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "administrador",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_30.set_password("123456")  # Password por defecto
            user_30.save()

        user_31, created = User.objects.get_or_create(
            cc=98765432,
            defaults={
                "email": "juan.perez@example.com",
                "first_name": "Juan",
                "last_name": "Pérez",
                "phone_number": 3001234567,
                "dob": datetime(1985, 5, 15, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_31.set_password("123456")  # Password por defecto
            user_31.save()

        user_32, created = User.objects.get_or_create(
            cc=1110287666,
            defaults={
                "email": "andyqui@gmail.com",
                "first_name": "Andrey",
                "last_name": "Quiceno",
                "phone_number": 3186111159,
                "dob": datetime(2012, 2, 15, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_32.set_password("123456")  # Password por defecto
            user_32.save()

        user_33, created = User.objects.get_or_create(
            cc=1110287650,
            defaults={
                "email": "andity@gmail.com",
                "first_name": "Andrey",
                "last_name": "Trujillo",
                "phone_number": 3186111159,
                "dob": datetime(2025, 7, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_33.set_password("123456")  # Password por defecto
            user_33.save()

        user_34, created = User.objects.get_or_create(
            cc=999888777,
            defaults={
                "email": "test.user@example.com",
                "first_name": "Test",
                "last_name": "User",
                "phone_number": 3009998877,
                "dob": datetime(1990, 1, 1, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_34.set_password("123456")  # Password por defecto
            user_34.save()

        user_35, created = User.objects.get_or_create(
            cc=777666555,
            defaults={
                "email": "maria.gonzalez@example.com",
                "first_name": "María",
                "last_name": "González",
                "phone_number": 6001122334,
                "dob": datetime(1985, 5, 15, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_35.set_password("123456")  # Password por defecto
            user_35.save()

        user_36, created = User.objects.get_or_create(
            cc=1110287642,
            defaults={
                "email": "andyquiv@gmail.com",
                "first_name": "Andrey",
                "last_name": "Quiceno",
                "phone_number": 3186111159,
                "dob": datetime(2025, 2, 12, 0, 0, 0),
                "rol": "cliente",
                "is_active": True,
                "is_staff": False,
                "is_superuser": False,
            }
        )
        if created:
            user_36.set_password("123456")  # Password por defecto
            user_36.save()

        # ===== TOKENS DE AUTENTICACIÓN =====
        print("🔐 Creando tokens de autenticación...")
        token_1, created = Token.objects.get_or_create(
            user=user_1,
            defaults={"key": "b351e31d8e4de570d6fcefd2f5da3f789d51cccb"}
        )

        token_9, created = Token.objects.get_or_create(
            user=user_9,
            defaults={"key": "8bdd9d0f6f1f0ada10f033591d61ca913032c02c"}
        )

        token_18, created = Token.objects.get_or_create(
            user=user_18,
            defaults={"key": "d791fe75a48a393c2769cd3db588e74d56ccc288"}
        )

        token_3, created = Token.objects.get_or_create(
            user=user_3,
            defaults={"key": "622363aab2803cf2c00b3134ac51a9198d1b1b80"}
        )

        token_10, created = Token.objects.get_or_create(
            user=user_10,
            defaults={"key": "4124695b1cdababb7ee736817d3c5a23af00de43"}
        )

        token_16, created = Token.objects.get_or_create(
            user=user_16,
            defaults={"key": "9af7f455976131e91ef8c1c52e48de6c52f09d21"}
        )

        token_28, created = Token.objects.get_or_create(
            user=user_28,
            defaults={"key": "7581e10d87bbc264865b74418d9cd57f999034c9"}
        )

        token_27, created = Token.objects.get_or_create(
            user=user_27,
            defaults={"key": "343fa65783ce44403f4c2d64172a14b3e94fac08"}
        )

        token_26, created = Token.objects.get_or_create(
            user=user_26,
            defaults={"key": "caa8f6c22b2a3cee4a46747b4dc5217dcb1d36b6"}
        )

        token_24, created = Token.objects.get_or_create(
            user=user_24,
            defaults={"key": "26b85031991ac93f27b2503b1572434e1bd197f1"}
        )

        token_19, created = Token.objects.get_or_create(
            user=user_19,
            defaults={"key": "1b3d3e560bf56d6963e72966adeb9f6660cbd6cf"}
        )

        token_7, created = Token.objects.get_or_create(
            user=user_7,
            defaults={"key": "26564651837229ebaf5638e8e1e8a2674f85c233"}
        )

        token_14, created = Token.objects.get_or_create(
            user=user_14,
            defaults={"key": "71c4aec1b366a83895922058149c7d15f99f6376"}
        )

        token_32, created = Token.objects.get_or_create(
            user=user_32,
            defaults={"key": "b194c261fb7dbc1772a26d15e97c2616960bca06"}
        )

        token_36, created = Token.objects.get_or_create(
            user=user_36,
            defaults={"key": "518188376863180d8273acbd7ee6ed455115809e"}
        )

        token_30, created = Token.objects.get_or_create(
            user=user_30,
            defaults={"key": "cc45d07ab1890b7c0f30421c7f194dc59a7dab72"}
        )

        # ===== CLIENTES =====
        print("👤 Creando clientes...")
        cliente_3, created = Cliente.objects.get_or_create(
            ID_Usuario=user_1,
            defaults={
                "prioritario": False,
            }
        )

        cliente_4, created = Cliente.objects.get_or_create(
            ID_Usuario=user_4,
            defaults={
                "prioritario": False,
            }
        )

        cliente_7, created = Cliente.objects.get_or_create(
            ID_Usuario=user_7,
            defaults={
                "prioritario": False,
            }
        )

        cliente_8, created = Cliente.objects.get_or_create(
            ID_Usuario=user_5,
            defaults={
                "prioritario": False,
            }
        )

        cliente_11, created = Cliente.objects.get_or_create(
            ID_Usuario=user_10,
            defaults={
                "prioritario": False,
            }
        )

        cliente_12, created = Cliente.objects.get_or_create(
            ID_Usuario=user_8,
            defaults={
                "prioritario": False,
            }
        )

        cliente_13, created = Cliente.objects.get_or_create(
            ID_Usuario=user_3,
            defaults={
                "prioritario": False,
            }
        )

        cliente_14, created = Cliente.objects.get_or_create(
            ID_Usuario=user_16,
            defaults={
                "prioritario": False,
            }
        )

        cliente_15, created = Cliente.objects.get_or_create(
            ID_Usuario=user_17,
            defaults={
                "prioritario": False,
            }
        )

        cliente_16, created = Cliente.objects.get_or_create(
            ID_Usuario=user_19,
            defaults={
                "prioritario": False,
            }
        )

        cliente_17, created = Cliente.objects.get_or_create(
            ID_Usuario=user_20,
            defaults={
                "prioritario": True,
            }
        )

        cliente_18, created = Cliente.objects.get_or_create(
            ID_Usuario=user_21,
            defaults={
                "prioritario": False,
            }
        )

        cliente_19, created = Cliente.objects.get_or_create(
            ID_Usuario=user_22,
            defaults={
                "prioritario": True,
            }
        )

        cliente_20, created = Cliente.objects.get_or_create(
            ID_Usuario=user_23,
            defaults={
                "prioritario": False,
            }
        )

        cliente_21, created = Cliente.objects.get_or_create(
            ID_Usuario=user_24,
            defaults={
                "prioritario": False,
            }
        )

        cliente_22, created = Cliente.objects.get_or_create(
            ID_Usuario=user_25,
            defaults={
                "prioritario": True,
            }
        )

        cliente_23, created = Cliente.objects.get_or_create(
            ID_Usuario=user_26,
            defaults={
                "prioritario": False,
            }
        )

        cliente_24, created = Cliente.objects.get_or_create(
            ID_Usuario=user_27,
            defaults={
                "prioritario": False,
            }
        )

        cliente_25, created = Cliente.objects.get_or_create(
            ID_Usuario=user_28,
            defaults={
                "prioritario": True,
            }
        )

        cliente_26, created = Cliente.objects.get_or_create(
            ID_Usuario=user_29,
            defaults={
                "prioritario": False,
            }
        )

        cliente_27, created = Cliente.objects.get_or_create(
            ID_Usuario=user_31,
            defaults={
                "prioritario": False,
            }
        )

        cliente_29, created = Cliente.objects.get_or_create(
            ID_Usuario=user_32,
            defaults={
                "prioritario": False,
            }
        )

        cliente_31, created = Cliente.objects.get_or_create(
            ID_Usuario=user_33,
            defaults={
                "prioritario": False,
            }
        )

        cliente_33, created = Cliente.objects.get_or_create(
            ID_Usuario=user_34,
            defaults={
                "prioritario": False,
            }
        )

        cliente_34, created = Cliente.objects.get_or_create(
            ID_Usuario=user_35,
            defaults={
                "prioritario": False,
            }
        )

        cliente_35, created = Cliente.objects.get_or_create(
            ID_Usuario=user_36,
            defaults={
                "prioritario": False,
            }
        )

        # ===== PRODUCTOS =====
        print("📦 Creando productos...")
        producto_1, created = Producto.objects.get_or_create(
            Nombre="Paracetamol",
            defaults={
                "Presentacion": "Tabletas 500mg x 10 und",
                "Descripcion": "Medicamento para aliviar el dolor y reducir la fiebre. Actúa bloqueando la producción de ciertas sustancias que causan dolor e inflamación.",
                "Tipo": "Antiinflamatorio",
                "Precio": 8000,
                "Descuento": 1000,
                "Stock": 10,
                "Marca": "MK",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "235674",
                "Fecha_vencimiento": date(2027, 11, 24),
            }
        )

        producto_2, created = Producto.objects.get_or_create(
            Nombre="Ibuprofeno 400mg",
            defaults={
                "Presentacion": "Tabletas x 20 unidades",
                "Descripcion": "Antiinflamatorio no esteroideo para dolor y fiebre",
                "Tipo": "Analgésico",
                "Precio": 12500,
                "Descuento": 0,
                "Stock": 154,
                "Marca": "Genfar",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED001",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_3, created = Producto.objects.get_or_create(
            Nombre="Acetaminofén 500mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Analgésico y antipirético de uso común",
                "Tipo": "Analgésico",
                "Precio": 8900,
                "Descuento": 500,
                "Stock": 179,
                "Marca": "MK",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED002",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_4, created = Producto.objects.get_or_create(
            Nombre="Amoxicilina 500mg",
            defaults={
                "Presentacion": "Cápsulas x 21 unidades",
                "Descripcion": "Antibiótico betalactámico de amplio espectro",
                "Tipo": "Antibiótico",
                "Precio": 18750,
                "Descuento": 0,
                "Stock": 79,
                "Marca": "Tecnoquímicas",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED003",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_5, created = Producto.objects.get_or_create(
            Nombre="Loratadina 10mg",
            defaults={
                "Presentacion": "Tabletas x 10 unidades",
                "Descripcion": "Antihistamínico para alergias",
                "Tipo": "Antihistamínico",
                "Precio": 15200,
                "Descuento": 10,
                "Stock": 117,
                "Marca": "Lafrancol",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED004",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_6, created = Producto.objects.get_or_create(
            Nombre="Omeprazol 20mg",
            defaults={
                "Presentacion": "Cápsulas x 14 unidades",
                "Descripcion": "Inhibidor de bomba de protones para gastritis",
                "Tipo": "Gastro",
                "Precio": 22400,
                "Descuento": 0,
                "Stock": 92,
                "Marca": "Pfizer",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED005",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_7, created = Producto.objects.get_or_create(
            Nombre="Dipirona 500mg",
            defaults={
                "Presentacion": "Tabletas x 20 unidades",
                "Descripcion": "Analgésico y antipirético potente",
                "Tipo": "Analgésico",
                "Precio": 11800,
                "Descuento": 15,
                "Stock": 105,
                "Marca": "Bayer",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED006",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_8, created = Producto.objects.get_or_create(
            Nombre="Diclofenaco 50mg",
            defaults={
                "Presentacion": "Tabletas x 20 unidades",
                "Descripcion": "Antiinflamatorio para dolor muscular y articular",
                "Tipo": "Antiinflamatorio",
                "Precio": 14600,
                "Descuento": 0,
                "Stock": 130,
                "Marca": "Voltaren",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED007",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_9, created = Producto.objects.get_or_create(
            Nombre="Simvastatina 20mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Estatina para control del colesterol",
                "Tipo": "Hipolipemiante",
                "Precio": 28900,
                "Descuento": 0,
                "Stock": 69,
                "Marca": "Abbott",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED008",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_10, created = Producto.objects.get_or_create(
            Nombre="Metformina 850mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Antidiabético oral para diabetes tipo 2",
                "Tipo": "Antidiabético",
                "Precio": 19500,
                "Descuento": 5,
                "Stock": 95,
                "Marca": "Sanofi",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED009",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_11, created = Producto.objects.get_or_create(
            Nombre="Atorvastatina 40mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Estatina para reducir colesterol y triglicéridos",
                "Tipo": "Hipolipemiante",
                "Precio": 35200,
                "Descuento": 0,
                "Stock": 56,
                "Marca": "Lipitor",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED010",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_12, created = Producto.objects.get_or_create(
            Nombre="Salbutamol 100mcg",
            defaults={
                "Presentacion": "Inhalador x 200 dosis",
                "Descripcion": "Broncodilatador para asma y EPOC",
                "Tipo": "Broncodilatador",
                "Precio": 42800,
                "Descuento": 0,
                "Stock": 42,
                "Marca": "Ventolin",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED011",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_13, created = Producto.objects.get_or_create(
            Nombre="Captopril 80mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "IECA para hipertensión arterial",
                "Tipo": "Antihipertensivo",
                "Precio": 16900,
                "Descuento": 10,
                "Stock": 83,
                "Marca": "Capoten",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED012",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_14, created = Producto.objects.get_or_create(
            Nombre="Losartán 50mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "ARA II para hipertensión y protección renal",
                "Tipo": "Antihipertensivo",
                "Precio": 24700,
                "Descuento": 0,
                "Stock": 75,
                "Marca": "Cozaar",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED013",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_15, created = Producto.objects.get_or_create(
            Nombre="Amlodipino 5mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Calcioantagonista para hipertensión",
                "Tipo": "Antihipertensivo",
                "Precio": 22300,
                "Descuento": 5,
                "Stock": 99,
                "Marca": "Norvasc",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED014",
                "Fecha_vencimiento": date(2028, 7, 20),
            }
        )

        producto_16, created = Producto.objects.get_or_create(
            Nombre="Cetirizina 10mg",
            defaults={
                "Presentacion": "Tabletas x 20 unidades",
                "Descripcion": "Antihistamínico de segunda generación",
                "Tipo": "Antihistamínico",
                "Precio": 13800,
                "Descuento": 0,
                "Stock": 140,
                "Marca": "Zyrtec",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED015",
                "Fecha_vencimiento": date(2027, 7, 21),
            }
        )

        producto_17, created = Producto.objects.get_or_create(
            Nombre="Inyección",
            defaults={
                "Presentacion": "Unidad de inyección",
                "Descripcion": "Envase de inyección clásico",
                "Tipo": "Otros",
                "Precio": 1000,
                "Descuento": 100,
                "Stock": 40,
                "Marca": "MK",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "MED030",
                "Fecha_vencimiento": date(2028, 10, 22),
            }
        )

        producto_18, created = Producto.objects.get_or_create(
            Nombre="Dolex forte 50mg",
            defaults={
                "Presentacion": "Cápsulas x 21 unidades",
                "Descripcion": "Especializado para malestares y migrañas",
                "Tipo": "Antibiótico",
                "Precio": 5000,
                "Descuento": 100,
                "Stock": 30,
                "Marca": "Lafrancol",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED043",
                "Fecha_vencimiento": date(2028, 6, 22),
            }
        )

        producto_19, created = Producto.objects.get_or_create(
            Nombre="Captopril 25mg",
            defaults={
                "Presentacion": "Tabletas x 30 unidades",
                "Descripcion": "Ideal para controlar la presión arterial",
                "Tipo": "Antihipertensivo",
                "Precio": 5000,
                "Descuento": 300,
                "Stock": 30,
                "Marca": "Capoten",
                "Activo": True,
                "requiere_orden_medica": True,
                "Codigo": "MED031",
                "Fecha_vencimiento": date(2025, 7, 31),
            }
        )

        producto_20, created = Producto.objects.get_or_create(
            Nombre="Vitamina C 1000mg",
            defaults={
                "Presentacion": "Tabletas",
                "Descripcion": "Medicamento Vitamina",
                "Tipo": "Vitamina",
                "Precio": 15000,
                "Descuento": 0,
                "Stock": 100,
                "Marca": "Healthy",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "",
                "Fecha_vencimiento": None,
            }
        )

        producto_21, created = Producto.objects.get_or_create(
            Nombre="Aspirina 100mg",
            defaults={
                "Presentacion": "Tabletas",
                "Descripcion": "Medicamento Analgésico",
                "Tipo": "Analgésico",
                "Precio": 1800,
                "Descuento": 0,
                "Stock": 100,
                "Marca": "Bayer",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "",
                "Fecha_vencimiento": None,
            }
        )

        producto_22, created = Producto.objects.get_or_create(
            Nombre="Vitamina C 1g",
            defaults={
                "Presentacion": "Tabletas",
                "Descripcion": "Medicamento Vitamina",
                "Tipo": "Vitamina",
                "Precio": 5500,
                "Descuento": 0,
                "Stock": 120,
                "Marca": "Bayer",
                "Activo": True,
                "requiere_orden_medica": False,
                "Codigo": "",
                "Fecha_vencimiento": None,
            }
        )

        # ===== SERVICIOS =====
        print("🏥 Creando servicios...")
        servicio_1, created = Servicio.objects.get_or_create(
            Nombre="Adulto Mayor",
            defaults={
                "Descripcion": "Urgencia",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_2, created = Servicio.objects.get_or_create(
            Nombre="Consulta de Urgencias",
            defaults={
                "Descripcion": "Atención médica inmediata para casos de urgencia y emergencia",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_3, created = Servicio.objects.get_or_create(
            Nombre="Atención Prioritaria Adulto Mayor",
            defaults={
                "Descripcion": "Servicio especializado para personas de la tercera edad con atención preferencial",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_4, created = Servicio.objects.get_or_create(
            Nombre="Consulta Medicina General",
            defaults={
                "Descripcion": "Consulta médica general para evaluación y diagnóstico de condiciones comunes",
                "Prioridad": 0,
                "Estado": True,
            }
        )

        servicio_5, created = Servicio.objects.get_or_create(
            Nombre="Aplicación de Inyecciones",
            defaults={
                "Descripcion": "Servicio de enfermería para aplicación de medicamentos inyectables",
                "Prioridad": 0,
                "Estado": True,
            }
        )

        servicio_6, created = Servicio.objects.get_or_create(
            Nombre="Toma de Signos Vitales",
            defaults={
                "Descripcion": "Medición de presión arterial, temperatura, pulso y otros signos vitales",
                "Prioridad": 0,
                "Estado": True,
            }
        )

        servicio_7, created = Servicio.objects.get_or_create(
            Nombre="Infancia",
            defaults={
                "Descripcion": "Atención a primera infancia",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_8, created = Servicio.objects.get_or_create(
            Nombre="Farmacia General",
            defaults={
                "Descripcion": "Servicio de farmacia general",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_9, created = Servicio.objects.get_or_create(
            Nombre="Consulta Médica",
            defaults={
                "Descripcion": "Servicio de consulta médica",
                "Prioridad": 2,
                "Estado": True,
            }
        )

        servicio_10, created = Servicio.objects.get_or_create(
            Nombre="Medicina Prepagada",
            defaults={
                "Descripcion": "Servicio para medicina prepagada",
                "Prioridad": 3,
                "Estado": True,
            }
        )

        servicio_11, created = Servicio.objects.get_or_create(
            Nombre="Consulta General",
            defaults={
                "Descripcion": "Consulta médica general",
                "Prioridad": 1,
                "Estado": True,
            }
        )

        servicio_12, created = Servicio.objects.get_or_create(
            Nombre="Medicina Especializada",
            defaults={
                "Descripcion": "Consulta con especialista",
                "Prioridad": 2,
                "Estado": True,
            }
        )

        servicio_13, created = Servicio.objects.get_or_create(
            Nombre="Venta de Medicamentos",
            defaults={
                "Descripcion": "Compra de medicamentos",
                "Prioridad": 3,
                "Estado": True,
            }
        )

        servicio_14, created = Servicio.objects.get_or_create(
            Nombre="Procedimientos",
            defaults={
                "Descripcion": "Procedimientos médicos",
                "Prioridad": 4,
                "Estado": True,
            }
        )

        # ===== CAJAS =====
        print("💰 Creando cajas...")
        caja_8, created = Caja.objects.get_or_create(
            nombre="A",
            defaults={
                "ID_Usuario": user_10,
                "Estado": True,
            }
        )

        caja_9, created = Caja.objects.get_or_create(
            nombre="B",
            defaults={
                "ID_Usuario": user_14,
                "Estado": True,
            }
        )

        caja_10, created = Caja.objects.get_or_create(
            nombre="C",
            defaults={
                "ID_Usuario": user_12,
                "Estado": True,
            }
        )

        caja_11, created = Caja.objects.get_or_create(
            nombre="D",
            defaults={
                "ID_Usuario": user_13,
                "Estado": True,
            }
        )

        caja_13, created = Caja.objects.get_or_create(
            nombre="TEST",
            defaults={
                "ID_Usuario": None,
                "Estado": True,
            }
        )


    print("✅ Datos de prueba creados exitosamente!")
    print("📊 Resumen:")
    print(f"   - Roles: {Rol.objects.count()}")
    print(f"   - Usuarios: {User.objects.count()}")
    print(f"   - Clientes: {Cliente.objects.count()}")
    print(f"   - Productos: {Producto.objects.count()}")
    print(f"   - Servicios: {Servicio.objects.count()}")
    print(f"   - Cajas: {Caja.objects.count()}")
    print(f"   - Tokens: {Token.objects.count()}")

if __name__ == "__main__":
    print("🎯 Ejecutando script de datos de prueba...")
    create_test_data()
    print("🎉 ¡Proceso completado!")