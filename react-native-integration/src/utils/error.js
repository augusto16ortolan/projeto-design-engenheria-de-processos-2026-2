const FIELD_MESSAGES = {
  "name must have at least 2 characters": "O nome deve ter pelo menos 2 caracteres.",
  "email must be valid": "Informe um e-mail válido.",
  "password must have at least 6 characters": "A senha deve ter pelo menos 6 caracteres.",
  "type must be movie or series": "Selecione um tipo de obra válido.",
  "title is required": "Informe o título da obra.",
  "status must be want_to_watch, watching, or watched": "Selecione um status válido.",
  "imageUrl must start with http:// or https://": "A URL da imagem deve começar com http:// ou https://.",
};

const API_MESSAGES = {
  "Email and password are required.": "Informe e-mail e senha.",
  "Email or password is incorrect.": "E-mail ou senha incorretos.",
  "Email is already registered.": "Este e-mail já está cadastrado.",
  "Work was not found.": "Esta obra não foi encontrada.",
  "Token is invalid or expired.": "Sua sessão expirou. Entre novamente.",
  "Send a Bearer token.": "Sua sessão não é válida. Entre novamente.",
};

export function getErrorMessage(error, fallback) {
  const response = error?.response;
  const data = response?.data;

  if (Array.isArray(data?.fields) && data.fields.length) {
    return data.fields.map((field) => FIELD_MESSAGES[field] || field).join("\n");
  }

  if (typeof data?.error === "string") {
    return API_MESSAGES[data.error] || data.error;
  }

  if (error?.code === "ECONNABORTED") {
    return "A solicitação demorou demais. Verifique sua conexão e tente novamente.";
  }

  if (error?.request && !response) {
    return "Não foi possível conectar à API. Verifique sua conexão e tente novamente.";
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}

export function getRequestError(error, fallback) {
  return {
    success: false,
    status: error?.response?.status,
    unauthorized: error?.response?.status === 401,
    message: getErrorMessage(error, fallback),
  };
}
