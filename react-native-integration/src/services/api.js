import axios from "axios";

// ETAPA 1 DA AULA — cliente Axios
//
// Configure EXPO_PUBLIC_API_URL no .env. O client já centraliza a URL base
// e o header JSON. Durante a aula, complete o interceptor para incluir
// Authorization: Bearer <token> quando houver uma sessão autenticada.

const baseURL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
let authToken = null;

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  // Quando o token for restaurado ou obtido no login, use setAuthToken(token).
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

export function setAuthToken(token) {
  authToken = token;
}

export default api;
