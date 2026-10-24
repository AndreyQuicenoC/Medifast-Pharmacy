from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import viewsets, status
from rest_framework.serializers import ValidationError
from django.db import transaction
from django.contrib.auth.hashers import check_password

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

        # Detectar si se está cambiando el rol
        nuevo_rol = None
        if 'is_staff' in data or 'is_superuser' in data or 'is_client' in data or 'is_cajero' in data:
            # Determinar el nuevo rol basado en los campos booleanos
            if data.get('is_staff') and data.get('is_superuser'):
                nuevo_rol = "administrador"
            elif data.get('is_staff') or data.get('is_cajero'):
                nuevo_rol = "empleado"
            else:
                nuevo_rol = "cliente"
        
        rol_actual = instance.rol

        # Cliente no puede cambiar contraseña
        if rol_actual.cliente:
            if "password" in data:
                raise ValidationError({"error": "Los clientes no pueden cambiar su contraseña."})

        # Empleado o administrador puede cambiar, pero con verificación de contraseña antigua
        elif rol_actual.administrador or rol_actual.Empleado:
            nueva_password = data.get("password")
            antigua_password = data.get("old_password")

            if nueva_password:
                if not antigua_password:
                    raise ValidationError({"error": "Debe proporcionar la contraseña actual para cambiarla."})

                if not instance.check_password(antigua_password):
                    raise ValidationError({"error": "La contraseña actual es incorrecta."})

                instance.set_password(nueva_password)
                instance.save()
                data.pop("password")  # Para que no intente reconfigurarla vía serializer
                data.pop("old_password", None)

        # Si hay cambio de rol, manejarlo con transacción
        if nuevo_rol:
            with transaction.atomic():
                self._handle_role_change(instance, nuevo_rol, data)

        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

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
        from apps.users.models import Cliente, Empleado, Administrador

        data = request.data.copy()

        # Check if data has nested 'user' structure or flat structure
        user = data.get("user")
        if user is None:
            # If no nested structure, treat the entire data as user data
            user = data.copy()
            # Set aditional data to empty if not provided
            aditional_data = data.get("aditional", {})
        else:
            aditional_data = data.get("aditional", {})

        # Validar rol recibido
        rol_value = user.get("rol") or user.get("role")  # Aceptar tanto 'rol' como 'role'
        if not rol_value:
            return Response({"error": "El campo 'rol' es requerido."}, status=400)
        
        # Handle if rol is sent as ID, Rol object, or string
        if isinstance(rol_value, int):
            # rol_value is an ID, get the Rol object
            try:
                rol_obj = Rol.objects.get(id=rol_value)
                # Determine the role type based on the Rol object fields
                if rol_obj.cliente:
                    rol_str = "cliente"
                elif rol_obj.administrador:
                    rol_str = "administrador"
                elif rol_obj.Empleado:
                    rol_str = "empleado"
                else:
                    return Response({"error": "Rol no válido en la base de datos."}, status=400)
            except Rol.DoesNotExist:
                return Response({"error": "El rol especificado no existe."}, status=400)
        elif isinstance(rol_value, str):
            # rol_value is a string
            rol_str = rol_value.lower()
            if rol_str not in ["cliente", "administrador", "empleado"]:
                return Response({"error": "El rol debe ser 'cliente', 'administrador' o 'empleado'."}, status=400)
        else:
            return Response({"error": "Formato de rol no válido."}, status=400)

        if rol_str == "empleado":
            rol_str = "Empleado"

        # Crear o usar el objeto Rol correspondiente
        with transaction.atomic():
            # If we already have a rol_obj from the ID case, use it
            if 'rol_obj' not in locals():
                # Create new Rol object only if we don't have one
                rol_data = {"cliente": False, "administrador": False, "Empleado": False}
                rol_data[rol_str] = True
                rol_obj = Rol.objects.create(**rol_data)
            
            user["rol"] = rol_obj.id

            # Si es cliente, la contraseña será la cédula
            if rol_str == "cliente":
                user["password"] = str(user.get("cc"))

            cc = user.get("cc")

            try:
                usuario_existente = User.objects.get(cc=cc)

                if usuario_existente.deleted_at:
                    serializer = UserSerializer(data=user)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()

                    usuario_existente.set_password(user["password"])
                    usuario_existente.deleted_at = None 
                    usuario_existente.save()

                    user_obj = usuario_existente

                else:
                    return Response({"error": "Ya existe un usuario activo con esa cédula."}, status=400)

            except User.DoesNotExist:
                serializer = UserSerializer(data=user)
                serializer.is_valid(raise_exception=True)
                self.perform_create(serializer)

                user_obj = User.objects.get(pk=serializer.data["id"])
                user_obj.set_password(serializer.validated_data["password"])
                user_obj.save()

            # Crear entrada en tabla correspondiente
            if rol_str == "cliente":
                prioridad = aditional_data.get("prioritario", False)
                Cliente.objects.create(ID_Usuario=user_obj, prioritario=prioridad)
            elif rol_str == "Empleado":
                fecha = aditional_data.get("fecha_contratacion")
                Empleado.objects.create(ID_Usuario=user_obj, Fecha_contratacion=fecha)
            elif rol_str == "administrador":
                Administrador.objects.create(ID_Usuario=user_obj)

            return Response({
                "message": "Usuario creado correctamente",
                "id": user_obj.id,
                "user": UserSerializer(user_obj).data
            }, status=status.HTTP_201_CREATED)

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
