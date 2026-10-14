export function getErrorMessage(error, fallback) {
  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message;
  }

  return fallback;
}
