import axios from "axios";

// API URLs para todos los endpoints de usuarios
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
console.log("API_BASE_URL configurada:", API_BASE_URL);

const API_URLS = {
  users: `${API_BASE_URL}/users/`,
  clients: `${API_BASE_URL}/clients/`,
  u_admin: `${API_BASE_URL}/u_admin/`,
  employee: `${API_BASE_URL}/employee/`,
};

console.log("API_URLS configuradas:", API_URLS);

// Tipos de roles disponibles
export const USER_ROLES = {
  cliente: "clients",
  administrador: "u_admin",
  empleado: "employee",
};

// Configurar header de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  console.log("getAuthHeaders - token encontrado:", token);
  const headers = token ? { Authorization: `Token ${token}` } : {};
  console.log("getAuthHeaders - headers generados:", headers);
  return headers;
};

// === FUNCIONES PRINCIPALES (SOLO USERS ENDPOINT) ===

// Obtener todos los usuarios de todos los endpoints
export const GetAllUsersFromAllEndpoints = async () => {
  try {
    const headers = getAuthHeaders();
    console.log("GetAllUsersFromAllEndpoints - iniciando peticiones con headers:", headers);

    const [usersResponse, clientsResponse, adminsResponse, employeesResponse] =
      await Promise.all([
        axios.get(API_URLS.users, { headers }).then(res => {
          console.log("Respuesta de users:", res.data);
          return res;
        }).catch(err => {
          console.error("Error en users endpoint:", err.response?.data || err.message);
          throw err;
        }),
        axios.get(API_URLS.clients, { headers }).then(res => {
          console.log("Respuesta de clients:", res.data);
          return res;
        }).catch(err => {
          console.error("Error en clients endpoint:", err.response?.data || err.message);
          throw err;
        }),
        axios.get(API_URLS.u_admin, { headers }).then(res => {
          console.log("Respuesta de u_admin:", res.data);
          return res;
        }).catch(err => {
          console.error("Error en u_admin endpoint:", err.response?.data || err.message);
          throw err;
        }),
        axios.get(API_URLS.employee, { headers }).then(res => {
          console.log("Respuesta de employee:", res.data);
          return res;
        }).catch(err => {
          console.error("Error en employee endpoint:", err.response?.data || err.message);
          throw err;
        }),
      ]);

    // Mapear datos de usuarios principales con validación
    const usersData = Array.isArray(usersResponse.data.results) ? usersResponse.data.results.map((user) => ({
      ...user,
      nombre: user.first_name || '',
      apellido: user.last_name || '',
      telefono: user.phone_number || '',
      rol: user.rol || "cliente",
    })) : [];

    // Mapear datos de clientes con validación
    const clientsData = Array.isArray(clientsResponse.data.results) ? clientsResponse.data.results.map((client) => ({
      id: client.user?.id || client.ID_Usuario, // Fallback al ID de la relación
      cc: client.user?.cc || '',
      nombre: client.user?.first_name || '',
      apellido: client.user?.last_name || '',
      email: client.user?.email || '',
      telefono: client.user?.phone_number || '',
      rol: "cliente",
      is_active: client.user?.is_active ?? true,
      prioritario: client.prioritario || false,
      // Mantener también el ID de la relación para referencia
      relationId: client.ID_Usuario,
    })).filter(client => client.id) : []; // Filtrar clientes sin ID válido

    // Mapear datos de administradores con validación
    const adminsData = Array.isArray(adminsResponse.data.results) ? adminsResponse.data.results.map((admin) => ({
      id: admin.user?.id || admin.ID_Usuario, // Fallback al ID de la relación
      cc: admin.user?.cc || '',
      nombre: admin.user?.first_name || '',
      apellido: admin.user?.last_name || '',
      email: admin.user?.email || '',
      telefono: admin.user?.phone_number || '',
      rol: "administrador",
      is_active: admin.user?.is_active ?? true,
      // Mantener también el ID de la relación para referencia
      relationId: admin.ID_Usuario,
    })).filter(admin => admin.id) : []; // Filtrar admins sin ID válido

    // Mapear datos de empleados con validación
    const employeesData = Array.isArray(employeesResponse.data.results) ? employeesResponse.data.results.map((employee) => ({
      id: employee.user?.id || employee.ID_Usuario, // Fallback al ID de la relación
      cc: employee.user?.cc || '',
      nombre: employee.user?.first_name || '',
      apellido: employee.user?.last_name || '',
      email: employee.user?.email || '',
      telefono: employee.user?.phone_number || '',
      rol: "empleado",
      is_active: employee.user?.is_active ?? true,
      fecha_contratacion: employee.Fecha_contratacion || '',
      // Mantener también el ID de la relación para referencia
      relationId: employee.ID_Usuario,
    })).filter(employee => employee.id) : []; // Filtrar empleados sin ID válido

    const resultado = {
      users: usersData,
      clients: clientsData,
      u_admin: adminsData,
      employee: employeesData,
    };

    console.log("Datos finales mapeados:", resultado);
    console.log("Conteo de usuarios:", {
      users: usersData.length,
      clients: clientsData.length,
      u_admin: adminsData.length,
      employee: employeesData.length
    });

    return resultado;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    
    // Proporcionar información más específica del error
    if (error.response) {
      if (error.response.status === 401) {
        throw new Error("Token de autenticación inválido. Por favor, inicia sesión nuevamente.");
      } else if (error.response.status === 403) {
        throw new Error("No tienes permisos para acceder a esta información.");
      } else if (error.response.status === 404) {
        throw new Error("Endpoint no encontrado. Verifica la configuración del servidor.");
      } else {
        throw new Error(`Error del servidor: ${error.response.status} - ${error.response.data?.detail || error.message}`);
      }
    } else if (error.request) {
      throw new Error("No se pudo conectar con el servidor. Verifica tu conexión a internet.");
    } else {
      throw new Error("Error inesperado: " + error.message);
    }
  }
};

