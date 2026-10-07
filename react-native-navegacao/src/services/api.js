import axios from "axios";

//ipconfig getifaddr en0
const API_URL = "http://10.1.188.248:3000";
let authToken = null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export function setAuthToken(token) {
  authToken = token;
}

export default api;
