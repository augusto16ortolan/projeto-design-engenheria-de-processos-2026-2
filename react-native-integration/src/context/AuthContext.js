import { createContext, useContext, useState } from "react";
import { login, register } from "../services/authService";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // ETAPA 3 DA AULA — sessão persistida
  // 1. Importe AsyncStorage.
  // 2. Após login/cadastro, salve response.token em uma chave como "@cena-marcada/token".
  // 3. Ao iniciar o app, recupere o token e valide-o com GET /auth/me.
  // 4. No logout, remova o token do AsyncStorage e limpe user/token.

  async function entrar(email, password) {
    const response = await login(email, password);
    if (response.success) {
      // Salve o token no AsyncStorage antes de definir o estado.
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }

  async function cadastrar(name, email, password) {
    const response = await register(name, email, password);
    if (response.success) {
      // Salve o token no AsyncStorage antes de definir o estado.
      setToken(response.token);
      setUser(response.user);
    }
    return response;
  }

  async function sair() {
    // Remova o token do AsyncStorage nesta etapa.
    setToken(null);
    setUser(null);
    return { success: true };
  }

  return (
    <AuthContext.Provider value={{ user, token, authenticated: Boolean(user), initializing: false, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
