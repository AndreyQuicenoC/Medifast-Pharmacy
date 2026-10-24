import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Configurar axios con el token de autenticación
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a todas las requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API de servicios
export const getServicios = async () => {
  console.log("🔍 Iniciando getServicios...");
  
  try {
    const response = await apiClient.get("/servicios/");
    console.log("✅ Respuesta completa getServicios:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en getServicios:", error);
    throw error;
  }
};

// API de turnos
export const crearTurno = async (servicioId, cedulaCliente) => {
  try {
    const response = await apiClient.post("/turnos/crear_turno/", {
      servicio_id: servicioId,
      cedula_cliente: cedulaCliente,
    });
    return response.data;
  } catch (error) {
    console.error("Error al crear turno:", error);
    throw error;
  }
};

export const getTurnoActivoCliente = async (cedula) => {
  try {
    const response = await apiClient.get(
      `/turnos/turno_activo_cliente/?cedula=${cedula}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener turno activo:", error);
    throw error;
  }
};

export const getColaTurnos = async () => {
  console.log("🔍 Iniciando getColaTurnos...");
  
  try {
    const response = await apiClient.get("/turnos/cola_turnos/");
    console.log("✅ Respuesta completa getColaTurnos:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en getColaTurnos:", error);
    throw error;
  }
};

export const getTurnoActualCaja = async (cajaId) => {
  console.log("🔍 Iniciando getTurnoActualCaja...");
  
  try {
    const response = await apiClient.get(
      `/turnos/turno_actual_caja/?caja_id=${cajaId}`
    );
    console.log("✅ Respuesta completa getTurnoActualCaja:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array o datos
  } catch (error) {
    console.error("❌ Error en getTurnoActualCaja:", error);
    throw error;
  }
};

export const getEstadoCajas = async () => {
  console.log("🔍 Iniciando getEstadoCajas...");
  
  try {
    const response = await apiClient.get("/turnos/estado_cajas/");
    console.log("✅ Respuesta completa getEstadoCajas:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array o datos
  } catch (error) {
    console.error("❌ Error en getEstadoCajas:", error);
    throw error;
  }
};

export const getTurnoActualGlobal = async () => {
  try {
    const response = await apiClient.get("/turnos/turno_actual_global/");
    return response.data;
  } catch (error) {
    console.error("Error al obtener turno actual global:", error);
    throw error;
  }
};

export const cancelarTurno = async (turnoId) => {
  try {
    const response = await apiClient.post(`/turnos/${turnoId}/cancelar_turno/`);
    return response.data;
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    throw error;
  }
};

// API para obtener información del cliente
export const getInfoCliente = async (cedula) => {
  try {
    const response = await apiClient.get(`/clients/?cc=${cedula}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener información del cliente:", error);
    throw error;
  }
};
