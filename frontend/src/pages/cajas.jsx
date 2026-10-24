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
import { PageShell } from "../components/PageState";
import { useConfirm } from "../components/ConfirmProvider";
import { notify } from "../utils/notify";
import AdminPageLayout from "../components/AdminPageLayout";
import { IconAdminCajas } from "../components/AdminModuleIcons";
import ActionIconButton from "../components/ActionIconButton";
import Tooltip from "../components/Tooltip";

export default function CajasView() {
  const confirm = useConfirm();
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
    if (rol === "administrador" && token) {
      fetchCajas();
      fetchUsuarios();
      fetchTodosLosEmpleados();
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
      const usuarios = await GetUsuariosDisponibles();
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
      const empleados = await GetTodosLosEmpleados();
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
        notify.error("El nombre de la caja es requerido");
        return;
      }

      // Manejar ID_Usuario correctamente
      if (formData.ID_Usuario === "" || formData.ID_Usuario === null) {
        dataToSend.ID_Usuario = null;
      } else {
        // Convertir a entero para asegurar el tipo correcto
        dataToSend.ID_Usuario = parseInt(formData.ID_Usuario);
      }

      if (editingId) {
        await UpdateCaja(editingId, dataToSend);
      } else {
        await CreateCaja(dataToSend);
      }
      // Recargar datos
      fetchCajas();
      fetchUsuarios();
      fetchTodosLosEmpleados();
      // Cerrar formulario
      setShowForm(false);
      setEditingId(null);
      notify.success("Caja guardada con éxito");
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

      notify.error(errorMessage);
    }
  };

  // Eliminar caja
  const handleDelete = async (id) => {
    const ok = await confirm({
      title: "Eliminar caja",
      message: "¿Confirma que desea eliminar esta caja? Esta acción no se puede deshacer.",
      confirmLabel: "Eliminar",
      destructive: true,
    });
    if (!ok) return;
    try {
      await DeleteCaja(id);
      fetchCajas();
      fetchUsuarios();
      fetchTodosLosEmpleados();
      notify.success("Caja eliminada con éxito");
    } catch (error) {
      console.error("Error al eliminar caja:", error);
      notify.error("Error al eliminar la caja");
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
      notify.error("Error al cambiar el estado de la caja");
    }
  };

  return (
    <PageShell loading={loading} loadingMessage="Cargando cajas...">
    <AdminPageLayout
      title="Gestión de cajas"
      subtitle="Asignación de cajeros y estado de mostrador"
      action={
        <Tooltip label="Registrar una nueva caja">
          <button type="button" onClick={handleShowCreateForm} className="btn-primary min-h-[2.75rem] px-4 py-2.5 text-sm">
            Nueva caja
          </button>
        </Tooltip>
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="flex-1">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {cajas.length > 0 ? (
              cajas.map((caja) => (
                <article
                  key={caja.id}
                  className={`rounded-xl border p-4 transition hover:shadow-md ${
                    caja.Estado ? "border-emerald-100 bg-white" : "border-gray-200 bg-gray-50 opacity-90"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                      <IconAdminCajas className="h-7 w-7" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h2 className="text-lg font-semibold text-[var(--color-text)]">
                          {caja.nombre || `Caja ${caja.id}`}
                        </h2>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            caja.Estado ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {caja.Estado ? "Activa" : "Inactiva"}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                        Cajero:{" "}
                        {caja.usuario
                          ? `${caja.usuario.first_name} ${caja.usuario.last_name}`
                          : "Sin asignar"}
                      </p>
                      <div className="mt-3 flex justify-end gap-1.5 border-t border-gray-100 pt-3">
                        <ActionIconButton
                          variant="edit"
                          label="Editar caja"
                          onClick={() => handleShowEditForm(caja)}
                        />
                        {caja.Estado ? (
                          <ActionIconButton
                            variant="deactivate"
                            label="Desactivar caja"
                            onClick={() => handleToggleEstado(caja.id, caja.Estado)}
                          />
                        ) : (
                          <ActionIconButton
                            variant="activate"
                            label="Activar caja"
                            onClick={() => handleToggleEstado(caja.id, caja.Estado)}
                          />
                        )}
                        <ActionIconButton
                          variant="delete"
                          label="Eliminar caja"
                          onClick={() => handleDelete(caja.id)}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="col-span-2 py-8 text-center text-[var(--color-text-muted)]">
                No hay cajas registradas. Crea la primera con el botón superior.
              </p>
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
                  {(editingId ? todosLosEmpleados : usuariosDisponibles).map(
                    (empleado) => {
                      const user = empleado.user || empleado;
                      const id = empleado.ID_Usuario ?? user.id ?? empleado.id;
                      return (
                        <option key={id} value={id}>
                          {user.first_name} {user.last_name} (CC: {user.cc})
                        </option>
                      );
                    },
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
    </AdminPageLayout>
    </PageShell>
  );
}
