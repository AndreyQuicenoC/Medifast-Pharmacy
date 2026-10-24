/** Normaliza respuestas paginadas o arrays del backend. */
export function extractList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.results)) return data.results;
  return [];
}
