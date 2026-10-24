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

// APIs para cajeros
export const getMiCajaInfo = async () => {
  try {
    const response = await apiClient.get("/turnos/mi_caja_info/");
    console.log("Respuesta de mi_caja_info:", response.data);
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error al obtener información de caja:", error);
    throw error;
  }
};

export const atenderSiguienteTurno = async () => {
  try {
    const response = await apiClient.post("/turnos/atender_siguiente_turno/");
    return response.data;
  } catch (error) {
    console.error("Error al atender siguiente turno:", error);
    throw error;
  }
};

export const finalizarTurno = async (productos = [], total = 0) => {
  try {
    const response = await apiClient.post("/turnos/finalizar_turno/", {
      productos,
      total,
    });
    return response.data;
  } catch (error) {
    console.error("Error al finalizar turno:", error);
    throw error;
  }
};

export const cancelarTurnoActual = async (motivo = "Cancelado por cajero") => {
  try {
    const response = await apiClient.post("/turnos/cancelar_turno_actual/", {
      motivo,
    });
    return response.data;
  } catch (error) {
    console.error("Error al cancelar turno:", error);
    throw error;
  }
};

export const toggleCajaEstado = async () => {
  try {
    const response = await apiClient.post("/turnos/toggle_caja_estado/");
    return response.data;
  } catch (error) {
    console.error("Error al cambiar estado de caja:", error);
    throw error;
  }
};

// API para obtener productos desde el backend
export const getProductos = async () => {
  console.log("🔍 Iniciando getProductos...");
  
  try {
    const response = await apiClient.get("/producto/");
    console.log("✅ Respuesta completa getProductos:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en getProductos:", error);
    throw error;
  }
};
