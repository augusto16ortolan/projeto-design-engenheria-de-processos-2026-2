import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
let authToken = null;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function setAuthToken(token) {
  authToken = token || null;
}

export default api;
