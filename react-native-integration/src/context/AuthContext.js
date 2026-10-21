import { createContext, useContext, useState, useEffect } from "react";
import { login, register } from "../services/authService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initializing, setInitializing] = useState(false);

  useEffect(() => {
    automaticLogin();
  }, []);

  async function automaticLogin() {
    try {
      setInitializing(true);
      const credentials = await AsyncStorage.getItem(
        "@cena-marcada/credentials",
      );

      if (!credentials) {
        return;
      }

      const { email, password } = JSON.parse(credentials);

      const response = await entrar(email, password);

      if (!response.success) {
        throw Error("Erro ao fazer o login automatico");
      }
    } catch (error) {
      await AsyncStorage.removeItem("@cena-marcada/credentials");
      setToken(null);
      setUser(null);
      setAuthenticated(null);
    } finally {
      setInitializing(false);
    }
  }

  async function entrar(email, password) {
    try {
      const response = await login(email, password);
      if (response.success) {
        const credentials = JSON.stringify({
          email,
          password,
        });

        // NAO É A FORMA CORRETA DE FAZER
        await AsyncStorage.setItem("@cena-marcada/credentials", credentials);

        setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      setToken(null);
      setUser(null);
      setAuthenticated(null);
      return { succes: false };
    }
  }

  async function cadastrar(name, email, password) {
    try {
      const response = await register(name, email, password);
      if (response.success) {
        const credentials = JSON.stringify({
          email,
          password,
        });

        // NAO É A FORMA CORRETA DE FAZER
        await AsyncStorage.setItem("@cena-marcada/credentials", credentials);

        setAuthToken(response.token);
        setToken(response.token);
        setUser(response.user);
        setAuthenticated(true);
      }
      return response;
    } catch (error) {
      setToken(null);
      setUser(null);
      setAuthenticated(null);
      return { succes: false };
    }
  }

  async function sair() {
    try {
      await AsyncStorage.removeItem("@cena-marcada/credentials");

      setToken(null);
      setUser(null);
      setAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { succes: false };
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
