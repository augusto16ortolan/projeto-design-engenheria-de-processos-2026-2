// ETAPA 1 DA AULA — cliente HTTP
//
// Configure EXPO_PUBLIC_API_URL no .env.
// Depois implemente apiRequest para:
// - montar a URL com base nessa variável;
// - enviar Content-Type: application/json;
// - enviar Authorization: Bearer <token> quando existir;
// - converter a resposta JSON e lançar o erro retornado pela API.

const baseUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");

export async function apiRequest(_path, _options = {}) {
  if (!baseUrl) {
    throw new Error("Configure EXPO_PUBLIC_API_URL no arquivo .env.");
  }

  throw new Error("Cliente HTTP ainda não implementado.");
}
