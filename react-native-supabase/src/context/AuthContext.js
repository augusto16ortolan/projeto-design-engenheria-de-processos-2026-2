import { createContext, useContext, useEffect, useState } from "react";
import { login, register } from "../services/authService";
import { getErrorMessage } from "../utils/error";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Na integração com Supabase, trocar por supabase.auth.getSession().
    setInitializing(false);
  }, []);

  async function entrar(email, password) {
    try {
      const response = await login(email, password);
      if (response.success) setUser(response.user);
      return response;
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Não foi possível entrar agora.") };
    }
  }

  async function cadastrar(name, email, password) {
    try {
      const response = await register(name, email, password);
      if (response.success) setUser(response.user);
      return response;
    } catch (error) {
      return { success: false, message: getErrorMessage(error, "Não foi possível criar a conta agora.") };
    }
  }

  function sair() {
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, authenticated: Boolean(user), initializing, entrar, cadastrar, sair }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