// Crear usuario SOLO en el endpoint de USERS (unificado)
export const CreateUserByRole = async (userData) => {
  try {
    const headers = getAuthHeaders();

    // Validar campos requeridos
    if (
      !userData.cc ||
      !userData.nombre ||
      !userData.apellido ||
      !userData.email ||
      !userData.telefono ||
      !userData.password
    ) {
      throw new Error("Todos los campos son requeridos");
    }

    // Validar fecha de contratación para empleados
    if (userData.rol === "empleado" && !userData.Fecha_contratacion) {
      throw new Error("La fecha de contratación es requerida para empleados");
    }

    // Validar formato de teléfono (debe empezar con 3 o 6 y tener 10 dígitos)
    const phoneRegex = /^[36]\d{9}$/;
    if (!phoneRegex.test(userData.telefono)) {
      throw new Error("El teléfono debe empezar con 3 o 6 y tener 10 dígitos");
    }

    // Validar formato de cédula (6-10 dígitos)
    const ccNumber = parseInt(userData.cc);
    if (isNaN(ccNumber) || ccNumber < 100000 || ccNumber > 9999999999) {
      throw new Error("La cédula debe tener entre 6 y 10 dígitos");
    }

    // Mapear campos para el backend
    const backendData = {
      cc: ccNumber,
      first_name: userData.nombre,
      last_name: userData.apellido,
      email: userData.email,
      phone_number: userData.telefono,
      password: userData.password,
      is_active: userData.is_active !== undefined ? userData.is_active : true,
      dob: "1990-01-01T00:00:00Z", // Fecha por defecto en formato ISO
    };

    // Solo incluir rol si se especifica
    if (userData.rol && userData.rol.trim() !== "") {
      backendData.rol = userData.rol;

      // Incluir fecha de contratación para empleados
      if (userData.rol === "empleado" && userData.Fecha_contratacion) {
        backendData.Fecha_contratacion = userData.Fecha_contratacion;
      }

      // Incluir prioridad para clientes
      if (userData.rol === "cliente") {
        backendData.prioritario = userData.prioritario || false;
      }
    }

    console.log("Datos que se envían al backend:", backendData);

    const response = await axios.post(API_URLS.users, backendData, { headers });
    return response.data;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    console.error("Response data:", error.response?.data);
    console.error("Response status:", error.response?.status);
    throw error;
  }
};

