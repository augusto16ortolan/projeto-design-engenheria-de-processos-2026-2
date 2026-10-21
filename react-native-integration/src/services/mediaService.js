import { getErrorMessage } from "../utils/error";
import api from "./api";

export async function getMedias(_filters) {
  try {
    const response = await api.get("/works", {
      params: _filters,
    });

    const data = response.data;

    return {
      success: true,
      medias: data.data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        getErrorMessage(error, "Não foi possível buscar as obras."),
    };
  }
}

export async function getMediaById(_id) {
  try {
    const response = await api.get(`/works/${_id}`);

    const data = response.data;

    return {
      success: true,
      media: data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        getErrorMessage(error, "Não foi possível buscar a obra seleciona."),
    };
  }
}

export async function createMedia(_data) {
  try {
    const response = await api.post("/works", _data);

    const data = response.data;

    return {
      success: true,
      media: data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        getErrorMessage(error, "Não foi possível cadastrar a obra."),
    };
  }
}

export async function updateMedia(_id, _data) {
  try {
    const response = await api.put(`/works/${_id}`, _data);

    const data = response.data;

    return {
      success: true,
      media: data,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        getErrorMessage(error, "Não foi possível editar a obra."),
    };
  }
}

export async function deleteMedia(_id) {
  try {
    await api.delete(`/works/${_id}`);

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        getErrorMessage(error, "Não foi possível excluir a obra."),
    };
  }
}
