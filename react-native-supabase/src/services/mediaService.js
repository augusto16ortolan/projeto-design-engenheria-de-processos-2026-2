import {
  addWork,
  findWorkById,
  listWorksByUser,
  removeWork,
  replaceWork,
} from "./mockStore";
import { getErrorMessage } from "../utils/error";

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
    return { success: true, medias: listWorksByUser(userId, filters) };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível carregar suas obras."),
    };
  }
}

export async function getMediaById(id, userId) {
  try {
    const media = findWorkById(id, userId);
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
    return { success: true, media: addWork(normalizeWork(data, userId)) };
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
    const media = replaceWork(id, userId, normalizeWork(data, userId));
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
    return removeWork(id, userId)
      ? { success: true }
      : { success: false, message: "Obra não encontrada." };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error, "Não foi possível excluir a obra."),
    };
  }
}
