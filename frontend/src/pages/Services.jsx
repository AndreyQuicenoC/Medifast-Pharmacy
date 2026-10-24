import { useState, useEffect } from "react";
import Button from "../components/Button";
import { PageShell } from "../components/PageState";
import { useNavigate } from "react-router-dom";
import {
  GetAllServicios,
  CreateServicio,
  UpdateServicio,
  DeactivateServicio,
  ActivateServicio,
  DeleteServicioPermanent,
} from "../api/servicio.api";
import { useConfirm } from "../components/ConfirmProvider";
import { notify } from "../utils/notify";
import AdminPageLayout from "../components/AdminPageLayout";
import ActionIconButton from "../components/ActionIconButton";
import Tooltip from "../components/Tooltip";
import { IconService } from "../components/icons";

export default function ServicioEditor() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showInactive, setShowInactive] = useState(false); // Estado para mostrar/ocultar servicios inactivos

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem("token");
    const rol = localStorage.getItem("rol");

    if (!token || rol !== "administrador") {
      navigate("/login");
    } else {
      setAuthorized(true);
    }
    setLoading(false);
  }, [navigate]);

  // Estados
  const [servicios, setServicios] = useState([]);
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    descripcion: "",
    etiqueta: "",
    prioridad: false,
  });
  const [error, setError] = useState(null);

  // Cargar servicios al montar el componente
  useEffect(() => {
    if (authorized) {
      fetchServicios();
    }
  }, [authorized]);

  // Función para cargar servicios
  const fetchServicios = async () => {
    try {
      setLoading(true);
      const serviciosData = await GetAllServicios();

      // Verificar que tenemos un array
      if (!Array.isArray(serviciosData)) {
        console.error("Los datos recibidos no son un array:", serviciosData);
        setError("Formato de datos incorrecto");
        return;
      }

      // Mapear los datos del backend a nuestro formato frontend
      const adaptedData = serviciosData.map((servicio) => ({
        id: servicio.id,
        etiqueta: servicio.Nombre,
        descripcion: servicio.Descripcion,
        prioridad: servicio.Prioridad > 0,
        estado: servicio.Estado,
      }));

      // Ordenar: primero activos, luego inactivos
      adaptedData.sort((a, b) => {
        if (a.estado === b.estado) return 0;
        return a.estado ? -1 : 1;
      });

      setServicios(adaptedData);
      setError(null);
    } catch (err) {
      console.error("Error al cargar servicios:", err);
      setError("No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Mostrar formulario para crear
  const handleShowCreateForm = () => {
    setEditingId(null);
    setFormData({
      descripcion: "",
      etiqueta: "",
      prioridad: false,
    });
    setShowForm(true);
  };

  // Mostrar formulario para editar
  const handleShowEditForm = (servicio) => {
    setEditingId(servicio.id);
    setFormData({
      descripcion: servicio.descripcion,
      etiqueta: servicio.etiqueta,
      prioridad: servicio.prioridad,
    });
    setShowForm(true);
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // Guardar servicio (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Actualizar servicio existente
        await UpdateServicio(editingId, formData);
        notify.success("Servicio actualizado con éxito");
      } else {
        // Crear nuevo servicio
        await CreateServicio(formData);
        notify.success("Servicio creado con éxito");
      }
      // Recargar datos
      fetchServicios();
      // Cerrar formulario
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      notify.error(
        `Error al guardar el servicio: ${
          error.response?.data?.detail || error.message
        }`,
      );
    }
  };

  // Desactivar servicio
  const handleDeactivate = async (id) => {
    const ok = await confirm({
      title: "Desactivar servicio",
      message: "¿Desea desactivar este servicio?",
      confirmLabel: "Desactivar",
      destructive: true,
    });
    if (!ok) return;
    try {
      await DeactivateServicio(id);
      fetchServicios();
      notify.success("Servicio desactivado con éxito");
    } catch (error) {
      console.error("Error al desactivar servicio:", error);
      notify.error("Error al desactivar el servicio");
    }
  };

  const handleActivate = async (id) => {
    const ok = await confirm({
      title: "Activar servicio",
      message: "¿Desea activar este servicio nuevamente?",
      confirmLabel: "Activar",
    });
    if (!ok) return;
    try {
      await ActivateServicio(id);
      fetchServicios();
      notify.success("Servicio activado con éxito");
    } catch (error) {
      console.error("Error al activar servicio:", error);
      notify.error("Error al activar el servicio");
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar servicio",
      message: "Esta acción es permanente. ¿Continuar?",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!ok) return;
    try {
      await DeleteServicioPermanent(id);
      fetchServicios();
      notify.success("Servicio eliminado con éxito");
      if (selectedServicio && selectedServicio.id === id) {
        setSelectedServicio(null);
      }
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      notify.error(
        "Error al eliminar el servicio. Puede que existan registros relacionados.",
      );
    }
  };

  // Seleccionar servicio
  const handleSelectServicio = (servicio) => {
    setSelectedServicio(servicio);
  };

  // Filtrar servicios según el estado de showInactive
  const serviciosFiltrados = showInactive
    ? servicios
    : servicios.filter((servicio) => servicio.estado);

  if (!authorized)
    return (
      <p className="text-center mt-8">
        No tienes permiso para acceder a esta sección.
      </p>
    );

  return (
    <PageShell
      loading={loading}
      error={error}
      onRetry={fetchServicios}
      loadingMessage="Cargando servicios..."
    >
    <AdminPageLayout
      title="Gestión de servicios"
      subtitle="Catálogo de atención en mostrador y consultorio"
      action={
        <div className="flex flex-wrap gap-2">
          <Tooltip label="Registrar un nuevo servicio">
            <Button className="btn-primary min-h-[2.75rem] px-4 py-2.5 text-sm" onClick={handleShowCreateForm}>
              Nuevo servicio
            </Button>
          </Tooltip>
          <Tooltip label={showInactive ? "Ocultar servicios inactivos" : "Ver servicios inactivos"}>
            <Button
              className={`min-h-[2.75rem] rounded-lg px-4 py-2.5 text-sm font-semibold text-white ${
                showInactive ? "bg-violet-700 hover:bg-violet-800" : "bg-amber-600 hover:bg-amber-700"
              }`}
              onClick={() => setShowInactive(!showInactive)}
            >
              {showInactive ? "Ocultar inactivos" : "Mostrar inactivos"}
            </Button>
          </Tooltip>
        </div>
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {serviciosFiltrados.length === 0 ? (
              <p className="col-span-full py-10 text-center text-[var(--color-text-muted)]">
                No hay servicios disponibles
              </p>
            ) : (
              serviciosFiltrados.map((servicio) => (
                <article
                  key={servicio.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectServicio(servicio)}
                  onKeyDown={(e) => e.key === "Enter" && handleSelectServicio(servicio)}
                  className={`flex cursor-pointer flex-col rounded-xl border p-4 shadow-sm transition hover:shadow-md ${
                    selectedServicio?.id === servicio.id
                      ? "border-emerald-500 bg-emerald-50/80"
                      : "border-gray-200 bg-white"
                  } ${!servicio.estado ? "border-dashed opacity-75" : ""}`}
                >
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="mt-0.5 text-emerald-700">
                        <IconService name={servicio.etiqueta} className="h-6 w-6" />
                      </span>
                      <h3 className="font-semibold leading-snug text-[var(--color-text)]">
                        {servicio.etiqueta}
                      </h3>
                    </div>
                    {!servicio.estado ? (
                      <span className="shrink-0 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-800">
                        Inactivo
                      </span>
                    ) : null}
                  </div>

                  <p className="mb-3 line-clamp-3 flex-grow text-sm text-[var(--color-text-muted)]">
                    {servicio.descripcion}
                  </p>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        servicio.prioridad
                          ? "bg-red-100 text-red-800"
                          : "bg-sky-100 text-sky-800"
                      }`}
                    >
                      {servicio.prioridad ? "Prioridad alta" : "Prioridad normal"}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-end gap-1.5 border-t border-gray-100 pt-3">
                    <ActionIconButton
                      variant="edit"
                      label="Editar servicio"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowEditForm(servicio);
                      }}
                    />
                    {servicio.estado ? (
                      <ActionIconButton
                        variant="deactivate"
                        label="Desactivar servicio"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeactivate(servicio.id);
                        }}
                      />
                    ) : (
                      <ActionIconButton
                        variant="activate"
                        label="Activar servicio"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleActivate(servicio.id);
                        }}
                      />
                    )}
                    <ActionIconButton
                      variant="delete"
                      label="Eliminar servicio"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(servicio.id);
                      }}
                    />
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Panel de servicio seleccionado - Solo visible en modo móvil cuando no se muestra el formulario */}
          {selectedServicio && !showForm && (
            <div className="lg:hidden mt-6 pt-6 border-t flex flex-col items-center space-y-4">
              <div className="w-full bg-green-600 text-white px-4 py-2 rounded-lg text-center font-medium">
                Servicio: {selectedServicio.etiqueta}
                {!selectedServicio.estado && (
                  <span className="ml-2 bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                    Inactivo
                  </span>
                )}
              </div>
              <div className="bg-yellow-700 text-white font-bold rounded-lg p-4 w-48 text-center">
                <span className="block">
                  Prioridad: {selectedServicio.prioridad ? "Alta" : "Normal"}
                </span>
                <span className="block">ID: {selectedServicio.id}</span>
              </div>
            </div>
          )}
        </div>

        {/* Columna derecha - Formulario o detalles del servicio */}
        {(showForm || selectedServicio) && (
          <div className="lg:w-2/5 xl:w-1/3 bg-white rounded-xl shadow p-5 h-fit">
            {showForm ? (
              /* Formulario de creación/edición */
              <>
                <h2 className="text-2xl font-semibold mb-4 pb-2">
                  {editingId ? "Editar Servicio" : "Nuevo Servicio"}
                </h2>
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Etiqueta
                    </label>
                    <input
                      type="text"
                      name="etiqueta"
                      value={formData.etiqueta}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">
                      Descripción
                    </label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="prioridad"
                      checked={formData.prioridad}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label className="text-sm">Prioridad Alta</label>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                    >
                      {editingId ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            ) : (
              /* Detalles del servicio seleccionado - Solo visible en pantallas grandes */
              selectedServicio && (
                <div className="hidden lg:flex flex-col items-center space-y-5">
                  <h2 className="text-xl font-semibold self-start mb-2">
                    Detalles del servicio
                  </h2>

                  <div className="w-full bg-green-600 text-white px-6 py-3 rounded-lg text-center font-medium text-lg relative">
                    {selectedServicio.etiqueta}
                    {!selectedServicio.estado && (
                      <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/3">
                        <span className="bg-red-700 text-white text-xs px-2 py-1 rounded-full">
                          Inactivo
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="w-full bg-gray-100 p-4 rounded-lg">
                    <p className="text-gray-700 mb-4">
                      {selectedServicio.descripcion}
                    </p>

                    <div className="flex justify-between items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          selectedServicio.prioridad
                            ? "bg-red-200 text-red-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {selectedServicio.prioridad
                          ? "Prioridad Alta"
                          : "Prioridad Normal"}
                      </span>
                      <span className="text-sm text-gray-500">
                        ID: {selectedServicio.id}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap justify-end gap-1.5 border-t border-gray-100 pt-4">
                    <ActionIconButton
                      variant="edit"
                      label="Editar servicio"
                      onClick={() => handleShowEditForm(selectedServicio)}
                    />
                    {selectedServicio.estado ? (
                      <ActionIconButton
                        variant="deactivate"
                        label="Desactivar servicio"
                        onClick={() => handleDeactivate(selectedServicio.id)}
                      />
                    ) : (
                      <ActionIconButton
                        variant="activate"
                        label="Activar servicio"
                        onClick={() => handleActivate(selectedServicio.id)}
                      />
                    )}
                    <ActionIconButton
                      variant="delete"
                      label="Eliminar servicio"
                      onClick={() => handleDelete(selectedServicio.id)}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </AdminPageLayout>
    </PageShell>
  );
}
