import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import medifastLogo from "../assets/medifast_logo.png";
// Importar las imágenes del carrusel
import imgPR_ViernesPastillaton from "../assets/ads/PR_ViernesPastillaton.jpg";
import imgVT_Vitamax from "../assets/ads/VT_Vitamax.jpg";
import imgMD_Somniora from "../assets/ads/MD_Somniora.jpg";
import {
  getTurnoActivoCliente,
  getColaTurnos,
  getEstadoCajas,
  cancelarTurno,
  getTurnoActualGlobal,
} from "../api/turno.api";

const images = [
  imgPR_ViernesPastillaton,
  imgVT_Vitamax,
  imgMD_Somniora,
];

const messages = [
  {
    title: "¿Sabías que...?",
    text: "En nuestra farmacia encuentras medicamentos certificados, asesoría personalizada y atención prioritaria para adultos mayores.",
    bgColor: "bg-green-50 text-green-900", // verde claro
  },
  {
    title: "Consejo de salud",
    text: "Tomar tus medicamentos a la misma hora cada día mejora su efectividad y reduce los efectos secundarios.",
    bgColor: "bg-blue-50 text-blue-900", // azul claro
  },
  {
    title: "Atención especial",
    text: "Ofrecemos servicios preferenciales para personas con movilidad reducida. ¡Pregunta en recepción!",
    bgColor: "bg-yellow-50 text-yellow-900", // amarillo claro
  },
];

