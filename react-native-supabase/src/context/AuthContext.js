import { createContext, useContext, useEffect, useState } from "react";
import { login, register, logout } from "../services/authService";
import { getErrorMessage } from "../utils/error";
import { supabase } from "../../supabase/supabase";
import { userFromSupabase } from "../services/supabaseMappers";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let active = true;

    function updateUser(session) {
      if (!active) return;
      setUser(session ? userFromSupabase(session.user) : null);
      setInitializing(false);
    }

    async function restoreSession() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        updateUser(data.session);
      } catch (_error) {
        updateUser(null);
      }
    }

    restoreSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => updateUser(session),
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function entrar(email, password) {
    try {
      const response = await login(email, password);
      if (response.success) setUser(response.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(error, "Não foi possível entrar agora."),
      };
    }
  }

  async function cadastrar(name, email, password) {
    try {
      const response = await register(name, email, password);
      if (response.success) setUser(response.user);
      return response;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(
          error,
          "Não foi possível criar a conta agora.",
        ),
      };
    }
  }

  async function sair() {
    try {
      const response = await logout();
      if (response.success) setUser(null);
      return response;
    } catch (error) {
      return {
        success: false,
        message: getErrorMessage(
          error,
          "Não foi possível sair da conta agora.",
        ),
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated: Boolean(user),
        initializing,
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
