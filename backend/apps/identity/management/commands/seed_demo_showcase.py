"""
Poblado amplio para demo academica (datos ficticios). Contrasena solo por argumento o entorno.
Idempotente por cedulas 910900xxx y nombres de caja DEMO-*.
"""

from __future__ import annotations

import json
import os
import random
from datetime import datetime, timedelta
from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.catalog.models import Producto
from apps.identity.models import Administrador, Cliente, Empleado, User
from apps.operations.models import Caja, Factura, Horario, Servicio, Turno

DEMO_USERS = [
    (910900001, "administrador", "Sofia", "Rios", "admin.demo@medifast.demo"),
    (910900002, "empleado", "Carlos", "Mesa", "cajero.demo@medifast.demo"),
    (910900003, "cliente", "Laura", "Pardo", "cliente.demo@medifast.demo"),
    (910900004, "cliente", "Andres", "Vega", "andres.demo@medifast.demo"),
    (910900005, "cliente", "Maria", "Lopez", "maria.demo@medifast.demo"),
    (910900006, "empleado", "Diana", "Torres", "diana.demo@medifast.demo"),
    (910900007, "administrador", "Felipe", "Gomez", "felipe.demo@medifast.demo"),
]

SERVICIOS = [
    ("Dispensacion medicamentos", 1, "Entrega OTC y formulados", True),
    ("Consulta farmaceutica", 2, "Orientacion sobre tratamientos", True),
    ("Toma de presion", 3, "Control cardiovascular basico", True),
    ("Vacunacion", 1, "Esquema adulto e infantil", True),
    ("Entrega domicilio", 4, "Pedidos programados zona urbana", True),
    ("Control diabetes", 2, "Seguimiento glucosa y adherencia", True),
]

PRODUCTOS_BASE = [
    ("Acetaminofen 500 mg", "Blister x 10", "Analgesico", "Analgesico", 8500, "MK"),
    ("Ibuprofeno 400 mg", "Caja x 20", "Antiinflamatorio", "Analgesico", 12000, "Genfar"),
    ("Loratadina 10 mg", "Caja x 10", "Antihistaminico", "Alergias", 9800, "La Santé"),
    ("Omeprazol 20 mg", "Caja x 14", "Protector gastrico", "Gastro", 14500, "Sanofi"),
    ("Amoxicilina 500 mg", "Caja x 15", "Antibiotico", "Antibiotico", 22000, "Pfizer"),
    ("Suero oral", "Sobre x 5", "Rehidratacion", "Gastro", 6500, "Pedialyte"),
    ("Alcohol antiséptico", "Frasco 120 ml", "Antiseptico", "Primeros auxilios", 7200, "JGB"),
    ("Gasa esteril", "Paquete x 10", "Curacion", "Primeros auxilios", 5400, "Procaps"),
    ("Vitamina C 1000 mg", "Frasco x 30", "Suplemento", "Vitaminas", 18900, "Nature's Bounty"),
    ("Metformina 850 mg", "Caja x 30", "Antidiabetico", "Cronico", 16500, "Merck"),
]


