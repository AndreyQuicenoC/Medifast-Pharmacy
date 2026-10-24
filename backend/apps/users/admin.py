from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from django import forms
from .models import User, Cliente, Empleado, Administrador, Rol


class CustomUserCreationForm(UserCreationForm):
    """Formulario personalizado para crear usuarios"""
    
    # Campo de rol obligatorio
    rol = forms.ChoiceField(
        choices=User.ROLE_CHOICES,
        initial='cliente',
        help_text='Seleccione el rol del usuario'
    )
    
    # Campo opcional para fecha de contratación (solo para empleados)
    fecha_contratacion = forms.DateField(
        required=False,
        help_text='Fecha de contratación (solo para empleados). Si se deja vacío, se usa la fecha actual.'
    )
    
    # Campo opcional para prioridad (solo para clientes)
    es_prioritario = forms.BooleanField(
        required=False,
        initial=False,
        help_text='Marcar si el cliente tiene prioridad'
    )
    
    class Meta:
        model = User
        fields = ('cc', 'first_name', 'last_name', 'email', 'phone_number', 'dob', 'rol')
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['cc'].help_text = 'Cédula de ciudadanía (6-10 dígitos)'
        self.fields['phone_number'].help_text = 'Número de teléfono (10 dígitos, empezar con 3 o 6)'
        self.fields['dob'].help_text = 'Fecha de nacimiento (YYYY-MM-DD)'
        self.fields['rol'].help_text = 'Seleccione el rol del usuario'
        self.fields['rol'].required = True
    
    def save(self, commit=True):
        user = super().save(commit=False)
        # Asegurar que el rol se asigne
        if not user.rol:
            user.rol = self.cleaned_data.get('rol', 'cliente')
        
        # Asignar permisos según el rol
        if user.rol == 'administrador':
            user.is_staff = True
            user.is_superuser = True
        elif user.rol == 'empleado':
            user.is_staff = True
            user.is_superuser = False
        else:  # cliente
            user.is_staff = False
            user.is_superuser = False
            
        if commit:
            user.save()
            # Crear las entradas correspondientes en las tablas específicas
            self._create_role_specific_entry(user)
        return user
    
    def _create_role_specific_entry(self, user):
        """Crear entrada en la tabla específica según el rol"""
        from datetime import date
        
        if user.rol == 'cliente':
            prioritario = self.cleaned_data.get('es_prioritario', False)
            Cliente.objects.get_or_create(
                ID_Usuario=user,
                defaults={'prioritario': prioritario}
            )
        elif user.rol == 'empleado':
            fecha_contratacion = self.cleaned_data.get('fecha_contratacion') or date.today()
            Empleado.objects.get_or_create(
                ID_Usuario=user,
                defaults={'Fecha_contratacion': fecha_contratacion}
            )
        elif user.rol == 'administrador':
            Administrador.objects.get_or_create(ID_Usuario=user)


class CustomUserChangeForm(UserChangeForm):
    """Formulario personalizado para editar usuarios"""
    
    class Meta:
        model = User
        fields = ('cc', 'first_name', 'last_name', 'email', 'phone_number', 'dob', 'rol', 'is_active')
    
    def save(self, commit=True):
        user = super().save(commit=False)
        
        # Actualizar permisos según el rol
        if user.rol == 'administrador':
            user.is_staff = True
            user.is_superuser = True
        elif user.rol == 'empleado':
            user.is_staff = True
            user.is_superuser = False
        else:  # cliente
            user.is_staff = False
            user.is_superuser = False
            
        if commit:
            user.save()
        return user


class UserAdmin(BaseUserAdmin):
    """Configuración personalizada del admin para User"""
    
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = ('cc', 'first_name', 'last_name', 'email', 'rol', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('rol', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('cc', 'first_name', 'last_name', 'email')
    ordering = ('cc',)
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('cc', 'first_name', 'last_name', 'email', 'phone_number', 'dob')
        }),
        ('Rol y Permisos', {
            'fields': ('rol', 'is_active', 'is_staff', 'is_superuser')
        }),
        ('Fechas importantes', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Información Personal', {
            'fields': ('cc', 'first_name', 'last_name', 'email', 'phone_number', 'dob')
        }),
        ('Contraseña', {
            'fields': ('password1', 'password2')
        }),
        ('Rol y Configuración', {
            'fields': ('rol', 'fecha_contratacion', 'es_prioritario')
        }),
    )


# Registrar modelos
admin.site.register(User, UserAdmin)
admin.site.register(Cliente)
admin.site.register(Empleado)
admin.site.register(Administrador)
admin.site.register(Rol)

# Personalizar el título del admin
admin.site.site_header = "Administración de Medifast"
admin.site.site_title = "Medifast Admin"
admin.site.index_title = "Panel de Administración"
