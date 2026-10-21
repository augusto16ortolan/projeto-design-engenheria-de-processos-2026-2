const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const IMAGE_URL_PATTERN = /^https?:\/\/.+/i;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email.trim()) errors.email = "Informe o e-mail.";
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Informe um e-mail válido.";
  if (!password) errors.password = "Informe a senha.";
  return errors;
}

export function validateRegistration({ name, email, password }) {
  const errors = validateLogin({ email, password });
  if (!name.trim()) errors.name = "Informe seu nome.";
  else if (name.trim().length < 2) errors.name = "O nome deve ter pelo menos 2 caracteres.";
  if (password && password.length < 6) errors.password = "A senha deve ter pelo menos 6 caracteres.";
  return errors;
}

export function validateWork({ title, imageUrl }) {
  const errors = {};
  if (!title.trim()) errors.title = "Informe o título da obra.";
  if (imageUrl.trim() && !IMAGE_URL_PATTERN.test(imageUrl.trim())) {
    errors.imageUrl = "A URL deve começar com http:// ou https://.";
  }
  return errors;
}

export function hasValidationErrors(errors) {
  return Object.keys(errors).length > 0;
}
