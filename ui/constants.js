const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
  THREADS: `${API_BASE_URL}/threads`,
  RANKING: `${API_BASE_URL}/ranking`,
  FAVORITES: `${API_BASE_URL}/favorites`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  BENEFITS: `${API_BASE_URL}/benefits`,
  NEW_THREAD: `${API_BASE_URL}/newThread`,
};