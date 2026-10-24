import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
});

apiClient.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export function isPaginatedPayload(data) {
  return (
    data &&
    typeof data === "object" &&
    !Array.isArray(data) &&
    Array.isArray(data.results)
  );
}

export function normalizeListPayload(data) {
  if (isPaginatedPayload(data)) {
    return {
      results: data.results,
      count: data.count ?? data.results.length,
      next: data.next ?? null,
      previous: data.previous ?? null,
    };
  }
  if (Array.isArray(data)) {
    return { results: data, count: data.length, next: null, previous: null };
  }
  return null;
}
