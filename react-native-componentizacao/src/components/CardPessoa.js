import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function CardPessoa({ pessoa }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: pessoa.foto }} style={styles.avatar} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{pessoa.nome}</Text>
        <Text style={styles.detail}>{pessoa.idade} anos</Text>
        <Text style={styles.detail}>{pessoa.cidade}</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.cardButton}
          onPress={() => Alert.alert(pessoa.nome, "Perfil selecionado.")}
        >
          <Text style={styles.cardButtonText}>Ver perfil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#E2E8F0",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 16,
    padding: 16,
  },
  avatar: {
    borderRadius: 36,
    height: 72,
    marginRight: 16,
    width: 72,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  detail: {
    color: "#64748B",
    fontSize: 15,
    lineHeight: 21,
  },
  cardButton: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cardButtonText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },
});
