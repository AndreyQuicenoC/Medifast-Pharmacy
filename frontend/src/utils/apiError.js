export function getApiErrorMessage(error, fallback = "Ocurrio un error inesperado.") {
  const data = error?.response?.data;
  if (!data) {
    return error?.message || fallback;
  }

  if (data.error?.details) {
    const details = data.error.details;
    if (typeof details === "string") return details;
    if (Array.isArray(details)) return details[0] || data.error.message || fallback;
    if (details.non_field_errors?.[0]) return details.non_field_errors[0];
    const firstKey = Object.keys(details)[0];
    if (firstKey && Array.isArray(details[firstKey])) {
      return details[firstKey][0];
    }
    if (data.error.message) return data.error.message;
  }

  if (data.non_field_errors?.[0]) return data.non_field_errors[0];
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) return data.detail[0];

  return fallback;
}