export default function Turno() {
  const navigate = useNavigate();

  const [imageIndex, setImageIndex] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  // Estados para gestión de turnos
  const [turnoCliente, setTurnoCliente] = useState(null);
  const [turnoActualCaja, setTurnoActualCaja] = useState(null);
  const [colaTurnos, setColaTurnos] = useState([]);
  const [estadoCajas, setEstadoCajas] = useState([]);
  const [loading, setLoading] = useState(false); // Cambiar a false para carga silenciosa
  const [clienteInfo, setClienteInfo] = useState(null);
  const [mostrarEstadoCajas, setMostrarEstadoCajas] = useState(false);
  const [notificacionesActivas, setNotificacionesActivas] = useState(false);
  const [turnoAnterior, setTurnoAnterior] = useState(null);
  
  // Estados para mejor UX (sin afectar funcionalidad core)
  const [actualizandoManual, setActualizandoManual] = useState(false);
  const [ultimaActualizacion, setUltimaActualizacion] = useState(new Date());
  const [cargaInicialCompleta, setCargaInicialCompleta] = useState(false);

  // Cambiar imagen cada 15 segundos
  useEffect(() => {
    const imageInterval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 15000);

    return () => clearInterval(imageInterval);
  }, [imageIndex]);

  // Cambiar mensaje cada 10 segundos
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(messageInterval);
  }, []);

  // Función para carga inicial silenciosa (sin mostrar spinner)
  const cargarDatosSilencioso = React.useCallback(
    async (cedula) => {
      try {
        // No activar loading para carga silenciosa
        
        // Obtener turno del cliente
        const turnoClienteResponse = await getTurnoActivoCliente(cedula);

        if (turnoClienteResponse.tiene_turno) {
          setTurnoCliente(turnoClienteResponse.turno);
        } else {
          // Si no tiene turno, redirigir a pedir turno
          navigate("/pedir-turno");
          return;
        }

        // Obtener turno actual global (independiente de la caja del usuario)
        const turnoActualGlobalResponse = await getTurnoActualGlobal();
        if (turnoActualGlobalResponse.hay_turno_actual) {
          setTurnoActualCaja(turnoActualGlobalResponse.turno_actual);
        }

        // Obtener cola de turnos
        const colaResponse = await getColaTurnos();
        setColaTurnos(colaResponse);

        // Obtener estado de todas las cajas
        const estadoCajasResponse = await getEstadoCajas();
        setEstadoCajas(estadoCajasResponse.estado_cajas || []);
        
        // Actualizar timestamp silenciosamente
        setUltimaActualizacion(new Date());
        setCargaInicialCompleta(true);
      } catch (error) {
        console.error("Error al cargar datos de turnos silenciosamente:", error);
        // En caso de error, mostrar pantalla de carga tradicional
        setLoading(true);
        cargarDatosTurnos(cedula);
      }
    },
    [navigate]
  );

  // Definir cargarDatosTurnos (para actualizaciones manuales que sí muestran loading)
  const cargarDatosTurnos = React.useCallback(
    async (cedula) => {
      try {
        setLoading(true);

        // Obtener turno del cliente
        const turnoClienteResponse = await getTurnoActivoCliente(cedula);

        if (turnoClienteResponse.tiene_turno) {
          setTurnoCliente(turnoClienteResponse.turno);
        } else {
          // Si no tiene turno, redirigir a pedir turno
          navigate("/pedir-turno");
          return;
        }

        // Obtener turno actual global (independiente de la caja del usuario)
        const turnoActualGlobalResponse = await getTurnoActualGlobal();
        if (turnoActualGlobalResponse.hay_turno_actual) {
          setTurnoActualCaja(turnoActualGlobalResponse.turno_actual);
        }

        // Obtener cola de turnos
        const colaResponse = await getColaTurnos();
        setColaTurnos(colaResponse);

        // Obtener estado de todas las cajas
        const estadoCajasResponse = await getEstadoCajas();
        setEstadoCajas(estadoCajasResponse.estado_cajas || []);
        
        // Actualizar timestamp silenciosamente
        setUltimaActualizacion(new Date());
      } catch (error) {
        console.error("Error al cargar datos de turnos:", error);
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  // Función para actualización manual más rápida (sin mostrar loading completo)
  const actualizarManual = React.useCallback(
    async (cedula) => {
      if (actualizandoManual) return; // Evitar múltiples llamadas
      
      try {
        setActualizandoManual(true);
        
        // Solo actualizar datos críticos más rápido
        const [turnoClienteResponse, turnoActualGlobalResponse, colaResponse] = await Promise.all([
          getTurnoActivoCliente(cedula),
          getTurnoActualGlobal(),
          getColaTurnos()
        ]);

        if (turnoClienteResponse.tiene_turno) {
          setTurnoCliente(turnoClienteResponse.turno);
        } else {
          navigate("/pedir-turno");
          return;
        }

        if (turnoActualGlobalResponse.hay_turno_actual) {
          setTurnoActualCaja(turnoActualGlobalResponse.turno_actual);
        }

        setColaTurnos(colaResponse);
        setUltimaActualizacion(new Date());
      } catch (error) {
        console.error("Error en actualización manual:", error);
      } finally {
        setActualizandoManual(false);
      }
    },
    [navigate, actualizandoManual]
  );

  // Verificar autenticación y cargar datos
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isClient = localStorage.getItem("is_client") === "true";
    const cedula = localStorage.getItem("user_cc");

    // Solo permitir acceso a clientes autenticados
    if (!authToken || !isClient) {
      navigate("/");
      return;
    }

    if (!cedula) {
      alert("Error: No se pudo obtener información del usuario");
      navigate("/");
      return;
    }

    setClienteInfo({
      cedula,
      nombre: localStorage.getItem("user_name") || "",
      apellido: localStorage.getItem("user_lastname") || "",
    });

    // Carga inicial silenciosa (sin mostrar spinner)
    cargarDatosSilencioso(cedula);

    // Actualizar datos cada 30 segundos usando la carga silenciosa también
    const interval = setInterval(() => {
      cargarDatosSilencioso(cedula);
    }, 30000);

    return () => clearInterval(interval);
  }, [navigate, cargarDatosSilencioso]);

  // Solicitar permisos de notificación
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setNotificacionesActivas(permission === "granted");
      });
    } else if (Notification.permission === "granted") {
      setNotificacionesActivas(true);
    }
  }, []);

  // Monitorear cambios en el turno para notificaciones
  useEffect(() => {
    if (!turnoCliente || !turnoActualCaja || !notificacionesActivas) return;

    // Verificar si el turno del cliente es el próximo
    const posicionEnCola = colaTurnos.findIndex(
      (turno) => turno.id === turnoCliente.id
    );

    // Si es el siguiente turno (posición 0 después del actual)
    if (
      posicionEnCola === 0 &&
      turnoAnterior?.id !== turnoCliente.id &&
      turnoActualCaja.id !== turnoCliente.id
    ) {
      mostrarNotificacion(
        "¡Tu turno es el siguiente!",
        `Prepárate, serás atendido pronto en ${
          turnoCliente.ID_Caja_data?.nombre || "tu caja asignada"
        }`
      );
    }

    // Si su turno está siendo atendido ahora
    if (
      turnoActualCaja.id === turnoCliente.id &&
      turnoAnterior?.id !== turnoCliente.id
    ) {
      mostrarNotificacion(
        "¡Es tu turno!",
        `Dirígete a ${
          turnoCliente.ID_Caja_data?.nombre || "tu caja asignada"
        } para ser atendido`
      );
    }

    setTurnoAnterior(turnoCliente);
  }, [
    turnoCliente,
    turnoActualCaja,
    colaTurnos,
    notificacionesActivas,
    turnoAnterior,
  ]);

  const mostrarNotificacion = (titulo, mensaje) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(titulo, {
        body: mensaje,
        icon: medifastLogo,
        requireInteraction: true,
      });
    }
  };

  const handleCancelarTurno = async () => {
    if (!turnoCliente) return;

    const confirmacion = window.confirm(
      "¿Estás seguro de que deseas cancelar tu turno? Esta acción no se puede deshacer."
    );

    if (confirmacion) {
      try {
        await cancelarTurno(turnoCliente.id);
        alert("Turno cancelado exitosamente");
        navigate("/pedir-turno");
      } catch (error) {
        alert("Error al cancelar el turno. Intenta nuevamente.");
        console.error("Error:", error);
      }
    }
  };

  const obtenerPosicionEnCola = () => {
    if (!turnoCliente) return 0;

    const turnosDelante = colaTurnos.filter(
      (turno) =>
        turno.posicion_cola < turnoCliente.posicion_cola &&
        turno.estado === "esperando"
    );

    return turnosDelante.length;
  };

  const obtenerTurnoActual = () => {
    if (turnoActualCaja) {
      return turnoActualCaja.numero_turno;
    }
    return "---";
  };

  // Solo mostrar pantalla de carga en casos excepcionales (errores)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Reconectando...
          </p>
        </div>
      </div>
    );
  }

  const prevImage = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto h-auto bg-white shadow-lg rounded-lg p-6">
        {/* Información del Cliente */}
        {clienteInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-blue-800">
                  👤 Bienvenido, {clienteInfo.nombre} {clienteInfo.apellido}
                </h3>
                <p className="text-sm text-blue-600">CC: {clienteInfo.cedula}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-500">
                  Última actualización: {ultimaActualizacion.toLocaleTimeString()}
                </p>
                {actualizandoManual && (
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600">Actualizando...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Turno Siguiente Section */}
        <div className="bg-green-600 rounded-2xl flex flex-col justify-center items-center py-8 mb-4">
          <h2 className="text-4xl font-bold text-white">
            {turnoActualCaja
              ? `Turno Actual - Caja ${
                  turnoActualCaja.caja_nombre || turnoActualCaja.caja_id
                }`
              : cargaInicialCompleta 
                ? "Sin Turno en Atención"
                : "Cargando..."}
          </h2>
          <span className={`text-8xl font-black text-white ${!cargaInicialCompleta && !turnoActualCaja ? 'animate-pulse' : ''}`}>
            {obtenerTurnoActual()}
          </span>
          {turnoActualCaja && (
            <div className="text-center text-white mt-2">
              <p className="text-lg">
                Cliente: {turnoActualCaja.cliente?.nombre || "N/A"}
              </p>
              <p className="text-md">
                Servicio: {turnoActualCaja.servicio || "N/A"}
              </p>
              {turnoActualCaja.es_prioritario && (
                <span className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium mt-2 inline-block">
                  🚨 Prioritario
                </span>
              )}
            </div>
          )}
          {!cargaInicialCompleta && !turnoActualCaja && (
            <div className="text-center text-white mt-2 opacity-50">
              <p className="text-lg animate-pulse">Obteniendo información...</p>
            </div>
          )}
        </div>

        {/* Mi Turno y Controles */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex-1 rounded-full py-4 px-6 flex justify-between items-center">
            <span className="text-4xl font-bold text-green-600">Mi Turno</span>
            <span className={`text-6xl font-bold text-green-600 ${!cargaInicialCompleta && !turnoCliente ? 'animate-pulse opacity-50' : ''}`}>
              {turnoCliente?.numero_turno || (!cargaInicialCompleta ? "..." : "---")}
            </span>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:w-auto w-full">
            <button
              className="flex-1 border border-green-600 text-green-600 rounded-full py-4 px-6 font-bold hover:bg-green-200 transition duration-300 flex items-center justify-center space-x-2"
              onClick={() => actualizarManual(clienteInfo?.cedula)}
              disabled={actualizandoManual}
            >
              {actualizandoManual ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <span>Actualizar información</span>
              )}
            </button>
            <button
              className="flex-1 border border-orange-600 bg-orange-600 text-white rounded-full py-4 px-6 font-bold hover:bg-orange-800 transition duration-300"
              onClick={handleCancelarTurno}
              disabled={!turnoCliente || turnoCliente.estado !== "esperando"}
            >
              Cancelar turno
            </button>
          </div>
        </div>

        {/* Información del Turno */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 bg-gray-100 rounded-xl p-4 min-h-[100px]">
            <h4 className="font-semibold text-gray-800 mb-2">
              Estado del Turno
            </h4>
            {turnoCliente ? (
              <div>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    turnoCliente.estado === "esperando"
                      ? "bg-yellow-100 text-yellow-800"
                      : turnoCliente.estado === "en_atencion"
                      ? "bg-blue-100 text-blue-800"
                      : turnoCliente.estado === "finalizado"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {turnoCliente.estado === "esperando"
                    ? "Esperando"
                    : turnoCliente.estado === "en_atencion"
                    ? "En Atención"
                    : turnoCliente.estado === "finalizado"
                    ? "Finalizado"
                    : "Cancelado"}
                </span>
                <p className="text-sm text-gray-600 mt-2">
                  Servicio: {turnoCliente.ID_Servicio_data?.Nombre || "---"}
                </p>
                <p className="text-sm text-gray-600">
                  Personas delante: {obtenerPosicionEnCola()}
                </p>
                {turnoCliente.es_prioritario && (
                  <span className="inline-block px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full mt-1">
                    Prioritario
                  </span>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Sin información</p>
            )}
          </div>

          <div className="flex-1 bg-gray-100 rounded-xl p-4 min-h-[100px]">
            <h4 className="font-semibold text-gray-800 mb-2">Caja Asignada</h4>
            {turnoCliente?.ID_Caja_data ? (
              <div>
                <p className="text-2xl font-bold text-green-600">
                  Caja{" "}
                  {turnoCliente.ID_Caja_data.nombre ||
                    turnoCliente.ID_Caja_data.id}
                </p>
                {turnoCliente.ID_Caja_data.usuario && (
                  <p className="text-sm text-gray-600">
                    Cajero: {turnoCliente.ID_Caja_data.usuario.first_name}{" "}
                    {turnoCliente.ID_Caja_data.usuario.last_name}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  ✨ Asignada automáticamente por nuestro sistema inteligente
                </p>
              </div>
            ) : (
              <p className="text-gray-500">Aún no asignada</p>
            )}
          </div>
        </div>

        {/* Nueva sección: Estado de Cajas */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Estado de las Cajas</h4>
            <button
              onClick={() => setMostrarEstadoCajas(!mostrarEstadoCajas)}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              {mostrarEstadoCajas ? "Ocultar" : "Ver estado"}
            </button>
          </div>

          {mostrarEstadoCajas && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {estadoCajas.map((caja) => (
                  <div
                    key={caja.id}
                    className={`border-2 rounded-lg p-3 ${
                      caja.estado
                        ? turnoCliente?.ID_Caja_data?.id === caja.id
                          ? "border-green-500 bg-green-50"
                          : "border-blue-200 bg-blue-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-semibold">
                        Caja {caja.nombre || caja.id}
                      </h5>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          caja.estado
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {caja.estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-1">
                      📋 {caja.turnos_en_espera} turnos en espera
                    </p>

                    {caja.turno_actual ? (
                      <div className="text-sm">
                        <p className="text-blue-600 font-medium">
                          🔄 Atendiendo turno #{caja.turno_actual.numero_turno}
                        </p>
                        <p className="text-gray-600">
                          👤 {caja.turno_actual.cliente.nombre}{" "}
                          {caja.turno_actual.cliente.apellido}
                        </p>
                        <p className="text-gray-600">
                          🏥 {caja.turno_actual.servicio}
                        </p>
                        {caja.turno_actual.hora_inicio_atencion && (
                          <p className="text-gray-500 text-xs">
                            Desde:{" "}
                            {new Date(
                              caja.turno_actual.hora_inicio_atencion
                            ).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Sin turno en atención
                      </p>
                    )}

                    {turnoCliente?.ID_Caja_data?.id === caja.id && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        ⭐ Tu caja asignada
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Explicación del algoritmo */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-800 mb-2">
                  🤖 ¿Cómo funciona la asignación automática?
                </h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • El sistema asigna automáticamente la caja con{" "}
                    <strong>menos turnos pendientes</strong>
                  </li>
                  <li>
                    • Solo se consideran las cajas <strong>activas</strong> para
                    asignación
                  </li>
                  <li>
                    • Los turnos <strong>prioritarios</strong> van al frente de
                    cada cola
                  </li>
                  <li>
                    • Se balancea la carga entre todas las cajas disponibles
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Carrusel + texto + Video YouTube */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Carrusel a la izquierda */}
          <div className="w-full lg:w-[500px] rounded-xl overflow-hidden shadow-lg relative">
            <img
              src={images[imageIndex]}
              alt={`Imagen ${imageIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500"
            />
            {/* Botón Prev */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-white/80 hover:bg-green-100 text-green-800 p-2 rounded-full shadow-md transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Botón Next */}
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-white/80 hover:bg-green-100 text-green-800 p-2 rounded-full shadow-md transition duration-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Carrusel de mensajes informativos con color variable */}
          <div
            className={`w-full lg:w-1/3 p-6 rounded-xl shadow-md flex flex-col justify-center items-center text-center transition-all duration-500 ${messages[messageIndex].bgColor}`}
          >
            <h3 className="text-xl font-bold mb-2">
              {messages[messageIndex].title}
            </h3>
            <p>{messages[messageIndex].text}</p>
          </div>

          {/* Video de YouTube */}
          <div className="w-full lg:w-1/3 flex justify-center items-center">
            <iframe
              width="100%"
              height="auto"
              src="https://www.youtube.com/embed/KFKMEiuCY6M"
              title="Video informativo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl shadow-md aspect-video"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
