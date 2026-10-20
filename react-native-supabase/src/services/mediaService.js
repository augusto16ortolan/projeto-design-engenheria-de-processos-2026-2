import { getErrorMessage } from "../utils/error";
import { supabase } from "../../supabase/supabase";
import { workFromSupabase, workToSupabase } from "./supabaseMappers";

const VALID_TYPES = ["movie", "series"];
const VALID_STATUSES = ["want_to_watch", "watching", "watched"];

function normalizeWork(data, userId) {
  return {
    userId,
    type: data.type,
    title: data.title.trim(),
    imageUrl: data.imageUrl?.trim() || "",
    synopsis: data.synopsis?.trim() || "",
    status: data.status,
  };
}

function validateWork(data) {
  if (!VALID_TYPES.includes(data.type)) return "Selecione o tipo da obra.";
  if (!data.title?.trim()) return "Informe o título.";
  if (data.imageUrl?.trim() && !/^https?:\/\/.+/.test(data.imageUrl.trim()))
    return "Informe uma URL de imagem válida (http ou https).";
  if (!VALID_STATUSES.includes(data.status)) return "Selecione o status.";
  return null;
}

export async function getMedias(userId, filters) {
  try {
    let query = supabase
      .from("works")
      .select("*")
      .eq("user_id", userId)
      .order("title", { ascending: true });

    if (filters?.type) query = query.eq("type", filters.type);
    if (filters?.status) query = query.eq("status", filters.status);

    const { data, error } = await query;
    if (error) return { success: false, message: error.message };

    return { success: true, medias: data.map(workFromSupabase) };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível carregar suas obras."),
    };
  }
}

export async function getMediaById(id, userId) {
  try {
    const { data, error } = await supabase
      .from("works")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) return { success: false, message: error.message };

    const media = data ? workFromSupabase(data) : null;
    return media
      ? { success: true, media }
      : { success: false, message: "Obra não encontrada." };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível carregar esta obra."),
    };
  }
}

export async function createMedia(userId, data) {
  try {
    const message = validateWork(data);
    if (message) return { success: false, message };

    const { data: createdWork, error } = await supabase
      .from("works")
      .insert(workToSupabase(normalizeWork(data, userId), userId))
      .select()
      .single();

    if (error) return { success: false, message: error.message };
    return { success: true, media: workFromSupabase(createdWork) };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível adicionar a obra."),
    };
  }
}

export async function updateMedia(id, userId, data) {
  try {
    const message = validateWork(data);
    if (message) return { success: false, message };

    const { data: updatedWork, error } = await supabase
      .from("works")
      .update(workToSupabase(normalizeWork(data, userId), userId))
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) return { success: false, message: error.message };

    const media = updatedWork ? workFromSupabase(updatedWork) : null;
    return media
      ? { success: true, media }
      : { success: false, message: "Obra não encontrada." };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível salvar as alterações."),
    };
  }
}

export async function deleteMedia(id, userId) {
  try {
    const { data, error } = await supabase
      .from("works")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) return { success: false, message: error.message };

    return data
      ? { success: true }
      : { success: false, message: "Obra não encontrada." };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível excluir a obra."),
    };
  }
}
