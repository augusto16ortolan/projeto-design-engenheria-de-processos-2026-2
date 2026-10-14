// Mantém as telas independentes da convenção snake_case usada no PostgreSQL.
export function workFromSupabase(row) {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type,
    title: row.title,
    imageUrl: row.image_url || "",
    synopsis: row.synopsis || "",
    status: row.status,
  };
}

export function workToSupabase(work, userId) {
  return {
    user_id: userId,
    type: work.type,
    title: work.title,
    image_url: work.imageUrl || null,
    synopsis: work.synopsis || null,
    status: work.status,
  };
}

export function userFromSupabase(user) {
  return {
    id: user.id,
    name: user.user_metadata?.name || "Usuário",
    email: user.email || "",
  };
}
