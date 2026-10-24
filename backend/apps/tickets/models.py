from django.db import models
from apps.products.models import Producto

class Caja(models.Model):
    
    """ Usuario asignado a la caja (puede ser None si no hay cajero asignado) """
    ID_Usuario = models.OneToOneField('users.User', on_delete=models.SET_NULL, null=True, blank=True)
    
    """ Nombre de la caja para identificación (A, B, C o 1, 2, 3, etc.) """
    nombre = models.CharField(max_length=10, unique=True, verbose_name='Nombre de la caja')
    
    """ Estado de la caja: activa o inactiva """
    Estado = models.BooleanField(default=True)
    
    """ Atributos necesarios para llevar registro de actualizaciones y soft delete sobre la base de datos """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        usuario_info = f"{self.ID_Usuario.first_name} {self.ID_Usuario.last_name}" if self.ID_Usuario else "Sin cajero"
        estado_info = "Activa" if self.Estado else "Inactiva"
        return f"Caja {self.nombre} - {usuario_info} - {estado_info}"

    class Meta:
        db_table = 'CAJA'
        verbose_name = 'Caja'
        verbose_name_plural = 'Cajas'
        ordering = ['nombre']

""" 
Para la tabla de Servicio no es posible la eliminación de datos, sino que simplemente es un servicio deshabilitado o habilitado,
esto sucede para no afectar la integridad de los datos en la tabla de turno, puesto que no deben eliminarse nunca los turnos,
por lógica de negocio y seguridad de la información. 
 """
class Servicio(models.Model):
    Nombre = models.CharField(max_length = 100)
    Prioridad = models.IntegerField()
    Descripcion = models.TextField()
    Estado = models.BooleanField() # permite saber si el servicio esta deshabilitado o habilitado

    def __str__(self):
        return self.Nombre + ' - ' + self.Descripcion
class Horario(models.Model):

    """ Tabla para la actualización de las fechas en cuanto al tiempo del turno """
    Hora_llegada = models.DateTimeField()
    Hora_atencion = models.DateTimeField()
    Hora_salida = models.DateTimeField()

class Turno(models.Model):

    """ Atributos de llaves foraneas a las tablas necesarias """
    ID_Cliente = models.ForeignKey('users.Cliente', null = False, on_delete = models.SET_DEFAULT, default = 1) # AJustar para guardar a nombre de cliente default
    ID_Caja = models.ForeignKey(Caja, null = True, blank=True, on_delete = models.SET_NULL) # Puede no tener caja asignada inicialmente
    ID_Servicio = models.ForeignKey(Servicio, null = False, on_delete = models.SET_DEFAULT, default = 1) # Deshabilitar el servicio unicamente
    ID_Horario = models.ForeignKey(Horario, null = True, blank=True, on_delete = models.CASCADE) # Puede no tener horario asignado inicialmente

    Cedula_manual = models.CharField(max_length = 12)
    
    """ Campos para gestión de cola de turnos """
    numero_turno = models.PositiveIntegerField(unique=True, null=True, blank=True)
    estado = models.CharField(max_length=20, choices=[
        ('esperando', 'Esperando'),
        ('en_atencion', 'En Atención'),
        ('finalizado', 'Finalizado'),
        ('cancelado', 'Cancelado')
    ], default='esperando')
    
    es_prioritario = models.BooleanField(default=False)
    posicion_cola = models.PositiveIntegerField(null=True, blank=True)

    """ Atributos necesarios para llevar registro de actualizacions y soft delete sobre la base de datos """
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Turno {self.numero_turno} - {self.ID_Cliente} - {self.estado}"
    
    class Meta:
        db_table = 'TURNO'
        verbose_name = 'Turno'
        verbose_name_plural = 'Turnos'
        ordering = ['posicion_cola', 'created_at']

class Factura(models.Model):
    """Tabla para las facturas de venta"""
    
    ID_Turno = models.ForeignKey(Turno, null=True, blank=True, on_delete=models.CASCADE, related_name='facturas')
    Total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    productos_vendidos = models.TextField(default='[]', blank=True)  # JSON como texto
    fecha_factura = models.DateTimeField(null=True, blank=True)
    
    # Mantener campos existentes para compatibilidad si existen
    Turno = models.ForeignKey(Turno, null=True, blank=True, on_delete=models.SET_NULL, related_name='facturas_old')
    
    class Meta:
        verbose_name = 'Factura'
        verbose_name_plural = 'Facturas'
    
    def __str__(self):
        turno_num = self.ID_Turno.numero_turno if self.ID_Turno else "N/A"
        return f"Factura #{self.id} - Turno {turno_num} - ${self.Total}" 

"""
class UsuarioEspera(models.Model):
    # Esta clase está bien, no requiere cambios
    id = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE) 
    hora_llegada = models.DateTimeField()
    hora_atencion = models.DateTimeField(null=True, blank=True)
    hora_salida = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True,blank=True)

    def __str__(self):
        return f"Usuario en espera: {self.usuario.cc}"

class CajeroUsuarioEspera(models.Model):
    # Modificar esta línea para apuntar a User con restricción
    cajero = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        limit_choices_to={'is_cajero': True}  # Restricción para que solo incluya cajeros
    )
    usuario_espera = models.ForeignKey(UsuarioEspera, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True,blank=True)

    class Meta:
        unique_together = ('cajero', 'usuario_espera') 

    def __str__(self):
        # El cajero ahora es un objeto User, así que podemos acceder a sus campos directamente
        return f"Cajero {self.cajero.cc} - Usuario {self.usuario_espera.usuario.cc}"
"""