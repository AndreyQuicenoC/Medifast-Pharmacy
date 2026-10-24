from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.serializers import ValidationError
from django.db import transaction
from django.contrib.auth.hashers import check_password
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate

from django.utils.timezone import now
from .models import Cliente, User, Administrador, Empleado, Rol
from .serializers import (cc_client, admin_password, obtener_creacion_actualizacion_cliente, 
                          obtener_creacion_actualizacion_administrador, ClienteSerializer, 
                          UserSerializer, RolSerializer, AdministradorSerializer, EmpleadoSerializer)
from apps.tickets.models import Turno
from apps.tickets.serializers import Turnos_de_un_cliente

class EmpleadoViewSet(viewsets.ModelViewSet):
    
    queryset = Empleado.objects.filter(deleted_at__isnull=True)
    serializer_class = EmpleadoSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        with transaction.atomic():
            # Eliminar el usuario de la tabla User también
            user = instance.ID_Usuario
            user.deleted_at = now()
            user.is_active = False
            user.save()
            
            # Eliminar de la tabla Empleado
            instance.deleted_at = now()
            instance.save()
            
        return Response({'message':'Empleado y usuario eliminados'}, status=status.HTTP_204_NO_CONTENT)

class AdministradorViewSet(viewsets.ModelViewSet):

    queryset = Administrador.objects.filter(deleted_at__isnull=True)
    serializer_class = AdministradorSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        with transaction.atomic():
            # Eliminar el usuario de la tabla User también
            user = instance.ID_Usuario
            user.deleted_at = now()
            user.is_active = False
            user.save()
            
            # Eliminar de la tabla Administrador
            instance.deleted_at = now()
            instance.save()
            
        return Response({'message':'Administrador y usuario eliminados'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path='creacion_y_actualizacion_administrador')
    def obtener_creacion_y_actualizacion_administrador(self, request):
        serializer = cc_client(data=request.data)
        serializer.is_valid(raise_exception=True)

        cc = serializer.validated_data['cc']

        try:
            usuario = User.objects.get(cc=cc, deleted_at__isnull=True)
            administrador = Administrador.objects.get(ID_Usuario=usuario, deleted_at__isnull=True)

            administrador_serializado = obtener_creacion_actualizacion_administrador(administrador)

            return Response({'fechas': administrador_serializado.data}, status=200)
        
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        
        except Administrador.DoesNotExist:
            return Response({'error': 'Administrador no encontrado'}, status=403) 
    
    @action(detail=False, methods=['patch'], url_path='cambiar_password')
    def cambiar_password_administrador(self, request):
        
        serializer = admin_password(data=request.data)
        serializer.is_valid(raise_exception=True)

        cc = serializer.validated_data['cc']
        n_password = serializer.validated_data['nueva_password']
        v_password = serializer.validated_data['antigua_password']

        try:
            usuario = User.objects.get(cc=cc, deleted_at__isnull=True)
            administrador = Administrador.objects.get(ID_Usuario=usuario, deleted_at__isnull=True)
            
            if check_password(v_password, usuario.password):
                usuario.set_password(n_password)
                usuario.save()

                return Response({'mensaje': 'Contraseña actualizada correctamente'}, status=200)
            else:
                return Response({'error': 'Contraseña incorrecta'}, status=401)

        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        
        except Administrador.DoesNotExist:
            return Response({'error': 'El usuario no es un administrador'}, status=403) 

class RolViewSet(viewsets.ModelViewSet):
    queryset = Rol.objects.all()
    serializer_class = RolSerializer

class UserViewSet(viewsets.ModelViewSet):

    queryset = User.objects.filter(deleted_at__isnull=True)
    serializer_class = UserSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        with transaction.atomic():
            # Eliminar de todas las tablas específicas (soft delete)
            self._delete_from_all_specific_tables(instance)
            
            # Eliminar el usuario principal
            instance.deleted_at = now()
            instance.is_active = False
            instance.save()
            
        return Response({'message':'Usuario eliminado'}, status=status.HTTP_204_NO_CONTENT)

    def _delete_from_all_specific_tables(self, user):
        """
        Elimina un usuario de todas las tablas específicas (Cliente, Empleado, Administrador)
        """
        from apps.users.models import Cliente, Empleado, Administrador
        
        # Eliminar de Cliente si existe
        try:
            cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            cliente.deleted_at = now()
            cliente.save()
        except Cliente.DoesNotExist:
            pass

        # Eliminar de Empleado si existe
        try:
            empleado = Empleado.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            empleado.deleted_at = now()
            empleado.save()
        except Empleado.DoesNotExist:
            pass

        # Eliminar de Administrador si existe
        try:
            administrador = Administrador.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            administrador.deleted_at = now()
            administrador.save()
        except Administrador.DoesNotExist:
            pass
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.copy()

        # Detectar si se debe agregar a la tabla sin eliminar de las existentes
        add_to_role_table = data.pop('add_to_role_table', False)
        
        # Detectar si se debe reemplazar el rol (eliminar de tabla anterior)
        replace_role_table = data.pop('replace_role_table', False)

        # Detectar si se está cambiando el rol
        nuevo_rol = data.get('rol')
        
        if nuevo_rol and nuevo_rol != instance.rol:
            # Manejar cambio de rol con transacción
            with transaction.atomic():
                if add_to_role_table:
                    # Solo agregar a la nueva tabla sin eliminar de las existentes
                    self._add_to_role_table(instance, nuevo_rol, data)
                elif replace_role_table:
                    # Eliminar de tabla anterior y agregar a la nueva
                    self._handle_role_change_simple(instance, nuevo_rol, data)
                else:
                    # Comportamiento original: mover de una tabla a otra
                    self._handle_role_change_simple(instance, nuevo_rol, data)
                
                # Actualizar rol
                instance.rol = nuevo_rol
                instance.save()
        
        # Manejar actualizaciones de campos específicos por rol sin cambiar el rol
        else:
            # Si es un cliente y se está actualizando el campo prioridad
            if instance.rol == 'cliente' and 'prioridad' in data:
                from apps.users.models import Cliente
                try:
                    cliente = Cliente.objects.get(ID_Usuario=instance, deleted_at__isnull=True)
                    cliente.prioritario = data.get('prioridad', False)
                    cliente.save()
                except Cliente.DoesNotExist:
                    pass

        # Manejar cambios de contraseña si es necesario
        if 'password' in data and data['password']:
            instance.set_password(data['password'])
            instance.save()
            data.pop('password')  # Remover para evitar conflictos

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def _handle_role_change_simple(self, user, nuevo_rol, data):
        """
        Maneja el cambio de rol usando el sistema simplificado
        """
        from apps.users.models import Cliente, Empleado, Administrador
        from django.utils import timezone
        
        # Eliminar de todas las tablas de roles (soft delete)
        try:
            cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            cliente.deleted_at = timezone.now()
            cliente.save()
        except Cliente.DoesNotExist:
            pass

        try:
            empleado = Empleado.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            empleado.deleted_at = timezone.now()
            empleado.save()
        except Empleado.DoesNotExist:
            pass

        try:
            administrador = Administrador.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            administrador.deleted_at = timezone.now()
            administrador.save()
        except Administrador.DoesNotExist:
            pass

        # Crear entrada en la nueva tabla correspondiente
        if nuevo_rol == "cliente":
            prioridad = data.get("prioridad", False)
            Cliente.objects.create(ID_Usuario=user, prioritario=prioridad)
        elif nuevo_rol == "empleado":
            # Usar fecha de contratación del data o fecha actual
            fecha_contratacion = data.get('Fecha_contratacion')
            if not fecha_contratacion:
                fecha_contratacion = timezone.now().date()
            
            Empleado.objects.create(
                ID_Usuario=user, 
                Fecha_contratacion=fecha_contratacion
            )
        elif nuevo_rol == "administrador":
            Administrador.objects.create(ID_Usuario=user)

    def _add_to_role_table(self, user, nuevo_rol, data):
        """
        Agrega el usuario a la tabla del nuevo rol sin eliminar de las existentes
        """
        from apps.users.models import Cliente, Empleado, Administrador
        from django.utils import timezone
        
        # Verificar si ya existe en la tabla correspondiente y no está eliminado
        if nuevo_rol == "cliente":
            if not Cliente.objects.filter(ID_Usuario=user, deleted_at__isnull=True).exists():
                Cliente.objects.create(ID_Usuario=user, prioritario=False)
        elif nuevo_rol == "empleado":
            if not Empleado.objects.filter(ID_Usuario=user, deleted_at__isnull=True).exists():
                # Usar fecha de contratación del data o fecha actual
                fecha_contratacion = data.get('Fecha_contratacion')
                if not fecha_contratacion:
                    fecha_contratacion = timezone.now().date()
                
                Empleado.objects.create(
                    ID_Usuario=user, 
                    Fecha_contratacion=fecha_contratacion
                )
        elif nuevo_rol == "administrador":
            if not Administrador.objects.filter(ID_Usuario=user, deleted_at__isnull=True).exists():
                Administrador.objects.create(ID_Usuario=user)

    def _handle_role_change(self, user, nuevo_rol, data):
        """
        Maneja el cambio de rol de un usuario, eliminándolo de su tabla actual
        y creándolo en la nueva tabla correspondiente.
        """
        from apps.users.models import Cliente, Empleado, Administrador
        
        # Eliminar de las tablas actuales (soft delete)
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

        # Crear o actualizar el objeto Rol
        rol_str = nuevo_rol
        if nuevo_rol == "empleado":
            rol_str = "Empleado"
        
        rol_data = {"cliente": False, "administrador": False, "Empleado": False}
        rol_data[rol_str] = True
        
        # Buscar si ya existe un rol con estas características o crear uno nuevo
        try:
            rol_obj = Rol.objects.get(**rol_data)
        except Rol.DoesNotExist:
            rol_obj = Rol.objects.create(**rol_data)
        
        # Actualizar el rol del usuario
        user.rol = rol_obj
        user.save()

        # Crear entrada en la nueva tabla correspondiente
        if nuevo_rol == "cliente":
            prioridad = data.get("prioridad", False)
            Cliente.objects.create(ID_Usuario=user, prioritario=prioridad)
        elif nuevo_rol == "empleado":
            fecha = data.get("fecha_contratacion", "2024-01-01")  # Fecha por defecto
            Empleado.objects.create(ID_Usuario=user, Fecha_contratacion=fecha)
        elif nuevo_rol == "administrador":
            Administrador.objects.create(ID_Usuario=user)

    def create(self, request, *args, **kwargs):
        """Crear usuario usando el nuevo sistema simplificado de roles"""
        data = request.data.copy()
        
        rol = data.get('rol')
        
        # Configurar campos adicionales basado en el rol
        if rol == 'administrador':
            data['is_staff'] = True
        else:
            data['is_staff'] = False
        
        # Verificar si ya existe un usuario con esa cédula
        cc = data.get('cc')
        if cc:
            try:
                existing_user = User.objects.get(cc=cc)
                if existing_user.deleted_at is None:
                    return Response({"error": "Ya existe un usuario activo con esa cédula."}, status=400)
                else:
                    # Reactivar usuario eliminado
                    existing_user.deleted_at = None
                    existing_user.is_active = True
                    existing_user.rol = rol
                    if data.get('password'):
                        existing_user.set_password(data['password'])
                    existing_user.save()
                    
                    # Crear entrada en tabla correspondiente si hay rol
                    if rol:
                        self._create_role_entry(existing_user, rol)
                    
                    return Response(UserSerializer(existing_user).data, status=status.HTTP_201_CREATED)
            except User.DoesNotExist:
                pass
        
        # Crear nuevo usuario
        with transaction.atomic():
            # Usar el serializer directamente para crear el usuario
            serializer = self.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def _create_role_entry(self, user, rol):
        """Crear entrada en la tabla específica del rol"""
        from apps.users.models import Cliente, Empleado, Administrador
        from django.utils import timezone
        
        if rol == 'cliente':
            Cliente.objects.create(ID_Usuario=user, prioritario=False)
        elif rol == 'empleado':
            Empleado.objects.create(
                ID_Usuario=user, 
                Fecha_contratacion=timezone.now().date()
            )
        elif rol == 'administrador':
            Administrador.objects.create(ID_Usuario=user)

class ClienteViewSet(viewsets.ModelViewSet):

    queryset = Cliente.objects.filter(deleted_at__isnull=True)
    serializer_class = ClienteSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        with transaction.atomic():
            # Eliminar el usuario de la tabla User también
            user = instance.ID_Usuario
            user.deleted_at = now()
            user.is_active = False
            user.save()
            
            # Eliminar de la tabla Cliente
            instance.deleted_at = now()
            instance.save()
            
        return Response({'message':'Cliente y usuario eliminados'}, status=status.HTTP_204_NO_CONTENT)
        
    @action(detail=False, methods=['post'], url_path='es_cliente_y_empleado') 
    def es_cliente_y_empleado(self, request):

        serializer = cc_client(data=request.data)
        serializer.is_valid(raise_exception=True)

        cc = serializer.validated_data['cc']

        try:
            usuario = User.objects.get(cc=cc, deleted_at__isnull=True)

            es_cliente = Cliente.objects.filter(ID_Usuario=usuario, deleted_at__isnull=True).exists()
            es_empleado = Empleado.objects.filter(ID_Usuario=usuario, deleted_at__isnull=True).exists()

            response = es_cliente and es_empleado

            return Response({'cliente_empleado': response, "nombre": usuario.first_name,
                             "apellido": usuario.last_name, "cc": usuario.cc
                             }, status=200)
        
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)

    @action(detail=False, methods=['post'], url_path='creacion_y_actualizacion_cliente')
    def obtener_creacion_y_actualizacion_cliente(self, request):

        serializer = cc_client(data=request.data)
        serializer.is_valid(raise_exception=True)

        cc = serializer.validated_data['cc']

        try:
            usuario = User.objects.get(cc=cc, deleted_at__isnull=True)
            cliente = Cliente.objects.get(ID_Usuario=usuario, deleted_at__isnull=True)

            # Aquí podrías agregar lógica adicional si es necesario
            cliente_serializado = obtener_creacion_actualizacion_cliente(cliente)

            return Response({'fechas': cliente_serializado.data}, status=200)
        
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=403)

    @action(detail=False, methods=['post'], url_path='turnos_cliente')
    def turnos_cliente(self, request):
        
        serializer = cc_client(data=request.data)
        serializer.is_valid(raise_exception=True)

        cc = serializer.validated_data['cc']

        try:
            usuario = User.objects.get(cc=cc, deleted_at__isnull=True)
            cliente = Cliente.objects.get(ID_Usuario=usuario, deleted_at__isnull=True)

            turnos = Turno.objects.filter(ID_Cliente=cliente)
            turnos_serializados = Turnos_de_un_cliente(turnos, many=True)

            return Response({'turnos': turnos_serializados.data}, status=200)
        
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=404)
        
        except Cliente.DoesNotExist:
            return Response({'error': 'Cliente no encontrado'}, status=403)

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        cc = request.data.get('cc')
        password = request.data.get('password')
        
        if not cc or not password:
            return Response({'error': 'CC y contraseña son requeridos'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(cc=cc, deleted_at__isnull=True, is_active=True)
            
            if user.check_password(password):
                token, created = Token.objects.get_or_create(user=user)
                
                # Usar el sistema de rol
                rol = getattr(user, 'rol', 'cliente')
                
                # Mantener compatibilidad con frontend existente
                is_client = rol == 'cliente'
                is_cajero = rol == 'empleado'
                
                return Response({
                    'token': token.key,
                    'user_id': user.pk,
                    'cc': user.cc,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'rol': rol,
                    'is_client': is_client,
                    'is_cajero': is_cajero,
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({'error': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['post'], permission_classes=[], authentication_classes=[])
    def register(self, request):
        """Endpoint público para registro de nuevos clientes"""
        data = request.data.copy()
        
        # Forzar que siempre sea cliente
        data['rol'] = 'cliente'
        data['is_client'] = True
        data['is_cajero'] = False
        data['is_staff'] = False
        data['is_superuser'] = False
        
        # Validaciones básicas
        required_fields = ['cc', 'first_name', 'last_name', 'email', 'password', 'phone_number', 'dob']
        for field in required_fields:
            if not data.get(field):
                return Response({
                    'error': f'El campo {field} es obligatorio'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si ya existe un usuario con esa cédula
        cc = data.get('cc')
        if User.objects.filter(cc=cc, deleted_at__isnull=True).exists():
            return Response({
                'cc': ['Ya existe un usuario registrado con esa cédula']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar si ya existe un usuario con ese email
        email = data.get('email')
        if User.objects.filter(email=email, deleted_at__isnull=True).exists():
            return Response({
                'email': ['Ya existe un usuario registrado con ese email']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar formato de teléfono
        phone_number = str(data.get('phone_number', ''))
        if not phone_number.startswith(('3', '6')) or len(phone_number) != 10:
            return Response({
                'phone_number': ['El número de teléfono debe empezar con 3 o 6 y tener 10 dígitos']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Validar cédula
        cc_str = str(cc)
        if len(cc_str) < 6 or len(cc_str) > 10:
            return Response({
                'cc': ['La cédula debe tener entre 6 y 10 dígitos']
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            with transaction.atomic():
                # Crear nuevo usuario
                serializer = self.get_serializer(data=data)
                serializer.is_valid(raise_exception=True)
                user = serializer.save()
                
                # Crear entrada en tabla Cliente
                from apps.users.models import Cliente
                Cliente.objects.create(ID_Usuario=user, prioritario=False)
                
                return Response({
                    'message': 'Usuario registrado exitosamente',
                    'user': {
                        'id': user.id,
                        'cc': user.cc,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'email': user.email
                    }
                }, status=status.HTTP_201_CREATED)
                
        except ValidationError as e:
            return Response(e.detail, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print(f"Error en registro: {str(e)}")
            print(traceback.format_exc())
            return Response({
                'error': f'Error al crear usuario: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
