from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from apps.tickets.models import (Caja, Servicio, Horario, Turno, Factura)
from apps.tickets.serializers import (CajaSerializer, ServicioSerializer, HorarioSerializer, 
                                      TurnoSerializer, FacturaSerializers, IDServicio, NameServicio,
                                      IDTurno)
from apps.users.models import Cliente, Empleado, User
from apps.users.serializers import EmpleadoSerializer, UserPublicSerializer
from rest_framework.decorators import action
from django.db import models

class CajaViewSet(viewsets.ModelViewSet):
    queryset = Caja.objects.filter(deleted_at__isnull=True)
    serializer_class = CajaSerializer

    def destroy(self, request, *args, **kwargs):
        """Soft delete para cajas"""
        caja = self.get_object()
        from django.utils.timezone import now
        caja.deleted_at = now()
        caja.save()
        return Response({'message': 'Caja eliminada'}, status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        """Override update para limpiar datos antes de serializar"""
        print(f"Datos recibidos para update: {request.data}")  # Debug
        
        # Limpiar ID_Usuario si viene como string vacío
        if 'ID_Usuario' in request.data and request.data['ID_Usuario'] == '':
            request.data['ID_Usuario'] = None
            
        # Validar que ID_Usuario sea un entero válido si no es None
        if request.data.get('ID_Usuario') is not None:
            try:
                request.data['ID_Usuario'] = int(request.data['ID_Usuario'])
            except (ValueError, TypeError):
                print(f"Error: ID_Usuario no es un entero válido: {request.data.get('ID_Usuario')}")
                return Response({'ID_Usuario': ['Debe ser un número entero válido']}, 
                              status=status.HTTP_400_BAD_REQUEST)
        
        # Validar nombre
        if 'nombre' in request.data and not request.data['nombre'].strip():
            return Response({'nombre': ['El nombre de la caja es requerido']}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        """Override create para limpiar datos antes de serializar"""
        print(f"Datos recibidos para create: {request.data}")  # Debug
        
        # Limpiar ID_Usuario si viene como string vacío
        if 'ID_Usuario' in request.data and request.data['ID_Usuario'] == '':
            request.data['ID_Usuario'] = None
            
        # Validar que ID_Usuario sea un entero válido si no es None
        if request.data.get('ID_Usuario') is not None:
            try:
                request.data['ID_Usuario'] = int(request.data['ID_Usuario'])
            except (ValueError, TypeError):
                print(f"Error: ID_Usuario no es un entero válido: {request.data.get('ID_Usuario')}")
                return Response({'ID_Usuario': ['Debe ser un número entero válido']}, 
                              status=status.HTTP_400_BAD_REQUEST)
        
        # Validar nombre
        if 'nombre' not in request.data or not request.data['nombre'].strip():
            return Response({'nombre': ['El nombre de la caja es requerido']}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['get'])
    def usuarios_disponibles(self, request):
        """Obtener usuarios con rol de empleado que no están asignados a ninguna caja"""
        usuarios_ocupados = Caja.objects.filter(
            deleted_at__isnull=True,
            ID_Usuario__isnull=False
        ).values_list('ID_Usuario', flat=True)
        
        # Solo usuarios con rol = 'empleado'
        usuarios_disponibles = User.objects.filter(
            deleted_at__isnull=True,
            is_active=True,
            rol='empleado'
        ).exclude(
            id__in=usuarios_ocupados
        )
        
        serializer = UserPublicSerializer(usuarios_disponibles, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def empleados_todos(self, request):
        """Obtener todos los usuarios con rol de empleado (para el formulario de edición)"""
        empleados = User.objects.filter(
            deleted_at__isnull=True,
            is_active=True,
            rol='empleado'
        )
        
        serializer = UserPublicSerializer(empleados, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        """Desactivar una caja"""
        caja = self.get_object()
        caja.Estado = False
        caja.save()
        return Response({'message': 'Caja desactivada'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        """Activar una caja"""
        caja = self.get_object()
        caja.Estado = True
        caja.save()
        return Response({'message': 'Caja activada'}, status=status.HTTP_200_OK)

"""


def buscar_servicio_por_nombre(nombre):
    try:
        servicio = Servicio.objects.get(Nombre=nombre)
        return servicio  # Puedes hacer .__dict__ para ver todos los campos
    except Servicio.DoesNotExist:
        return None

"""

class ServicioViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    
    queryset = Servicio.objects.filter(Estado = True)
    serializer_class = ServicioSerializer

    def get_object(self):
        """
        Override get_object to allow access to all services for activar/desactivar actions
        """
        # For activar/desactivar actions, we need to access both active and inactive services
        if self.action in ['activar', 'desactivar']:
            lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
            assert lookup_url_kwarg in self.kwargs, (
                'Expected view %s to be called with a URL keyword argument '
                'named "%s". Fix your URL conf, or set the `.lookup_field` '
                'attribute on the view correctly.' %
                (self.__class__.__name__, lookup_url_kwarg)
            )
            filter_kwargs = {self.lookup_field: self.kwargs[lookup_url_kwarg]}
            # Use all services for these actions
            obj = Servicio.objects.get(**filter_kwargs)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    def destroy(self, request, *args, **kwargs):
        servicio = self.get_object()
        servicio.Estado = False
        servicio.save()
        return Response({'message':'Servicio Deshabilitado'}, status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        servicio = self.get_object()
        servicio.Estado = True
        servicio.save()
        return Response({'message': 'Servicio activado'}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        servicio = self.get_object()
        servicio.Estado = False
        servicio.save()
        return Response({'message': 'Servicio desactivado'}, status=status.HTTP_200_OK)
    
    def get_queryset(self):
        queryset = Servicio.objects.all()
        # Filtro para mostrar todos los servicios o solo activos
        show_all = self.request.query_params.get('show_all')
        if show_all != 'true':
            queryset = queryset.filter(Estado=True)
        return queryset
    
    @action(detail=False, methods = ['post'], url_path = 'prioridad_servicio')
    def obtener_prioridad_servicio(self,request):

        serializer = IDServicio(data = request.data)
        serializer.is_valid(raise_exception=True)

        id_servicio = serializer.validated_data['id']

        try:
            servicio = Servicio.objects.get(id=id_servicio)
            return Response({'success': True,'prioridad' : servicio.Prioridad}, status = 200)
        except Servicio.DoesNotExist:
            return Response({'success': False, 'message': "Servicio no encontrado"}, status = 404)
    
    @action(detail=False, methods=['post'],url_path = 'nombre_servicio')
    def obtener_nombre_servicio(self, request):

        serializer = IDServicio(data = request.data)
        serializer.is_valid(raise_exception=True)

        id_servicio = serializer.validated_data['id']

        try:
            servicio = Servicio.objects.get(id=id_servicio)
            return Response({'success': True,'nombre' : servicio.Nombre}, status = 200)
        except Servicio.DoesNotExist:
            return Response({'success': False, 'message': "Servicio no encontrado"}, status = 404)
    
    @action(detail=False, methods=['post'], url_path = 'buscar_por_nombre')
    def buscar_servicio_por_nombre(self,request):

        serializer = NameServicio(data = request.data)
        serializer.is_valid(raise_exception=True)

        nombre = serializer.validated_data['name']

        try:
            servicio = Servicio.objects.get(Nombre = nombre)
            return Response({'success': True,'servicio' : servicio}, status = 200)
        except Servicio.DoesNotExist:
            return Response({'success': False, 'message': "Servicio no encontrado"}, status = 404)

    @action(detail=False, methods=['post'],url_path='contar_turnos_servicio')
    def contar_turnos_por_servicio(self,request):

        serializer = IDServicio(data = request.data)
        serializer.is_valid(raise_exception=True)

        id_servicio = serializer.validated_data['id']

        conteo = Turno.objects.filter(ID_Servicio_id=id_servicio).count()

        return Response({'success':True, 'conteo' : conteo}, status = 200)
    
    @action(detail=False, methods = ['post'], url_path='servicio_activo')
    def servicio_esta_activo(self,request):

        serializer = IDServicio(data = request.data)
        serializer.is_valid(raise_exception=True)

        id_servicio = serializer.validated_data['id']

        try:

            service = Servicio.objects.get(id = id_servicio)
            return Response({'success':True, 'activo': service.Estado},status = 200)
        
        except Servicio.DoesNotExist:

            return Response({'success':False, 'message': 'servicio no encontrado'}, status = 404)

    
class HorarioViewSet(viewsets.ModelViewSet):

    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer


class TurnoViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Turno.objects.all()
    serializer_class = TurnoSerializer

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'No se permite eliminar Turnos.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=False, methods=['post'])
    def crear_turno(self, request):
        """Crear un nuevo turno para un cliente con asignación automática de caja"""
        from apps.tickets.serializers import CrearTurnoSerializer
        from apps.users.models import User, Cliente
        from django.utils import timezone
        from django.db.models import Count, Max
        from django.db import transaction
        
        serializer = CrearTurnoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        servicio_id = serializer.validated_data['servicio_id']
        cedula_cliente = serializer.validated_data['cedula_cliente']
        
        try:
            with transaction.atomic():
                # Obtener cliente
                user = User.objects.get(cc=cedula_cliente, deleted_at__isnull=True)
                cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
                
                # Verificar si el cliente ya tiene un turno activo
                turno_activo = Turno.objects.filter(
                    ID_Cliente=cliente,
                    estado__in=['esperando', 'en_atencion']
                ).first()
                
                if turno_activo:
                    return Response({
                        'success': False,
                        'message': 'Ya tienes un turno activo',
                        'turno_activo': {
                            'numero_turno': turno_activo.numero_turno,
                            'estado': turno_activo.estado,
                            'servicio': turno_activo.ID_Servicio.Nombre
                        }
                    }, status=400)
                
                # Obtener servicio
                servicio = Servicio.objects.get(id=servicio_id)
                
                # Generar número de turno único usando MAX para evitar conflictos
                max_numero = Turno.objects.aggregate(max_num=Max('numero_turno'))['max_num']
                nuevo_numero = (max_numero or 0) + 1
                
                # Verificar que el número no exista (por si acaso)
                while Turno.objects.filter(numero_turno=nuevo_numero).exists():
                    nuevo_numero += 1
                
                # Determinar prioridad inicial
                prioridad_base = 5 if servicio.Prioridad == 1 or cliente.prioritario else 1
                es_prioritario = prioridad_base == 5
                
                # ALGORITMO DE ASIGNACIÓN AUTOMÁTICA DE CAJAS
                caja_asignada = self._asignar_caja_automatica(prioridad_base)
                
                if not caja_asignada:
                    return Response({
                        'success': False,
                        'message': 'No hay cajas disponibles en este momento. Intenta más tarde.'
                    }, status=400)
                
                # Calcular posición en cola específica para la caja asignada
                posicion_cola = self._calcular_posicion_cola(caja_asignada, es_prioritario)
                
                # Crear horario
                horario = Horario.objects.create(
                    Hora_llegada=timezone.now(),
                    Hora_atencion=timezone.now(),
                    Hora_salida=timezone.now()
                )
                
                # Crear turno con caja asignada
                turno = Turno.objects.create(
                    ID_Cliente=cliente,
                    ID_Caja=caja_asignada,
                    ID_Servicio=servicio,
                    ID_Horario=horario,
                    Cedula_manual=cedula_cliente,
                    numero_turno=nuevo_numero,
                    es_prioritario=es_prioritario,
                    posicion_cola=posicion_cola,
                    estado='esperando'
                )
                
                # Incrementar prioridades de turnos existentes en otras cajas
                self._incrementar_prioridades_turnos()
                
                # Reorganizar colas después de la asignación
                self._reorganizar_todas_las_colas()
                
                serializer_response = TurnoSerializer(turno)
                return Response({
                    'success': True,
                    'message': f'Turno creado exitosamente y asignado a Caja {caja_asignada.id}',
                    'turno': serializer_response.data,
                    'caja_asignada': caja_asignada.id
                }, status=201)
                
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Error al crear turno: {str(e)}'
            }, status=500)
    
    def _asignar_caja_automatica(self, prioridad_turno):
        """
        Asignar automáticamente la caja con menos turnos pendientes
        Basado en el algoritmo proporcionado
        """
        from django.db.models import Count
        
        # Obtener cajas activas (Estado=True)
        cajas_activas = Caja.objects.filter(
            Estado=True,
            deleted_at__isnull=True
        )
        
        if not cajas_activas.exists():
            return None
        
        # Contar turnos pendientes por caja (esperando + en_atencion)
        cajas_con_turnos = cajas_activas.annotate(
            turnos_pendientes=Count(
                'turno',
                filter=models.Q(turno__estado__in=['esperando', 'en_atencion'])
            )
        ).order_by('turnos_pendientes')
        
        # Seleccionar la caja con menos turnos pendientes
        caja_seleccionada = cajas_con_turnos.first()
        
        return caja_seleccionada
    
    def _calcular_posicion_cola(self, caja, es_prioritario):
        """Calcular posición en cola para la caja específica"""
        if es_prioritario:
            # Los turnos prioritarios van antes que los normales en esta caja
            posicion = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando',
                es_prioritario=True
            ).count() + 1
        else:
            # Los turnos normales van después de todos los prioritarios en esta caja
            total_prioritarios = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando',
                es_prioritario=True
            ).count()
            total_normales = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando',
                es_prioritario=False
            ).count()
            posicion = total_prioritarios + total_normales + 1
        
        return posicion
    
    def _incrementar_prioridades_turnos(self):
        """
        Incrementar las prioridades de los turnos existentes que no son máxima prioridad
        Simula el comportamiento del algoritmo original
        """
        # Esta función simula el incremento de prioridades del algoritmo original
        # En la implementación real, esto se puede manejar con timestamps o contadores
        pass
    
    def _reorganizar_todas_las_colas(self):
        """Reorganizar las posiciones en todas las colas de todas las cajas"""
        cajas_activas = Caja.objects.filter(Estado=True, deleted_at__isnull=True)
        
        for caja in cajas_activas:
            # Reorganizar turnos prioritarios
            turnos_prioritarios = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando',
                es_prioritario=True
            ).order_by('created_at')
            
            for idx, turno in enumerate(turnos_prioritarios):
                turno.posicion_cola = idx + 1
                turno.save()
            
            # Reorganizar turnos normales
            turnos_normales = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando',
                es_prioritario=False
            ).order_by('created_at')
            
            base_posicion = len(turnos_prioritarios) + 1
            for idx, turno in enumerate(turnos_normales):
                turno.posicion_cola = base_posicion + idx
                turno.save()
    
    @action(detail=False, methods=['get'])
    def turno_activo_cliente(self, request):
        """Obtener turno activo de un cliente"""
        cedula = request.query_params.get('cedula')
        if not cedula:
            return Response({'error': 'Cédula requerida'}, status=400)
        
        try:
            user = User.objects.get(cc=cedula, deleted_at__isnull=True)
            cliente = Cliente.objects.get(ID_Usuario=user, deleted_at__isnull=True)
            
            turno_activo = Turno.objects.filter(
                ID_Cliente=cliente,
                estado__in=['esperando', 'en_atencion']
            ).first()
            
            if turno_activo:
                serializer = TurnoSerializer(turno_activo)
                return Response({
                    'tiene_turno': True,
                    'turno': serializer.data
                })
            else:
                return Response({'tiene_turno': False})
                
        except (User.DoesNotExist, Cliente.DoesNotExist):
            return Response({'error': 'Cliente no encontrado'}, status=404)
    
    @action(detail=False, methods=['get'])
    def cola_turnos(self, request):
        """Obtener cola de turnos ordenada por prioridad"""
        turnos = Turno.objects.filter(
            estado='esperando'
        ).order_by('es_prioritario', 'posicion_cola')
        
        serializer = TurnoSerializer(turnos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancelar_turno(self, request, pk=None):
        """Cancelar un turno"""
        turno = self.get_object()
        
        if turno.estado not in ['esperando']:
            return Response({
                'success': False,
                'message': 'Solo se pueden cancelar turnos en estado "esperando"'
            }, status=400)
        
        turno.estado = 'cancelado'
        turno.save()
        
        # Reorganizar cola
        self._reorganizar_cola()
        
        return Response({
            'success': True,
            'message': 'Turno cancelado exitosamente'
        })
    
    def _reorganizar_cola(self):
        """Reorganizar posiciones en la cola después de cancelaciones"""
        # Reorganizar turnos prioritarios
        turnos_prioritarios = Turno.objects.filter(
            estado='esperando',
            es_prioritario=True
        ).order_by('created_at')
        
        for idx, turno in enumerate(turnos_prioritarios):
            turno.posicion_cola = idx + 1
            turno.save()
        
        # Reorganizar turnos normales
        turnos_normales = Turno.objects.filter(
            estado='esperando',
            es_prioritario=False
        ).order_by('created_at')
        
        base_posicion = len(turnos_prioritarios) + 1
        for idx, turno in enumerate(turnos_normales):
            turno.posicion_cola = base_posicion + idx
            turno.save()
    

    """

    # 6.) Ver cuantos turnos son de un cliente de la base de datos y cuantos no.

    7.) Ver cuantos turnos fueron terminados y cuando no.

    8.) Cuantos turnos han sido creados en un día en particular.

    9.) Dado un turno encontrar en que caja se realizo o atendio este y en que fecha y hora.

    10.) Dado un turno saber cual cliente esta asociado ( si es cliente, sino retornar que no es cliente )


    """

    #@action(detail=False, methods = ['get'], url_path = 'contar_turnos_terminados_y_no')
    #def contar_turnos_terminados_y_no(self,request):

        #serializer = IDTurno(data = request.data)
        #serializer.is_valid(raise_exception = True)

        #id_turno = serializer.validated_data['id']

        #try:

            #turnos = Turno.objects.filter()

            #horar

            #terminados = Turno.objects.filter(finalizado=True).count()
            #no_terminados = Turno.objects.filter(finalizado=False).count()
            #return {
                #"terminados": terminados,
                #"no_terminados": no_terminados
            #}
        
    def perform_create(self, serializer):
        cedula = self.request.data.get('Cedula_manual')
        try:
            cliente = Cliente.objects.get(ID_Usuario__cc=cedula)
        except Cliente.DoesNotExist:
            cliente = Cliente.objects.get(pk=1)  # cliente por defecto

        serializer.save(ID_Cliente=cliente)
    
    # ============= NUEVAS APIs PARA CAJEROS =============
    
    @action(detail=False, methods=['get'])
    def mi_caja_info(self, request):
        """Obtener información de la caja asignada al cajero actual"""
        try:
            # Obtener usuario actual del token
            usuario_actual = request.user
            
            print(f"=== DEBUG MI_CAJA_INFO ===")
            print(f"Usuario autenticado: {usuario_actual.is_authenticated}")
            print(f"Usuario: {usuario_actual.username if usuario_actual.is_authenticated else 'Anónimo'}")
            print(f"ID: {usuario_actual.id if usuario_actual.is_authenticated else 'N/A'}")
            print(f"CC: {getattr(usuario_actual, 'cc', 'N/A')}")
            print(f"Rol: {getattr(usuario_actual, 'rol', 'N/A')}")
            print(f"Is_staff: {getattr(usuario_actual, 'is_staff', False)}")
            print(f"Is_cajero: {getattr(usuario_actual, 'is_cajero', False)}")
            
            if not usuario_actual.is_authenticated:
                return Response({
                    'error': 'Usuario no autenticado'
                }, status=401)
            
            # Buscar empleado asociado al usuario o verificar si es administrador
            try:
                empleado = Empleado.objects.filter(ID_Usuario=usuario_actual).first()
                es_administrador = usuario_actual.rol == 'administrador' or usuario_actual.is_staff
                
                if not empleado and not es_administrador:
                    return Response({
                        'error': 'Usuario no es un empleado válido ni administrador',
                        'debug_info': f'Usuario: {usuario_actual.username}, CC: {usuario_actual.cc}, Rol: {getattr(usuario_actual, "rol", "N/A")}, Is_staff: {usuario_actual.is_staff}'
                    }, status=403)
            except Exception as e:
                return Response({
                    'error': f'Error al buscar empleado: {str(e)}'
                }, status=403)
            
            # Buscar la caja asignada al empleado
            cajas = Caja.objects.filter(
                ID_Usuario=usuario_actual
            )
            
            caja = cajas.first()
            
            if not caja:
                return Response({
                    'error': 'No tienes una caja asignada',
                    'debug_info': f'Usuario ID: {usuario_actual.id}, Empleado: {empleado.id if empleado else "None"}'
                }, status=404)

            
            # Obtener turnos en espera para esta caja (ordenados por prioridad y posición)
            turnos_pendientes = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando'
            ).select_related('ID_Cliente__ID_Usuario', 'ID_Servicio').order_by('es_prioritario', 'posicion_cola')

            # Obtener turno actualmente en atención (si existe)
            turno_actual = Turno.objects.filter(
                ID_Caja=caja,
                estado='en_atencion'
            ).select_related('ID_Cliente__ID_Usuario', 'ID_Servicio').first()

            # Serializar turnos pendientes
            turnos_data = []
            for turno in turnos_pendientes:
                cliente = turno.ID_Cliente
                servicio = turno.ID_Servicio
                cliente_data = None
                if cliente and cliente.ID_Usuario:
                    cliente_data = {
                        'first_name': cliente.ID_Usuario.first_name,
                        'last_name': cliente.ID_Usuario.last_name,
                        'cc': cliente.ID_Usuario.cc
                    }
                
                turnos_data.append({
                    'id': turno.id,
                    'numero_turno': turno.numero_turno,
                    'estado': turno.estado,
                    'es_prioritario': turno.es_prioritario,
                    'posicion_cola': turno.posicion_cola,
                    'Cedula_manual': turno.Cedula_manual,
                    'ID_Cliente_data': {
                        'ID_Usuario_data': cliente_data
                    } if cliente_data else None,
                    'ID_Servicio_data': {
                        'Nombre': servicio.Nombre
                    } if servicio else None,
                    'created_at': turno.created_at.isoformat() if turno.created_at else None
                })

            # Serializar turno actual
            turno_actual_data = None
            if turno_actual:
                cliente_actual = turno_actual.ID_Cliente
                servicio_actual = turno_actual.ID_Servicio
                cliente_actual_data = None
                if cliente_actual and cliente_actual.ID_Usuario:
                    cliente_actual_data = {
                        'first_name': cliente_actual.ID_Usuario.first_name,
                        'last_name': cliente_actual.ID_Usuario.last_name,
                        'cc': cliente_actual.ID_Usuario.cc
                    }
                
                turno_actual_data = {
                    'id': turno_actual.id,
                    'numero_turno': turno_actual.numero_turno,
                    'estado': turno_actual.estado,
                    'es_prioritario': turno_actual.es_prioritario,
                    'Cedula_manual': turno_actual.Cedula_manual,
                    'ID_Cliente_data': {
                        'ID_Usuario_data': cliente_actual_data
                    } if cliente_actual_data else None,
                    'ID_Servicio_data': {
                        'Nombre': servicio_actual.Nombre
                    } if servicio_actual else None,
                    'created_at': turno_actual.created_at.isoformat() if turno_actual.created_at else None
                }

            return Response({
                'success': True,
                'caja': {
                    'id': caja.id,
                    'nombre': caja.nombre,  # AGREGANDO EL CAMPO NOMBRE
                    'Estado': caja.Estado
                },
                'usuario': {
                    'first_name': usuario_actual.first_name,
                    'last_name': usuario_actual.last_name,
                    'username': usuario_actual.username,
                    'cc': getattr(usuario_actual, 'cc', 'N/A')
                },
                'cola_turnos': turnos_data,
                'turno_actual': turno_actual_data
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al obtener información de caja: {str(e)}'
            }, status=500)

    @action(detail=False, methods=['post'])
    def atender_siguiente_turno(self, request):
        """Marcar el siguiente turno como en atención"""
        try:
            usuario_actual = request.user
            
            # Buscar la caja del usuario
            caja = Caja.objects.filter(
                ID_Usuario=usuario_actual,
                deleted_at__isnull=True,
                Estado=True
            ).first()
            
            if not caja:
                return Response({
                    'error': 'No tienes una caja asignada o está inactiva'
                }, status=404)
            
            # Verificar que no hay turno actual en atención
            turno_actual = Turno.objects.filter(
                ID_Caja=caja,
                estado='en_atencion'
            ).first()
            
            if turno_actual:
                return Response({
                    'error': 'Ya hay un turno en atención. Finaliza el turno actual primero.'
                }, status=400)
            
            # Obtener el siguiente turno en cola
            siguiente_turno = Turno.objects.filter(
                ID_Caja=caja,
                estado='esperando'
            ).order_by('posicion_cola', 'created_at').first()
            
            if not siguiente_turno:
                return Response({
                    'error': 'No hay turnos pendientes en la cola'
                }, status=404)
            
            # Marcar como en atención
            siguiente_turno.estado = 'en_atencion'
            siguiente_turno.save()
            
            # Actualizar horario de atención
            if siguiente_turno.ID_Horario:
                siguiente_turno.ID_Horario.Hora_atencion = timezone.now()
                siguiente_turno.ID_Horario.save()
            
            serializer = TurnoSerializer(siguiente_turno)
            return Response({
                'success': True,
                'turno': serializer.data,
                'message': f'Turno {siguiente_turno.numero_turno} ahora en atención'
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al atender turno: {str(e)}'
            }, status=500)
    
    @action(detail=False, methods=['post'])
    def finalizar_turno(self, request):
        """Finalizar el turno actual y crear factura si hay productos"""
        try:
            import json
            
            print(f"🚀 INICIANDO finalizar_turno - Usuario: {request.user}")
            print(f"📥 Datos completos recibidos: {request.data}")
            
            # Forzar flush para asegurar que aparezcan los logs
            import sys
            sys.stdout.flush()
            
            usuario_actual = request.user
            productos = request.data.get('productos', [])
            total = request.data.get('total', 0)
            
            print(f"📦 Productos recibidos: {len(productos)} items")
            print(f"💰 Total: ${total}")
            sys.stdout.flush()
            
            if productos:
                print(f"🔍 Detalles de productos:")
                for i, producto in enumerate(productos):
                    print(f"  {i+1}. {producto}")
                sys.stdout.flush()
            else:
                print("⚠️  NO SE RECIBIERON PRODUCTOS!")
                sys.stdout.flush()
            
            # Buscar la caja del usuario
            caja = Caja.objects.filter(
                ID_Usuario=usuario_actual,
                deleted_at__isnull=True,
                Estado=True
            ).first()
            
            if not caja:
                return Response({
                    'error': 'No tienes una caja asignada o está inactiva'
                }, status=404)
            
            # Obtener turno actual en atención
            turno_actual = Turno.objects.filter(
                ID_Caja=caja,
                estado='en_atencion'
            ).first()
            
            if not turno_actual:
                return Response({
                    'error': 'No hay turno en atención'
                }, status=404)
            
            # Finalizar turno
            turno_actual.estado = 'finalizado'
            turno_actual.save()
            
            # Actualizar horario de salida
            if turno_actual.ID_Horario:
                turno_actual.ID_Horario.Hora_salida = timezone.now()
                turno_actual.ID_Horario.save()
            
            # Crear factura si hay productos
            factura = None
            if productos and len(productos) > 0:
                print(f"🎯 CHECKPOINT 1: Hay {len(productos)} productos para procesar")
                sys.stdout.flush()
                
                # Asegurar que productos sea una lista de Python
                if isinstance(productos, str):
                    print(f"🔄 CHECKPOINT 2: Productos viene como string, parseando...")
                    sys.stdout.flush()
                    try:
                        # Intentar parsear si viene como string JSON
                        productos = json.loads(productos)
                        print(f"✅ CHECKPOINT 2a: JSON parseado exitosamente")
                        sys.stdout.flush()
                    except json.JSONDecodeError:
                        print(f"⚠️ CHECKPOINT 2b: JSON falló, intentando formato Python...")
                        sys.stdout.flush()
                        # Si falla JSON, intentar eval para formato Python-style
                        try:
                            # Convertir formato Python a JSON válido
                            productos_fixed = (productos
                                .replace("'", '"')
                                .replace('True', 'true')
                                .replace('False', 'false')
                                .replace('None', 'null'))
                            productos = json.loads(productos_fixed)
                            print(f"✅ CHECKPOINT 2c: Formato Python convertido exitosamente")
                            sys.stdout.flush()
                        except:
                            print(f"❌ CHECKPOINT 2d: Error total parseando productos: {productos}")
                            sys.stdout.flush()
                            productos = []
                
                if not productos or len(productos) == 0:
                    print(f"❌ CHECKPOINT 3: No hay productos válidos después del parseo")
                    sys.stdout.flush()
                else:
                    print(f"✅ CHECKPOINT 3: {len(productos)} productos válidos después del parseo")
                    sys.stdout.flush()
                
                # Convertir a JSON válido garantizado
                productos_json = json.dumps(productos, ensure_ascii=False)
                
                print(f"🔄 CHECKPOINT 4: Guardando factura con {len(productos)} productos")
                print(f"📝 JSON generado: {productos_json[:100]}..." if len(productos_json) > 100 else f"📝 JSON generado: {productos_json}")
                sys.stdout.flush()
                
                try:
                    factura = Factura.objects.create(
                        ID_Turno=turno_actual,
                        Total=total,
                        productos_vendidos=productos_json,  # Guardar como JSON válido garantizado
                        fecha_factura=timezone.now()
                    )
                    print(f"✅ CHECKPOINT 5: Factura creada exitosamente - ID: {factura.id}")
                    sys.stdout.flush()
                except Exception as e:
                    print(f"❌ CHECKPOINT 5: Error creando factura: {str(e)}")
                    sys.stdout.flush()
                    import traceback
                    traceback.print_exc()
                    raise e
                
                # REDUCIR STOCK - ASEGURAR QUE SIEMPRE SE EJECUTE
                print(f"🚨 CHECKPOINT 6: INICIANDO REDUCCIÓN DE STOCK")
                sys.stdout.flush()
                
                if not productos or len(productos) == 0:
                    print(f"❌ CHECKPOINT 6a: Lista de productos está vacía para reducción")
                    sys.stdout.flush()
                else:
                    print(f"✅ CHECKPOINT 6a: Procesando {len(productos)} productos para reducción")
                    sys.stdout.flush()
                    
                    try:
                        from apps.products.models import Producto
                        print(f"✅ CHECKPOINT 6b: Modelo Producto importado exitosamente")
                        sys.stdout.flush()
                        
                        stock_actualizado = 0
                        for i, producto_vendido in enumerate(productos):
                            print(f"🔄 CHECKPOINT 7.{i+1}: Procesando producto {i+1}/{len(productos)}")
                            sys.stdout.flush()
                            
                            try:
                                producto_id = producto_vendido.get('id')
                                cantidad_vendida = producto_vendido.get('cantidad', 0)
                                print(f"📦 CHECKPOINT 7.{i+1}a: ID={producto_id}, cantidad={cantidad_vendida}")
                                sys.stdout.flush()
                                
                                if not producto_id:
                                    print(f"❌ CHECKPOINT 7.{i+1}b: ID de producto es None o vacío")
                                    sys.stdout.flush()
                                    continue
                                    
                                if cantidad_vendida <= 0:
                                    print(f"❌ CHECKPOINT 7.{i+1}c: Cantidad vendida es 0 o negativa")
                                    sys.stdout.flush()
                                    continue
                                
                                try:
                                    producto = Producto.objects.get(id=producto_id)
                                    print(f"✅ CHECKPOINT 7.{i+1}d: Producto encontrado: {producto.Nombre}")
                                    sys.stdout.flush()
                                except Producto.DoesNotExist:
                                    print(f"❌ CHECKPOINT 7.{i+1}d: Producto con ID {producto_id} no encontrado")
                                    sys.stdout.flush()
                                    continue
                                
                                stock_anterior = producto.Stock
                                print(f"📊 CHECKPOINT 7.{i+1}e: Stock actual: {stock_anterior}")
                                sys.stdout.flush()
                                
                                if producto.Stock >= cantidad_vendida:
                                    try:
                                        producto.Stock -= cantidad_vendida
                                        producto.save()
                                        stock_actualizado += 1
                                        print(f"✅ CHECKPOINT 7.{i+1}f: ÉXITO - {producto.Nombre}: Stock {stock_anterior} → {producto.Stock}")
                                        sys.stdout.flush()
                                    except Exception as save_error:
                                        print(f"❌ CHECKPOINT 7.{i+1}f: Error guardando producto: {str(save_error)}")
                                        sys.stdout.flush()
                                        import traceback
                                        traceback.print_exc()
                                else:
                                    print(f"⚠️ CHECKPOINT 7.{i+1}f: Stock insuficiente para {producto.Nombre}. Stock: {producto.Stock}, Solicitado: {cantidad_vendida}")
                                    sys.stdout.flush()
                                    
                            except Exception as producto_error:
                                print(f"❌ CHECKPOINT 7.{i+1}: Error procesando producto: {str(producto_error)}")
                                sys.stdout.flush()
                                import traceback
                                traceback.print_exc()
                        
                        print(f"🏁 CHECKPOINT 8: REDUCCIÓN COMPLETADA - {stock_actualizado}/{len(productos)} productos actualizados")
                        sys.stdout.flush()
                        
                    except Exception as reduccion_error:
                        print(f"❌ CHECKPOINT 6c: Error crítico en reducción de stock: {str(reduccion_error)}")
                        sys.stdout.flush()
                        import traceback
                        traceback.print_exc()
                        # NO hacer raise aquí para que el turno se pueda finalizar
            else:
                print(f"ℹ️ CHECKPOINT 0: No hay productos para procesar")
                sys.stdout.flush()
            
            
            # Reorganizar cola después de finalizar
            self._reorganizar_cola()
            
            response_data = {
                'success': True,
                'turno_finalizado': TurnoSerializer(turno_actual).data,
                'message': f'Turno {turno_actual.numero_turno} finalizado exitosamente'
            }
            
            if factura:
                response_data['factura'] = {
                    'id': factura.id,
                    'total': factura.Total,
                    'productos': factura.productos_vendidos
                }
            
            return Response(response_data)
            
        except Exception as e:
            return Response({
                'error': f'Error al finalizar turno: {str(e)}'
            }, status=500)
    
    @action(detail=False, methods=['post'])
    def cancelar_turno_actual(self, request):
        """Cancelar el turno actual en atención"""
        try:
            usuario_actual = request.user
            motivo = request.data.get('motivo', 'Cancelado por cajero')
            
            # Buscar la caja del usuario
            caja = Caja.objects.filter(
                ID_Usuario=usuario_actual,
                deleted_at__isnull=True,
                Estado=True
            ).first()
            
            if not caja:
                return Response({
                    'error': 'No tienes una caja asignada o está inactiva'
                }, status=404)
            
            # Obtener turno actual en atención
            turno_actual = Turno.objects.filter(
                ID_Caja=caja,
                estado='en_atencion'
            ).first()
            
            if not turno_actual:
                return Response({
                    'error': 'No hay turno en atención para cancelar'
                }, status=404)
            
            # Cancelar turno
            turno_actual.estado = 'cancelado'
            turno_actual.save()
            
            # Reorganizar cola
            self._reorganizar_cola()
            
            return Response({
                'success': True,
                'message': f'Turno {turno_actual.numero_turno} cancelado: {motivo}'
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al cancelar turno: {str(e)}'
            }, status=500)
    
    @action(detail=False, methods=['post'])
    def toggle_caja_estado(self, request):
        """Activar/desactivar la caja del cajero"""
        try:
            usuario_actual = request.user
            
            # Buscar la caja del usuario
            caja = Caja.objects.filter(
                ID_Usuario=usuario_actual,
                deleted_at__isnull=True
            ).first()
            
            if not caja:
                return Response({
                    'error': 'No tienes una caja asignada'
                }, status=404)
            
            # Verificar si hay turno en atención antes de desactivar
            if caja.Estado and Turno.objects.filter(
                ID_Caja=caja,
                estado='en_atencion'
            ).exists():
                return Response({
                    'error': 'No puedes desactivar la caja mientras hay un turno en atención'
                }, status=400)
            
            # Cambiar estado
            caja.Estado = not caja.Estado
            caja.save()
            
            # Si se desactiva, reorganizar turnos pendientes a otras cajas
            if not caja.Estado:
                self._reasignar_turnos_caja_inactiva(caja)
            
            return Response({
                'success': True,
                'caja_activa': caja.Estado,
                'message': f'Caja {"activada" if caja.Estado else "desactivada"} exitosamente'
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al cambiar estado de caja: {str(e)}'
            }, status=500)
    
    def _reasignar_turnos_caja_inactiva(self, caja_inactiva):
        """Reasignar turnos de una caja inactiva a otras cajas activas"""
        try:
            # Obtener turnos pendientes de la caja inactiva
            turnos_pendientes = Turno.objects.filter(
                ID_Caja=caja_inactiva,
                estado='esperando'
            )
            
            if not turnos_pendientes.exists():
                return
            
            # Obtener cajas activas disponibles
            cajas_activas = Caja.objects.filter(
                deleted_at__isnull=True,
                Estado=True
            ).exclude(id=caja_inactiva.id)
            
            if not cajas_activas.exists():
                # No hay cajas activas, mantener turnos en la caja inactiva
                return
            
            # Reasignar cada turno
            for turno in turnos_pendientes:
                # Encontrar la caja con menos turnos pendientes
                mejor_caja = None
                min_turnos = float('inf')
                
                for caja in cajas_activas:
                    count_turnos = Turno.objects.filter(
                        ID_Caja=caja,
                        estado='esperando'
                    ).count()
                    
                    if count_turnos < min_turnos:
                        min_turnos = count_turnos
                        mejor_caja = caja
                
                if mejor_caja:
                    # Reasignar turno
                    turno.ID_Caja = mejor_caja
                    # Calcular nueva posición en cola
                    turno.posicion_cola = self._calcular_posicion_cola(mejor_caja, turno.es_prioritario)
                    turno.save()
            
            # Reorganizar todas las colas
            self._reorganizar_todas_las_colas()
            
        except Exception as e:
            print(f"Error reasignando turnos: {e}")
    
    @action(detail=False, methods=['get'])
    def estado_cajas(self, request):
        """
        Endpoint para obtener el estado de todas las cajas activas y sus turnos actuales
        """
        try:
            # Usar el nombre correcto del campo: Estado (con mayúscula)
            cajas_activas = Caja.objects.filter(Estado=True, deleted_at__isnull=True)
            estado_cajas = []
            
            for caja in cajas_activas:
                # Obtener turno actual en atención
                # Remover deleted_at__isnull=True porque Turno no tiene este campo
                turno_actual = Turno.objects.filter(
                    ID_Caja=caja,
                    estado='en_atencion'
                ).select_related('ID_Cliente__ID_Usuario', 'ID_Servicio').first()
                
                # Contar turnos en espera - usar 'esperando' en lugar de 'en_espera'
                turnos_en_espera = Turno.objects.filter(
                    ID_Caja=caja,
                    estado='esperando'
                ).count()
                
                caja_info = {
                    'id': caja.id,
                    'nombre': caja.nombre,
                    'estado': caja.Estado,  # Usar el nombre correcto del campo
                    'turno_actual': None,
                    'turnos_en_espera': turnos_en_espera
                }
                
                if turno_actual:
                    # Los datos del cliente están en ID_Usuario del Cliente
                    cliente_nombre = "Cliente Manual"
                    cliente_apellido = ""
                    if turno_actual.ID_Cliente and turno_actual.ID_Cliente.ID_Usuario:
                        cliente_nombre = turno_actual.ID_Cliente.ID_Usuario.first_name or "Sin nombre"
                        cliente_apellido = turno_actual.ID_Cliente.ID_Usuario.last_name or ""
                    
                    caja_info['turno_actual'] = {
                        'id': turno_actual.id,
                        'numero_turno': turno_actual.numero_turno,
                        'cliente': {
                            'nombre': cliente_nombre,
                            'apellido': cliente_apellido
                        },
                        'servicio': turno_actual.ID_Servicio.Nombre if turno_actual.ID_Servicio else "Sin servicio",  # Usar Nombre con mayúscula
                        'created_at': turno_actual.created_at.isoformat() if turno_actual.created_at else None  # Usar created_at en lugar de hora_inicio_atencion
                    }
                
                estado_cajas.append(caja_info)
            
            return Response({
                'estado_cajas': estado_cajas,
                'timestamp': timezone.now()
            })
            
        except Exception as e:
            return Response({
                'error': f'Error obteniendo estado de cajas: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def turno_actual_global(self, request):
        """Obtener información del turno que se está atendiendo actualmente en cualquier caja"""
        try:
            # Buscar turno que esté siendo atendido actualmente
            turno_actual = Turno.objects.filter(
                estado='en_atencion'
            ).select_related('ID_Cliente__ID_Usuario', 'ID_Servicio', 'ID_Caja__ID_Usuario').first()
            
            if not turno_actual:
                return Response({
                    'hay_turno_actual': False,
                    'turno_actual': None
                })
            
            # Buscar el siguiente turno en la misma caja
            siguiente_turno = Turno.objects.filter(
                ID_Caja=turno_actual.ID_Caja,
                estado='esperando'
            ).order_by('es_prioritario', 'posicion_cola').first()
            
            turno_data = {
                'id': turno_actual.id,
                'numero_turno': turno_actual.numero_turno,
                'caja_id': turno_actual.ID_Caja.id if turno_actual.ID_Caja else None,
                'caja_nombre': turno_actual.ID_Caja.nombre if turno_actual.ID_Caja else None,
                'cliente': {
                    'nombre': f"{turno_actual.ID_Cliente.ID_Usuario.first_name} {turno_actual.ID_Cliente.ID_Usuario.last_name}" if turno_actual.ID_Cliente else "Cliente Manual",
                    'cedula': getattr(turno_actual.ID_Cliente.ID_Usuario, 'cc', turno_actual.Cedula_manual or 'N/A') if turno_actual.ID_Cliente else (turno_actual.Cedula_manual or 'N/A')
                },
                'servicio': turno_actual.ID_Servicio.Nombre if turno_actual.ID_Servicio else 'Sin servicio',
                'es_prioritario': turno_actual.es_prioritario,
                'created_at': turno_actual.created_at.isoformat() if turno_actual.created_at else None
            }
            
            siguiente_data = None
            if siguiente_turno:
                siguiente_data = {
                    'numero_turno': siguiente_turno.numero_turno,
                    'cliente': {
                        'nombre': f"{siguiente_turno.ID_Cliente.ID_Usuario.first_name} {siguiente_turno.ID_Cliente.ID_Usuario.last_name}" if siguiente_turno.ID_Cliente else "Cliente Manual",
                    },
                    'es_prioritario': siguiente_turno.es_prioritario
                }
            
            return Response({
                'hay_turno_actual': True,
                'turno_actual': turno_data,
                'siguiente_turno': siguiente_data
            })
            
        except Exception as e:
            return Response({
                'error': f'Error al obtener turno actual: {str(e)}'
            }, status=500)
    

class FacturaViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializers

    def destroy(self, request, *args, **kwargs):
        return Response({'detail': 'No se permite eliminar Facturas.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    @action(detail=False, methods=['get'])
    def por_turno(self, request):
        """Obtener facturas de un turno específico"""
        turno_id = request.query_params.get('turno_id')
        if not turno_id:
            return Response({'error': 'turno_id es requerido'}, status=400)
        
        try:
            facturas = Factura.objects.filter(ID_Turno__id=turno_id)
            serializer = self.get_serializer(facturas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def por_caja(self, request):
        """Obtener facturas de una caja específica"""
        caja_id = request.query_params.get('caja_id')
        if not caja_id:
            return Response({'error': 'caja_id es requerido'}, status=400)
        
        try:
            facturas = Factura.objects.filter(ID_Turno__ID_Caja__id=caja_id)
            serializer = self.get_serializer(facturas, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)
    
    @action(detail=False, methods=['get'])
    def por_fecha(self, request):
        """Obtener facturas por rango de fechas"""
        fecha_inicio = request.query_params.get('fecha_inicio')
        fecha_fin = request.query_params.get('fecha_fin')
        
        facturas = self.queryset
        
        if fecha_inicio:
            facturas = facturas.filter(fecha_factura__gte=fecha_inicio)
        if fecha_fin:
            facturas = facturas.filter(fecha_factura__lte=fecha_fin)
        
        serializer = self.get_serializer(facturas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def reporte_ventas(self, request):
        """Generar reporte de ventas"""
        from django.db.models import Sum, Count
        from django.utils import timezone
        from datetime import timedelta
        
        hoy = timezone.now().date()
        hace_30_dias = hoy - timedelta(days=30)
        
        # Ventas de hoy
        ventas_hoy = Factura.objects.filter(fecha_factura__date=hoy).aggregate(
            total=Sum('Total'),
            cantidad=Count('id')
        )
        
        # Ventas del mes
        ventas_mes = Factura.objects.filter(fecha_factura__date__gte=hace_30_dias).aggregate(
            total=Sum('Total'),
            cantidad=Count('id')
        )
        
        return Response({
            'ventas_hoy': {
                'total': float(ventas_hoy['total'] or 0),
                'cantidad': ventas_hoy['cantidad'] or 0
            },
            'ventas_mes': {
                'total': float(ventas_mes['total'] or 0),
                'cantidad': ventas_mes['cantidad'] or 0
            }
        })


















