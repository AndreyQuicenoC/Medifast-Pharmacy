import axios from "axios";
import { extractList } from "./listUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL_CAJAS = `${API_BASE_URL}/caja/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Token ${token}` } : {};
};

async function getList(url) {
  const response = await axios.get(url, { headers: getAuthHeaders() });
  return extractList(response.data);
}

export const GetAllCajas = () => getList(API_URL_CAJAS);

export const GetUsuariosDisponibles = () =>
  getList(`${API_URL_CAJAS}usuarios_disponibles/`);

export const GetTodosLosEmpleados = () =>
  getList(`${API_URL_CAJAS}empleados_todos/`);

export const CreateCaja = (caja) =>
  axios.post(API_URL_CAJAS, caja, { headers: getAuthHeaders() });

export const UpdateCaja = (id, caja) =>
  axios.put(`${API_URL_CAJAS}${id}/`, caja, { headers: getAuthHeaders() });

export const DeleteCaja = (id) =>
  axios.delete(`${API_URL_CAJAS}${id}/`, { headers: getAuthHeaders() });

export const ActivarCaja = (id) =>
  axios.post(`${API_URL_CAJAS}${id}/activar/`, {}, { headers: getAuthHeaders() });

export const DesactivarCaja = (id) =>
  axios.post(`${API_URL_CAJAS}${id}/desactivar/`, {}, { headers: getAuthHeaders() });
