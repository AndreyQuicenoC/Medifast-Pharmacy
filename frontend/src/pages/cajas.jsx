import { useState, useEffect } from "react";
import {
  GetAllCajas,
  GetUsuariosDisponibles,
  GetTodosLosEmpleados,
  CreateCaja,
  UpdateCaja,
  DeleteCaja,
  ActivarCaja,
  DesactivarCaja,
} from "../api/caja.api";

export default function CajasView() {
  // Estados
  const [cajas, setCajas] = useState([]);
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  const [todosLosEmpleados, setTodosLosEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ID_Usuario: "",
    Estado: true,
  });

  // Verificar permisos - solo administradores pueden gestionar cajas
  const rol = localStorage.getItem("rol");
  const token = localStorage.getItem("authToken");

  // Cargar datos al iniciar
  useEffect(() => {
    console.log("Rol del usuario:", rol);
    console.log("Token disponible:", !!token);
    console.log("Token value:", token);

    if (rol === "administrador" && token) {
      fetchCajas();
      fetchUsuarios();
      fetchTodosLosEmpleados();
    } else {
      console.log("No se cargan datos - rol o token inválido");
    }
  }, [rol, token]);

  if (rol !== "administrador") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">
          No tienes permiso para acceder a esta sección. Solo administradores
          pueden gestionar cajas.
        </p>
      </div>
    );
  }

  // Obtener cajas
  const fetchCajas = async () => {
    try {
      const cajas = await GetAllCajas();
      console.log("Datos de cajas recibidos:", cajas);
      
      // Verificar que tenemos un array
      if (!Array.isArray(cajas)) {
        console.error("Los datos de cajas recibidos no son un array:", cajas);
        return;
      }
      
      setCajas(cajas);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar cajas:", error);
      setLoading(false);
    }
  };

  // Obtener usuarios disponibles (solo empleados no asignados)
  const fetchUsuarios = async () => {
    try {
      console.log("Obteniendo usuarios disponibles...");
      console.log("Token en localStorage:", localStorage.getItem("authToken"));
      const usuarios = await GetUsuariosDisponibles();
      console.log("Usuarios disponibles obtenidos:", usuarios);
      
      // Verificar que tenemos un array
      if (!Array.isArray(usuarios)) {
        console.error("Los datos de usuarios recibidos no son un array:", usuarios);
        return;
      }
      
      setUsuariosDisponibles(usuarios);
    } catch (error) {
      console.error("Error al cargar usuarios disponibles:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }
  };

  // Obtener todos los empleados (para el formulario de edición)
  const fetchTodosLosEmpleados = async () => {
    try {
      console.log("Obteniendo todos los empleados...");
      const empleados = await GetTodosLosEmpleados();
      console.log("Todos los empleados obtenidos:", empleados);
      
      // Verificar que tenemos un array
      if (!Array.isArray(empleados)) {
        console.error("Los datos de empleados recibidos no son un array:", empleados);
        return;
      }
      
      setTodosLosEmpleados(empleados);
    } catch (error) {
      console.error("Error al cargar todos los empleados:", error);
      console.error("Response status:", error.response?.status);
      console.error("Response data:", error.response?.data);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let finalValue;
    if (type === "checkbox") {
      finalValue = checked;
    } else if (name === "ID_Usuario") {
      // Para ID_Usuario, mantener como string para el formulario
      finalValue = value;
    } else {
      finalValue = value;
    }

    console.log(`Campo ${name} cambió a:`, finalValue); // Para debug

    setFormData({
      ...formData,
      [name]: finalValue,
    });
  };

  // Mostrar formulario para crear
  const handleShowCreateForm = () => {
    setEditingId(null);
    setFormData({
      nombre: "",
      ID_Usuario: "",
      Estado: true,
    });
    setShowForm(true);
  };

  // Mostrar formulario para editar
  const handleShowEditForm = (caja) => {
    console.log("Editando caja:", caja); // Para debug
    setEditingId(caja.id);
    setFormData({
      nombre: caja.nombre || "",
      ID_Usuario: caja.ID_Usuario ? caja.ID_Usuario.toString() : "",
      Estado: caja.Estado,
    });
    setShowForm(true);
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  // Guardar caja (crear o actualizar)
  const handleSave = async () => {
    try {
      const dataToSend = {
        nombre: formData.nombre.trim(),
        Estado: formData.Estado,
      };

      // Validar que el nombre no esté vacío
      if (!dataToSend.nombre) {
        alert("El nombre de la caja es requerido");
        return;
      }

      // Manejar ID_Usuario correctamente
      if (formData.ID_Usuario === "" || formData.ID_Usuario === null) {
        dataToSend.ID_Usuario = null;
      } else {
        // Convertir a entero para asegurar el tipo correcto
        dataToSend.ID_Usuario = parseInt(formData.ID_Usuario);
      }

      console.log("Datos a enviar:", dataToSend); // Para debug
      console.log("Tipo de ID_Usuario:", typeof dataToSend.ID_Usuario); // Para debug

      if (editingId) {
        // Actualizar caja existente
        console.log("Actualizando caja ID:", editingId);
        const response = await UpdateCaja(editingId, dataToSend);
        console.log("Respuesta del servidor:", response.data);
      } else {
        // Crear nueva caja
        console.log("Creando nueva caja");
        const response = await CreateCaja(dataToSend);
        console.log("Respuesta del servidor:", response.data);
      }
      // Recargar datos
      fetchCajas();
      fetchUsuarios();
      fetchTodosLosEmpleados();
      // Cerrar formulario
      setShowForm(false);
      setEditingId(null);
      alert("Caja guardada con éxito");
    } catch (error) {
      console.error("Error al guardar caja:", error);
      console.error("Response status:", error.response?.status); // Para debug
      console.error("Response data:", error.response?.data); // Para debug

      let errorMessage = "Error al guardar la caja";
      if (error.response?.data) {
        if (error.response.data.nombre) {
          errorMessage = `Error en nombre: ${error.response.data.nombre.join(
            ", "
          )}`;
        } else if (error.response.data.ID_Usuario) {
          errorMessage = `Error en usuario: ${error.response.data.ID_Usuario.join(
            ", "
          )}`;
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (typeof error.response.data === "object") {
          errorMessage = JSON.stringify(error.response.data);
        }
      }

      alert(errorMessage);
    }
  };

  // Eliminar caja
  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro que desea eliminar esta caja?")) {
      try {
        await DeleteCaja(id);
        fetchCajas();
        fetchUsuarios();
        fetchTodosLosEmpleados();
        alert("Caja eliminada con éxito");
      } catch (error) {
        console.error("Error al eliminar caja:", error);
        alert("Error al eliminar la caja");
      }
    }
  };

  // Activar/Desactivar caja
  const handleToggleEstado = async (id, estadoActual) => {
    try {
      if (estadoActual) {
        await DesactivarCaja(id);
      } else {
        await ActivarCaja(id);
      }
      fetchCajas();
    } catch (error) {
      console.error("Error al cambiar estado de caja:", error);
      alert("Error al cambiar el estado de la caja");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Cargando cajas...</p>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Contenedor principal con diseño responsive de 2 columnas */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Columna izquierda - Lista de cajas */}
        <div className="flex-1 bg-white rounded-xl shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Gestión de Cajas</h1>
            <button
              onClick={handleShowCreateForm}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Nueva Caja
            </button>
          </div>

          {/* Lista de cajas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {cajas.length > 0 ? (
              cajas.map((caja) => (
                <div
                  key={caja.id}
                  className={`flex items-center border rounded-lg p-4 shadow hover:shadow-md transition ${
                    !caja.Estado ? "bg-gray-100" : "bg-white"
                  }`}
                >
                  {/* Ícono de usuario */}
                  <div className="w-1/4 flex justify-center items-center">
                    <div className="border rounded-full h-16 w-16 flex justify-center items-center text-2xl">
                      👤
                    </div>
                  </div>

                  {/* Info de la caja */}
                  <div className="flex-1 ml-4 w-80">
                    <div className="flex justify-between items-center mb-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg inline-block w-3/4">
                        Caja {caja.nombre || caja.id}
                      </button>
                      <span
                        className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          caja.Estado
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {caja.Estado ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                    {/* Nombre del usuario */}
                    <div className="font-semibold">Cajero:</div>
                    <div className="mb-3">
                      {caja.usuario
                        ? `${caja.usuario.first_name} ${caja.usuario.last_name}`
                        : "Sin asignar"}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShowEditForm(caja)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm flex-1"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleToggleEstado(caja.id, caja.Estado)}
                        className={`${
                          caja.Estado
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white px-3 py-1 rounded text-sm flex-1`}
                      >
                        {caja.Estado ? "Desactivar" : "Activar"}
                      </button>
                      <button
                        onClick={() => handleDelete(caja.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex-1"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No hay cajas disponibles. ¡Agrega una nueva caja!
              </div>
            )}
          </div>
        </div>

        {/* Columna derecha - Formulario de creación/edición */}
        {showForm && (
          <div className="lg:w-2/5 xl:w-1/3 bg-white rounded-xl shadow p-5 h-fit">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">
              {editingId ? "Editar Caja" : "Nueva Caja"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Nombre de la Caja *
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: A, B, C o 1, 2, 3"
                  className="border rounded px-3 py-2 w-full"
                  required
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Asignar Empleado (Cajero)
                </label>
                <select
                  name="ID_Usuario"
                  value={formData.ID_Usuario}
                  onChange={handleChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  <option value="">-- Sin asignar --</option>
                  {/* Mostrar empleados disponibles para crear, todos los empleados para editar */}
                  {/* DEBUG: Información de empleados */}
                  {console.log("=== DROPDOWN DEBUG ===")}
                  {console.log("EditingId:", editingId)}
                  {console.log(
                    "UsuariosDisponibles length:",
                    usuariosDisponibles.length
                  )}
                  {console.log(
                    "UsuariosDisponibles data:",
                    usuariosDisponibles
                  )}
                  {console.log(
                    "TodosLosEmpleados length:",
                    todosLosEmpleados.length
                  )}
                  {console.log("TodosLosEmpleados data:", todosLosEmpleados)}
                  {console.log(
                    "Array a usar:",
                    editingId ? todosLosEmpleados : usuariosDisponibles
                  )}
                  {(editingId ? todosLosEmpleados : usuariosDisponibles).map(
                    (empleado) => (
                      <option key={empleado.id} value={empleado.id}>
                        {empleado.first_name} {empleado.last_name} (CC:{" "}
                        {empleado.cc})
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="Estado"
                  checked={formData.Estado}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm">Caja Activa</label>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-4">
                <button
                  type="button"
                  onClick={handleSave}
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
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
