from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action, api_view
from django.utils.dateparse import parse_date
from django.db.models import Q, Count, Sum, Avg
from datetime import date, timedelta

# Modelos de productos
from .models import Producto
from .serializers import ProductoSerializer

# --- ViewSet principal para productos ---

class ProductoViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para operaciones CRUD en productos.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def get_queryset(self):
        queryset = Producto.objects.all()
        # Filtro por activo/inactivo
        activo = self.request.query_params.get('activo')
        if activo is not None:
            queryset = queryset.filter(Activo=activo.lower() == 'true')
        return queryset
        
    def perform_destroy(self, instance):
        # Implementa borrado lógico en lugar de eliminar físicamente
        instance.Activo = False
        instance.save()
        
    @action(detail=False, methods=['get'])
    def activos(self, request):
        """
        Retorna solo productos activos.
        """
        productos = self.get_queryset().filter(Activo=True)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['get'])
    def inactivos(self, request):
        """
        Retorna solo productos inactivos.
        """
        productos = self.get_queryset().filter(Activo=False)
        serializer = self.get_serializer(productos, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def activar(self, request, pk=None):
        """
        Activa un producto inactivo.
        """
        producto = self.get_object()
        producto.Activo = True
        producto.save()
        serializer = self.get_serializer(producto)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def desactivar(self, request, pk=None):
        """
        Desactiva un producto activo.
        """
        producto = self.get_object()
        producto.Activo = False
        producto.save()
        serializer = self.get_serializer(producto)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def actualizar_stock(self, request, pk=None):
        """
        Actualiza el stock de un producto específico.
        """
        producto = self.get_object()
        cantidad = request.data.get('cantidad')
        
        try:
            if cantidad is None:
                return Response({"error": "Debe especificar una cantidad"}, 
                              status=status.HTTP_400_BAD_REQUEST)
                
            cantidad = int(cantidad)
            producto.Stock = cantidad
            producto.save()
            return Response(self.get_serializer(producto).data)
        except ValueError:
            return Response({"error": "La cantidad debe ser un número entero"}, 
                          status=status.HTTP_400_BAD_REQUEST)


# --- Vistas API basadas en clases para operaciones básicas ---

class ProductoListCreateAPIView(generics.ListCreateAPIView):
    """
    Lista todos los productos o crea uno nuevo.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer


class ProductoDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recupera, actualiza o elimina un producto.
    """
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def perform_destroy(self, instance):
        # Implementamos borrado lógico
        instance.Activo = False
        instance.save()


# --- Vistas especializadas para búsquedas y filtros básicos ---

class BuscarProductosAPIView(APIView):
    """
    Vista para buscar productos por nombre, descripción o código.
    """
    def get(self, request):
        termino = request.query_params.get('q', None)
        
        if not termino:
            return Response({"detail": "Debe especificar un término de búsqueda."}, 
                           status=status.HTTP_400_BAD_REQUEST)
            
        productos = Producto.objects.filter(
            Q(Nombre__icontains=termino) | 
            Q(Descripcion__icontains=termino) | 
            Q(Codigo__icontains=termino)
        )
        
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)


class ProductosPorTipoAPIView(APIView):
    """
    Lista productos por tipo/categoría.
    """
    def get(self, request):
        tipo = request.query_params.get('tipo', None)
        
        if not tipo:
            return Response({"error": "Debe especificar un tipo de producto"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        productos = Producto.objects.filter(Tipo=tipo)
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)


class ProductosPorPrecioAPIView(APIView):
    """
    Lista productos por rango de precio.
    """
    def get(self, request):
        min_precio = request.query_params.get('min', None)
        max_precio = request.query_params.get('max', None)
        
        if not (min_precio or max_precio):
            return Response({"error": "Debe especificar al menos un valor de precio"}, 
                           status=status.HTTP_400_BAD_REQUEST)
        
        queryset = Producto.objects.all()
        
        if min_precio:
            try:
                min_precio = float(min_precio)
                queryset = queryset.filter(Precio__gte=min_precio)
            except ValueError:
                return Response({"error": "El precio mínimo debe ser un número"}, 
                               status=status.HTTP_400_BAD_REQUEST)
        
        if max_precio:
            try:
                max_precio = float(max_precio)
                queryset = queryset.filter(Precio__lte=max_precio)
            except ValueError:
                return Response({"error": "El precio máximo debe ser un número"}, 
                               status=status.HTTP_400_BAD_REQUEST)
        
        serializer = ProductoSerializer(queryset, many=True)
        return Response(serializer.data)


class ProductosSinStockAPIView(APIView):
    """
    Lista productos sin stock.
    """
    def get(self, request):
        productos = Producto.objects.filter(Stock=0, Activo=True)
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)


class ProductosDisponiblesAPIView(APIView):
    """
    Lista productos disponibles (con stock y activos).
    """
    def get(self, request):
        productos = Producto.objects.filter(Stock__gt=0, Activo=True)
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)