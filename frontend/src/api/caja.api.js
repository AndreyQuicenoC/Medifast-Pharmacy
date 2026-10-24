import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL_CAJAS = `${API_BASE_URL}/caja/`;

// Configurar header de autorización
const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const GetAllCajas = async () => {
  console.log("🔍 Iniciando GetAllCajas...");
  
  try {
    const response = await axios.get(API_URL_CAJAS, { headers: getAuthHeaders() });
    console.log("✅ Respuesta completa GetAllCajas:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en GetAllCajas:", error);
    throw error;
  }
};

export const GetUsuariosDisponibles = async () => {
  console.log("🔍 Iniciando GetUsuariosDisponibles...");
  
  try {
    const response = await axios.get(`${API_URL_CAJAS}usuarios_disponibles/`, {
      headers: getAuthHeaders(),
    });
    console.log("✅ Respuesta completa GetUsuariosDisponibles:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en GetUsuariosDisponibles:", error);
    throw error;
  }
};

export const GetTodosLosEmpleados = async () => {
  console.log("🔍 Iniciando GetTodosLosEmpleados...");
  
  try {
    const response = await axios.get(`${API_URL_CAJAS}empleados_todos/`, {
      headers: getAuthHeaders(),
    });
    console.log("✅ Respuesta completa GetTodosLosEmpleados:", response);
    console.log("📄 response.data:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = response.data.results || response.data;
    console.log("🔄 Datos extraídos:", data);
    console.log("📊 Tipo de datos:", Array.isArray(data) ? 'Array' : typeof data);
    console.log("📝 Cantidad de elementos:", Array.isArray(data) ? data.length : 'No es array');
    
    return data; // Retornar directamente el array
  } catch (error) {
    console.error("❌ Error en GetTodosLosEmpleados:", error);
    throw error;
  }
};

export const CreateCaja = (caja) => {
  return axios.post(API_URL_CAJAS, caja, { headers: getAuthHeaders() });
};

export const UpdateCaja = (id, caja) => {
  return axios.put(`${API_URL_CAJAS}${id}/`, caja, {
    headers: getAuthHeaders(),
  });
};

export const DeleteCaja = (id) => {
  return axios.delete(`${API_URL_CAJAS}${id}/`, { headers: getAuthHeaders() });
};

export const ActivarCaja = (id) => {
  return axios.post(
    `${API_URL_CAJAS}${id}/activar/`,
    {},
    { headers: getAuthHeaders() }
  );
};

export const DesactivarCaja = (id) => {
  return axios.post(
    `${API_URL_CAJAS}${id}/desactivar/`,
    {},
    { headers: getAuthHeaders() }
  );
};
