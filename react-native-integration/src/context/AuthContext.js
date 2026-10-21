import { createContext, useCallback, useContext, useState, useEffect } from "react";
import { login, register } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    automaticLogin();
  }, []);

  const clearAuthentication = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    setAuthenticated(false);
  }, []);

  const clearSession = useCallback(async () => {
    try {
      await AsyncStorage.removeItem("@cena-marcada/credentials");
    } finally {
      clearAuthentication();
    }
  }, [clearAuthentication]);

  async function automaticLogin() {
    try {
      const credentials = await AsyncStorage.getItem(
        "@cena-marcada/credentials",
      );

      if (!credentials) {
        return;
      }

      const { email, password } = JSON.parse(credentials);

      const response = await entrar(email, password);

      if (!response.success) {
        await clearSession();
      }
    } catch (error) {
      await clearSession();
    } finally {
      setInitializing(false);
    }
  }

  async function entrar(email, password) {
    try {
      const response = await login(email, password);
      if (response.success) {
        const credentials = JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        });

        await AsyncStorage.setItem("@cena-marcada/credentials", credentials);

        setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      clearAuthentication();
      return { success: false, message: "Não foi possível salvar sua sessão." };
    }
  }

  async function cadastrar(name, email, password) {
    try {
      const response = await register(name, email, password);
      if (response.success) {
        const credentials = JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        });

        await AsyncStorage.setItem("@cena-marcada/credentials", credentials);

        setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      clearAuthentication();
      return { success: false, message: "Não foi possível salvar sua sessão." };
    }
  }

  async function sair() {
    try {
      await clearSession();
      return { success: true };
    } catch (error) {
      clearAuthentication();
      return { success: false, message: "Não foi possível encerrar a sessão." };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authenticated,
        initializing,
        entrar,
        cadastrar,
        sair,
        clearSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
