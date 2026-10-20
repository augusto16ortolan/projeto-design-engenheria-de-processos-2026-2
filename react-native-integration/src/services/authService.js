function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

const pendingMessage =
  "A integração com a API será implementada durante a aula.";

export async function login(_email, _password) {
  return { success: false, message: pendingMessage };
}

export async function register(_name, _email, _password) {
  return { success: false, message: pendingMessage };
}
