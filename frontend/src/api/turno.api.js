import axios from "axios";
import { extractList } from "./listUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const apiClient = axios.create({ baseURL: API_BASE_URL });

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

export const getServicios = async () => {
  const response = await apiClient.get("/servicios/");
  return extractList(response.data);
};

export const crearTurno = async (servicioId, cedulaCliente) => {
  const response = await apiClient.post("/turnos/crear_turno/", {
    servicio_id: servicioId,
    cedula_cliente: cedulaCliente,
  });
  return response.data;
};

export const getTurnoActivoCliente = async (cedula) => {
  const response = await apiClient.get(
    `/turnos/turno_activo_cliente/?cedula=${cedula}`,
  );
  return response.data;
};

export const getColaTurnos = async () => {
  const response = await apiClient.get("/turnos/cola_turnos/");
  return extractList(response.data);
};

export const getTurnoActualCaja = async (cajaId) => {
  const response = await apiClient.get(
    `/turnos/turno_actual_caja/?caja_id=${cajaId}`,
  );
  const data = response.data;
  return data?.results ?? data;
};

export const getEstadoCajas = async () => {
  const response = await apiClient.get("/turnos/estado_cajas/");
  return extractList(response.data);
};

export const getTurnoActualGlobal = async () => {
  const response = await apiClient.get("/turnos/turno_actual_global/");
  return response.data;
};

export const cancelarTurno = async (turnoId) => {
  const response = await apiClient.post(`/turnos/${turnoId}/cancelar_turno/`);
  return response.data;
};

export const getInfoCliente = async (cedula) => {
  const response = await apiClient.get(`/clients/?cc=${cedula}`);
  return response.data;
};
