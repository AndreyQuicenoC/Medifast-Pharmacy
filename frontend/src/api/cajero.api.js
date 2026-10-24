import axios from "axios";
import { extractList } from "./listUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export const getMiCajaInfo = async () => {
  const response = await apiClient.get("/turnos/mi_caja_info/");
  return response.data.results || response.data;
};

export const atenderSiguienteTurno = async () => {
  const response = await apiClient.post("/turnos/atender_siguiente_turno/");
  return response.data;
};

export const finalizarTurno = async (productos = [], total = 0) => {
  const response = await apiClient.post("/turnos/finalizar_turno/", {
    productos,
    total,
  });
  return response.data;
};

export const cancelarTurnoActual = async (motivo = "Cancelado por cajero") => {
  const response = await apiClient.post("/turnos/cancelar_turno_actual/", {
    motivo,
  });
  return response.data;
};

export const toggleCajaEstado = async () => {
  const response = await apiClient.post("/turnos/toggle_caja_estado/");
  return response.data;
};

export const getProductos = async () => {
  const response = await apiClient.get("/producto/");
  return extractList(response.data);
};
