import { Image, StyleSheet, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";

export default function CardObra({ obra, action }) {
  return (
    <Card style={styles.card} onPress={() => action(obra)}>
      <View style={styles.conteudo}>
        <Image source={{ uri: obra.imageUrl }} style={styles.poster} />
        <View style={styles.informacoes}>
          <Text variant="titleMedium" style={styles.titulo}>
            {obra.title}
          </Text>
          <Text variant="bodyMedium">
            {obra.year} • {obra.ageRating}
          </Text>
          <Text variant="bodySmall" style={styles.genero}>
            {obra.genres.join(", ")}
          </Text>
          <View style={styles.rodape}>
            <Chip compact>{obra.type === "movie" ? "Filme" : "Série"}</Chip>
            <Chip compact icon="star">
              {obra.rating}
            </Chip>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 14 },
  conteudo: { flexDirection: "row", padding: 12 },
  poster: { borderRadius: 8, height: 130, width: 88 },
  informacoes: { flex: 1, justifyContent: "center", marginLeft: 14 },
  titulo: { fontWeight: "700", marginBottom: 6 },
  genero: { color: "#5F6368", marginTop: 4 },
  rodape: { flexDirection: "row", gap: 8, marginTop: 12 },
});
