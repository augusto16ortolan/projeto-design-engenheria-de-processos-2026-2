import { createContext, useContext, useState } from "react";
import { login, register } from "../services/authService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function entrar(email, password) {
    const response = await login(email, password);
    if (response.success) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }

  async function cadastrar(name, email, password) {
    const response = await register(name, email, password);
    if (response.success) {
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }

  async function sair() {
    setToken(null);
    setUser(null);
    return { success: true };
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authenticated: Boolean(user),
        initializing: false,
        entrar,
        cadastrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