// Actualizar usuario y manejar cambio de rol
export const UpdateUserWithRoleChange = async (userId, userData) => {
  try {
    const headers = getAuthHeaders();

    // Mapear campos para el backend
    const backendData = {
      first_name: userData.nombre,
      last_name: userData.apellido,
      email: userData.email,
      phone_number: userData.telefono,
      rol: userData.rol,
      is_active: userData.is_active,
      replace_role_table: true, // Indicar al backend que debe reemplazar el rol (eliminar de tabla anterior)
    };

    // Solo incluir contraseña si se proporciona
    if (userData.password && userData.password.trim()) {
      backendData.password = userData.password;
    }

    // Incluir fecha de contratación para empleados
    if (userData.rol === "empleado" && userData.Fecha_contratacion) {
      backendData.Fecha_contratacion = userData.Fecha_contratacion;
    }

    // Incluir prioridad para clientes
    if (userData.rol === "cliente") {
      backendData.prioritario = userData.prioritario || false;
    }

    console.log("Actualizando usuario con datos:", backendData);

    // Actualizar directamente en el endpoint de users
    const response = await axios.put(
      `${API_URLS.users}${userId}/`,
      backendData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

// Actualizar usuario manteniendo múltiples roles (comportamiento anterior)
export const UpdateUserKeepingMultipleRoles = async (userId, userData) => {
  try {
    const headers = getAuthHeaders();

    // Mapear campos para el backend
    const backendData = {
      first_name: userData.nombre,
      last_name: userData.apellido,
      email: userData.email,
      phone_number: userData.telefono,
      rol: userData.rol,
      is_staff: userData.rol === "administrador",
      is_active: userData.is_active,
      add_to_role_table: true, // Indicar al backend que debe agregar a la tabla específica sin eliminar
    };

    // Solo incluir contraseña si se proporciona
    if (userData.password && userData.password.trim()) {
      backendData.password = userData.password;
    }

    // Incluir fecha de contratación para empleados
    if (userData.rol === "empleado" && userData.Fecha_contratacion) {
      backendData.Fecha_contratacion = userData.Fecha_contratacion;
    }

    console.log(
      "Actualizando usuario manteniendo múltiples roles:",
      backendData
    );

    // Actualizar directamente en el endpoint de users
    const response = await axios.put(
      `${API_URLS.users}${userId}/`,
      backendData,
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    console.error("Response data:", error.response?.data);
    throw error;
  }
};

// Eliminar usuario del endpoint de USERS
export const DeleteUserFromEndpoint = async (userId) => {
  try {
    const headers = getAuthHeaders();

    // Siempre eliminar desde el endpoint de users
    const response = await axios.delete(`${API_URLS.users}${userId}/`, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

// Actualizar prioridad de cliente
export const UpdateClientPriority = async (clientId, prioritario) => {
  try {
    const headers = getAuthHeaders();
    const response = await axios.patch(
      `${API_URLS.clients}${clientId}/`,
      {
        prioritario: prioritario,
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar prioridad del cliente:", error);
    throw error;
  }
};

// === FUNCIONES HEREDADAS PARA COMPATIBILIDAD ===
export const GetAllUsers = () => {
  return axios.get(API_URLS.users, { headers: getAuthHeaders() });
};

export const CreateUser = (user) => {
  return axios.post(API_URLS.users, user, { headers: getAuthHeaders() });
};

export const UpdateUser = (id, user) => {
  return axios.put(`${API_URLS.users}${id}/`, user, {
    headers: getAuthHeaders(),
  });
};

export const DeleteUser = (id) => {
  return axios.delete(`${API_URLS.users}${id}/`, { headers: getAuthHeaders() });
};

export const GetAllClients = () => {
  return axios.get(API_URLS.clients, { headers: getAuthHeaders() });
};

export const GetAllAdmins = () => {
  return axios.get(API_URLS.u_admin, { headers: getAuthHeaders() });
};

export const GetAllEmployees = () => {
  return axios.get(API_URLS.employee, { headers: getAuthHeaders() });
};
