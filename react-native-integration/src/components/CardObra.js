import { StyleSheet, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { Image } from "expo-image";
import {
  workStatusIcon,
  workStatusLabel,
  workTypeLabel,
} from "../constants/works";

const defaultPoster = require("../../assets/icon.png");

export default function CardObra({ obra, action }) {
  return (
    <Card style={styles.card} onPress={() => action(obra)}>
      <View style={styles.conteudo}>
        <Image
          source={obra.imageUrl ? { uri: obra.imageUrl } : defaultPoster}
          style={styles.poster}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.informacoes}>
          <Text variant="titleMedium" style={styles.titulo}>
            {obra.title}
          </Text>
          <Text variant="bodyMedium">{workTypeLabel(obra.type)}</Text>
          <View style={styles.rodape}>
            <Chip compact>{workTypeLabel(obra.type)}</Chip>
            <Chip compact icon={workStatusIcon(obra.status)}>
              {workStatusLabel(obra.status)}
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
  rodape: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
});
