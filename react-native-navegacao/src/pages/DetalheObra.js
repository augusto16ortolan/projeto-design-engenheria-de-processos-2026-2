import { useEffect, useLayoutEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

import { getMediaById } from "../services/mediaService";

export default function DetalheObra({ route, navigation }) {
  const { obraParam, authInfo } = route.params;
  const [loading, setLoading] = useState(true);
  const [obra, setObra] = useState(null);

  useLayoutEffect(() => {
    navigation.setOptions({ title: obra?.title || obraParam.title });
  }, [navigation, obra?.title, obraParam.title]);

  useEffect(() => {
    getObra();
  }, []);

  async function getObra() {
    try {
      setLoading(true);
      const response = await getMediaById(authInfo.token, obraParam.id);

      if (!response.success) {
        Alert.alert("Não foi possível carregar", response.message);
        navigation.goBack();
        return;
      }

      setObra(response.media);
    } catch (error) {
      Alert.alert("Não foi possível carregar", error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !obra) {
    return (
      <View style={styles.estado}>
        <ActivityIndicator size="large" color="#E62429" />
        <Text>Buscando detalhes na API...</Text>
      </View>
    );
  }

  const eSerie = obra.type === "series";
  const nota = obra.rating?.toFixed(1).replace(".", ",") || "—";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: obra.imageUrl }} style={styles.poster} />
        <Chip style={styles.tipo}>{eSerie ? "Série" : "Filme"}</Chip>
        <Text variant="headlineMedium" style={styles.titulo}>{obra.title}</Text>
        <View style={styles.chips}>
          <Chip icon="calendar">{obra.year}</Chip>
          <Chip icon="star">{nota}</Chip>
          <Chip icon="account-group">{obra.ageRating}</Chip>
        </View>
        <Divider style={styles.divisor} />
        <Text variant="titleMedium" style={styles.subtitulo}>Sinopse</Text>
        <Text variant="bodyLarge" style={styles.sinopse}>{obra.synopsis}</Text>
        <Text variant="titleMedium" style={styles.subtitulo}>Informações</Text>
        <List.Item title="Gênero" description={obra.genres.join(", ")} left={(props) => <List.Icon {...props} icon="tag" />} />
        <List.Item title={eSerie ? "Criação" : "Direção"} description={eSerie ? obra.creator || "Não informado" : obra.director || "Não informado"} left={(props) => <List.Icon {...props} icon="account" />} />
        <List.Item title="Elenco principal" description={obra.cast?.join(", ") || "Não informado"} left={(props) => <List.Icon {...props} icon="account-group" />} />
        <List.Item title="Estúdio" description={obra.studio || "Não informado"} left={(props) => <List.Icon {...props} icon="movie-open" />} />
        <List.Item title="Origem e idioma" description={`${obra.country || "Não informado"} • ${obra.language || "Não informado"}`} left={(props) => <List.Icon {...props} icon="earth" />} />
        {eSerie ? (
          <List.Item title="Temporadas e episódios" description={`${obra.seasons} temporada(s) • ${obra.episodes} episódio(s)`} left={(props) => <List.Icon {...props} icon="television" />} />
        ) : (
          <List.Item title="Duração" description={obra.duration || "Não informado"} left={(props) => <List.Icon {...props} icon="clock-outline" />} />
        )}
        <Button mode="outlined" style={styles.botao} onPress={getObra}>Atualizar detalhes</Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#FFFFFF", flex: 1 },
  container: { backgroundColor: "#FFFFFF", paddingBottom: 42, paddingHorizontal: 24 },
  poster: { alignSelf: "center", borderRadius: 12, height: 360, marginBottom: 18, width: 240 },
  tipo: { alignSelf: "flex-start" },
  titulo: { fontWeight: "800", marginTop: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  divisor: { marginVertical: 24 },
  subtitulo: { fontWeight: "700", marginBottom: 8, marginTop: 8 },
  sinopse: { color: "#424242", lineHeight: 24, marginBottom: 16 },
  botao: { marginTop: 24 },
  estado: { alignItems: "center", flex: 1, gap: 12, justifyContent: "center" },
});
