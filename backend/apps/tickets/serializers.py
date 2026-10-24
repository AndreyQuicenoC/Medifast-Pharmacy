from rest_framework import serializers
from .models import Turno, Caja, Servicio, Horario, Factura
from apps.users.models import Cliente, Empleado, User
from apps.users.serializers import ClienteSerializer, EmpleadoSerializer, UserPublicSerializer

class IDTurno(serializers.Serializer):
    id = serializers.IntegerField(min_value=100000, max_value=9999999999)

class IDServicio(serializers.Serializer):
    id = serializers.IntegerField(min_value=100000, max_value=9999999999)

class NameServicio(serializers.Serializer):
    name = serializers.CharField(max_length = 100)

class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'

class CajaSerializer(serializers.ModelSerializer):
    usuario = UserPublicSerializer(source="ID_Usuario", read_only=True)
    ID_Usuario = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(deleted_at__isnull=True), 
        allow_null=True, 
        required=False
    )
    
    class Meta:
        model = Caja
        fields = ['id', 'nombre', 'ID_Usuario', 'usuario', 'Estado', 'created_at', 'updated_at', 'deleted_at']
    
    def validate_ID_Usuario(self, value):
        """Validar que el usuario no esté ya asignado a otra caja"""
        if value is not None:
            # Excluir la caja actual si estamos actualizando
            caja_actual = self.instance
            cajas_ocupadas = Caja.objects.filter(
                ID_Usuario=value,
                deleted_at__isnull=True
            )
            if caja_actual:
                cajas_ocupadas = cajas_ocupadas.exclude(id=caja_actual.id)
            
            if cajas_ocupadas.exists():
                raise serializers.ValidationError("Este usuario ya está asignado a otra caja.")
        
        return value
    
    def validate_nombre(self, value):
        """Validar que el nombre de la caja sea único"""
        if value is not None:
            caja_actual = self.instance
            cajas_con_nombre = Caja.objects.filter(
                nombre=value,
                deleted_at__isnull=True
            )
            if caja_actual:
                cajas_con_nombre = cajas_con_nombre.exclude(id=caja_actual.id)
            
            if cajas_con_nombre.exists():
                raise serializers.ValidationError("Ya existe una caja con este nombre.")
        
        return value

class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

class FacturaSerializers(serializers.ModelSerializer):
    productos = serializers.SerializerMethodField()
    
    class Meta:
        model = Factura
        fields = '__all__'
    
    def get_productos(self, obj):
        """Convierte el JSON de productos a lista de Python"""
        import json
        try:
            return json.loads(obj.productos_vendidos) if obj.productos_vendidos else []
        except (json.JSONDecodeError, AttributeError):
            return []

class Turnos_de_un_cliente(serializers.ModelSerializer):

    ID_Caja = CajaSerializer()
    ID_Servicio = ServicioSerializer()

    class Meta:
        model = Turno
        fields = ['ID_Caja','ID_Servicio','Cedula_manual','created_at','updated_at','deleted_at']

class TurnoSerializer(serializers.ModelSerializer):

    ID_Caja_data = CajaSerializer(source='ID_Caja', read_only=True)
    ID_Servicio_data = ServicioSerializer(source='ID_Servicio', read_only=True)
    ID_Horario_data = HorarioSerializer(source='ID_Horario', read_only=True)
    ID_Cliente_data = ClienteSerializer(source='ID_Cliente', read_only=True)

    ID_Caja = serializers.PrimaryKeyRelatedField(queryset=Caja.objects.all(), required=False, allow_null=True)
    ID_Servicio = serializers.PrimaryKeyRelatedField(queryset=Servicio.objects.all(), write_only=True)
    ID_Horario = serializers.PrimaryKeyRelatedField(queryset=Horario.objects.all(), required=False, allow_null=True)
    ID_Cliente = serializers.PrimaryKeyRelatedField(queryset=Cliente.objects.all(), write_only=True)

    class Meta:
        model = Turno
        fields = [
            'id', 'numero_turno', 'estado', 'es_prioritario', 'posicion_cola',
            'ID_Caja', 'ID_Caja_data',
            'ID_Servicio', 'ID_Servicio_data',
            'ID_Horario', 'ID_Horario_data',
            'ID_Cliente', 'ID_Cliente_data',
            'Cedula_manual', 'created_at', 'updated_at'
        ]

class CrearTurnoSerializer(serializers.Serializer):
    servicio_id = serializers.IntegerField()
    cedula_cliente = serializers.CharField(max_length=12)
    
    def validate_servicio_id(self, value):
        try:
            servicio = Servicio.objects.get(id=value, Estado=True)
            return value
        except Servicio.DoesNotExist:
            raise serializers.ValidationError("El servicio no existe o está deshabilitado")
    
    def validate_cedula_cliente(self, value):
        from apps.users.models import User, Cliente
        try:
            user = User.objects.get(cc=value, deleted_at__isnull=True)
            cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            return value
        except (User.DoesNotExist, Cliente.DoesNotExist):
            raise serializers.ValidationError("Cliente no encontrado")


