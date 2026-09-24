import { useLayoutEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, Chip, Divider, List, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetalheObra({ route, navigation }) {
  const { obra } = route.params;

  if (!obra) {
    console.log("teste");
    return <ActivityIndicator size={"large"} />;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: obra.nome || "Obra",
    });
  }, []);

  const eSerie = obra.tipo === "Série";

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={{ uri: obra.imagem }} style={styles.poster} />
        <Chip style={styles.tipo}>{obra.tipo}</Chip>
        <Text variant="headlineMedium" style={styles.titulo}>
          {obra.titulo}
        </Text>
        <View style={styles.chips}>
          <Chip icon="calendar">{obra.ano}</Chip>
          <Chip icon="star">{obra.nota}</Chip>
          <Chip icon="account-group">{obra.classificacao}</Chip>
        </View>
        <Divider style={styles.divisor} />
        <Text variant="titleMedium" style={styles.subtitulo}>
          Sinopse
        </Text>
        <Text variant="bodyLarge" style={styles.sinopse}>
          {obra.sinopse}
        </Text>
        <Text variant="titleMedium" style={styles.subtitulo}>
          Informações
        </Text>
        <List.Item
          title="Gênero"
          description={obra.genero}
          left={(props) => <List.Icon {...props} icon="tag" />}
        />
        <List.Item
          title={eSerie ? "Criação" : "Direção"}
          description={eSerie ? obra.criacao : obra.direcao}
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title="Elenco principal"
          description={obra.elenco}
          left={(props) => <List.Icon {...props} icon="account-group" />}
        />
        <List.Item
          title="Estúdio"
          description={obra.estudio}
          left={(props) => <List.Icon {...props} icon="movie-open" />}
        />
        <List.Item
          title="Origem e idioma"
          description={`${obra.pais} • ${obra.idioma}`}
          left={(props) => <List.Icon {...props} icon="earth" />}
        />
        {eSerie ? (
          <List.Item
            title="Temporadas e episódios"
            description={`${obra.temporadas} temporada(s) • ${obra.episodios} episódio(s)`}
            left={(props) => <List.Icon {...props} icon="television" />}
          />
        ) : (
          <List.Item
            title="Duração"
            description={obra.duracao}
            left={(props) => <List.Icon {...props} icon="clock-outline" />}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#FFFFFF", flex: 1 },
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingBottom: 42,
  },
  poster: {
    alignSelf: "center",
    borderRadius: 12,
    height: 360,
    marginBottom: 18,
    width: 240,
  },
  tipo: { alignSelf: "flex-start" },
  titulo: { fontWeight: "800", marginTop: 12 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 16 },
  divisor: { marginVertical: 24 },
  subtitulo: { fontWeight: "700", marginBottom: 8, marginTop: 8 },
  sinopse: { color: "#424242", lineHeight: 24, marginBottom: 16 },
  botao: { marginTop: 30 },
});
