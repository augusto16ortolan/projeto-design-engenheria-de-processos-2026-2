import { addUser, findUserByEmail } from "./mockStore";
import { getErrorMessage } from "../utils/error";

function toPublicUser({ password, ...user }) {
  return user;
}

export async function login(email, password) {
  try {
    const user = findUserByEmail(email.trim());

    if (!user || user.password !== password) {
      return { success: false, message: "E-mail ou senha incorretos." };
    }

    return { success: true, user: toPublicUser(user) };
  } catch (error) {
    return { success: false, message: getErrorMessage(error, "Não foi possível entrar agora.") };
  }
}

export async function register(name, email, password) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (findUserByEmail(normalizedEmail)) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }

    return {
      success: true,
      user: addUser({ name: name.trim(), email: normalizedEmail, password }),
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error, "Não foi possível criar a conta agora.") };
  }
}
