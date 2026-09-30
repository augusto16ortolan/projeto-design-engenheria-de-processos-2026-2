import api from "./api";

export async function getMedias(token, filtro) {
  try {
    const type =
      filtro === "Filmes" ? "movie" : filtro === "Séries" ? "series" : "";

    const response = await api.get("/media", {
      params: {
        limit: 50,
        ...(type && { type }),
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const medias = response.data;

    if (medias.error) {
      return {
        success: false,
        message: medias.error,
      };
    }

    return {
      success: true,
      medias: medias.data,
    };
  } catch (error) {
    console.log("Ocorreu um erro ao buscar as mídias", error.message);
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Não foi possível conectar à API. Confira o endereço IP.",
    };
  }
}

export async function getMediaById(token, id) {
  try {
    const response = await api.get(`/media/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const media = response.data;

    if (media.error) {
      return {
        success: false,
        message: media.error,
      };
    }

    return {
      success: true,
      media,
    };
  } catch (error) {
    console.log("Ocorreu um erro ao buscar a mídia selecionada", error.message);
    return {
      success: false,
      message:
        error.response?.data?.error ||
        "Não foi possível conectar à API. Confira o endereço IP.",
    };
  }
}
