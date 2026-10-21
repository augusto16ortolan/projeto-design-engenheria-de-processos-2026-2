import { useLayoutEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Button, SegmentedButtons, Text } from "react-native-paper";
import CampoTexto from "../components/CampoTexto";
import { WORK_STATUSES, WORK_TYPES } from "../constants/works";
import { createMedia, updateMedia } from "../services/mediaService";
import { getErrorMessage } from "../utils/error";
import { hasValidationErrors, validateWork } from "../utils/validation";

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

  async function save() {
    const validationErrors = validateWork(form);
    setErrors(validationErrors);
    if (hasValidationErrors(validationErrors)) return;

    try {
      setLoading(true);
      const payload = {
        ...form,
        title: form.title.trim(),
        imageUrl: form.imageUrl.trim(),
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
      <CampoTexto
        label="URL da imagem (opcional)"
        valor={form.imageUrl}
        setValor={(value) => updateField("imageUrl", value)}
        erro={errors.imageUrl}
        autoCapitalize="none"
        keyboardType="url"
      />
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
        loading={loading}
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
