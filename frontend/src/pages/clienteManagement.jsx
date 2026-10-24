import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Importar funciones de la API
import {
  GetAllUsersFromAllEndpoints,
  CreateUserByRole,
  UpdateUserWithRoleChange,
  UpdateUserKeepingMultipleRoles,
  DeleteUserFromEndpoint,
  UpdateClientPriority,
} from "../api/user.api";

export default function ClienteManagement() {
  const navigate = useNavigate();

  // Estados principales
  const [users, setUsers] = useState({
    users: [],
    clients: [],
    u_admin: [],
    employee: [],
  });

  // Estado para manejar el filtro de rol seleccionado
  const [currentRole, setCurrentRole] = useState("todos");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para la búsqueda

  // Estado del formulario
  const [formData, setFormData] = useState({
    cc: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    password: "",
    rol: "cliente",
    is_active: true,
    prioritario: false,
    Fecha_contratacion: "",
  });

  // Verificar autenticación al cargar
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      navigate("/login");
      return;
    }

    loadAllUsers();
  }, [navigate]);

  // Cargar usuarios de todos los endpoints
  const loadAllUsers = async () => {
    try {
      setLoading(true);
      console.log("Iniciando carga de usuarios...");
      const data = await GetAllUsersFromAllEndpoints();
      console.log("Datos recibidos del backend:", data);
      setUsers(data);
      setError(null);
      console.log("Estado de users actualizado:", data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Validar email en tiempo real (solo cuando se está escribiendo en el campo email)
    if (name === "email" && value.trim()) {
      const emailValidation = validateEmailUnique(value, editingId);
      if (!emailValidation.isValid) {
        setError(emailValidation.message);
      } else {
        // Limpiar error solo si era un error de email duplicado
        if (error && error.includes("email ya está registrado")) {
          setError(null);
        }
      }
    }
  };

  // Validar que el email no esté duplicado
  const validateEmailUnique = (email, excludeUserId = null) => {
    // Verificar en todos los endpoints
    for (const endpointKey of Object.keys(users)) {
      const usersInEndpoint = users[endpointKey] || [];
      const duplicateUser = usersInEndpoint.find(
        (user) =>
          user.email &&
          user.email.toLowerCase() === email.toLowerCase() &&
          user.id !== excludeUserId
      );

      if (duplicateUser) {
        return {
          isValid: false,
          message: `El email ya está registrado por otro usuario (${duplicateUser.nombre} ${duplicateUser.apellido})`,
        };
      }
    }

    return { isValid: true, message: "" };
  };

  // Obtener usuarios filtrados por rol con filtro de búsqueda
  const getCurrentUsers = () => {
    console.log("getCurrentUsers - currentRole:", currentRole);
    console.log("getCurrentUsers - users object:", users);
    
    // Combinar todos los usuarios de todos los endpoints
    const allUsers = [
      ...users.users,
      ...users.clients,
      ...users.u_admin,
      ...users.employee,
    ].filter((user, index, self) => 
      // Eliminar duplicados basándose en el ID del usuario
      index === self.findIndex(u => u.id === user.id)
    );

    console.log("getCurrentUsers - allUsers combinados:", allUsers);

    // Filtrar por rol seleccionado
    let filteredUsers = allUsers;
    if (currentRole !== "todos") {
      filteredUsers = allUsers.filter(user => user.rol === currentRole);
    }

    console.log("getCurrentUsers - usuarios filtrados por rol:", filteredUsers);

    // Aplicar filtro de búsqueda si existe
    if (!searchTerm) {
      return filteredUsers;
    }

    // Filtrar usuarios por CC, nombre, apellido o email
    return filteredUsers.filter((user) => {
      const searchLower = searchTerm.toLowerCase();
      const cc = (user.cc || "").toString().toLowerCase();
      const nombre = (user.nombre || "").toLowerCase();
      const apellido = (user.apellido || "").toLowerCase();
      const email = (user.email || "").toLowerCase();

      return (
        cc.includes(searchLower) ||
        nombre.includes(searchLower) ||
        apellido.includes(searchLower) ||
        email.includes(searchLower)
      );
    });
  };

  // Mostrar formulario para crear (solo en "todos" o cuando hay usuarios)
  const handleShowCreateForm = () => {
    setFormData({
      cc: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      password: "",
      rol: currentRole === "todos" ? "cliente" : currentRole, // Asignar rol por defecto basado en el filtro actual
      is_active: true,
      prioritario: false,
      Fecha_contratacion: "",
    });
    setEditingId(null);
    setShowForm(true);
  };

  // Mostrar formulario para editar
  const handleShowEditForm = (user) => {
    // Asegurar que tenemos todos los datos del usuario para editar
    // Manejar diferentes formatos de datos según el endpoint
    const userData = {
      cc: user.cc || "",
      nombre: user.nombre || user.first_name || "",
      apellido: user.apellido || user.last_name || "",
      telefono: user.telefono || user.phone_number || "",
      email: user.email || "",
      password: "",
      rol: user.rol || "",
      is_active: user.is_active !== undefined ? user.is_active : true,
      prioritario: user.prioritario !== undefined ? user.prioritario : false,
      Fecha_contratacion:
        user.Fecha_contratacion || user.fecha_contratacion || "",
    };

    // Si estamos en un filtro específico y el rol está vacío, inferirlo
    if (!userData.rol) {
      if (currentRole === "cliente") userData.rol = "cliente";
      else if (currentRole === "administrador") userData.rol = "administrador";
      else if (currentRole === "empleado") userData.rol = "empleado";
    }

    // Ahora user.id debe ser siempre el ID del usuario base debido al mapeo corregido
    const userIdToEdit = user.id;

    setFormData(userData);
    setEditingId(userIdToEdit);
    setShowForm(true);

    // Debug para verificar que se está configurando correctamente
    console.log("=== EDITANDO USUARIO ===");
    console.log("Usuario original:", user);
    console.log("Datos mapeados para formulario:", userData);
    console.log("ID a editar (user.id):", userIdToEdit);
    console.log("Filtro actual:", currentRole);
    console.log("Estado editingId después del set:", userIdToEdit);
    console.log("===========================");
  };

  // Cancelar edición/creación
  const handleCancel = () => {
    console.log("Cancelando formulario - reseteando estados");
    setFormData({
      cc: "",
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
      password: "",
      rol: "cliente",
      is_active: true,
      prioritario: false,
      Fecha_contratacion: "",
    });
    setEditingId(null);
    setShowForm(false);
    setError(null); // Limpiar errores al cancelar
  };

  // Guardar usuario (crear o actualizar)
  const handleSave = async (e) => {
    e.preventDefault();

    // Validar email único
    const emailValidation = validateEmailUnique(formData.email, editingId);
    if (!emailValidation.isValid) {
      setError(emailValidation.message);
      return;
    }

    try {
      if (editingId) {
        // EDITAR: Para todos los usuarios usar función completa de actualización
        console.log("Actualizando usuario:", editingId);
        console.log("Datos a enviar:", formData);
        console.log("Filtro actual:", currentRole);

        // Determinar el endpoint correcto basado en el rol del usuario
        let targetEndpoint = "users"; // Por defecto
        if (formData.rol === "cliente") targetEndpoint = "clients";
        else if (formData.rol === "administrador") targetEndpoint = "u_admin";
        else if (formData.rol === "empleado") targetEndpoint = "employee";

        await UpdateUserWithRoleChange(editingId, formData, targetEndpoint);
      } else {
        // CREAR: Permitir crear desde cualquier vista
        console.log("Creando nuevo usuario:", formData);
        await CreateUserByRole(formData);
      }

      await loadAllUsers();
      handleCancel();
      setError(null); // Limpiar errores previos si todo salió bien
    } catch (err) {
      console.error("Error al guardar usuario:", err);

      // Manejar diferentes tipos de errores
      let errorMessage = "Error al guardar el usuario";

      if (err.response?.data) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === "object") {
          // Si hay errores específicos de campos
          const errorMessages = [];
          for (const [field, messages] of Object.entries(backendErrors)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(", ")}`);
            } else {
              errorMessages.push(`${field}: ${messages}`);
            }
          }
          errorMessage = errorMessages.join("\n");
        } else if (backendErrors.error) {
          errorMessage = backendErrors.error;
        } else if (backendErrors.detail) {
          errorMessage = backendErrors.detail;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  // Eliminar usuario
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      // Buscar el usuario para determinar su rol y endpoint correcto
      const allUsers = [
        ...users.users,
        ...users.clients,
        ...users.u_admin,
        ...users.employee,
      ];
      const userToDelete = allUsers.find(user => user.id === id);
      
      let targetEndpoint = "users"; // Por defecto
      if (userToDelete?.rol === "cliente") targetEndpoint = "clients";
      else if (userToDelete?.rol === "administrador") targetEndpoint = "u_admin";
      else if (userToDelete?.rol === "empleado") targetEndpoint = "employee";

      await DeleteUserFromEndpoint(id, targetEndpoint);
      await loadAllUsers();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError(
        "Error al eliminar el usuario: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  // Seleccionar usuario para ver detalles
  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  // Cambiar filtro de rol actual
  const handleRoleChange = (role) => {
    setCurrentRole(role);
    setSelectedUser(null);
    setShowForm(false);
    setSearchTerm(""); // Limpiar búsqueda al cambiar filtro
  };

  // Obtener título del filtro de rol
  const getRoleTitle = (role) => {
    const titles = {
      todos: "Todos los Usuarios",
      cliente: "Clientes", 
      administrador: "Administradores",
      empleado: "Empleados",
    };
    return titles[role] || role;
  };

  // Obtener conteo de usuarios por rol
  const getUserCountByRole = (role) => {
    if (role === "todos") {
      const allUsers = [
        ...users.users,
        ...users.clients,
        ...users.u_admin,
        ...users.employee,
      ].filter((user, index, self) => 
        index === self.findIndex(u => u.id === user.id)
      );
      return allUsers.length;
    }
    
    const allUsers = [
      ...users.users,
      ...users.clients,
      ...users.u_admin,
      ...users.employee,
    ].filter((user, index, self) => 
      index === self.findIndex(u => u.id === user.id)
    );
    
    return allUsers.filter(user => user.rol === role).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 mr-6 ml-6 rounded-xl">
      {/* Header */}
      <div className="bg-white shadow-sm  px-4 sm:px-6 py-4 rounded-t-xl">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          Gestión de Usuarios
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Administra usuarios desde un solo lugar
        </p>
      </div>

      {/* Menu Bar */}
      <div className="bg-white shadow-sm border-b px-4 sm:px-6 py-3">
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {["todos", "cliente", "administrador", "empleado"].map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
                currentRole === role
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="hidden sm:inline">
                {getRoleTitle(role)}
              </span>
              <span className="sm:hidden">
                {getRoleTitle(role).split(" ")[0]}
              </span>
              <span className="ml-1">({getUserCountByRole(role)})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mx-4 sm:mx-6 mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline text-sm">{error}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3 cursor-pointer"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
        {/* Left Panel - Lista de usuarios */}
        <div
          className="w-full lg:w-2/3 bg-white shadow-lg m-2 sm:m-4 rounded-lg overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-6 py-4 bg-gray-50 border-b gap-3 sm:gap-0 flex-shrink-0">
            <h2 className="text-lg font-semibold text-gray-800">
              {getRoleTitle(currentRole)}
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 w-full sm:w-auto">
              {/* Buscador */}
              <div className="relative flex-1 sm:flex-initial">
                <input
                  type="text"
                  placeholder="Buscar por CC, nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg
                      className="h-4 w-4 text-gray-400 hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>

              {/* Botón de acción */}
              <button
                onClick={handleShowCreateForm}
                className="px-3 sm:px-4 py-2 rounded-lg font-medium text-sm w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
              >
                Crear Usuario
              </button>
            </div>
          </div>

          <div
            className="flex-1 overflow-auto"
            style={{ maxHeight: "calc(100vh - 280px)", scrollbarWidth: "thin" }}
          >
            {/* Indicador de búsqueda */}
            {searchTerm && (
              <div className="px-4 py-2 bg-blue-50 border-b text-sm text-blue-700">
                {getCurrentUsers().length > 0
                  ? `Mostrando ${
                      getCurrentUsers().length
                    } resultado(s) para "${searchTerm}"`
                  : `No se encontraron resultados para "${searchTerm}"`}
              </div>
            )}

            {/* Mobile View - Cards */}
            <div className="block lg:hidden space-y-2 p-2">
              {getCurrentUsers().map((user) => (
                <div
                  key={user.id}
                  className={`p-4 border-b hover:bg-gray-50 cursor-pointer rounded-lg border ${
                    selectedUser?.id === user.id
                      ? "bg-blue-50 border-blue-200"
                      : "border-gray-200"
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {user.nombre} {user.apellido}
                      </h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-600">CC: {user.cc}</p>
                      {/* Información adicional específica para clientes */}
                      {currentRole === "cliente" &&
                        user.prioritario !== undefined && (
                          <p className="text-sm text-gray-600">
                            Prioritario: {user.prioritario ? "Sí" : "No"}
                          </p>
                        )}
                      {/* Información adicional específica para empleados */}
                      {currentRole === "empleado" &&
                        user.Fecha_contratacion && (
                          <p className="text-sm text-gray-600">
                            F. Contratación: {user.Fecha_contratacion}
                          </p>
                        )}
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.rol === "administrador"
                            ? "bg-purple-100 text-purple-800"
                            : user.rol === "empleado"
                            ? "bg-blue-100 text-blue-800"
                            : user.rol === "cliente"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.rol || "Sin rol"}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.is_active ? "Activo" : "Inactivo"}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShowEditForm(user);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(user.id);
                        }}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden lg:block overflow-x-auto overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      CC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Rol
                    </th>
                    {/* Columna adicional para clientes */}
                    {currentRole === "cliente" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        Prioritario
                      </th>
                    )}
                    {/* Columna adicional para empleados */}
                    {currentRole === "empleado" && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        F. Contratación
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getCurrentUsers().map((user) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 cursor-pointer ${
                        selectedUser?.id === user.id ? "bg-blue-50" : ""
                      }`}
                      onClick={() => handleSelectUser(user)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.cc}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.nombre} {user.apellido}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            user.rol === "administrador"
                              ? "bg-purple-100 text-purple-800"
                              : user.rol === "empleado"
                              ? "bg-blue-100 text-blue-800"
                              : user.rol === "cliente"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.rol || "Sin rol"}
                        </span>
                      </td>
                      {/* Celda adicional para clientes - Prioritario */}
                      {currentRole === "cliente" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                              user.prioritario
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.prioritario ? "Sí" : "No"}
                          </span>
                        </td>
                      )}
                      {/* Celda adicional para empleados - Fecha de Contratación */}
                      {currentRole === "empleado" && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.Fecha_contratacion ||
                            user.fecha_contratacion ||
                            "N/A"}
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            user.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowEditForm(user);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(user.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {getCurrentUsers().length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? `No se encontraron usuarios que coincidan con "${searchTerm}"`
                  : "No hay usuarios en esta sección"}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Detalles y formulario */}
        <div
          className="w-full lg:w-1/3 bg-white shadow-lg m-2 sm:m-4 lg:ml-0 rounded-lg overflow-hidden flex flex-col"
          style={{ maxHeight: "calc(100vh - 200px)" }}
        >
          {showForm ? (
            // Formulario de edición/creación
            <div className="h-full flex flex-col">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingId
                    ? `Editar Usuario (ID: ${editingId})`
                    : "Crear Usuario"}
                </h3>
                {/* Debug info */}
                <p className="text-xs text-gray-500 mt-1">
                  Modo: {editingId ? "EDITAR" : "CREAR"} | Filtro:{" "}
                  {currentRole} | User ID: {editingId || "N/A"}
                </p>
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-auto">
                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CC
                    </label>
                    <input
                      type="text"
                      name="cc"
                      value={formData.cc}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Entre 6 y 10 dígitos"
                      pattern="[0-9]{6,10}"
                      minLength={6}
                      maxLength={10}
                      required
                      disabled={editingId} // No permitir cambiar CC en edición
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="3XXXXXXXXX o 6XXXXXXXXX (10 dígitos)"
                      pattern="[36][0-9]{9}"
                      minLength={10}
                      maxLength={10}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contraseña
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={
                        editingId ? "Dejar vacío para mantener actual" : ""
                      }
                      required={!editingId}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <select
                      name="rol"
                      value={formData.rol}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Sin rol asignado</option>
                      <option value="cliente">Cliente</option>
                      <option value="empleado">Empleado</option>
                      <option value="administrador">Administrador</option>
                    </select>
                  </div>

                  {/* Campo de fecha de contratación solo para empleados */}
                  {(formData.rol === "empleado" ||
                    currentRole === "empleado") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Contratación
                      </label>
                      <input
                        type="date"
                        name="Fecha_contratacion"
                        value={formData.Fecha_contratacion}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={
                          formData.rol === "empleado" ||
                          currentRole === "empleado"
                        }
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">
                      Usuario Activo
                    </label>
                  </div>

                  {/* Campo de prioridad solo para clientes */}
                  {(formData.rol === "cliente" ||
                    currentRole === "cliente") && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="prioritario"
                        checked={formData.prioritario}
                        onChange={handleChange}
                        className="mr-2"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Cliente Prioritario
                      </label>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-2 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      {editingId ? "Actualizar" : "Crear"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : selectedUser ? (
            // Detalles del usuario seleccionado
            <div className="h-full flex flex-col">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 border-b">
                <h3 className="text-lg font-semibold text-gray-800">
                  Detalles del Usuario
                </h3>
              </div>

              <div className="flex-1 p-4 sm:p-6 overflow-auto">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CC
                    </label>
                    <p className="text-gray-900">{selectedUser.cc}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Nombre Completo
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.nombre} {selectedUser.apellido}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <p className="text-gray-900 break-words">
                      {selectedUser.email}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <p className="text-gray-900">
                      {selectedUser.telefono || "N/A"}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rol
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.rol === "administrador"
                          ? "bg-purple-100 text-purple-800"
                          : selectedUser.rol === "empleado"
                          ? "bg-blue-100 text-blue-800"
                          : selectedUser.rol === "cliente"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedUser.rol || "Sin rol"}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado
                    </label>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedUser.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedUser.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </div>

                  {selectedUser.prioritario !== undefined && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Prioritario
                      </label>
                      <p className="text-gray-900">
                        {selectedUser.prioritario ? "Sí" : "No"}
                      </p>
                    </div>
                  )}

                  {selectedUser.fecha_contratacion && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Fecha de Contratación
                      </label>
                      <p className="text-gray-900">
                        {selectedUser.fecha_contratacion}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleShowEditForm(selectedUser)}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(selectedUser.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Mensaje inicial
            <div className="h-full flex items-center justify-center text-gray-500 p-4">
              <div className="text-center">
                <p className="text-lg mb-2">Selecciona un usuario</p>
                <p className="text-sm">
                  Haz clic en un usuario de la lista para ver sus detalles
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
