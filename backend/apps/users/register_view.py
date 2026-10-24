from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.serializers import ValidationError
from django.db import transaction
from .models import User, Cliente
from .serializers import UserSerializer

@api_view(['POST'])
@permission_classes([])  # Sin permisos requeridos
@authentication_classes([])  # Sin autenticación requerida
def register_user(request):
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
            serializer = UserSerializer(data=data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # No necesitamos crear Cliente manualmente - el serializer lo hace automáticamente
            
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
