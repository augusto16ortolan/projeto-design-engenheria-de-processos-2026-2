import { useCallback, useLayoutEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Chip, Divider, Text } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";
import {
  workStatusIcon,
  workStatusLabel,
  workTypeLabel,
} from "../constants/works";
import { deleteMedia, getMediaById } from "../services/mediaService";
import { getErrorMessage } from "../utils/error";

const defaultPoster = require("../../assets/icon.png");

export default function DetalheObra({ route, navigation }) {
  const { obraParam } = route.params;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [obra, setObra] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: obra?.title || obraParam.title });
  }, [navigation, obra?.title, obraParam.title]);

  const loadWork = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMediaById(obraParam.id);
      if (!response.success) {
        Alert.alert("Não foi possível carregar", response.message);
        navigation.goBack();
        return;
      }
      setObra(response.media);
    } catch (error) {
      Alert.alert(
        "Não foi possível carregar",
        getErrorMessage(error, "Tente novamente em instantes."),
      );
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [navigation, obraParam.id]);

  useFocusEffect(
    useCallback(() => {
      loadWork();
    }, [loadWork]),
  );

  function confirmDelete() {
    Alert.alert(
      "Excluir obra?",
      `“${obra.title}” será removida da sua coleção.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              setDeleting(true);
              const response = await deleteMedia(obra.id);
              if (!response.success)
                return Alert.alert(
                  "Não foi possível excluir",
                  response.message,
                );
              navigation.goBack();
            } catch (error) {
              Alert.alert(
                "Não foi possível excluir",
                getErrorMessage(error, "Tente novamente em instantes."),
              );
            } finally {
              setDeleting(false);
            }
          },
        },
      ],
    );
  }

  if (loading || !obra)
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color="#E62429" />
        <Text>Carregando obra...</Text>
      </View>
    );

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={obra.imageUrl ? { uri: obra.imageUrl } : defaultPoster}
          style={styles.poster}
        />
        <View style={styles.chips}>
          <Chip>{workTypeLabel(obra.type)}</Chip>
          <Chip icon={workStatusIcon(obra.status)}>
            {workStatusLabel(obra.status)}
          </Chip>
        </View>
        <Text variant="headlineMedium" style={styles.titulo}>
          {obra.title}
        </Text>
        {obra.synopsis ? (
          <>
            <Divider style={styles.divisor} />
            <Text variant="titleMedium" style={styles.subtitulo}>
              Sinopse
            </Text>
            <Text variant="bodyLarge" style={styles.sinopse}>
              {obra.synopsis}
            </Text>
          </>
        ) : null}
        <View style={styles.acoes}>
          <Button
            mode="contained"
            icon="pencil"
            onPress={() =>
              navigation.navigate("FormularioObra", { obraParam: obra })
            }
            disabled={deleting}
          >
            Editar
          </Button>
          <Button
            mode="outlined"
            textColor="#B3261E"
            icon="delete-outline"
            onPress={confirmDelete}
            disabled={deleting}
          >
            {deleting ? "Excluindo..." : "Excluir"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#FFFFFF", flex: 1 },
  container: {
    backgroundColor: "#FFFFFF",
    paddingBottom: 42,
    paddingHorizontal: 24,
  },
  poster: {
    alignSelf: "center",
    borderRadius: 12,
    height: 360,
    marginBottom: 18,
    marginTop: 16,
    width: 240,
  },
  titulo: { fontWeight: "800", marginTop: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  divisor: { marginVertical: 24 },
  subtitulo: { fontWeight: "700", marginBottom: 8 },
  sinopse: { color: "#424242", lineHeight: 24, marginBottom: 16 },
  acoes: { gap: 12, marginTop: 24 },
  estado: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center" },
});
