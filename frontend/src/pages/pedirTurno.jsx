import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getServicios,
  crearTurno,
  getTurnoActivoCliente,
} from "../api/turno.api";
import { PageShell } from "../components/PageState";
import { IconInfo, IconService } from "../components/icons";
import { notify } from "../utils/notify";
import AdminPageLayout from "../components/AdminPageLayout";

export default function PedirTurno() {
  const navigate = useNavigate();

  // Estados
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState("");
  const [loading, setLoading] = useState(true);
  const [creandoTurno, setCreandoTurno] = useState(false);
  const [error, setError] = useState("");
  const [clienteInfo, setClienteInfo] = useState(null);

  // Definir funciones con useCallback antes del useEffect
  const verificarTurnoExistente = React.useCallback(
    async (cedula) => {
      try {
        const response = await getTurnoActivoCliente(cedula);
        if (response?.tiene_turno) {
          // Si ya tiene turno, redirigir a la página de turnos
          navigate("/turnos");
        }
      } catch (error) {
        console.error("Error al verificar turno existente:", error);
      }
    },
    [navigate]
  );

  const cargarServicios = React.useCallback(async () => {
    try {
      setLoading(true);
      const serviciosData = await getServicios();
      setServicios(Array.isArray(serviciosData) ? serviciosData : []);
    } catch (error) {
      setError("Error al cargar los servicios disponibles");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar autenticación
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const isClient = localStorage.getItem("is_client") === "true";
    const cedula = localStorage.getItem("user_cc");

    // Solo permitir acceso a clientes autenticados
    if (!authToken || !isClient) {
      navigate("/login");
      return;
    }

    if (!cedula) {
      setError("No se pudo obtener información del usuario");
      return;
    }

    setClienteInfo({
      cedula,
      nombre: localStorage.getItem("user_name") || "",
      apellido: localStorage.getItem("user_lastname") || "",
    });

    verificarTurnoExistente(cedula);
    cargarServicios();
  }, [navigate, verificarTurnoExistente, cargarServicios]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!servicioSeleccionado) {
      setError("Por favor selecciona un servicio");
      return;
    }

    setCreandoTurno(true);
    setError("");

    try {
      const response = await crearTurno(
        Number(servicioSeleccionado),
        clienteInfo.cedula
      );

      if (response?.success === false) {
        setError(response.message || "No se pudo crear el turno");
        return;
      }
      if (response?.turno) {
        localStorage.setItem("turno_actual", JSON.stringify(response.turno));
      }
      notify.success(
        response?.turno?.numero_turno
          ? `Turno creado. Número: ${response.turno.numero_turno}`
          : response?.message || "Turno solicitado correctamente",
      );
      navigate("/turnos");
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || "Error al crear el turno");
      } else {
        setError("Error de conexión. Intenta nuevamente.");
      }
      console.error("Error:", error);
    } finally {
      setCreandoTurno(false);
    }
  };

  const getPrioridadTexto = (prioridad) => {
    return prioridad === 1 ? "Prioritario" : "Normal";
  };

  return (
    <PageShell loading={loading} loadingMessage="Cargando servicios...">
    <AdminPageLayout
      title="Solicitar turno"
      subtitle="Selecciona un servicio (máximo uno activo)"
      backTo="/turnos"
      action={
        clienteInfo ? (
          <div className="text-right text-sm">
            <p className="font-semibold text-emerald-800">
              {clienteInfo.nombre} {clienteInfo.apellido}
            </p>
            <p className="text-[var(--color-text-muted)]">CC {clienteInfo.cedula}</p>
          </div>
        ) : null
      }
    >
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Servicios Disponibles
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {servicios.map((servicio) => (
                  <label
                    key={servicio.id}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all duration-200 ${
                      servicioSeleccionado == servicio.id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="servicio"
                      value={servicio.id}
                      checked={servicioSeleccionado == servicio.id}
                      onChange={(e) => setServicioSeleccionado(e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-start">
                      <span className="mr-3 text-emerald-700">
                        <IconService name={servicio.Nombre} />
                      </span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {servicio.Nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {servicio.Descripcion}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            servicio.Prioridad === 1
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {getPrioridadTexto(servicio.Prioridad)}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-800">
                <IconInfo className="h-5 w-5" />
                Información importante
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • Los servicios <strong>prioritarios</strong> serán atendidos
                  antes que los normales
                </li>
                <li>• Solo puedes tener un turno activo a la vez</li>
                <li>• Puedes cancelar tu turno desde la página de turnos</li>
                <li>• Te asignaremos automáticamente a la caja disponible</li>
              </ul>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate("/turnos")}
                className="btn-secondary min-h-[2.75rem] flex-1 py-2.5"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creandoTurno || !servicioSeleccionado}
                className={`min-h-[2.75rem] flex-1 rounded-lg py-2.5 text-sm font-semibold transition ${
                  creandoTurno || !servicioSeleccionado
                    ? "cursor-not-allowed bg-gray-200 text-gray-500"
                    : "btn-primary"
                }`}
              >
                {creandoTurno ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creando turno...
                  </div>
                ) : (
                  "Solicitar Turno"
                )}
              </button>
            </div>
          </form>
        <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
          ¿Necesitas ayuda? Acércate a recepción.
        </p>
    </AdminPageLayout>
    </PageShell>
  );
}
