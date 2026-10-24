import { apiClient, normalizeListPayload } from "./http.js";

export const getFacturas = async (page = 1, pageSize = 20) => {
  const response = await apiClient.get(`/facturas/?page=${page}&page_size=${pageSize}`);
  const normalized = normalizeListPayload(response.data);

  if (!normalized) {
    throw new Error("Respuesta de facturas invalida");
  }

  const count = normalized.count ?? normalized.results.length;
  return {
    results: normalized.results,
    count,
    next: normalized.next,
    previous: normalized.previous,
    totalPages: Math.max(1, Math.ceil(count / pageSize)),
    currentPage: page,
  };
};

export const getAllFacturas = async () => {
  let allFacturas = [];
  let page = 1;
  let hasMore = true;

  while (hasMore && page <= 100) {
    const response = await apiClient.get(`/facturas/?page=${page}&page_size=100`);
    const normalized = normalizeListPayload(response.data);
    if (!normalized?.results?.length) break;
    allFacturas = allFacturas.concat(normalized.results);
    hasMore = Boolean(normalized.next);
    page += 1;
  }

  return allFacturas;
};

export const getFacturasPorTurno = async (turnoId) => {
  const response = await apiClient.get(`/facturas/por_turno/?turno_id=${turnoId}`);
  const normalized = normalizeListPayload(response.data);
  return normalized?.results ?? [];
};

export const getFacturasPorCaja = async (cajaId) => {
  const response = await apiClient.get(`/facturas/por_caja/?caja_id=${cajaId}`);
  const normalized = normalizeListPayload(response.data);
  return normalized?.results ?? [];
};

export const getFacturasPorFecha = async (fecha) => {
  const response = await apiClient.get(`/facturas/por_fecha/?fecha=${fecha}`);
  const normalized = normalizeListPayload(response.data);
  return normalized?.results ?? [];
};

export const getReporteVentas = async (fechaInicio, fechaFin) => {
  const response = await apiClient.get(
    `/facturas/reporte_ventas/?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
  );
  return response.data;
};
