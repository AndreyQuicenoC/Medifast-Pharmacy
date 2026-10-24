from django.contrib.auth import get_user_model
from django.utils import timezone
from django.contrib.auth.base_user import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, cc, email, first_name, last_name, phone_number, password=None, dob=None, **extra_fields):
        if not cc:
            raise ValueError('El número de cédula es obligatorio')
        if not email:
            raise ValueError('El email es obligatorio')
        if not first_name:
            raise ValueError('El primer nombre es obligatorio')
        if not last_name:
            raise ValueError('El apellido es obligatorio')

        # Aseguramos que el campo dob tiene un valor por defecto
        if dob is None:
            dob = timezone.now()  # Se puede establecer cualquier valor por defecto, por ejemplo la fecha actual.

        user = self.model(
            cc=cc,
            email=self.normalize_email(email),
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            dob=dob,
            **extra_fields
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, cc, email, first_name, last_name, phone_number, password=None, dob=None, **extra_fields):
        # Establecer valores predeterminados para los campos obligatorios del superusuario
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        # Si no se proporciona un valor para 'dob', asignamos la fecha actual o cualquier otro valor por defecto
        if dob is None:
            dob = timezone.now()  # O puedes establecer otro valor por defecto aquí.

        # Creamos el superusuario con los valores proporcionados y los predeterminados
        return self.create_user(
            cc=cc, email=email, first_name=first_name, last_name=last_name,
            phone_number=phone_number, password=password, dob=dob, **extra_fields
        )

