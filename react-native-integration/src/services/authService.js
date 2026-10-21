import { getRequestError } from "../utils/error";
import api from "./api";

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export async function login(_email, _password) {
  try {
    const response = await api.post("/auth/login", {
      email: normalizeEmail(_email),
      password: _password,
    });

    const data = response.data;

    return {
      token: data.token,
      user: data.user,
      success: true,
    };
  } catch (error) {
    return getRequestError(error, "Não foi possível entrar agora.");
  }
}

export async function register(_name, _email, _password) {
  try {
    const response = await api.post("/auth/register", {
      name: _name,
      email: normalizeEmail(_email),
      password: _password,
    });

    const data = response.data;

    return {
      token: data.token,
      user: data.user,
      success: true,
    };
  } catch (error) {
    return getRequestError(error, "Não foi possível cadastrar agora.");
  }
}
