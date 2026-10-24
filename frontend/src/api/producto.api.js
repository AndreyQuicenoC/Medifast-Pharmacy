import axios from "axios";

// API URL constante
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL = `${API_BASE_URL}/producto`;

// Tipos predefinidos de medicamentos para el combobox
export const TIPOS_MEDICAMENTOS = [
  "Analgésico",
  "Antiinflamatorio",
  "Antibiótico",
  "Antialérgico",
  "Antihipertensivo",
  "Antidiabético",
  "Gastro",
  "Hipolipemiante",
  "Otros",
];

// Cargar productos desde la API
export const fetchProductos = async (authToken) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    });
    console.log("Respuesta de productos:", response.data);
    // Manejar respuesta paginada del backend
    const productos = response.data.results || response.data;
    return { data: productos, error: null };
  } catch (err) {
    console.error("Error al cargar productos:", err);
    return { data: null, error: "No se pudieron cargar los productos" };
  }
};

// Guardar producto (crear o actualizar)
export const saveProducto = async (formData, editingId, token) => {
  try {
    if (editingId) {
      // Actualizar producto existente
      const response = await axios.put(`${API_URL}/${editingId}/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return { success: true, data: response.data, error: null };
    } else {
      // Crear nuevo producto
      const response = await axios.post(`${API_URL}/`, formData, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      return { success: true, data: response.data, error: null };
    }
  } catch (error) {
    console.error("Error al guardar producto:", error);
    return {
      success: false,
      data: null,
      error: error.response?.data?.detail || error.message,
    };
  }
};

// Eliminar/desactivar producto
export const desactivarProducto = async (id, token) => {
  try {
    await axios.post(
      `${API_URL}/${id}/desactivar/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return { success: true, error: null };
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return { success: false, error: "Error al desactivar el producto" };
  }
};

// Activar producto
export const activarProducto = async (id, token) => {
  try {
    await axios.post(
      `${API_URL}/${id}/activar/`,
      {},
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    return { success: true, error: null };
  } catch (error) {
    console.error("Error al activar producto:", error);
    return { success: false, error: "Error al activar el producto" };
  }
};

// Formatear precio para mostrar
export const formatPrice = (price) => `$${price.toLocaleString()}`;