class Command(BaseCommand):
    help = "Carga mockdata amplio para demo (solo entornos de demostracion)."

    def add_arguments(self, parser):
        parser.add_argument(
            "--password",
            default=os.environ.get("DEMO_SEED_PASSWORD", ""),
            help="Contrasena ficticia para cuentas demo (obligatoria).",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        password = (options["password"] or "").strip()
        if not password:
            raise SystemExit("Indique --password o variable DEMO_SEED_PASSWORD.")

        users_by_cc = {}
        for cc, rol, first, last, email in DEMO_USERS:
            user, created = User.objects.get_or_create(
                cc=cc,
                defaults={
                    "email": email,
                    "first_name": first,
                    "last_name": last,
                    "phone_number": 3009000000 + (cc % 1000),
                    "rol": rol,
                    "is_staff": rol == "administrador",
                    "is_active": True,
                    "dob": timezone.make_aware(datetime(1992, 3, 10, 12, 0)),
                },
            )
            if created:
                user.set_password(password)
                user.save()
            users_by_cc[cc] = user
            if rol == "administrador":
                Administrador.objects.get_or_create(ID_Usuario=user)
            elif rol == "empleado":
                Empleado.objects.get_or_create(
                    ID_Usuario=user,
                    defaults={"Fecha_contratacion": timezone.now().date()},
                )
            elif rol == "cliente":
                Cliente.objects.get_or_create(
                    ID_Usuario=user,
                    defaults={"prioritario": cc == 910900004},
                )

        servicios = []
        for nombre, prio, desc, estado in SERVICIOS:
            obj, _ = Servicio.objects.get_or_create(
                Nombre=nombre,
                defaults={
                    "Prioridad": prio,
                    "Descripcion": desc,
                    "Estado": estado,
                },
            )
            servicios.append(obj)

        if Servicio.objects.count() == len(servicios):
            self.stdout.write("Servicios demo listos.")

        for i in range(45):
            base = PRODUCTOS_BASE[i % len(PRODUCTOS_BASE)]
            suffix = f" L{i + 1}" if i >= len(PRODUCTOS_BASE) else ""
            nombre = base[0] + suffix
            Producto.objects.get_or_create(
                Nombre=nombre,
                defaults={
                    "Presentacion": base[1],
                    "Descripcion": base[2],
                    "Tipo": base[3],
                    "Precio": base[4] + (i * 150),
                    "Descuento": (i % 5) * 2,
                    "Stock": 15 + (i * 3) % 120,
                    "Marca": base[5],
                    "Activo": True,
                    "requiere_orden_medica": base[3] == "Antibiotico",
                    "Codigo": f"DEMO-{1000 + i}",
                },
            )

        empleados = [u for u in users_by_cc.values() if u.rol == "empleado"]
        cajas = []
        for idx, label in enumerate(("A", "B", "C", "D")):
            cajero = empleados[idx] if idx < len(empleados) else None
            caja, _ = Caja.objects.get_or_create(
                nombre=f"DEMO-{label}",
                defaults={
                    "Estado": True,
                    "ID_Usuario": cajero,
                },
            )
            cajas.append(caja)

        clientes = list(Cliente.objects.filter(ID_Usuario__cc__gte=910900003))
        now = timezone.now()
        turno_num = Turno.objects.count() + 1
        for idx in range(24):
            cliente = clientes[idx % len(clientes)] if clientes else None
            if not cliente:
                break
            servicio = servicios[idx % len(servicios)]
            estado = ("esperando", "en_atencion", "finalizado", "cancelado")[idx % 4]
            horario = Horario.objects.create(
                Hora_llegada=now - timedelta(hours=idx + 1),
                Hora_atencion=now - timedelta(hours=idx, minutes=45),
                Hora_salida=now - timedelta(hours=idx, minutes=15),
            )
            Turno.objects.get_or_create(
                numero_turno=9000 + idx,
                defaults={
                    "ID_Cliente": cliente,
                    "ID_Caja": cajas[idx % len(cajas)],
                    "ID_Servicio": servicio,
                    "ID_Horario": horario,
                    "Cedula_manual": str(cliente.ID_Usuario.cc),
                    "estado": estado,
                    "es_prioritario": idx % 7 == 0,
                    "posicion_cola": idx + 1,
                },
            )
            turno_num += 1

        productos = list(Producto.objects.filter(Codigo__startswith="DEMO-")[:8])
        for turno in Turno.objects.filter(numero_turno__gte=9000)[:16]:
            if Factura.objects.filter(ID_Turno=turno).exists():
                continue
            lineas = [
                {
                    "producto_id": p.id,
                    "nombre": p.Nombre,
                    "cantidad": 1 + (turno.id or 0) % 3,
                    "precio_unitario": p.Precio,
                }
                for p in random.sample(productos, min(3, len(productos)))
            ]
            total = sum(
                Decimal(str(x["precio_unitario"])) * x["cantidad"] for x in lineas
            )
            Factura.objects.create(
                ID_Turno=turno,
                Total=total,
                productos_vendidos=json.dumps(lineas),
                fecha_factura=now - timedelta(days=(turno.id or 1) % 10),
            )

        self.stdout.write(
            self.style.SUCCESS(
                "Demo showcase cargado: usuarios 910900001-910900007, productos, turnos y facturas."
            )
        )
