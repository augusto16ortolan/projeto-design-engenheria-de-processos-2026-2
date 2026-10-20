// ETAPA 4 DA AULA — coleção pessoal
//
// Todas as rotas abaixo exigem Authorization: Bearer <token>.
// GET    /works?type=&status=       -> { data: Work[] }
// GET    /works/:id                 -> Work
// POST   /works                     -> Work
// PUT    /works/:id                 -> Work
// DELETE /works/:id                 -> 204
//
// Work: { id, userId, type, title, imageUrl, synopsis, status }
// O servidor define userId pelo token. Nunca envie userId no body.

const pendingMessage =
  "A integração com a API será implementada durante a aula.";

export async function getMedias(_filters) {
  // Monte a query string para type e status e use GET /works.
  return { success: false, message: pendingMessage };
}

export async function getMediaById(_id) {
  // Use GET /works/:id.
  return { success: false, message: pendingMessage };
}

export async function createMedia(_data) {
  // Valide o formulário e use POST /works.
  return { success: false, message: pendingMessage };
}

export async function updateMedia(_id, _data) {
  // Valide o formulário e use PUT /works/:id.
  return { success: false, message: pendingMessage };
}

export async function deleteMedia(_id) {
  // Use DELETE /works/:id.
  return { success: false, message: pendingMessage };
}
