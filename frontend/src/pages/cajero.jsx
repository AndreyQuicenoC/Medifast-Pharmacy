import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  getMiCajaInfo,
  atenderSiguienteTurno,
  finalizarTurno,
  cancelarTurnoActual,
  toggleCajaEstado,
  getProductos,
} from "../api/cajero.api";

export default function Cajero() {
  const navigate = useNavigate();

  // Estados principales
  const [cajaInfo, setCajaInfo] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [usuariosCola, setUsuariosCola] = useState([]);

  // Estados de UI
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [mostrarProductos, setMostrarProductos] = useState(false);
  const [seleccionTipoAtencion, setSeleccionTipoAtencion] = useState(false);
  const [confirmarCancelar, setConfirmarCancelar] = useState(false);

  // Estados de productos y carrito
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [totalCompra, setTotalCompra] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [ordenRecibida, setOrdenRecibida] = useState(false);

  // Datos del cajero (se cargan desde cajaInfo)
  const cajero = cajaInfo
    ? {
        nombre:
          cajaInfo.usuario?.first_name && cajaInfo.usuario?.last_name
            ? `${cajaInfo.usuario.first_name} ${cajaInfo.usuario.last_name}`
            : cajaInfo.usuario?.username || "Usuario",
        cedula: cajaInfo.usuario?.cc || "N/A",
        caja: (() => {
          const cajaData = cajaInfo.caja;
          if (!cajaData) return "N/A";

          // Debug: verificar si el backend envía el campo nombre
          console.log("=== DEBUG NOMBRE CAJA ===");
          console.log("cajaData completo:", cajaData);
          console.log("cajaData.nombre:", cajaData.nombre);

          // Usar el campo nombre directamente del backend
          if (cajaData.nombre) {
            return cajaData.nombre;
          }

          // Si no hay nombre, es un error del backend
          console.error(
            "ERROR: El backend no está enviando el campo 'nombre' de la caja"
          );
          return `Caja ${cajaData.id || "?"}`;
        })(),
      }
    : {
        nombre: "Cargando...",
        cedula: "...",
        caja: "...",
      };

  // Estado de caja basado en cajaInfo
  const cajaActiva = cajaInfo?.caja?.Estado || false;

  // Verificar autenticación
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isCajero = localStorage.getItem("is_cajero") === "true";
    const rol = localStorage.getItem("rol");

    if (!authToken || (!isCajero && rol !== "administrador")) {
      navigate("/");
      return;
    }

    cargarDatosCaja();
    cargarProductos();

    // Actualizar datos cada 10 segundos para mantener la cola actualizada
    const interval = setInterval(cargarDatosCaja, 10000);
    return () => clearInterval(interval);
  }, [navigate]);

  // Filtrar productos según búsqueda y orden médica
  useEffect(() => {
    // Verificar que productos sea un array antes de filtrar
    if (!Array.isArray(productos)) {
      console.error("productos no es un array:", productos);
      setProductosFiltrados([]);
      return;
    }

    let productosDisponibles = productos;

    // Si no hay orden médica, filtrar productos que la requieren
    if (!ordenRecibida) {
      productosDisponibles = productosDisponibles.filter(
        (producto) => !producto.requiere_orden_medica
      );
    }

    // Aplicar filtro de búsqueda
    setProductosFiltrados(
      productosDisponibles.filter(
        (producto) =>
          producto.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          producto.Marca.toLowerCase().includes(busqueda.toLowerCase()) ||
          producto.Tipo.toLowerCase().includes(busqueda.toLowerCase())
      )
    );
  }, [busqueda, ordenRecibida, productos]);

  // Calcular total de la compra
  useEffect(() => {
    const total = carrito.reduce((sum, item) => {
      return sum + (item.Precio - item.Descuento) * item.cantidad;
    }, 0);
    setTotalCompra(total);
  }, [carrito]);

  const cargarDatosCaja = async () => {
    try {
      setLoading(true);
      const data = await getMiCajaInfo();
      setCajaInfo(data);

      // Debug: Mostrar la estructura de datos de la caja
      console.log("Datos de caja recibidos:", data);
      console.log("Información específica de caja:", data.caja);
      console.log("Todos los campos de la caja:", Object.keys(data.caja || {}));
      console.log("ID de la caja:", data.caja?.id);
      console.log("Posibles nombres:", {
        nombre: data.caja?.nombre,
        Nombre: data.caja?.Nombre,
        name: data.caja?.name,
        Name: data.caja?.Name,
        letra: data.caja?.letra,
        Letra: data.caja?.Letra,
        descripcion: data.caja?.descripcion,
        Descripcion: data.caja?.Descripcion,
      });

      // Actualizar cola de usuarios desde el backend
      if (data.cola_turnos) {
        setUsuariosCola(
          data.cola_turnos.map((turno) => ({
            id: turno.id,
            nombre:
              turno.ID_Cliente_data?.ID_Usuario_data?.first_name || "Cliente",
            apellido: turno.ID_Cliente_data?.ID_Usuario_data?.last_name || "",
            turno: turno.numero_turno || `T${turno.id}`,
            servicio: turno.ID_Servicio_data?.Nombre || "Servicio",
            prioridad: turno.es_prioritario || false,
            cedula:
              turno.Cedula_manual ||
              turno.ID_Cliente_data?.ID_Usuario_data?.cc ||
              "N/A",
          }))
        );
      }

      // Si hay un turno en atención, cargarlo
      if (data.turno_actual) {
        const turnoActual = data.turno_actual;
        setUsuarioActual({
          id: turnoActual.id,
          nombre:
            turnoActual.ID_Cliente_data?.ID_Usuario_data?.first_name ||
            "Cliente",
          apellido:
            turnoActual.ID_Cliente_data?.ID_Usuario_data?.last_name || "",
          turno: turnoActual.numero_turno || `T${turnoActual.id}`,
          servicio: turnoActual.ID_Servicio_data?.Nombre || "Servicio",
          prioridad: turnoActual.es_prioritario || false,
          cedula:
            turnoActual.Cedula_manual ||
            turnoActual.ID_Cliente_data?.ID_Usuario_data?.cc ||
            "N/A",
        });
        setMostrarOpciones(true);
      } else {
        setUsuarioActual(null);
        setMostrarOpciones(false);
        setMostrarProductos(false);
        setSeleccionTipoAtencion(false);
      }

      setError("");
    } catch (error) {
      setError(
        error.response?.data?.error || "Error al cargar información de caja"
      );
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarProductos = async () => {
    try {
      const productosData = await getProductos();
      console.log("Productos recibidos:", productosData);
      
      // Verificar que tenemos un array
      if (!Array.isArray(productosData)) {
        console.error("Los datos de productos recibidos no son un array:", productosData);
        setProductos([]); // Establecer array vacío como fallback
        return;
      }
      
      setProductos(productosData);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProductos([]); // Establecer array vacío en caso de error
    }
  };

  // Atender siguiente usuario - integrado con backend
  const atenderSiguiente = async () => {
    if (!cajaActiva) {
      alert("La caja debe estar activa para atender usuarios");
      return;
    }

    try {
      const response = await atenderSiguienteTurno();

      if (response.success) {
        // Recargar datos para obtener el usuario en atención
        await cargarDatosCaja();
        setSeleccionTipoAtencion(true);
        setMostrarOpciones(false);
        setMostrarProductos(false);
        setCarrito([]);
        setOrdenRecibida(false);
      } else {
        alert(response.message || "No hay usuarios en cola para atender");
      }
    } catch (error) {
      console.error("Error al atender siguiente:", error);
      alert(error.response?.data?.error || "Error al atender siguiente turno");
    }
  };

  // Método para atender con orden médica
  const atenderConOrden = () => {
    setOrdenRecibida(true);
    setMostrarOpciones(true);
    setSeleccionTipoAtencion(false);
    setMostrarProductos(false);
  };

  // Método para atender sin orden médica
  const atenderSinOrden = () => {
    setOrdenRecibida(false);
    setMostrarOpciones(true);
    setSeleccionTipoAtencion(false);
    setMostrarProductos(false);
  };

  // Mostrar productos
  const mostrarSeleccionProductos = () => {
    setMostrarProductos(true);
  };

  // Volver al paso anterior
  const volverAtras = () => {
    if (mostrarProductos) {
      setMostrarProductos(false);
    } else if (mostrarOpciones) {
      setMostrarOpciones(false);
      setSeleccionTipoAtencion(true);
    } else if (seleccionTipoAtencion) {
      confirmarCancelarAtencion();
    }
  };

  // Mostrar confirmación de cancelar atención
  const confirmarCancelarAtencion = () => {
    setConfirmarCancelar(true);
  };

  // Cancelar atención - integrado con backend
  const handleCancelarAtencion = async () => {
    try {
      await cancelarTurnoActual("Cancelado por cajero");
      await cargarDatosCaja(); // Recargar para actualizar el estado
      setConfirmarCancelar(false);
    } catch (error) {
      console.error("Error al cancelar turno:", error);
      alert(error.response?.data?.error || "Error al cancelar turno");
    }
  };

  // Desactivar/activar caja - integrado con backend
  const toggleCaja = async () => {
    try {
      const response = await toggleCajaEstado();

      if (response.success) {
        await cargarDatosCaja(); // Recargar para actualizar el estado
        alert(response.message);
      }
    } catch (error) {
      console.error("Error al cambiar estado de caja:", error);
      alert(error.response?.data?.error || "Error al cambiar estado de caja");
    }
  };

  // Solicitar ayuda
  const pedirAyuda = () => {
    alert("Se ha solicitado ayuda. Un supervisor acudirá pronto.");
  };

  // Agregar producto al carrito
  const agregarProducto = (producto) => {
    if (producto.requiere_orden_medica && !ordenRecibida) {
      alert(
        "Este producto requiere orden médica. No puede ser vendido sin receta."
      );
      return;
    }

    const existeEnCarrito = carrito.find((item) => item.id === producto.id);

    if (existeEnCarrito) {
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = (id, cantidad) => {
    if (cantidad <= 0) {
      setCarrito(carrito.filter((item) => item.id !== id));
    } else {
      setCarrito(
        carrito.map((item) => (item.id === id ? { ...item, cantidad } : item))
      );
    }
  };

  // Eliminar producto del carrito
  const eliminarProducto = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  // Generar factura y finalizar compra - integrado con backend
  const finalizarCompra = async () => {
    if (carrito.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }

    try {
      // Crear factura en el backend
      const facturaData = {
        productos: carrito.map((item) => ({
          id: item.id,
          nombre: item.Nombre,
          marca: item.Marca,
          cantidad: item.cantidad,
          precio: item.Precio,
          descuento: item.Descuento,
          requireOrden: item.requiere_orden_medica || false,
        })),
        total: totalCompra,
      };

      const response = await finalizarTurno(
        facturaData.productos,
        facturaData.total
      );

      if (response.success) {
        // Crear factura para el PDF
        const factura = {
          fecha: new Date().toLocaleString(),
          cajero: cajero.nombre,
          cliente: `${usuarioActual.nombre} ${usuarioActual.apellido}`,
          cedula: usuarioActual.cedula,
          turno: usuarioActual.turno,
          productos: carrito,
          total: totalCompra,
          conOrdenMedica: ordenRecibida,
          facturaId: response.factura?.id || Date.now(),
        };

        // Generar PDF
        generarPDF(factura);

        // Recargar datos para actualizar el estado
        await cargarDatosCaja();

        alert("Compra finalizada exitosamente. Se ha generado la factura.");
      }
    } catch (error) {
      console.error("Error al finalizar compra:", error);
      alert(error.response?.data?.error || "Error al finalizar la compra");
    }
  };

  // Función para generar PDF de la factura
  const generarPDF = (factura) => {
    try {
      const doc = new jsPDF();

      // Título
      doc.setFontSize(20);
      doc.text("MEDIFAST - FACTURA", 105, 20, { align: "center" });

      // Información de la factura
      doc.setFontSize(12);
      doc.text(`Factura No: ${factura.facturaId}`, 15, 40);
      doc.text(`Fecha: ${factura.fecha}`, 15, 50);
      doc.text(`Cajero: ${factura.cajero}`, 15, 60);
      doc.text(`Cliente: ${factura.cliente}`, 15, 70);
      doc.text(`Cédula: ${factura.cedula}`, 15, 80);
      doc.text(`Turno: ${factura.turno}`, 15, 90);
      doc.text(
        `Tipo: ${
          factura.conOrdenMedica ? "Con orden médica" : "Sin orden médica"
        }`,
        15,
        100
      );

      // Tabla de productos
      autoTable(doc, {
        head: [
          ["Producto", "Marca", "Precio", "Descuento", "Cantidad", "Subtotal"],
        ],
        body: factura.productos.map((producto) => {
          const subtotal =
            (producto.Precio - producto.Descuento) * producto.cantidad;
          return [
            producto.Nombre,
            producto.Marca,
            `$${producto.Precio.toLocaleString()}`,
            `$${producto.Descuento.toLocaleString()}`,
            producto.cantidad,
            `$${subtotal.toLocaleString()}`,
          ];
        }),
        startY: 110,
        theme: "grid",
        styles: {
          fontSize: 10,
          cellPadding: 3,
        },
      });

      // Total
      const finalY = doc.lastAutoTable.finalY || 110;
      doc.setFontSize(14);
      doc.text(`TOTAL: $${factura.total.toLocaleString()}`, 15, finalY + 20);

      // Información adicional
      doc.setFontSize(10);
      doc.text("Gracias por su compra", 105, finalY + 40, { align: "center" });
      doc.text("MEDIFAST - Farmacia de confianza", 105, finalY + 50, {
        align: "center",
      });

      // Guardar PDF
      const fileName = `factura_${factura.facturaId}_${factura.cliente.replace(
        /\s+/g,
        "_"
      )}.pdf`;
      doc.save(fileName);

      console.log("Factura PDF generada exitosamente");
    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar la factura PDF");
    }
  };

  // Pasar al siguiente turno sin atender
  const pasarSiguienteTurno = async () => {
    try {
      await cancelarTurnoActual("Turno pasado sin atención");
      await cargarDatosCaja();

      // Si hay más usuarios en cola, atender automáticamente
      setTimeout(() => {
        if (usuariosCola.length > 0) {
          atenderSiguiente();
        }
      }, 500);
    } catch (error) {
      console.error("Error al pasar turno:", error);
      alert(error.response?.data?.error || "Error al pasar al siguiente turno");
    }
  };

  // Volver a opciones principales
  const volverAOpciones = () => {
    setMostrarOpciones(false);
    setMostrarProductos(false);
    setSeleccionTipoAtencion(false);
    setOrdenRecibida(false);
    setCarrito([]);
  };

  // Solicitar permisos de notificación
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  if (loading && !cajaInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información de caja...</p>
        </div>
      </div>
    );
  }

  if (error && !cajaInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <h3 className="font-bold">Error al cargar información</h3>
            <p>{error}</p>
            <button
              onClick={cargarDatosCaja}
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sección Izquierda - Lista de usuarios en cola */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Usuarios en Cola
          </h2>

          {usuariosCola.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay usuarios en cola
            </p>
          ) : (
            <div className="space-y-3">
              {usuariosCola.map((usuario, index) => (
                <div
                  key={usuario.id}
                  className={`p-3 rounded-lg ${
                    usuarioActual && usuario.id === usuarioActual.id
                      ? "bg-green-100 border border-green-400"
                      : index === 0 && !usuarioActual
                      ? "bg-green-50 border border-green-300"
                      : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {usuario.nombre} {usuario.apellido}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        usuario.prioridad
                          ? "bg-red-100 text-red-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {usuario.prioridad ? "Prioritario" : "Normal"}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-gray-600">
                      Turno: {usuario.turno}
                    </span>
                    <span className="text-gray-600">{usuario.servicio}</span>
                  </div>
                  {usuarioActual && usuario.id === usuarioActual.id && (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      En atención
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sección Central - Información de cajero y controles */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Información de Cajero - Caja {cajero.caja}
          </h2>
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-gray-200 h-24 w-24 flex items-center justify-center text-3xl">
                👤
              </div>
            </div>
            <p className="text-center font-medium text-lg">{cajero.nombre}</p>
            <p className="text-center text-gray-600">CC: {cajero.cedula}</p>
            <p className="text-center">
              <span
                className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${
                  cajaActiva
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Caja {cajaActiva ? "Activa" : "Inactiva"}
              </span>
            </p>
          </div>

          {/* Pantalla inicial - Sin usuario en atención activa */}
          {!seleccionTipoAtencion && !mostrarOpciones && !confirmarCancelar && (
            <div className="space-y-3">
              <button
                onClick={atenderSiguiente}
                disabled={!cajaActiva || usuariosCola.length === 0}
                className={`w-full py-2 px-4 rounded-lg font-medium text-white ${
                  cajaActiva && usuariosCola.length > 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Atender Siguiente Turno
              </button>

              <button
                onClick={toggleCaja}
                className={`w-full py-2 px-4 rounded-lg font-medium ${
                  cajaActiva
                    ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {cajaActiva ? "Desactivar Caja" : "Activar Caja"}
              </button>

              <button
                onClick={pedirAyuda}
                className="w-full py-2 px-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium"
              >
                Pedir Ayuda
              </button>
            </div>
          )}

          {/* Confirmación de cancelar atención */}
          {confirmarCancelar && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <h3 className="font-medium text-center mb-4">
                ¿Está seguro que desea cancelar la atención?
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCancelarAtencion}
                  className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
                >
                  Sí, Cancelar
                </button>
                <button
                  onClick={() => setConfirmarCancelar(false)}
                  className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  No, Volver
                </button>
              </div>
            </div>
          )}

          {/* Selección del tipo de atención */}
          {usuarioActual && seleccionTipoAtencion && !confirmarCancelar && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-center mb-2">Atendiendo a:</h3>
              <p className="text-center font-bold mb-4">
                {usuarioActual.nombre} {usuarioActual.apellido}
              </p>

              <div className="space-y-3">
                <button
                  onClick={atenderConOrden}
                  className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                >
                  Atender con Orden Médica
                </button>

                <button
                  onClick={atenderSinOrden}
                  className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
                >
                  Atender sin Orden Médica
                </button>

                <button
                  onClick={pasarSiguienteTurno}
                  className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium"
                >
                  No Atender (Siguiente Turno)
                </button>

                <button
                  onClick={volverAOpciones}
                  className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                >
                  Volver a Opciones
                </button>
              </div>
            </div>
          )}

          {/* Información del usuario en atención */}
          {usuarioActual && mostrarOpciones && !confirmarCancelar && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-center mb-2">En atención:</h3>
              <p className="text-center font-bold mb-2">
                {usuarioActual.nombre} {usuarioActual.apellido}
              </p>
              <p className="text-center mb-2">Turno: {usuarioActual.turno}</p>
              <div className="flex justify-center mb-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    usuarioActual.prioridad
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {usuarioActual.prioridad
                    ? "Prioridad Alta"
                    : "Prioridad Normal"}
                </span>
              </div>
              <p className="text-center mb-3">
                Servicio:{" "}
                <span className="font-medium">{usuarioActual.servicio}</span>
              </p>

              {/* Indicador de estado de orden médica */}
              <p className="text-center mb-3">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    ordenRecibida
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {ordenRecibida ? "Con Orden Médica" : "Sin Orden Médica"}
                </span>
              </p>

              {!mostrarProductos ? (
                <div className="space-y-3">
                  <button
                    onClick={mostrarSeleccionProductos}
                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Seleccionar Productos
                  </button>

                  <button
                    onClick={volverAtras}
                    className="w-full py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                  >
                    Volver Atrás
                  </button>

                  <button
                    onClick={confirmarCancelarAtencion}
                    className="w-full py-2 px-4 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg font-medium"
                  >
                    Cancelar Atención
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <p className="mb-2">Seleccione los productos</p>
                  <button
                    onClick={volverAtras}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ← Volver a opciones
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sección Derecha - Selección de productos y facturación */}
        <div className="lg:col-span-6 bg-white rounded-xl shadow p-4 md:p-6">
          {mostrarProductos ? (
            <>
              <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                Selección de Productos
                {!ordenRecibida && (
                  <span className="ml-2 text-sm font-normal text-yellow-600">
                    (Sin orden médica - Algunos productos no están disponibles)
                  </span>
                )}
              </h2>

              {/* Búsqueda de productos */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Buscar producto por nombre, marca o tipo..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              {/* Lista de productos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto.id}
                    className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer relative"
                    onClick={() => agregarProducto(producto)}
                  >
                    {producto.requiere_orden_medica && (
                      <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                        Requiere orden
                      </span>
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">{producto.Nombre}</span>
                      <span className="text-sm text-gray-500">
                        {producto.Marca}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">{producto.Tipo}</div>
                    <div className="flex justify-between mt-1">
                      <span
                        className={`${
                          producto.Descuento > 0
                            ? "line-through text-gray-400"
                            : ""
                        }`}
                      >
                        ${producto.Precio.toLocaleString()}
                      </span>
                      {producto.Descuento > 0 && (
                        <span className="font-medium text-green-600">
                          $
                          {(
                            producto.Precio - producto.Descuento
                          ).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carrito */}
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Productos Seleccionados</h3>

                {carrito.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No hay productos seleccionados
                  </p>
                ) : (
                  <>
                    <div className="max-h-64 overflow-y-auto mb-4">
                      {carrito.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 border-b"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.Nombre}</div>
                            <div className="text-sm text-gray-600">
                              {item.Marca}
                            </div>
                            <div className="text-sm">
                              ${(item.Precio - item.Descuento).toLocaleString()}{" "}
                              c/u
                            </div>
                            {item.requiere_orden_medica && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-1 py-0.5 rounded">
                                Requiere orden
                              </span>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actualizarCantidad(item.id, item.cantidad - 1);
                              }}
                              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              value={item.cantidad}
                              onChange={(e) =>
                                actualizarCantidad(
                                  item.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="border rounded w-12 px-2 py-1 text-center"
                              min="1"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actualizarCantidad(item.id, item.cantidad + 1);
                              }}
                              className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center"
                            >
                              +
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarProducto(item.id);
                              }}
                              className="text-red-500 hover:text-red-700 ml-2"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="font-bold text-lg">Total:</span>
                      <span className="font-bold text-xl">
                        ${totalCompra.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={finalizarCompra}
                      className="w-full mt-4 py-3 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                    >
                      Confirmar Pago
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500 text-center">
                {usuarioActual
                  ? seleccionTipoAtencion
                    ? "Seleccione el tipo de atención"
                    : "Seleccione 'Seleccionar Productos' para continuar"
                  : "Atienda a un usuario para mostrar opciones"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
