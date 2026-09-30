import api from "./api";

export async function login(email, senha) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password: senha,
    });

    const authInfo = response.data;

    if (!authInfo.token) {
      return {
        success: false,
        message: authInfo.error,
      };
    }

    return {
      success: true,
      authInfo,
    };
  } catch (error) {
    console.log("Ocorreu um erro ao fazer o login!", error.message);
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Não foi possível conectar à API. Confira o endereço IP.",
    };
  }
}

export async function register(name, email, senha) {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password: senha,
    });

    const authInfo = response.data;

    if (!authInfo.token) {
      return {
        success: false,
        message: authInfo.error,
      };
    }

    return {
      success: true,
      authInfo,
    };
  } catch (error) {
    console.log(
      "Ocorreu um erro ao fazer o cadastro de usuário!",
      error.message,
    );
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Não foi possível conectar à API. Confira o endereço IP.",
    };
  }
}
