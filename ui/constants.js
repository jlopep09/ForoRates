const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  THREADS: `${API_BASE_URL}/threads`,
};