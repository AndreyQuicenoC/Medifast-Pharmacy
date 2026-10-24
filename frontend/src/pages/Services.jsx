import { useState, useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import {
  GetAllServicios,
  CreateServicio,
  UpdateServicio,
  DeactivateServicio,
  ActivateServicio,
  DeleteServicioPermanent,
} from "../api/servicio.api";

export default function ServicioEditor() {
  const navigate = useNavigate();
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
      console.log("Datos de servicios recibidos:", serviciosData);

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
        alert("Servicio actualizado con éxito");
      } else {
        // Crear nuevo servicio
        await CreateServicio(formData);
        alert("Servicio creado con éxito");
      }
      // Recargar datos
      fetchServicios();
      // Cerrar formulario
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      alert(
        `Error al guardar el servicio: ${
          error.response?.data?.detail || error.message
        }`
      );
    }
  };

  // Desactivar servicio
  const handleDeactivate = async (id) => {
    if (window.confirm("¿Está seguro que desea desactivar este servicio?")) {
      try {
        await DeactivateServicio(id);
        fetchServicios();
        alert("Servicio desactivado con éxito");
      } catch (error) {
        console.error("Error al desactivar servicio:", error);
        alert("Error al desactivar el servicio");
      }
    }
  };

  // Activar servicio
  const handleActivate = async (id) => {
    if (window.confirm("¿Está seguro que desea activar este servicio?")) {
      try {
        await ActivateServicio(id);
        fetchServicios();
        alert("Servicio activado con éxito");
      } catch (error) {
        console.error("Error al activar servicio:", error);
        alert("Error al activar el servicio");
      }
    }
  };

  // Eliminar servicio permanentemente
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar este servicio?")) {
      try {
        await DeleteServicioPermanent(id);
        fetchServicios();
        alert("Servicio eliminado con éxito");
        // Si el servicio eliminado era el seleccionado, deseleccionarlo
        if (selectedServicio && selectedServicio.id === id) {
          setSelectedServicio(null);
        }
      } catch (error) {
        console.error("Error al eliminar servicio:", error);
        alert(
          "Error al eliminar el servicio. Puede que existan registros relacionados que impidan su eliminación."
        );
      }
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

  if (loading)
    return <div className="text-center mt-8">Cargando servicios...</div>;
  if (error)
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!authorized)
    return (
      <p className="text-center mt-8">
        No tienes permiso para acceder a esta sección.
      </p>
    );

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Contenedor principal con diseño responsive de 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda - Lista de servicios */}
        <div className="flex-1 bg-white rounded-xl shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Gestión de Servicios</h2>
            <div className="flex gap-2">
              <Button
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                onClick={handleShowCreateForm}
              >
                Nuevo Servicio
              </Button>
              <Button
                className={`px-4 py-2 ${
                  showInactive
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-yellow-600 hover:bg-yellow-700"
                } text-white rounded-lg`}
                onClick={() => setShowInactive(!showInactive)}
              >
                {showInactive ? "Ocultar inactivos" : "Mostrar inactivos"}
              </Button>
            </div>
          </div>

          {/* Lista de servicios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviciosFiltrados.length === 0 ? (
              <p className="col-span-full text-center text-gray-500 py-8">
                No hay servicios disponibles
              </p>
            ) : (
              serviciosFiltrados.map((servicio) => (
                <div
                  key={servicio.id}
                  className={`flex flex-col p-5 border rounded-lg shadow-sm min-h-[240px] 
                    ${
                      selectedServicio?.id === servicio.id
                        ? "bg-green-50 border-green-500"
                        : ""
                    }
                    ${
                      !servicio.estado
                        ? "opacity-70 border-dashed border-gray-400"
                        : ""
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Button
                      className="flex-1 px-2 py-1 bg-zinc-400 hover:bg-slate-500 text-sm text-white rounded-lg"
                      onClick={() => {
                        handleSelectServicio(servicio);
                      }}
                    >
                      {servicio.etiqueta}
                    </Button>
                    {!servicio.estado && (
                      <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-gray-600 flex-grow my-4 line-clamp-3">
                    {servicio.descripcion}
                  </p>

                  <div className="mt-auto w-full">
                    <div className="mb-3">
                      <span
                        className={`inline-block text-xs ${
                          servicio.prioridad
                            ? "bg-red-200 text-red-700"
                            : "bg-gray-200 text-gray-600"
                        } px-2 py-1 rounded-full`}
                      >
                        {servicio.prioridad
                          ? "Prioridad Alta"
                          : "Prioridad Normal"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 w-full">
                      <Button
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-2 rounded-md w-full flex justify-center items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowEditForm(servicio);
                        }}
                      >
                        Editar
                      </Button>

                      {servicio.estado ? (
                        <Button
                          className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-2 rounded-md w-full flex justify-center items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivate(servicio.id);
                          }}
                        >
                          Desactivar
                        </Button>
                      ) : (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-2 rounded-md w-full flex justify-center items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate(servicio.id);
                          }}
                        >
                          Activar
                        </Button>
                      )}
                    </div>

                    {/* Botón de eliminación permanente */}
                    <div className="mt-2 w-full">
                      <Button
                        className="bg-red-700 hover:bg-red-800 text-white text-xs px-2 py-2 rounded-md w-full flex justify-center items-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(servicio.id);
                        }}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
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

                  <div className="grid grid-cols-2 gap-3 w-full mt-2">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                      onClick={() => handleShowEditForm(selectedServicio)}
                    >
                      Editar Servicio
                    </Button>

                    {selectedServicio.estado ? (
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md"
                        onClick={() => handleDeactivate(selectedServicio.id)}
                      >
                        Desactivar
                      </Button>
                    ) : (
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                        onClick={() => handleActivate(selectedServicio.id)}
                      >
                        Activar
                      </Button>
                    )}

                    <Button
                      className="col-span-2 bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md mt-2"
                      onClick={() => handleDelete(selectedServicio.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
