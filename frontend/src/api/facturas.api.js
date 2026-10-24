import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Configurar axios con el token de autenticación
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor para agregar el token a todas las requests
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("authToken") || localStorage.getItem("token");
    console.log(
      "🔑 Enviando request con token:",
      token ? `${token.substring(0, 10)}...` : "Sin token"
    );

    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("❌ Error en interceptor de request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    console.log("✅ Response exitoso:", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error(
      "❌ Error en response:",
      error.response?.status,
      error.config?.url,
      error.response?.data
    );
    return Promise.reject(error);
  }
);

// API para obtener todas las facturas con paginación
export const getFacturas = async (page = 1, pageSize = 20) => {
  try {
    console.log(`🔄 Llamando API getFacturas - página ${page}, tamaño ${pageSize}...`);
    const response = await apiClient.get(`/facturas/?page=${page}&page_size=${pageSize}`);
    console.log("📦 Respuesta completa de facturas:", response.data);
    
    // Manejar respuesta paginada del backend
    const data = {
      results: response.data.results || response.data,
      count: response.data.count || (response.data.results ? response.data.results.length : response.data.length),
      next: response.data.next,
      previous: response.data.previous,
      totalPages: response.data.count ? Math.ceil(response.data.count / pageSize) : 1,
      currentPage: page
    };
    
    console.log("📦 Facturas procesadas:", {
      cantidad: data.results?.length || 0,
      total: data.count,
      página: data.currentPage,
      totalPáginas: data.totalPages
    });
    
    return data;
  } catch (error) {
    console.error("❌ Error al obtener facturas:", error);

    // Log más detallado del error
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", error.response.data);
      console.error("   Headers:", error.response.headers);
    } else if (error.request) {
      console.error("   No response received:", error.request);
    } else {
      console.error("   Error message:", error.message);
    }

    throw error;
  }
};

// API para obtener TODAS las facturas (sin paginación) - útil para reportes
export const getAllFacturas = async () => {
  try {
    console.log("🔄 Obteniendo TODAS las facturas...");
    let allFacturas = [];
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      console.log(`📄 Cargando página ${page}...`);
      const response = await apiClient.get(`/facturas/?page=${page}&page_size=100`);
      const pageData = response.data.results || response.data;
      
      if (Array.isArray(pageData) && pageData.length > 0) {
        allFacturas = [...allFacturas, ...pageData];
        hasMore = response.data.next ? true : false;
        page++;
        console.log(`✅ Página ${page-1} cargada: ${pageData.length} facturas. Total acumulado: ${allFacturas.length}`);
      } else {
        hasMore = false;
      }
      
      // Prevenir bucle infinito
      if (page > 100) {
        console.warn("⚠️ Límite de páginas alcanzado (100), deteniendo carga...");
        break;
      }
    }
    
    console.log(`🎉 Carga completa: ${allFacturas.length} facturas obtenidas`);
    return allFacturas;
  } catch (error) {
    console.error("❌ Error al obtener todas las facturas:", error);
    throw error;
  }
};

// API para obtener facturas por turno
export const getFacturasPorTurno = async (turnoId) => {
  try {
    const response = await apiClient.get(
      `/facturas/por_turno/?turno_id=${turnoId}`
    );
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error al obtener facturas por turno:", error);
    throw error;
  }
};

// API para obtener facturas por caja
export const getFacturasPorCaja = async (cajaId) => {
  try {
    const response = await apiClient.get(
      `/facturas/por_caja/?caja_id=${cajaId}`
    );
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error al obtener facturas por caja:", error);
    throw error;
  }
};

// API para obtener facturas por fecha
export const getFacturasPorFecha = async (fecha) => {
  try {
    const response = await apiClient.get(`/facturas/por_fecha/?fecha=${fecha}`);
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error al obtener facturas por fecha:", error);
    throw error;
  }
};

// API para obtener reporte de ventas
export const getReporteVentas = async (fechaInicio, fechaFin) => {
  try {
    const response = await apiClient.get(
      `/facturas/reporte_ventas/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`
    );
    return response.data.results || response.data;
  } catch (error) {
    console.error("Error al obtener reporte de ventas:", error);
    throw error;
  }
};
