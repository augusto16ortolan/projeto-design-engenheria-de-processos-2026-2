import { useLayoutEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, SegmentedButtons, Text } from "react-native-paper";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import CampoTexto from "../components/CampoTexto";
import { WORK_STATUSES, WORK_TYPES } from "../constants/works";
import { createMedia, updateMedia } from "../services/mediaService";
import { getErrorMessage } from "../utils/error";
import { hasValidationErrors, validateWork } from "../utils/validation";
import { uploadProductImage } from "../services/uploadService";

function formFromWork(work) {
  return {
    type: work?.type || "movie",
    title: work?.title || "",
    imageUrl: work?.imageUrl || "",
    synopsis: work?.synopsis || "",
    status: work?.status || "want_to_watch",
  };
}

export default function FormularioObra({ route, navigation }) {
  const work = route.params?.obraParam;
  const [form, setForm] = useState(() => formFromWork(work));
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageAsset, setImageAsset] = useState(null);
  const [errors, setErrors] = useState({});
  const editing = Boolean(work?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: editing ? "Editar obra" : "Adicionar obra",
    });
  }, [editing, navigation]);
  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function selectImage(source) {
    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permissão necessária",
          source === "camera"
            ? "Permita o acesso à câmera para tirar uma foto."
            : "Permita o acesso às fotos para escolher uma imagem.",
        );
        return;
      }

      const options = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [2, 5],
        quality: 0.8,
        base64: true,
      };
      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled) setImageAsset(result.assets[0]);
    } catch (error) {
      Alert.alert(
        "Não foi possível selecionar",
        getErrorMessage(error, "Tente novamente em instantes."),
      );
    }
  }

  function removeImage() {
    setImageAsset(null);
    updateField("imageUrl", "");
  }

  async function save() {
    const validationErrors = validateWork(form);
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;

    try {
      setLoading(true);
      let imageUrl = form.imageUrl.trim();
      if (imageAsset) {
        setUploading(true);
        const uploadUrl = await uploadProductImage(imageAsset);
        setUploading(false);
        imageUrl = uploadUrl;
      }
      const payload = {
        ...form,
        title: form.title.trim(),
        imageUrl,
        synopsis: form.synopsis.trim(),
      };
      const response = editing
        ? await updateMedia(work.id, payload)
        : await createMedia(payload);
      if (!response.success)
        return Alert.alert("Não foi possível salvar", response.message);
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Não foi possível salvar",
        getErrorMessage(error, "Tente novamente em instantes."),
      );
    } finally {
      setUploading(false);
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text variant="titleMedium" style={styles.rotulo}>
        Tipo
      </Text>
      <SegmentedButtons
        value={form.type}
        onValueChange={(value) => updateField("type", value)}
        buttons={WORK_TYPES.map((item) => ({
          value: item.value,
          label: item.label,
        }))}
        style={styles.segmento}
      />
      <CampoTexto
        label="Título"
        valor={form.title}
        setValor={(value) => updateField("title", value)}
        erro={errors.title}
      />
      <Text variant="titleMedium" style={styles.rotulo}>
        Capa
      </Text>
      {imageAsset || form.imageUrl ? (
        <View style={styles.imagemContainer}>
          <Image
            source={imageAsset?.uri || form.imageUrl}
            style={styles.imagem}
            contentFit="cover"
            transition={200}
          />
          <Button
            mode="outlined"
            icon="delete-outline"
            onPress={removeImage}
            disabled={loading || uploading}
          >
            Remover imagem
          </Button>
        </View>
      ) : null}
      <Button
        mode="outlined"
        icon="image-plus"
        onPress={() => selectImage("library")}
        disabled={loading || uploading}
        style={styles.botaoImagem}
      >
        {imageAsset || form.imageUrl ? "Trocar imagem" : "Selecionar imagem"}
      </Button>
      <Button
        mode="text"
        icon="camera"
        onPress={() => selectImage("camera")}
        disabled={loading || uploading}
        style={styles.botaoCamera}
      >
        Tirar foto
      </Button>
      <CampoTexto
        label="Sinopse (opcional)"
        valor={form.synopsis}
        setValor={(value) => updateField("synopsis", value)}
        multiline
        numberOfLines={4}
      />
      <Text variant="titleMedium" style={styles.rotulo}>
        Status
      </Text>
      {WORK_STATUSES.map((item) => (
        <TouchableOpacity
          key={item.value}
          onPress={() => updateField("status", item.value)}
          style={[
            styles.statusOption,
            form.status === item.value && styles.statusOptionAtivo,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              form.status === item.value && styles.statusTextAtivo,
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
      <Button
        mode="contained"
        icon="content-save"
        onPress={save}
        disabled={loading}
        loading={loading || uploading}
        contentStyle={styles.botao}
      >
        {editing ? "Salvar alterações" : "Adicionar à coleção"}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    flexGrow: 1,
    padding: 24,
    paddingBottom: 42,
  },
  rotulo: { fontWeight: "700", marginBottom: 8, marginTop: 6 },
  segmento: { marginBottom: 18 },
  imagemContainer: { alignItems: "center", gap: 12, marginBottom: 14 },
  imagem: { borderRadius: 12, height: 270, width: 180 },
  botaoImagem: { marginBottom: 18 },
  botaoCamera: { marginBottom: 18, marginTop: -12 },
  statusOption: {
    borderColor: "#79747E",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 14,
  },
  statusOptionAtivo: { backgroundColor: "#E62429", borderColor: "#E62429" },
  statusText: { color: "#E62429", fontWeight: "700" },
  statusTextAtivo: { color: "#FFFFFF" },
  botao: { marginTop: 8, paddingVertical: 7 },
});
