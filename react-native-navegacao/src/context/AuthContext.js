import { useContext, createContext, useState } from "react";
import { login, register } from "../services/authService";
import { setAuthToken } from "../services/api";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  async function entrar(email, password) {
    try {
      const response = await login(email, password);

      if (!response.success) {
        return false;
      }

      const { user, token } = response.authInfo;

      setUser(user);
      setToken(token);
      setAuthenticated(true);
      setAuthToken(token);

      return true;
    } catch (error) {
      setUser(null);
      setToken(null);
      setAuthenticated(false);
      setAuthToken(null);

      return false;
    }
  }

  async function cadastrar(name, email, password) {
    try {
      const response = await register(name, email, password);

      if (!response.success) {
        return false;
      }

      const { user, token } = response.authInfo;

      setUser(user);
      setToken(token);
      setAuthenticated(true);
      setAuthToken(token);

      return true;
    } catch (error) {
      setUser(null);
      setToken(null);
      setAuthenticated(false);
      setAuthToken(null);

      return false;
    }
  }

  function sair() {
    setUser(null);
    setToken(null);
    setAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{ token, user, authenticated, entrar, cadastrar, sair }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
