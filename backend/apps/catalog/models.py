from django.db import models

class Producto(models.Model):
    Nombre = models.CharField(max_length=100)  
    Presentacion = models.TextField()
    Descripcion = models.TextField()
    Tipo = models.CharField(max_length=50)
    Precio = models.IntegerField()
    Descuento = models.IntegerField(default=0)
    Stock = models.IntegerField()
    Marca = models.CharField(max_length=200)
    Activo = models.BooleanField(default=True)
    requiere_orden_medica = models.BooleanField(default=False)
    Codigo = models.CharField(max_length=50, null=True, blank=True)
    Fecha_vencimiento = models.DateField(null=True, blank=True) 