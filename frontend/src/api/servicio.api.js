import axios from "axios";
import { extractList } from "./listUtils.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const API_URL_SERVICIO = `${API_BASE_URL}/servicios/`;

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const GetAllServicios = async () => {
  const response = await axios.get(`${API_URL_SERVICIO}?show_all=true`, {
    headers: getAuthHeaders(),
  });
  return extractList(response.data);
};

export const CreateServicio = (servicio) => {
  const backendData = {
    Nombre: servicio.etiqueta,
    Descripcion: servicio.descripcion,
    Prioridad: servicio.prioridad ? 1 : 0,
    Estado: true,
  };
  return axios.post(`${API_URL_SERVICIO}`, backendData, {
    headers: getAuthHeaders(),
  });
};

export const UpdateServicio = (id, servicio) => {
  const backendData = {
    Nombre: servicio.etiqueta,
    Descripcion: servicio.descripcion,
    Prioridad: servicio.prioridad ? 1 : 0,
    Estado: true,
  };
  return axios.put(`${API_URL_SERVICIO}${id}/`, backendData, {
    headers: getAuthHeaders(),
  });
};

export const DeleteServicio = (id) =>
  axios.delete(`${API_URL_SERVICIO}${id}/`, { headers: getAuthHeaders() });

export const DeactivateServicio = (id) =>
  axios.post(`${API_URL_SERVICIO}${id}/desactivar/`, {}, { headers: getAuthHeaders() });

export const ActivateServicio = (id) =>
  axios.post(`${API_URL_SERVICIO}${id}/activar/`, {}, { headers: getAuthHeaders() });

export const DeleteServicioPermanent = (id) =>
  axios.delete(`${API_URL_SERVICIO}${id}/`, { headers: getAuthHeaders() });
