from rest_framework import serializers
from apps.users.models import User, Cliente, Administrador, Rol, Empleado

class UserPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'first_name', 'last_name', 'email', 'cc',
            'phone_number', 'dob', 'is_active', 'created_at',
            'rol'
        ]

class EmpleadoSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(source="ID_Usuario", read_only=True)
    ID_Usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )
    
    class Meta:
        model = Empleado
        fields = ['ID_Usuario', 'user', 'created_at', 'updated_at', 'deleted_at', 'Fecha_contratacion']

class AdministradorSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(source="ID_Usuario", read_only=True)
    ID_Usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = Administrador
        fields = ['ID_Usuario', 'user', 'created_at', 'updated_at', 'deleted_at']


class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = '__all__'

class ClienteSerializer(serializers.ModelSerializer):
    user  = UserPublicSerializer(source = "ID_Usuario", read_only=True)
    ID_Usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True
    )  
    class Meta:
        model = Cliente
        fields = ['ID_Usuario', 'user', 'created_at', 'updated_at', 'deleted_at', 'prioritario']

class obtener_creacion_actualizacion_administrador(serializers.ModelSerializer):

    class Meta:
        model = Administrador
        fields = ['created_at','updated_at'] 

class obtener_creacion_actualizacion_cliente(serializers.ModelSerializer):

    class Meta:
        model = Cliente
        fields = ['created_at','updated_at'] 

class admin_password(serializers.Serializer):
    #class Meta:
        #model = Administrador
    cc = serializers.IntegerField(min_value=100000, max_value=9999999999)
    antigua_password = serializers.CharField(write_only=True, min_length=6)
    nueva_password = serializers.CharField(write_only=True, min_length=6)

class cc_client(serializers.Serializer):
    # the parameter it is an identification by the person
    #class Meta:
        #model = Cliente
        #fields = ['ID_Usuario']
    cc = serializers.IntegerField(min_value=100000, max_value=9999999999)


class UserSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = [
            'id','password','first_name', 'last_name', 'email', 'cc', 'phone_number', 'rol',
            'dob', 'is_active', 'created_at', 'updated_at', 'deleted_at'
        ]
        extra_kwargs = {
            'password': {'write_only': True},  # No mostrar la contraseña en respuestas
            'created_at': {'read_only': True},  # Solo lectura
            'updated_at': {'read_only': True},  # Solo lectura
            'deleted_at': {'read_only': True}   # Solo lectura
        }

    def create(self, validated_data):
        """Crear usuario con contraseña encriptada"""
        password = validated_data.pop('password', None)
        rol = validated_data.get('rol', None)
        
        # Crear usuario sin rol si no se especifica
        user = User(**validated_data)
        if password:
            user.set_password(password)  # Encripta la contraseña automáticamente
        user.save()
        
        # Solo crear entrada en tabla de rol si se especifica un rol
        if rol:
            self._create_role_entry(user, rol)
        
        return user

    def update(self, instance, validated_data):
        """Actualizar usuario (manteniendo encriptación de contraseña)"""
        password = validated_data.pop('password', None)
        rol = validated_data.get('rol')
        
        # Si hay cambio de rol, manejarlo
        if rol and rol != instance.rol:
            self._handle_role_change(instance, rol)
            instance.rol = rol
        elif rol is None and instance.rol:
            # Si se está eliminando el rol
            self._remove_from_all_role_tables(instance)
            instance.rol = None
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
    
    def _create_role_entry(self, user, rol):
        """Crear entrada en la tabla específica del rol"""
        from django.utils.timezone import now
        
        if rol == 'cliente':
            Cliente.objects.create(ID_Usuario=user, prioritario=False)
        elif rol == 'empleado':
            Empleado.objects.create(ID_Usuario=user, Fecha_contratacion=now().date())
        elif rol == 'administrador':
            Administrador.objects.create(ID_Usuario=user)
    
    def _handle_role_change(self, user, nuevo_rol):
        """Manejar cambio de rol eliminando de tabla anterior y creando en nueva"""
        # Primero eliminar de todas las tablas de roles
        self._remove_from_all_role_tables(user)
        
        # Crear entrada en la nueva tabla
        self._create_role_entry(user, nuevo_rol)
    
    def _remove_from_all_role_tables(self, user):
        """Eliminar usuario de todas las tablas de roles (soft delete)"""
        from django.utils.timezone import now
        
        try:
            cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            cliente.deleted_at = now()
            cliente.save()
        except Cliente.DoesNotExist:
            pass

        try:
            empleado = Empleado.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            empleado.deleted_at = now()
            empleado.save()
        except Empleado.DoesNotExist:
            pass

        try:
            administrador = Administrador.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            administrador.deleted_at = now()
            administrador.save()
        except Administrador.DoesNotExist:
            pass


class NestedUserSerializer(serializers.Serializer):
    user = UserSerializer()
    aditional = serializers.DictField(required=False)