// ETAPA 2 DA AULA — autenticação pela Cena Marcada API
//
// POST /auth/login
// Body: { email, password }
// Resposta: { user: { id, name, email }, token }
//
// POST /auth/register
// Body: { name, email, password }
// Resposta: { user: { id, name, email }, token }

const pendingMessage =
  "A integração com a API será implementada durante a aula.";

export async function login(_email, _password) {
  // Use api.post("/auth/login", { email, password }).
  return { success: false, message: pendingMessage };
}

export async function register(_name, _email, _password) {
  // Use api.post("/auth/register", { name, email, password }).
  return { success: false, message: pendingMessage };
}
